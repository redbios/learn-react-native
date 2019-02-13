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
    <View style={[styles.button, props.disabled ? styles.disabled : null]}>
      <Text style={[styles.text, props.disabled ? styles.disabledText : null]}>
        {props.children}
      </Text>
    </View>
  );
  if (props.disabled) {
    return content;
  }
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
  },
  disabled: {
    backgroundColor: "#eee",
    borderColor: "#aaa"
  },
  disabledText: {
    color: "#aaa"
  }
});

export default buttonWithBackgroud;
