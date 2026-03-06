import { createContext, useState , useEffect,useContext} from "react"
import * as SecureStore from "expo-secure-store"
import api,{setApiTokenHeader} from './api';
import { useChatStore } from "../store/chatStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import cacheProfileImage from "./profileLocalPath";


const AuthContext = createContext();

export function AuthProvider({children}){
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        const loadUser=async ()=>{
            try{
                const token= await SecureStore.getItemAsync("token")
                if(token){
                    setApiTokenHeader(token);
                    const response= await api.post("/auth/user")
                    const userId = response.data.userId 
                    const userData= await api.post(`/auth/user/${userId}`,{userId})
                    setUser(userData.data);
                }
            }
            catch(err){
                console.log(err)
                await SecureStore.deleteItemAsync('token');
            }
            finally{
                setLoading(false)
            }
        } 
        loadUser();
    },[])
    async function login(phone,password){
        try{
            const res= await api.post('/auth/login',{phone,password});
            const {user,accessToken}= res.data;
            await SecureStore.setItemAsync('token',accessToken);
            setApiTokenHeader(accessToken);
            setUser(user);
            if(user.profileUrl){
                const image= await cacheProfileImage(user.id,user.profileUrl);
                await AsyncStorage.setItem('profileUrl',image)
            }
            return user
        }
        catch(err){
            console.log(err.response?.data.error);
            throw err
        }
    }
    async function logout(){
        await SecureStore.deleteItemAsync('token');
        api.defaults.headers.common.Authorization= "";
        useChatStore.persist.clearStorage();
        await AsyncStorage.removeItem('profileUrl')
        const localPath = `${FileSystem.documentDirectory}user_${user.id}.jpeg`;
        const fileExists= await FileSystem.getInfoAsync(localPath)
        if(fileExists.exists){
            await FileSystem.deleteAsync(localPath)
        }
        useChatStore.setState({
            chats:{},
            messages:{},
            chatOrder:[],
            activeChatId:null
        })
        setUser(null);
    }
    async function signup(name,phone,password,language) {
        try{
            const res= await api.post('/auth/signup',{phone,name,password,language})
            const {user,accessToken}=res.data
            await SecureStore.setItemAsync("token",accessToken)
            setApiTokenHeader(accessToken);
            setUser(user);
        }catch(err){
            console.error(err);
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{user,loading,login,signup,logout,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}
