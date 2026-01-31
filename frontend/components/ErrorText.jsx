import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';

const ErrorText = ({style,...props}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
    return (
    <Text style={[{
        opacity:0.8,
        color:'red'
    },style]}
        {...props}
    />
    )
}

export default ErrorText

