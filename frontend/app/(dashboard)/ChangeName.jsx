import { StyleSheet } from "react-native";
import ThemedInput from "../../components/ThemedInput";
import ThemedView from "../../components/ThemedView";
import { useAuth } from "../../libs/auth-context";
import Spacer from "../../components/Spacer";
import { useState } from "react";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ErrorText from "../../components/ErrorText";
import api from '../..//libs/api'
import ThemedLoading from "../../components/ThemedLoading";
import { useRouter } from 'expo-router';
const ChangeName = () => {
  const {user,setUser}=useAuth();
    const [name,setName]=useState("")
    const [error,setError]=useState(null)
    const router=useRouter()
    async function handleSubmit(){
        if(name.length<1){
            setError('Invalid Name')
        }
        else{
            try {
                const update=await api.put('/auth/changename',{name})
                setUser(update.data.user)
                setError(update.data.message)
                setTimeout(() => {
                    router.back()
                }, 1000);

            } catch (error) {
                console.log(error)
                setError("Something Failed")
            }
        }

    }
  if(!user) return <ThemedLoading />
  return (
        
        <ThemedView style={{
            padding:20,
            flex:1,
            alignItems:'center',
        }}>
            
            {error && <ErrorText style={{
                color:'red',
            }}>
                {error}
            </ErrorText>}
            <Spacer />
            <ThemedInput 
                placeholder="New Name"
                onChangeText={setName}
                value={name}
                style={styles.input}
            />
           
            <Spacer />
            <ThemedButton onPress={handleSubmit}>
                <ThemedText style={{
                    fontFamily:'serif'
                }}>Submit</ThemedText>
            </ThemedButton>
        </ThemedView>
  )
}

export default ChangeName

const styles=StyleSheet.create({
    input:{
        width:'80%',
        borderColor:'black',
        borderWidth:1,
    }
})