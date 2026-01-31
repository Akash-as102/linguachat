import { TextInput, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';

const ThemedInput = ({style,...props}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
    return (
        <TextInput style={[{backgroundColor: theme.backgroundColor,
            borderColor:theme.borderColor,
            color:theme.text,
            borderRadius:10,
            padding:15,
        },style]}
        {...props}/>
  )
}

export default ThemedInput

