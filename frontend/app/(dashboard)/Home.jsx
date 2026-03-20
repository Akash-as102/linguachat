import { StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../../libs/auth-context'
import ThemedLoading from '../../components/ThemedLoading';
import ThemedView from '../../components/ThemedView';
import ChatList from '../../components/ChatList';
import { useCallback } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useFocusEffect } from 'expo-router';

const Home = () => {
  const {user}=useAuth();
  const {clearActiveChat,}= useChatStore();

  useFocusEffect(
    useCallback(()=>{
      clearActiveChat();
    },[])
  )

  if(!user) return <ThemedLoading />
  return (
    <ThemedView style={styles.view}>
      <ChatList />
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  view:{
    flex:1,
    backgroundColor:'white'
  }
})