import React from "react";
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform
} from "react-native";

const buttonWithBackgroud = props => {
  const content = (
    <View style={styles.button}>
      <Text style={styles.text}>{props.title}</Text>
    </View>
  );
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback onPress={props.onPress}>
        {content}
      </TouchableNativeFeedback>
    );
  }
  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  button: {
    padding: 11,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#4798e0"
  },
  text: {
    color: "white",
    fontWeight: "bold"
  }
});

export default buttonWithBackgroud;
