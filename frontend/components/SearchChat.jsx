import { useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';
import ThemedView from './ThemedView';
import ThemedChat from './ThemedChat';


const SearchChat = ({style,children,...props}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
  return (
    <ThemedView style={{flex:1, marginTop:20,marginHorizontal:15}}>
        {!Array.isArray(children)?
            <ThemedChat name={children.name} phone={children.phone} chatUserId={children.id} isSearch={true} />:
            children.map((item)=> <ThemedChat key={item.userId} name={item.name} chatUserId={item.userId} lastMessageTime={item.updatedAt} lastMessage={item.lastMessage.text} unreadCount={item.unreadCount} />)
        }
    </ThemedView>
  )
}

export default SearchChat
