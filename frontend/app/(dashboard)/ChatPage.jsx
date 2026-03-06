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

import ThemedView from "../../components/ThemedView"
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

  const { messages, loadedConversations } = useChatStore()
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText}>{name}</ThemedText>
      </ThemedView>

      {/* Messages */}
      <Animated.FlatList
        ref={flatListRef}
        data={chatUserMessages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSent =
            socketRef.current.auth.userId === item.senderId
          return <ThemedMessageBubble item={item} isSent={isSent} />
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
            marginBottom:10
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
        <ThemedButton style={{ width: "20%" }} onPress={handleSend}>
          <ThemedText>Send</ThemedText>
        </ThemedButton>
      </Animated.View>
    </SafeAreaView>
  )
}

export default ChatPage

/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
  header: {
    height: 65,
    backgroundColor: "#021526",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color:'white',
    fontFamily:'serif',
    fontSize:20,
    marginLeft:20
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#03346E",
  },
  message: {
    position: "absolute",
    left: 0,
    right: 0,
    height: INPUT_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#03346E",
    paddingHorizontal: 10,
  },
  input: {
    minHeight: 45,
    maxHeight: 100,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "80%",
  },
})
