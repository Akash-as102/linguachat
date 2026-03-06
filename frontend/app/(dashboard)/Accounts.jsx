import { Link, useRouter } from "expo-router";
import ThemedView from "../../components/ThemedView"
import { Button, Image, Pressable, StyleSheet, Text } from 'react-native';
import ProfilePic from '../../components/ProfilePic';
import ThemedText from "../../components/ThemedText";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useEffect } from "react";

const Accounts = () => {
    const [url,setUrl]=useState(null);
    const router=useRouter();
    function handleName(){
        router.push('/ChangeName')
    }
    function handlePassword(){
        router.push('/ChangePassword')
    }
    useEffect(()=>{
        (async()=>{
            const storedUrl = await AsyncStorage.getItem("profileUrl");
            setUrl(storedUrl);
        })()
    },[])
    return (
        <ThemedView style={styles.container}>
                <Spacer />
                <ProfilePic style={{
                    width:200,
                    height:200,
                    borderRadius:100
                }}
                url={url}
                />
                <Spacer height={15}/>
                <Button title="Edit" onPress={()=>router.push('/SetProfile')}/>
                <Spacer />
                <ThemedButton style={{
                    borderRadius:0,
                }} onPress={handleName}>
                    <ThemedText style={{
                        fontFamily:'serif',
                        fontSize:17
                    }}>
                        Change Name
                    </ThemedText>
                </ThemedButton>
                <Spacer />
                <ThemedButton style={{
                    borderRadius:0,
                }} onPress={handlePassword}>
                    <ThemedText style={{
                        fontFamily:'serif',
                        fontSize:17
                    }}>
                        Change Password
                    </ThemedText>
                </ThemedButton>
        </ThemedView>
    )
}

export default Accounts

const styles= StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
    },

})