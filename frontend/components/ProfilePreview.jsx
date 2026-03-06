import { Image, StyleSheet, Text, View } from 'react-native'
import defaultProfile from '../assets/defaultProfile.jpg'

const ProfilePreview = ({url,style,...props}) => {
    return (
    <Image source={url? {uri:url} : defaultProfile} style={[
        styles.previewImage
    ,style]} {...props} />
  )
}

export default ProfilePreview

const styles = StyleSheet.create({
    previewImage: {
        width: 260,
        height: 260,
        borderRadius: 130,
    },
})