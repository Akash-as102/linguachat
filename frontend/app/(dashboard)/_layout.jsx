import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import RouteGuard from '../../libs/RouteGuard';
import GradientHeader from '../../components/GradientHeader';
import ThemedText from '../../components/ThemedText';
import SettingButton from '../../components/SettingButton';
import { SocketProvider } from '../../libs/SocketContext';

const DashboardLayout = () => {
  return (
    <RouteGuard >
        <SocketProvider>
          <StatusBar value='auto'/>
          <Stack >
            <Stack.Screen name='Home' options={{
              header:()=><GradientHeader search={true} setting={true}>
                <ThemedText style={styles.headerText}>Chats</ThemedText>
              </GradientHeader>
            }} />
            <Stack.Screen name='Settings' options={{
              header:()=><GradientHeader style={styles.settingHeader}>
                <ThemedText style={[styles.headerText,{marginTop:40}]}>Settings</ThemedText>
              </GradientHeader>
            }} />
            <Stack.Screen name='Accounts' options={{
              header:()=><GradientHeader style={styles.settingHeader}>
                <ThemedText style={[styles.headerText,{marginTop:40}]}>Accounts</ThemedText>
              </GradientHeader>
            }} />
            <Stack.Screen name='ChangeName' options={{title:'Reset Name'}} />
            <Stack.Screen name='ChangePassword' options={{title:'Reset Password'}} />
            <Stack.Screen name='ChatPage' options={{headerShown:false}} />
            <Stack.Screen name='SearchPage' options={{headerShown:false}} />
          </Stack>
        </SocketProvider>
    </RouteGuard>
  )
}

export default DashboardLayout

const styles = StyleSheet.create({
  headerText:{
    fontSize:30,
    fontWeight:'bold',
    marginLeft:30,
    fontFamily:'serif'
  },
  settingHeader:{
    height:130,
  }
})