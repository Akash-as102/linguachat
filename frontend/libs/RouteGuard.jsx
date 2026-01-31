import { useEffect } from "react";
import { useAuth } from "./auth-context";
import {useRouter} from "expo-router"
import ThemedLoading from "../components/ThemedLoading";

export default function RouteGuard({children}){
    const {user,loading}= useAuth();
    const router = useRouter();

    useEffect(()=>{
        if(!loading){
            if(!user) router.replace('/Login');
        }
    },[user,loading])
    if(loading) return <ThemedLoading />
    return children
}