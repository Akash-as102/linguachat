import { useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';
import ThemedView from './ThemedView';
import { useChatStore } from '../store/chatStore';
import ThemedChat from './ThemedChat';


const ChatList = ({style,...props}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
    const {chats,chatOrder}=useChatStore();
    
  return (
    <ThemedView style={[{flex:1},style]}>
        {chatOrder.map(id=>{
          const message=chats[id];
          if(!message)return null
          const lastMessage= typeof(message.lastMessage)=='object'? message.lastMessage.text:message.lastMessage
          return <ThemedChat key={id} name={message.name} 
            lastMessageTime={message.updatedAt}
            lastMessage={lastMessage}
            chatUserId={message.userId}
            unreadCount={message.unreadCount}
          />
        })}
    </ThemedView>
  )
}

export default ChatList
