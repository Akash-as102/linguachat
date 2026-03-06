import { StyleSheet, Text, View } from 'react-native'
import ThemedView from '../../components/ThemedView';
import ChatList from '../../components/ChatList';
import { useChatStore } from '../../store/chatStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedInput from '../../components/ThemedInput';
import  EvilIcons  from '@expo/vector-icons/EvilIcons';
import { useCallback, useEffect, useState } from 'react';
import SearchChat from '../../components/SearchChat';
import SearchError from '../../components/SearchError';
import mainApi from '../../libs/mainApi';
import { useFocusEffect } from 'expo-router';
import cacheProfileImage from '../../libs/profileLocalPath';

const SearchPage = () => {
  const {chats,clearActiveChat,setProfile}= useChatStore();
  const [text,setText]=useState("")
  const [searchResult,setSearchResult]=useState(null);
  const [showEveryUser,setShowEveryUser]=useState(true)
  const [error,setError]=useState(null)

  async function handleSubmit(query){
    const number=parseInt(query)
    if(!number){
      const user=Object.values(chats).filter(item=>item.name?.toLowerCase().includes(query.toLowerCase().trim()))
      if(user.length>0){
        setSearchResult(user)
        setShowEveryUser(false)
      }
      else{
        setShowEveryUser(false)
        setError('User Not Found')
      }
    }
    else{
      if(number.toString().length!==10){
        setError("Enter a Valid Number")
        setShowEveryUser(false);
      }
      else{
        try {
          const res= await mainApi.get(`/search/searchByPhone/${number}`)
          setError(null)
          let image= null
          if(res.data.profileUrl){
           image= await cacheProfileImage(res.data.id,res.data.profileUrl);
           setProfile(res.data.id,image)
          }
          const updated={
              id:res.data.id,
              name:res.data.name,
              phone:res.data.phone,
            }
          setSearchResult(updated);
          setShowEveryUser(false)
        } catch (error) {
          setShowEveryUser(false);
          setError(error.response?.data.error || "User Not Found")
        }
      }
    }
  }
  useEffect(()=>{
    if(text.trim()===""){
      setShowEveryUser(true)
      setSearchResult(null)
      setError(null)
    }
  },[text])

  useFocusEffect(
      useCallback(()=>{
        clearActiveChat();
      },[])
    )
  return (
    <SafeAreaView style={{flex:1}}>
        <View style={styles.search}>
            <EvilIcons name="search" size={28} color='black' />
            <ThemedInput style={{
                backgroundColor:'grey',
                width:'85%'
            }}
                placeholder="Search name or mobile number"
                value={text}
                onChangeText={setText}
                returnKeyType='search'
                onSubmitEditing={()=>handleSubmit(text)}
            >
            </ThemedInput>
        </View>
        <ThemedView style={styles.view}>
          {!showEveryUser? (error? <SearchError error={error}/>:<SearchChat children={searchResult}/>): <ChatList style={{marginTop:10}} /> }
        </ThemedView>
    </SafeAreaView>
  )
}

export default SearchPage

const styles = StyleSheet.create({
  view:{
    flex:1
  },
  search:{
    flexDirection:'row',
    justifyContent:"center",
    alignItems:'center',
    backgroundColor:'grey',
    borderRadius:40,
    width:'95%',
    alignSelf:'center',
    margin:10
  }
})