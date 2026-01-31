import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import defaultProfile from '../assets/defaultProfile.jpg'

const ProfilePic = ({url,style,...props}) => {
  return (
    <Image source={url? {uri:url} : defaultProfile} style={[{
        width:50,
        height:50,
        borderRadius:25
    },style]} {...props} />
  )
}

export default ProfilePic

const styles = StyleSheet.create({})