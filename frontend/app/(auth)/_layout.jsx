import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import GuestOnly from '../../libs/GuestOnly'

const AuthLayout = () => {
  return (
    <GuestOnly>
      <StatusBar value='auto' />
      <Stack screenOptions={{animation:'none'}}>
          <Stack.Screen name='Login' options={{headerShown:false}} />
          <Stack.Screen name="Signup" options={{headerShown:false}} />
      </Stack>
    </GuestOnly>
  )
}

export default AuthLayout

