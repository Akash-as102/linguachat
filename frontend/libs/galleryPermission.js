import * as ImagePicker from 'expo-image-picker';

const requestPermission=async ()=>{
    const {status}= await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status !== "granted"){
        alert("Permission required to access photos")
        return false
    }
    return true
}
export default requestPermission;