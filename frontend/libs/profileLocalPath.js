import * as FileSystem from "expo-file-system/legacy";
import mainApi from './mainApi';


const cacheProfileImage = async (userId,imageUrl) => {
  const localPath = `${FileSystem.documentDirectory}user_${userId}.jpeg`;
  if(!imageUrl){
    const url=await mainApi.get(`/user/profilePic/${userId}`)
    if(url.profileUrl){
      await FileSystem.downloadAsync(`${process.env.EXPO_PUBLIC_API}${url.profileUrl}`,localPath)
      return `${localPath}?t=${Date.now()}`; 
    }
    else{
      return null;
    }
  }
  await FileSystem.downloadAsync(`${process.env.EXPO_PUBLIC_API}${imageUrl}`,localPath)
  return `${localPath}?t=${Date.now()}`; 
};
export default cacheProfileImage
