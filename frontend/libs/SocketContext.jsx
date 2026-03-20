import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "./auth-context";
import { connectWS } from "./socket.js";
import { useChatStore } from "../store/chatStore.js";
import mainApi from "./mainApi.js";
import cacheProfileImage from "./profileLocalPath.js";


const SocketContext=createContext(null);

export const SocketProvider=({children})=>{
    const socketRef=useRef(null);
    const {user}=useAuth()
    const {setChats,setMessages,messageStatusUpdate,setProfile,deleteMessage,messages}=useChatStore();

    useEffect(() => {
  if (!user) return
  const socket = connectWS(user.id,user.language)
  socketRef.current = socket

  const onChatList = (chatList) => {
    const chatsMap = {}
    const chatOrder = []

    chatList.forEach(async chat => {
      chatsMap[chat.peerId] = {
        userId: chat.peerId,
        lastMessage: chat.lastMessage,
        updatedAt: chat.lastMessageAt,
        unreadCount: chat.unreadCount,
        name: chat.peer.name,
        phone: chat.peer.phone
      }
      chatOrder.push(chat.peerId)
      const image=await cacheProfileImage(chat.peerId,chat.peer.profileUrl)
      setProfile(chat.peerId,image)
    })

    setChats(chatsMap, chatOrder)
  }

  const onGetMessages = ({ chatUserId, messages }) => {
    setMessages(chatUserId, messages)
  }

  const onReceiveMessage = async (message) => {
    const {
      addMessage,
      incrementUnread,
      activeChatId,
      messageStatusUpdate,
      chats,
      setChatUserInfo
    } = useChatStore.getState()

    const chatUserId =
      message.senderId === user.id
        ? message.receiverId
        : message.senderId

    const isIncoming = message.senderId !== user.id

    addMessage(chatUserId, message, isIncoming)

    if (!chats[chatUserId]?.name) {
      const res = await mainApi.get(`/search/searchId/${chatUserId}`)
      setChatUserInfo(chatUserId, {
        name: res.data.name,
        phone: res.data.phone
      })
    }
  }
  const onDeleteMessage= ({messageId,senderId})=>{
    deleteMessage(messageId,true,senderId);
  }

  const onMessageStatusUpdate = ({ chatUserId, messageId, status }) => {
    messageStatusUpdate(chatUserId, messageId, status)
  }

  socket.on("chatList", onChatList)
  socket.on("getMessages", onGetMessages)
  socket.on("receiveMessage", onReceiveMessage)
  socket.on("messageStatusUpdate", onMessageStatusUpdate)
  socket.on('deleteMessage', onDeleteMessage)

  socket.emit("getChatList")

  return () => {
    socket.off("chatList", onChatList)
    socket.off("getMessages", onGetMessages)
    socket.off("receiveMessage", onReceiveMessage)
    socket.off("messageStatusUpdate", onMessageStatusUpdate)

    socket.disconnect()
    socketRef.current = null
  }
}, [user])

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    )
}
export const useSocket = ()=> useContext(SocketContext);