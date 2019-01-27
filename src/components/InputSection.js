import React from "react";
import { View, Button, TextInput, StyleSheet } from "react-native";

export default class InputSection extends React.Component {
  state = {
    placeName: ""
  };

  placeNameChangeHandler = val => {
    this.setState({
      placeName: val
    });
  };

  submitHandler = () => {
    this.props.submitvalue(this.state.placeName);
  };

  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.placeInput}
          placeholder="type the awesome text"
          value={this.state.placeName}
          onChangeText={this.placeNameChangeHandler}
        />
        <Button
          title="Add"
          style={styles.placeButton}
          onPress={this.submitHandler}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  placeInput: {
    width: "70%"
  },
  placeButton: {
    width: "30%"
  }
});
