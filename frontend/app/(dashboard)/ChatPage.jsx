import { KeyboardAvoidingView, Platform, StyleSheet, FlatList,text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedInput from '../../components/ThemedInput'
import { useLocalSearchParams } from 'expo-router'
import ThemedButton from '../../components/ThemedButton';
import { useChatStore } from '../../store/chatStore'
import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../../libs/SocketContext'
import ThemedMessageBubble from '../../components/ThemedMessageBubble'

const ChatPage = () => {
  const { chatUserId, name } = useLocalSearchParams()
  const [text,setText]=useState()
  const {messages} = useChatStore();
  const chatUserMessages= messages[chatUserId]
  const socketRef = useSocket();
  const flatListRef=useRef(null)
  
  function handleSend(){
    socketRef.current.emit('sendMessage',{chatUserId,text});
    setText('')
  }

  /* Scroll to latest */ 

  useEffect(()=>{
    if(chatUserMessages.length==0)return 
    requestAnimationFrame(()=>{
      flatListRef.current?.scrollToIndex({
      index:chatUserMessages.length-1,
      animated:false,
      viewPosition:1
      })
    })
  },[chatUserMessages.length])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText}>{name}</ThemedText>
      </ThemedView>

      {/* Messages + Input */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust if you have header
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={chatUserMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSent=socketRef.current.auth.userId==item.senderId
            return <ThemedMessageBubble item={item} isSent={isSent}  />
          }}
          contentContainerStyle={{ padding: 10 }}
          style={styles.messagesList}
          onScrollToIndexFailed={(info)=>{
            setTimeout(()=>{
              flatListRef.current?.scrollToIndex({
                index:info.index,
                animated:false,
                viewPosition:1
              })
            },50)
          }}
        />

        {/* Input */}
        <ThemedView style={styles.message}>
          <ThemedInput style={styles.input} placeholder="Type a message..." value={text} onChangeText={setText} 
            multiline
          />
          <ThemedButton style={{width:"20%"}} onPress={handleSend}>
            <ThemedText>Send</ThemedText>
          </ThemedButton>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatPage

const styles = StyleSheet.create({
  header: {
    height: 60,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end', // push input to bottom
  },
  messagesList: {
    flex: 1,
  },
  messageBubbleLeft: {
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: 'flex-start', // or 'flex-end' for sent messages
    maxWidth:"75%",
    minWidth:"25%"
  },
  messageBubbleRight:{
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: 'flex-end',
    maxWidth:"75%",
    minWidth:"25%"
  },
  input: {
    minHeight: 50,
    maxHeight: 100,
    backgroundColor: 'grey',
    margin: 10,
    borderRadius: 25,
    paddingHorizontal: 15,
    width:"80%"
  },
  message:{
    flexDirection:'row'
  }
})
