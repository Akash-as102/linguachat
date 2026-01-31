import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "./auth-context";
import { connectWS } from "./socket.js";
import { useChatStore } from "../store/chatStore.js";
import mainApi from "./mainApi.js";


const SocketContext=createContext(null);

export const SocketProvider=({children})=>{
    const socketRef=useRef(null);
    const {user}=useAuth()
    const {setChats}=useChatStore();

    useEffect(()=>{
        if(!user)return;
        socketRef.current=connectWS(user.id)

        socketRef.current.on('chatList',(chatList)=>{
            const chatsMap={}
            const chatOrder=[]
            chatList.forEach(chat=>{
                chatsMap[chat.peerId]={
                    userId:chat.peerId,
                    lastMessage:chat.lastMessage,
                    updatedAt:chat.lastMessageAt,
                    unreadCount:chat.unreadCount,
                    name:chat.peer.name,
                    phone:chat.peer.phone
                }
                chatOrder.push(chat.peerId);
            })
            setChats(chatsMap,chatOrder)
        })

        socketRef.current.emit('getChatList');

        socketRef.current.on("receiveMessage",async (message)=>{
            const {addMessage,incrementUnread,activeChatId,messageStatusUpdate,chats,setChatUserInfo} =useChatStore.getState()
            const chatUserId=message.senderId===user.id? message.receiverId:message.senderId
            const isIncoming=message.senderId!==user.id
            addMessage(chatUserId,message,isIncoming);
            
            if(!chats[chatUserId]?.name){
                const res=await mainApi.get(`/search/searchId/${chatUserId}`)
                setChatUserInfo(chatUserId,{
                    name:res.data.name,
                    phone:res.data.phone
                })
            }

            if(activeChatId!==chatUserId){
                incrementUnread(chatUserId)
            }
        })
        socketRef.current.on('messageStatusUpdate',({chatUserId,messageId,status})=>{
            messageStatusUpdate(chatUserId,messageId,status);
        })

        return ()=>{
            socketRef.current?.disconnect();
            socketRef.current=null;
        }
    },[user])

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    )
}
export const useSocket = ()=> useContext(SocketContext);