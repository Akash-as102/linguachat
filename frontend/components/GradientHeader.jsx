import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useColorScheme, View} from 'react-native';
import { Colors } from '../constants/Colors';
import SearchBar from './SearchBar';
import { useState } from 'react';
import FakeSearchBar from './FakeSearchBar';
import Spacer from './Spacer';
import SettingButton from './SettingButton';

export default function GradientHeader({style,search,children,setting}) {
    const colorScheme=useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light
  const [value,setValue]=useState()
  return (
    <LinearGradient
        colors={['#17153B', '#03346E',theme.backgroundColor]}
        locations={[0.1,0.25,1]}
        style={[styles.container,style]}
        
    >
      {children}
      <Spacer height={9}/>
      {search && (<View style={{
        flexDirection:'row',

        justifyContent:'space-around',
        alignItems:'center'
      }}>
        <FakeSearchBar style={{
          opacity:0.7,
        }}
        />
        <SettingButton />
      </View>
    )
      }
    </LinearGradient>
  );
}
const styles=StyleSheet.create({
    container:{
        height:170,
        justifyContent:'center',
    }
})
