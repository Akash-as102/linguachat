import {create} from 'zustand'
import {persist,createJSONStorage} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useChatStore=create(persist((set,get)=>({
    chats:{},
    messages:{},
    activeChatId:null,
    chatOrder:[],
    loadedConversations:{},
    profileUrl:{},

    setProfile:(userId,url)=>set(()=>({
        profileUrl:{
            ...get().profileUrl,
            [userId]:url
        }
    })),

    setActiveChat:(userId)=>set(()=>({
        activeChatId:userId,
        chats:{
            ...get().chats,
            [userId]:{
                ...get().chats[userId],
                unreadCount:0
            }
        }
    })),

    addMessage:(chatUserId,message,isIncoming)=>set((state)=>{
        const existingChat=state.chats[chatUserId]
        const isActive= state.activeChatId===chatUserId
        const unreadCount=isIncoming && !isActive ? (existingChat?.unreadCount ?? 0)+1 :existingChat?.unread ?? 0;
        return {
        messages:{
            ...state.messages,
            [chatUserId]:[
                ...(state.messages[chatUserId] || []),
                message
            ]
        },
        chats:{
            ...state.chats,
            [chatUserId]:{
                ...existingChat,
                userId:chatUserId,
                lastMessage:message,
                unreadCount,
                updatedAt:message.createdAt
            }
        },
        chatOrder:[
            chatUserId,
            ...state.chatOrder.filter(id=>id!==chatUserId)
        ]
    }}),
    setChatUserInfo:(chatUserId,userInfo)=>set((state)=>({
        chats:{
            ...state.chats,
            [chatUserId]:{
                ...state.chats[chatUserId],
                ...userInfo
            }
        }
    })),
    messageStatusUpdate:(chatUserId,messageId,status)=>set((state)=>({
        messages: {
            ...state.messages,
            [chatUserId]: state.messages[chatUserId]?.map(msg=>
                msg.id===messageId?{...msg,status}:msg
            )
        }
    })),
    clearActiveChat:()=>set(()=>({
        activeChatId:null
    })),
    incrementUnread:(chatUserId)=>set((state)=>({
        chats:{
            ...state.chats,
            [chatUserId]:{
                ...state.chats[chatUserId],
                unreadCount:(state.chats[chatUserId]?.unreadCount || 0)+1
            }
        }
    })),
    setChats:(chats,order)=>set({chats,chatOrder:order}),
    setMessages:(chatUserId,msgs)=>set((state)=>({
        messages:{...state.messages,[chatUserId]:msgs},
        loadedConversations:{
            ...state.loadedConversations,
            [chatUserId]:true
        }
    }))
}),{    
    name:"chat-storage",
    storage:createJSONStorage(()=>AsyncStorage)
})
)