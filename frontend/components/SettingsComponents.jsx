import { Text, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';

const SettingsComponent = ({style,name,url,newMessage=true}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
    return (
        <View style={[{backgroundColor: theme.backgroundColor,
            borderBottomColor:'grey',
            height:60,
            flexDirection:'row',
            marginHorizontal:15
        },style]}
        >
            <Text>Account</Text>
        </View>
  )
}

export default SettingsComponent