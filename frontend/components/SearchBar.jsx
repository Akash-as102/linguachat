import {  useColorScheme} from 'react-native'
import { Colors } from '../constants/Colors';
import ThemedInput from './ThemedInput';

const SearchBar = ({style,...props}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
  return (
    <ThemedInput style={[{
        width:'85%',
        height:20,
        alignSelf:'center',
        marginTop:20,
        borderRadius:20,
        text: theme.searchText
    },style]} {...props}/>
  )
}

export default SearchBar
