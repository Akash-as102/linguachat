import { StyleSheet, Text, View } from 'react-native'
import ThemedView from '../../components/ThemedView'
import SettingsComponent from '../../components/SettingsComponents'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import { useAuth } from '../../libs/auth-context'
import { Link } from 'expo-router';

const Settings = () => {
  const {user,logout}=useAuth();
    const handleLogout=()=>{
      logout();
    }
  return (
    <ThemedView style={{flex:1}}>
      <Link href="/Accounts">
        <ThemedView style={styles.container}>
          <ThemedText style={styles.heading}>Account</ThemedText>
          <ThemedText style={styles.description}>Edit Phone Number, Profile Pic</ThemedText>
        </ThemedView>
      </Link>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.heading}>Privacy</ThemedText>
        <ThemedText style={styles.description}>Block Contacts</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.heading}>Notifications</ThemedText>
        <ThemedText style={styles.description}>Message,group</ThemedText>
      </ThemedView>
      <Link href="/ChangeLanguage">
        <ThemedView style={styles.container}>
          <ThemedText style={styles.heading}>Language</ThemedText>
          <ThemedText style={styles.description}>Preferred Language</ThemedText>
        </ThemedView>
      </Link>
      <ThemedButton onPress={handleLogout} style={styles.logout}>
        <Text style={{
          fontSize:15,
          fontWeight:'bold',
          fontFamily:"serif"
        }}>Log Out</Text>
      </ThemedButton>
    </ThemedView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container:{
    padding:17,

  },
  heading:{
    marginBottom:5,
    fontSize:20,
    fontFamily:'serif'
  },
  description:{
    color:'grey'
  },
  logout:{
    width:100,
    alignSelf:'center'
  }
})