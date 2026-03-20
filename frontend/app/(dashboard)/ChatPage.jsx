import {
  StyleSheet,
  FlatList,
  Animated,
  Keyboard,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"

import AntDesign from '@expo/vector-icons/AntDesign';
import ThemedText from "../../components/ThemedText"
import ThemedInput from "../../components/ThemedInput"
import ThemedButton from "../../components/ThemedButton"
import ThemedMessageBubble from "../../components/ThemedMessageBubble"

import { useChatStore } from "../../store/chatStore"
import { useSocket } from "../../libs/SocketContext"

const INPUT_HEIGHT = 70

const ChatPage = () => {
  const { chatUserId, name } = useLocalSearchParams()
  const [text, setText] = useState("")
  const {profileUrl}=useChatStore()

  const { messages, loadedConversations, deleteMessage} = useChatStore()
  const chatUserMessages = messages[chatUserId] || []

  const socketRef = useSocket()
  const flatListRef = useRef(null)

  const keyboardOffset = useRef(new Animated.Value(0)).current

  /* ------------------ Keyboard handling ------------------ */

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        Animated.timing(keyboardOffset, {
          toValue: e.endCoordinates.height,
          duration: Platform.OS === "ios" ? e.duration : 200,
          useNativeDriver: false,
        }).start()
      }
    )

    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: Platform.OS === "ios" ? 250 : 200,
          useNativeDriver: false,
        }).start()
      }
    )

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  /* ------------------ Fetch messages ------------------ */

  useEffect(() => {
    if (!chatUserId) return
    if (loadedConversations?.[chatUserId]) return

    socketRef.current.emit("getMessages", { chatUserId })
  }, [chatUserId])

  /* ------------------ Auto scroll to bottom ------------------ */
  const scrollToBottom = (animated = false) => {
  if (!flatListRef.current ) return

  flatListRef.current.scrollToEnd({animated})
}

  /* ------------------ Send message ------------------ */

  function handleSend() {
    if (!text.trim()) return
    socketRef.current.emit("sendMessage", { chatUserId, text })
    setText("")
  }

  // --------------------- delete message ------------------

    function handleDeleteMessage(id, edit, userId,senderId=null) {

      deleteMessage(id, edit, userId)

      if (socketRef.current) {
          socketRef.current.emit('deleteMessage', {
              senderId,
              id,
              userId
          })
      }
}
  

  return (
    <SafeAreaView style={{ flex: 1,marginTop:-40}}>
      {/* Header */}
      {/* <ThemedView style={styles.header}>
        <ProfilePic url={profileUrl[chatUserId]}/>
        <ThemedText style={styles.headerText}>{name}</ThemedText>
      </ThemedView> */}

      {/* Messages */}
      <Animated.FlatList
        ref={flatListRef}
        data={chatUserMessages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSent =
            socketRef.current.auth.userId === item.senderId
          return <ThemedMessageBubble item={item} isSent={isSent} onDelete={handleDeleteMessage}/>
        }}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        contentContainerStyle={{
          padding: 10,
          paddingBottom: Animated.add(
            keyboardOffset,
            new Animated.Value(INPUT_HEIGHT + 10)
          ),
        }}
        onContentSizeChange={()=> scrollToBottom(false)}
        style={styles.messagesList}
      />

      {/* Input */}
      <Animated.View
        style={[
          styles.message,
          {
            bottom: keyboardOffset,
            marginBottom:10,
            alignItems:'center',
            justifyContent:'center'
          },
        ]}
      >
        <ThemedInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <ThemedButton style={{ width: "13%",borderRadius:'50%',height:"70%",backgroundColor:'#232055',marginLeft:10}} onPress={handleSend}>
          <AntDesign name="send" size={23} color="white" />
        </ThemedButton>
      </Animated.View>
    </SafeAreaView>
  )
}

export default ChatPage

/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
  // header: {
  //   height: 65,
  //   backgroundColor: "#6389AD",
  //   justifyContent: "center",
  //   paddingHorizontal: 15,
  //   elevation:10,
  //   flexDirection:'row',
  //   alignItems:"center",
  //   justifyContent:'flex-start'
  // },
  // headerText: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color:'black',
  //   fontFamily:'serif',
  //   fontSize:20,
  //   marginLeft:7
  // },
  messagesList: {
    flex: 1,
    backgroundColor: "white",
  },
  message: {
    position: "absolute",
    left: 0,
    right: 0,
    height: INPUT_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  input: {
    minHeight: 45,
    maxHeight: 120,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "80%",
    backgroundColor:'#eed8b6'
  },
})
