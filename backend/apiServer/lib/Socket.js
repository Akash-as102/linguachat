const prisma=require('../../lib/prisma')

const onlineUsers=new Map();

module.exports=(io)=>{
    io.on('connection',async (socket)=>{
        const userId=socket.handshake.auth.userId;
        socket.userId=userId

        onlineUsers.set(userId,socket.id);

        socket.on('getChatList',async ()=>{
            const chatList=await prisma.chat.findMany({
            where:{userId},
            include:{
                peer:{
                    select:{
                        name:true,
                        phone:true
                    }
                }
            },
            orderBy:{lastMessageAt:'desc'}
            })
            socket.emit('chatList',chatList);
        })

        socket.on('sendMessage',async ({chatUserId,text})=>{
            const receiverId=parseInt(chatUserId)
            const message=await prisma.message.create({
                data:{
                    senderId:socket.userId,
                    receiverId,
                    text
                }
            })
            const userA=await prisma.chat.upsert({
                where:{
                    userId_peerId:{
                        userId:socket.userId,
                        peerId:receiverId
                    }
                },
                update:{
                    lastMessage:text,
                    lastMessageAt:new Date(),
                    unreadCount:0
                },
                create:{
                    userId:socket.userId,
                    peerId:receiverId,
                    lastMessage:text,
                    lastMessageAt:new Date(),
                    unreadCount:0
                }
            })
            const userB=await prisma.chat.upsert({
                where:{
                    userId_peerId:{
                        userId:receiverId,
                        peerId:socket.userId
                    }
                },
                update:{
                    lastMessage:text,
                    lastMessageAt:new Date(),
                    unreadCount:{increment:1}
                },
                create:{
                    userId:receiverId,
                    peerId:socket.userId,
                    lastMessage:text,
                    lastMessageAt:new Date(),
                    unreadCount:1
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