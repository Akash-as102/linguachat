import { Image, Pressable, StyleSheet, Text ,View} from "react-native";
import ThemedInput from "../../components/ThemedInput";
import ThemedView from "../../components/ThemedView";
import { useAuth } from "../../libs/auth-context";
import Spacer from "../../components/Spacer";
import { useState } from "react";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ErrorText from "../../components/ErrorText";
import ThemedLoading from "../../components/ThemedLoading";
import defaultProfile from "../../assets/defaultProfile.jpg"
import requestPermission from '../../libs/galleryPermission';
import * as ImagePicker from 'expo-image-picker';
import cacheProfileImage from "../../libs/profileLocalPath";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store"
import { router } from 'expo-router';
import * as FileSystem from "expo-file-system/legacy";


const SetProfile = () => {
    const {user}=useAuth()
    const [token,setToken]=useState(null)
    const [profileUrl,setProfileUrl]=useState("")
    const [selected,setSelected]=useState(false)
    const [enableDelete,setEnableDelete]=useState(false);
    useEffect(()=>{
        (async()=>{
            const fetchToken= await SecureStore.getItemAsync('token')
            setToken(fetchToken)
        })()
    },[])
    useEffect(()=>{
        (async()=>{
            let url=await AsyncStorage.getItem('profileUrl');
            if(url){setEnableDelete(true)
                setProfileUrl(url);
            }
            else{
                url=await cacheProfileImage(user.id);
                setProfileUrl(url)
            }
        })()
    },[])
    async function pickImage(){
        const ok=await requestPermission()
        if(!ok) return;

        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[1,1],
            quality:0.6,
            exif:false
        })
        if(!result.canceled){
            try {
                setProfileUrl(`${result.assets[0].uri}?t=${Date.now()}`);
                setSelected(true);
                setEnableDelete(true);
            } catch (error) {
                console.log(error)
            }
        }
    }
    async function deleteImage(){
        await AsyncStorage.removeItem('profileUrl')
        setProfileUrl('')
        setSelected(true)
        setEnableDelete(false);
    }
    const uploadImage=async (uri)=>{
        const formData=new FormData();
        if(uri==""){
            const result=await fetch(`${process.env.EXPO_PUBLIC_API}/user/deleteProfilePic`,{
                method:"POST",
                headers:{
                    "authorization":`Bearer ${token}`,
                    "Content-Type":"multipart/form-data"
                }
            })
            const data=await result.json();
            const localPath = `${FileSystem.documentDirectory}user_${user.id}.jpeg`;
            await FileSystem.deleteAsync(localPath)
            router.back();
            router.back();
        }
        else {
            formData.append('image',{
            uri,
            name:`${user.name}.jpg`,
            type:"image/jpeg"
        });
        const result=await fetch(`${process.env.EXPO_PUBLIC_API}/user/profilePic`,{
            method:"POST",
            headers:{
                "authorization":`Bearer ${token}`,
                "Content-Type":"multipart/form-data"
            },
            body:formData
        })
        const data= await result.json()
        const image= await cacheProfileImage(user.id,data.profilePic);
        await AsyncStorage.setItem('profileUrl',image)
        router.replace("/Home")
        }
    }

    return (
    <ThemedView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <ThemedButton onPress={deleteImage} style={[styles.delete,!enableDelete && styles.deleteDisable]} >
                <Text style={styles.button}>X</Text>
            </ThemedButton>
        <Image source={profileUrl? {uri:profileUrl} : defaultProfile} style={[{
                width:"70%",
                height:"35%",
                borderRadius:150
        }]} />
        <Spacer />
        <ThemedButton onPress={pickImage} style={styles.buttonContainer} >
            <Text style={styles.button}>Select Image</Text>
        </ThemedButton>
        <Spacer />

        <ThemedButton onPress={()=>router.replace('/Home')} style={styles.buttonContainer}>
                <Text >Skip</Text>
            </ThemedButton>

        <Spacer></Spacer>

        <ThemedButton onPress={()=>uploadImage(profileUrl)} style={[styles.buttonContainer,!selected && styles.uploadDisable,{backgroundColor:"#021526"}]}  disabled={!selected}>
            <Text style={{color:'white',fontFamily:'serif'}}>Save</Text>
        </ThemedButton>
        
    </ThemedView>
    )
}

export default SetProfile

const styles=StyleSheet.create({
    button:{
        fontFamily:'serif',
    },
    buttonContainer:{
        width:'35%'
    },
    uploadDisable:{
        opacity:0
    },
    delete:{
        width:30,
        height:30,
        backgroundColor:'#FF5F5F',
        alignSelf:'flex-end',
        marginRight:'18%',
    },
    deleteDisable:{
        display:'none'
    },


})