const prisma=require('../../lib/prisma')

const onlineUsers=new Map();

module.exports=(io)=>{
    io.on('connection',async (socket)=>{
        const userId=socket.handshake.auth.userId;
        socket.userId=userId

        onlineUsers.set(userId,socket.id);

        socket.on('sendMessage',async ({chatUserId,text})=>{
            const receiverId=parseInt(chatUserId)
            const message=await prisma.message.create({
                data:{
                    senderId:socket.userId,
                    receiverId,
                    text
                }
            })
            const receiverSocketId=onlineUsers.get(receiverId)
            
            if(receiverSocketId){
                const deliveredMessage={...message,status:'DELIVERED'}
                io.to(receiverSocketId).emit('receiveMessage',deliveredMessage);
                await prisma.message.update({
                    where:{id:message.id},
                    data:{
                        status:"DELIVERED"
                    }
                });
                socket.emit('receiveMessage',deliveredMessage)
            }
            else{
                socket.emit('receiveMessage',message);
            }
        })
        const pendingMessages=await prisma.message.findMany({
            where:{
                receiverId:socket.userId,
                status:'SENT'
            },
            orderBy:{createdAt:'asc'}
        });
        pendingMessages.forEach((msg)=>{
            socket.emit('receiveMessage',{...msg,status:"DELIVERED"})
        })
        for(const msg of pendingMessages){
            const senderSocketId=onlineUsers.get(msg.senderId)
            if(senderSocketId){
                io.to(senderSocketId).emit("messageStatusUpdate",{
                    chatUserId:msg.receiverId,
                    messageId:msg.id,
                    status:"DELIVERED"
                })
            }
        }
        
        await prisma.message.updateMany({
            where:{
                receiverId:socket.userId,
                status:"SENT"
            },
            data:{
                status:'DELIVERED'
            }
        })
        socket.on('disconnect',()=>{
            onlineUsers.delete(socket.userId)
        })
        
    })
}