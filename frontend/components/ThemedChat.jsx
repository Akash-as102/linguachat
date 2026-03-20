import { Image, Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';
import ProfilePic from './ProfilePic';
import { useChatStore } from '../store/chatStore';
import { router } from 'expo-router';
import { useState } from 'react';
import ProfilePreview from './ProfilePreview';

const ThemedChat = ({style,name,chatUserId,unreadCount,lastMessageTime,isSearch=false,lastMessage,phone}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
    const {setActiveChat}=useChatStore()
    const [preview,setPreview]=useState(false);
    const {profileUrl}=useChatStore();

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
        <>
        <View style={{
            flexDirection:'row',
            height:60,
            flex:1,
            // marginVertical:20,
        }}>
            <Pressable onPress={()=>setPreview(true)}>
                <ProfilePic url={profileUrl[chatUserId]}/>
            </Pressable>
            <Pressable style={({pressed})=>[{backgroundColor: theme.backgroundColor,
                borderBottomColor:'grey',
                flex:1,
                height:60
            },pressed && styles.pressed,style]}
            onPress={()=>handleClick(chatUserId,name)}
            >
                <View style={[{marginLeft:10,flex:1,},style]}>
                    <Text style={{
                        fontSize:18,
                        fontWeight:'bold'
                    }}>{name}</Text>
                    {phone && <Text style={{marginTop:2}}>{phone}</Text>}
                    {unreadCount>0 ? <Text style={{
                        color:'blue',
                        marginTop:4,
                    }}>{unreadCount} New Message at {formatChatTime(lastMessageTime)}</Text>:
                        (!isSearch && <View style={styles.lastMessage}><Text>{lastMessage}</Text><Text>{formatChatTime(lastMessageTime)}</Text></View>)
                    }
                </View>
            </Pressable>
        </View>
        <Modal
            visible={preview}
            transparent
            animationType="fade"
            onRequestClose={() => setPreview(false)}
        >
            <Pressable
            style={styles.overlay}
            onPress={() => setPreview(false)}
            >
            <ProfilePreview url={profileUrl[chatUserId]}/>
            </Pressable>
      </Modal>
        </>
  )
}

export default ThemedChat

const styles=StyleSheet.create({
    pressed:{
        // backgroundColor:"grey"
    },
    lastMessage:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:5,
        maxHeight:20,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    previewImage: {
        width: 260,
        height: 260,
        borderRadius: 130,
    },
})