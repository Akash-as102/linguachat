import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors';
import ThemedView from './ThemedView';
import { useState } from 'react';
import ThemedText from './ThemedText';
const MAX_HEIGHT=500
const collapsedHeight=480
const ThemedMessageBubble = ({style,isSent,item}) => {
    const colorScheme= useColorScheme()
    const theme= Colors[colorScheme] ?? Colors.light;
    const [expanded,setExpanded]=useState(false)
    const [isOverflowing,setIsOverflowing]=useState(false)
    const onTextLayout=(e)=>{
        const height=e.nativeEvent.layout.height
        if(height>MAX_HEIGHT)setIsOverflowing(true)
    }

    return (
        <ThemedView style={[isSent?styles.messageBubbleRight:styles.messageBubbleLeft]}
            onLayout={onTextLayout}
        >
            <ThemedView style={[styles.text,!expanded && isOverflowing && styles.collapsed]}>
                <ThemedText>{item.text}</ThemedText>
            </ThemedView>
            {isOverflowing && (
                <Pressable onPress={()=>setExpanded(prev=>!prev)} >
                    <Text>{expanded?"show less":"Read More"}</Text>
                </Pressable>
            )}
        </ThemedView>
  )
}

export default ThemedMessageBubble

const styles=StyleSheet.create({
    messageBubbleLeft: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: 'flex-start', 
    maxWidth:"75%",
    minWidth:"25%"
  },
  messageBubbleRight:{
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: 'flex-end',
    maxWidth:"75%",
    minWidth:"25%"
  },
  collapsed:{
    maxHeight:collapsedHeight,
    overflow:"hidden"
  },
})
