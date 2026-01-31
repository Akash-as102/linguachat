import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Fontisto from '@expo/vector-icons/Fontisto';
import { Link, useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';


const SettingButton = ({style,...props}) => {
    const colorScheme= useColorScheme()
      const theme= Colors[colorScheme] ?? Colors.light;
      const router=useRouter();
    return (
        <Pressable onPress={()=> router.push('/Settings')}>
            <Fontisto name="player-settings" size={24} color={theme.text} />
        </Pressable>
  )
}

export default SettingButton

const styles = StyleSheet.create({})