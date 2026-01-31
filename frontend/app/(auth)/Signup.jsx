import { KeyboardAvoidingView, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native'
import {Colors} from '../../constants/Colors.js'

//themed components
import ThemedInput from '../../components/ThemedInput.jsx';
import Spacer from '../../components/Spacer.jsx';
import ThemedText from '../../components/ThemedText.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import ThemedButton from '../../components/ThemedButton.jsx';
import { Link } from 'expo-router';
import { useState } from 'react';
import ErrorText from '../../components/ErrorText.jsx';
import { useAuth } from '../../libs/auth-context.jsx';


const Signup = () => {
    const colorScheme=useColorScheme();
    const theme= Colors[colorScheme] ?? Colors.light;
    const background=(colorScheme === 'dark'? '#000000' : '') ;
    const {signup}=useAuth()
    //logics 
  const [error,setError]= useState(null);
  const [phone,setPhone]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName] = useState('');

  const handleSubmit=async ()=>{
    if(phone.length!== 10){
      setError("INVALID PHONE NUMBER")
      return
    }
    if(name.length == 0){
        setError("ENTER A VALID NAME")
        return
    }
    setError(null)
    try{
      await signup(name,phone,password)
      return router.replace('/Home')

    }catch(err){
      setError(err.response?.data.error || "Something went wrong");
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
            <ThemedText style={styles.heading} >Register Now</ThemedText>
              <Spacer height={20}/>
              {error && 
                <ErrorText style={[{alignSelf:'flex-start',marginLeft:'20'},styles.error]}>
                  {error}
                </ErrorText>
              }
              <Spacer height={15}/>
              <ThemedInput style={styles.input}
                 placeholder="Name"
                 onChangeText={setName}
                 value={name}
              />
              <Spacer />
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
              <Link href="/Login" style={styles.login}>Sign In</Link>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
    body:{
      flex:1,
      marginBottom:0
    },
    container:{
        flex:1,
        justifyContent:'center',
        // alignItems:'center'
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
    login:{
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