import { useEffect } from "react";
import { useAuth } from "./auth-context";
import {useRouter} from "expo-router"
import ThemedLoading from "../components/ThemedLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GuestOnly({children}){
    const {user,loading}= useAuth();
    const router = useRouter();

    useEffect(()=>{
        (async ()=>{
            if(!loading){
            const profile= await AsyncStorage.getItem('profileUrl')
            if(user && profile) router.replace('/Home');
            else if(user && !profile) router.replace('/SetProfile')
        }
        })()
    },[user,loading])
    if(loading) return <ThemedLoading />
    return children
}