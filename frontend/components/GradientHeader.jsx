import { StyleSheet, Text, useColorScheme, View} from 'react-native';
import { Colors } from '../constants/Colors';
import FakeSearchBar from './FakeSearchBar';
import Spacer from './Spacer';
import SettingButton from './SettingButton';
import ProfilePic from './ProfilePic';
import { useChatStore } from '../store/chatStore';
import ThemedText from './ThemedText';

export default function GradientHeader({style,search,children,setting,name,chatUserId}) {
    const colorScheme=useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light
    const {profileUrl}=useChatStore()
  return (
    <View
        style={[styles.container,style]}
        
    >
      <Spacer height={30}/>
      {children}
      {name && 
        <View style={styles.header}>
          <ProfilePic url={profileUrl[chatUserId]}/>
          <Text style={styles.headerText}>{name}</Text>
        </View>
      }
      <Spacer height={15}/>
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
    </View>
  );
}
const styles=StyleSheet.create({
    container:{
        height:170,
        justifyContent:'center',
        backgroundColor:'white',
        // marginBottom:10,
        elevation:5
    },
    header:{
      justifyContent: "center",
      paddingHorizontal: 15,
      flexDirection:'row',
      alignItems:"center",
      justifyContent:'flex-start',
      marginTop:20
    },
    headerText:{
      fontSize: 18,
      fontWeight: "bold",
      color:'black',
      fontFamily:'serif',
      fontSize:20,
      marginLeft:7
    }
})

