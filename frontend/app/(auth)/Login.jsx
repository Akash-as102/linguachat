import { KeyboardAvoidingView, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native'
import {Colors} from '../../constants/Colors.js'

//themed components
import ThemedInput from '../../components/ThemedInput.jsx';
import Spacer from '../../components/Spacer.jsx';
import ThemedText from '../../components/ThemedText.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import ThemedButton from '../../components/ThemedButton.jsx';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../libs/auth-context.jsx';
import ErrorText from '../../components/ErrorText.jsx';

const Login = () => {
    const colorScheme=useColorScheme();
    const theme= Colors[colorScheme] ?? Colors.light;
    const background=(colorScheme === 'dark'? '#000000' : '') ;

    //logics 
  const [error,setError]= useState(null);
  const [phone,setPhone]=useState("");
  const [password,setPassword]=useState("");
  const router= useRouter();
  const {login,logout} = useAuth()

  const handleSubmit=async ()=>{
    if(phone.length!== 10){
      setError("INVALID PHONE NUMBER")
      return
    }
    setError(null)
    try{
      await login(phone,password)
      return router.replace('/Home')
    }catch(err){
      const message= err.response?.data.error || "Something Went Wrong"
      setError(message);
    }
  }
  return (
    <View style={[styles.body,{
      backgroundColor:background
    }]}>
      <KeyboardAvoidingView style={[styles.container,{
        backgroundColor: background
      }]}
        behavior={Platform.OS==='ios'? 'padding':'height'}
      >
        <LinearGradient
          colors={['#17153B', '#03346E']}
          locations={[0.5,1]}
          style={styles.form}
        >
            <ThemedText style={styles.heading} >Welcome Back</ThemedText>
              <Spacer height={20}/>
              {error && 
                <ErrorText style={[{alignSelf:'flex-start',marginLeft:'20'},styles.error]}>
                  {error}
                </ErrorText>
              }
              <Spacer height={15}/>
              <ThemedInput style={styles.input}
                 placeholder="Phone"
                 keyboardType="number-pad"
                 onChangeText={setPhone}
                 value={phone}
                 maxLength={10}
              />
              <Spacer />
              <ThemedInput style={styles.input}
                 placeholder="Password"
                 secureTextEntry
                 onChangeText={setPassword}
              />
              <Spacer height={10}/>
              <Link href="/ResetPassword" style={styles.forgot}>Forgot Password</Link>
              <Spacer height={20}/>
              <ThemedButton onPress={handleSubmit}>
                <Text style={styles.btn}>Submit</Text>
              </ThemedButton>
              <Spacer height={15} />
              <Link href="/Signup" style={styles.register}>Register Now</Link>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    body:{
      flex:1,
      marginBottom:0
    },
    container:{
        flex:1,
        justifyContent:'center',
        padding:40,
        
    },
    form:{
      backgroundColor:'white',
      padding:25,
      borderRadius:10,
      alignItems:'center',
    },
    input:{
      width:"90%"
    },
    heading:{
      fontSize:25,
      fontWeight:"bold",
      fontFamily:'serif',
      color:'white'
    },
    btn:{
      fontSize:16,
      fontWeight:'bold',
      fontFamily:'serif'
    },
    register:{
      color:'white',
      fontWeight:'bold',
      fontFamily:'serif'
    },
    forgot:{
      color:'white',
      alignSelf:'flex-start',
      marginLeft:20
    },
    error:{
      color:'red',
      fontFamily:'serif',
      fontSize: 12
    }
})