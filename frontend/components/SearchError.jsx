import { Text, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';

const SearchError = ({style,error}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
  return (
    <View style={[{
        backgroundColor:theme.backgroundColor,
        justifyContent:'center',
        alignItems:'center'
    },style]}>
        <Text style={{
            color:'grey',
            fontSize:18,
            fontFamily:'serif',
            marginTop:10
        }}>
            {error}
        </Text>
    </View>
  )
}

export default SearchError
