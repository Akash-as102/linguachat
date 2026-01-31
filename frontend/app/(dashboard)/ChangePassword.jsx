import { StyleSheet } from "react-native";
import ThemedInput from "../../components/ThemedInput";
import ThemedView from "../../components/ThemedView";
import { useAuth } from "../../libs/auth-context";
import Spacer from "../../components/Spacer";
import { useState } from "react";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import api from '../../libs/api'
import ErrorText from "../../components/ErrorText";
import { useRouter } from "expo-router";
const ChangeName = () => {
  const {user}=useAuth();
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [oldPassword,setOldPassword]=useState("")
    const [error,setError]=useState()
    const router=useRouter()

    async function handleSubmit(){
        if(oldPassword.length<1 || password.length<1){
            setError("Password Cannot Be Empty")
        }
        else if(password!==confirmPassword)setError("Passwords Don't Match")
        else{
            try {
                const res=await api.put('/auth/changePassword',{oldPassword,password})
                setError(res.data.message)
                setTimeout(() => {
                    router.back()
                }, 5000);
            } catch (error) {
                console.log(error.response.data.error)
                setError(()=>{
                    return (error.response?.data?.error || error.message || 'Unexpected Error')
                })
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
                color:'red'
            }}>
                    {error}
                </ErrorText>}
            <Spacer />
            <ThemedInput 
                placeholder="Old Password"
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
            />
            <Spacer />
            <ThemedInput 
                placeholder="New Password"
                style={[styles.input,{
                    borderColor:'#03346E',
                    borderWidth:2
                }]}
                value={password}
                onChangeText={setPassword}
            />
            <Spacer />
            <ThemedInput 
                placeholder="Confirm New Password"
                style={[styles.input,{
                    borderColor:'#03346E',
                    borderWidth:2
                }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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