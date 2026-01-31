import {  Pressable, useColorScheme} from 'react-native'
import { Colors } from '../constants/Colors';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';
import { useRouter } from 'expo-router';


const FakeSearchBar = ({style}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
    const router=useRouter()
  return (
      <Pressable onPress={()=>router.push('/SearchPage')} style={[{
        width:'80%'
      },style]} >
        <ThemedView style={{
          flexDirection:'row',
          padding:8,
          borderRadius:20,
          backgroundColor:theme.searchBackground,
          alignItems:'center',
        }} >
          <EvilIcons name="search" size={24} color='black' />
          <ThemedText style={{
            marginHorizontal:8
          }}>SEARCH</ThemedText>
        </ThemedView>
      </Pressable>
  )
}

export default FakeSearchBar
