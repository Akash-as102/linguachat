const prisma=require('../../lib/prisma')
const {translate}=require('./translate')

const onlineUsers=new Map();

module.exports=(io)=>{
    io.on('connection',async (socket)=>{
        const userId=socket.handshake.auth.userId;
        const lang=socket.handshake.auth.lang;
        socket.userId=userId
        onlineUsers.set(userId,[socket.id,lang]);

        socket.on('getChatList',async ()=>{
            const chatList=await prisma.chat.findMany({
            where:{userId},
            include:{
                peer:{
                    select:{
                        name:true,
                        phone:true,
                        profileUrl:true
                    }
                }
            },
            orderBy:{lastMessageAt:'desc'}
            })
            socket.emit('chatList',chatList);
        })
        socket.on('getMessages',async ({chatUserId})=>{
            const receiverId=parseInt(chatUserId)
            const messages=await prisma.message.findMany({
                where:{
                    OR:[
                        {
                            receiverId,
                            senderId:socket.userId
                        },{
                            receiverId:socket.userID,
                            senderId:receiverId
                        }
                    ]
                },
                orderBy:{createdAt:'asc'}
            })
            socket.emit('getMessages',{chatUserId,messages})
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

            const receiverSocketId=onlineUsers.has(receiverId)? onlineUsers.get(receiverId)[0] : null;
            
            if(receiverSocketId){
                const receiverLang=onlineUsers.get(receiverId)[1]
                const translatedText=await translate(message.text,receiverLang)
                const nonTranslated= {...message,status:"DELIVERED"}
                const deliveredMessage={...message,text:translatedText,status:'DELIVERED'}
                io.to(receiverSocketId).emit('receiveMessage',deliveredMessage);
                await prisma.message.update({
                    where:{id:message.id},
                    data:{
                        status:"DELIVERED"
                    }
                });
                socket.emit('receiveMessage',nonTranslated)
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
        const language= onlineUsers.get(socket.userId)[1]
        pendingMessages.forEach(async (msg)=>{
            const msgText= await translate(msg.text,language)
            socket.emit('receiveMessage',{...msg,text:msgText,status:"DELIVERED"})
        })
        for(const msg of pendingMessages){
            const senderSocketId=onlineUsers.has(msg.senderId) ? onlineUsers.get(msg.senderId)[0] :null;
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