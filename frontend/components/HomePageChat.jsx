import { Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';
import ProfilePic from './ProfilePic';
import { useChatStore } from '../store/chatStore';
import { router } from 'expo-router';
import { useState } from 'react';
import ProfilePreview from './ProfilePreview';

const HomePageChat = ({
    style,
    name,
    chatUserId,
    unreadCount,
    lastMessageTime,
    isSearch=false,
    lastMessage,
    phone,
    selected,
    onLongPress,
    clearSelection
}) => {

    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light;
    const { setActiveChat, profileUrl,deleteChat } = useChatStore()
    const [preview,setPreview] = useState(false)

    function formatChatTime(timestamp){
        const d = new Date(timestamp)
        const now = new Date()

        const isToday =
        d.getDate()===now.getDate() &&
        d.getMonth()===now.getMonth() &&
        d.getFullYear()===now.getFullYear()

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

    function handleClick(){
        if(selected){
            clearSelection()
            return
        }

        setActiveChat(chatUserId)

        router.push({
            pathname:'/ChatPage',
            params:{
                chatUserId,
                name
            }
        })
    }

    function handleDelete(){
        deleteChat(chatUserId)
        clearSelection()
    }

    return (
        <>
        <Pressable
            onPress={handleClick}
            onLongPress={onLongPress}
            delayLongPress={300}
            style={[selected && styles.selected,{
                flexDirection:'row',
                height:60,
                marginHorizontal:15,
                alignItems:'center',
            }]}
        >

            {/* Profile Pic */}
            <Pressable onPress={()=>setPreview(true)}>
                <ProfilePic url={profileUrl[chatUserId]}/>
            </Pressable>

            {/* Chat Content */}
            <View style={{marginLeft:10,flex:1}}>

                <View style={{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center'
                }}>

                    <Text style={{
                        fontSize:18,
                        fontWeight:'bold'
                    }}>
                        {name}
                    </Text>

                    {selected && (
                        <Pressable onPress={handleDelete}>
                            <Text style={styles.delete}>Delete</Text>
                        </Pressable>
                    )}

                </View>

                {phone && <Text style={{marginTop:2}}>{phone}</Text>}

                {unreadCount>0 ?
                (
                    <Text style={{
                        color:'blue',
                        marginTop:4,
                    }}>
                        {unreadCount} New Message at {formatChatTime(lastMessageTime)}
                    </Text>
                )
                :
                (
                    !isSearch &&
                    <View style={styles.lastMessage}>
                        <Text numberOfLines={1}>{lastMessage}</Text>
                        {!selected && <Text>{formatChatTime(lastMessageTime)}</Text>}
                    </View>
                )}

            </View>

        </Pressable>

        {/* Profile Preview */}
        <Modal
            visible={preview}
            transparent
            animationType="fade"
            onRequestClose={()=>setPreview(false)}
        >
            <Pressable
                style={styles.overlay}
                onPress={()=>setPreview(false)}
            >
                <ProfilePreview url={profileUrl[chatUserId]}/>
            </Pressable>
        </Modal>
        </>
    )
}

export default HomePageChat


const styles = StyleSheet.create({

    lastMessage:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:5,
        maxHeight:20,
    },

    overlay:{
        flex:1,
        backgroundColor:"rgba(0,0,0,0.9)",
        justifyContent:"center",
        alignItems:"center",
    },
    delete:{
        fontSize:18,
        fontFamily:'serif',
        color:'red'
    }
})