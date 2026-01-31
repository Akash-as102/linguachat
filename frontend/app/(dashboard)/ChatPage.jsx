import { KeyboardAvoidingView, Platform, StyleSheet, FlatList,text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedInput from '../../components/ThemedInput'
import { useLocalSearchParams } from 'expo-router'
import ThemedButton from '../../components/ThemedButton';
import { useChatStore } from '../../store/chatStore'
import { useState } from 'react'
import { useSocket } from '../../libs/SocketContext'

const ChatPage = () => {
  const { chatUserId, name } = useLocalSearchParams()
  const [text,setText]=useState()
  const {messages} = useChatStore();
  const chatUserMessages= messages[chatUserId]
  const socketRef = useSocket();

  function handleSend(){
    socketRef.current.emit('sendMessage',{chatUserId,text});
    setText('')
  }

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
          data={chatUserMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView style={styles.messageBubble}>
              <ThemedText>{item.text}</ThemedText>
              <ThemedText>{item.status}</ThemedText>
            </ThemedView>
          )}
          contentContainerStyle={{ padding: 10 }}
          style={styles.messagesList}
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
  messageBubble: {
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: 'flex-start', // or 'flex-end' for sent messages
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
