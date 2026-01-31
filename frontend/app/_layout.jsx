import {Stack }from "expo-router"
import { AuthProvider, useAuth } from '../libs/auth-context'
import ThemedLoading from '../components/ThemedLoading'

const RootNavigator = () => {
  const {user,loading} = useAuth()
  if(loading) return <ThemedLoading />
  return (
      <Stack>
        <Stack.Screen name="(dashboard)" options={{headerShown:false}}/>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
      </Stack>
  )
}

export default function RootComponent(){
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}

