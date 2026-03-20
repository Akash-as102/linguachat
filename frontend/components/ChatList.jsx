import { StyleSheet, Text, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors';
import ThemedView from './ThemedView';
import { useChatStore } from '../store/chatStore';
import HomePageChat from './HomePageChat';
import { useState } from 'react';

const ChatList = ({style,...props}) => {

    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light;

    const {chats,chatOrder} = useChatStore();

    const [selectedChat,setSelectedChat] = useState(null)
  return (
    <ThemedView style={[{flex:1,paddingTop:10},styles.container,style]}>
        {chatOrder.length==0 && <Text style={styles.empty}>Search user to add to homepage</Text>}
        {chatOrder.map(id=>{
          const message = chats[id];
          if(!message) return null
          const lastMessage =
            typeof(message.lastMessage) === 'object'
              ? message.lastMessage.text
              : message.lastMessage

          return (
            <HomePageChat
              key={id}
              name={message.name}
              lastMessageTime={message.updatedAt}
              lastMessage={lastMessage}
              chatUserId={message.userId}
              unreadCount={message.unreadCount}

              selected={selectedChat === message.userId}
              onLongPress={()=>setSelectedChat(message.userId)}
              clearSelection={()=>setSelectedChat(null)}
            />
          )
        })}

    </ThemedView>
  )
}

export default ChatList

const styles=StyleSheet.create({
  container:{
  },
  empty:{
    opacity:0.5,
    margin:'auto'
  }
})