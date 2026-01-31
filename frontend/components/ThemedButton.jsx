import { Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';

const ThemedButton = ({style,...props}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
  return (
    <Pressable style={({pressed})=>[{
        width:"60%",
        height:35,
        backgroundColor:theme.button,
        borderRadius: 20,
        justifyContent:"center",
        alignItems:'center',
    },pressed && styles.pressed,style]} {...props}/>
  )
}

export default ThemedButton

const styles=StyleSheet.create({
    btn:{
        width:"80%",
        height:30
    },
    pressed:{
        opacity:0.8
    }
})
