import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';
import ProfilePic from './ProfilePic';
import { useChatStore } from '../store/chatStore';
import { router } from 'expo-router';

const ThemedChat = ({style,name,chatUserId,profileUrl,unreadCount,lastMessageTime,isSearch=false,lastMessage,phone}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
    const {setActiveChat}=useChatStore()
    function formatChatTime(timestamp){
        const d=new Date(timestamp)
        const now=new Date()

        const isToday=d.getDate()===now.getDate() && d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear()
        if(isToday){
            return d.toLocaleTimeString([],{
                hour:"2-digit",
                minute:'2-digit'
            })
        }
        return d.toLocaleDateString([],{
            day:'2-digit',
            month:'short'
        })
    }


    function handleClick(chatUserId,name){
          setActiveChat(chatUserId)
           router.push({
              pathname:'/ChatPage',
              params:{
                chatUserId,
                name
              }
             })
        }
    return (
        <Pressable style={({pressed})=>[{backgroundColor: theme.backgroundColor,
            borderBottomColor:'grey',
            height:60,
            flexDirection:'row',
            marginHorizontal:15
        },pressed && styles.pressed,style]}
        onPress={()=>handleClick(chatUserId,name)}
        >
            <ProfilePic url={profileUrl}/>
            <View style={[{marginLeft:10,flex:1,},style]}>
                <Text style={{
                    fontSize:18,
                    fontWeight:'bold'
                }}>{name}</Text>
                {phone && <Text style={{marginTop:2}}>{phone}</Text>}
                {unreadCount>0 ? <Text style={{
                    color:'blue',
                    marginTop:4
                }}>{unreadCount} New Message at {formatChatTime(lastMessageTime)}</Text>:
                    (!isSearch && <View style={styles.lastMessage}><Text>{lastMessage}</Text><Text>{formatChatTime(lastMessageTime)}</Text></View>)
                }
            </View>
        </Pressable>
  )
}

export default ThemedChat

const styles=StyleSheet.create({
    pressed:{
        backgroundColor:"grey"
    },
    lastMessage:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:5
    }
})