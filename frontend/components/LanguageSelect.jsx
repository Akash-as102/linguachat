import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { languages } from "../constants/languages";

export default function LanguageSelect({ value, onChange }) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)}
      >
        {languages.map((lang) => (
          <Picker.Item
            key={lang.code}
            label={lang.label}
            value={lang.code}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth:1,
    borderRadius: 10,
    overflow: "hidden",
    width:'90%',
    backgroundColor:'white'
  },
});