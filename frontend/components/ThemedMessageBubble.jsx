import { Pressable, StyleSheet, Text, View } from "react-native"
import ThemedView from "./ThemedView"
import ThemedText from "./ThemedText"
import { useState } from "react"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useChatStore } from "../store/chatStore";
import mainApi from "../libs/mainApi";
import { useSocket } from "../libs/SocketContext";

const MAX_HEIGHT = 500
const collapsedHeight = 480

const ThemedMessageBubble = ({ isSent, item,onDelete}) => {

  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [selected, setSelected] = useState(false)
  const {deleteMessage}=useChatStore();

  const onTextLayout = (e) => {
    const height = e.nativeEvent.layout.height
    if (height > MAX_HEIGHT) setIsOverflowing(true)
  }

  const handleLongPress = () => {
    setSelected(true)
  }

  const handlePress = () => {
    if (selected) {
      setSelected(false)
    }
  }

  const handleDelete = async (id,sent,userId=item.senderId,senderId=null) => {
        setSelected(false)
        if(!sent){
            onDelete?.(item.id,false,userId)
        }
        else{
            const res=await mainApi.post('/user/deleteMessage',{id})
            onDelete?.(item.id,true,userId,senderId)
        }
    }

  return (

    <View
      style={[
        styles.row,
        isSent ? styles.rowRight : styles.rowLeft
      ]}
    >

      {/* DELETE RIGHT (sent message) */}
      {selected && isSent && (
        <Pressable onPress={()=>handleDelete(item.id,true,item.receiverId,item.senderId)} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={30} color="black" />
        </Pressable>
      )}

      {/* MESSAGE */}
      <Pressable
        onLongPress={handleLongPress}
        onPress={handlePress}
        delayLongPress={300}
        style={[
          isSent ? styles.messageBubbleRight : styles.messageBubbleLeft,
          selected && styles.selected
        ]}
      >

        <ThemedView
          style={[
            !expanded && isOverflowing && styles.collapsed, selected && styles.selected
          ]}
          onLayout={onTextLayout}
        >
          <ThemedText style={styles.text}>{item.text}</ThemedText>
        </ThemedView>

        {isOverflowing && (
          <Pressable onPress={() => setExpanded(prev => !prev)}>
            <Text style={styles.readMore}>
              {expanded ? "Show Less" : "Read More"}
            </Text>
          </Pressable>
        )}

      </Pressable>

      {/* DELETE LEFT (received message) */}
      {selected && !isSent && (
        <Pressable onPress={()=>handleDelete(item.id,false)} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={30} color="black" />
        </Pressable>
      )}

    </View>
  )
}

export default ThemedMessageBubble

const styles = StyleSheet.create({

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },

  rowLeft: {
    justifyContent: "flex-start"
  },

  rowRight: {
    justifyContent: "flex-end"
  },

  messageBubbleLeft: {
    padding: 10,
    backgroundColor: "#d8c3a2",
    borderRadius: 8,
    maxWidth: "75%",
    minWidth: "25%"
  },

  messageBubbleRight: {
    padding: 10,
    backgroundColor: "#d8c3a2",
    borderRadius: 8,
    maxWidth: "75%",
    minWidth: "25%"
  },

  collapsed: {
    maxHeight: collapsedHeight,
    overflow: "hidden"
  },

  selected: {
    backgroundColor:'grey'
  },

  deleteButton: {
    marginHorizontal: 8
  },

  deleteText: {
    fontSize: 20
  },

  readMore: {
    marginTop: 5,
    color: "#007AFF"
  },
  text:{
    fontFamily:'serif',
    backgroundColor:'#d8c3a2'
  }
})