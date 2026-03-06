import { StyleSheet } from "react-native";
import ThemedInput from "../../components/ThemedInput";
import ThemedView from "../../components/ThemedView";
import { useAuth } from "../../libs/auth-context";
import Spacer from "../../components/Spacer";
import { useState } from "react";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import api from '../..//libs/api'
import ThemedLoading from "../../components/ThemedLoading";
import { useRouter } from 'expo-router';
import LanguageSelect from '../../components/LanguageSelect';
const ChangeLanguage = () => {
    const {user,setUser}=useAuth();
    const [lang,setLang]=useState(user.language)
    const router=useRouter()
    async function handleSubmit(){
        const update=await api.put('/auth/changeLanguage',{lang})
        setUser(update.data);
        router.back()
    }
  if(!user) return <ThemedLoading />
  return (
        
        <ThemedView style={{
            padding:20,
            flex:1,
            alignItems:'center',
        }}>
         <LanguageSelect value={lang} onChange={setLang} />
         <Spacer />
         <ThemedButton onPress={handleSubmit} style={styles.button}>
            <ThemedText style={{fontFamily:"serif"}}>Save</ThemedText>
         </ThemedButton>
        </ThemedView>
  )
}

export default ChangeLanguage

const styles=StyleSheet.create({
    button:{
        width:'35%'
    }
})