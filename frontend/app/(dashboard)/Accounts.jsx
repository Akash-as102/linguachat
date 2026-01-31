import { Link, useRouter } from "expo-router";
import ThemedView from "../../components/ThemedView"
import { Image, Pressable, StyleSheet } from 'react-native';
import ProfilePic from '../../components/ProfilePic';
import ThemedText from "../../components/ThemedText";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";

const Accounts = () => {
    const router=useRouter();
    function handleName(){
        router.push('/ChangeName')
    }
    function handlePassword(){
        router.push('/ChangePassword')
    }
    return (
        <ThemedView style={styles.container}>
                <Spacer />
                <ProfilePic style={{
                    width:200,
                    height:200,
                    borderRadius:100
                }}/>
                <Spacer height={15}/>
                <ThemedText style={{color:'blue'}}>Edit</ThemedText>
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