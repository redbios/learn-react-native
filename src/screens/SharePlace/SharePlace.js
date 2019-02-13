import React, { Component } from "react";
import { View, Button, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";

import PlaceInput from "../../components/PlaceInput/PlaceInput";
import MainText from "../../components/UI/MainText/MainText";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import PickImage from "../../components/PickImage/PickImage";
import PickLocation from "../../components/PickLocation/PickLocation";

import { addPlace } from "../../store/actions/index";

class SharePlace extends Component {
  static navigatorStyle = {
    navBarButtonColor: "orange"
  };

  state = {
    placeName: {
      value: "",
      valid: false,
      validationRules: {
        isFilled: true
      }
    }
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "sideDrawerToggle") {
        this.props.navigator.toggleDrawer({
          side: "left"
        });
      }
    }
  };

  placeNameChangeHandler = val => {
    this.setState(prevState => {
      return {
        placeName: {
          value: val,
          valid: this.validationHandler(
            val,
            prevState.placeName.validationRules
          ),
          validationRules: prevState.placeName.validationRules
        }
      };
    });
  };

  validationHandler = (val, rules) => {
    let isValid = true;
    for (const rul in rules) {
      switch (rul) {
        case "isFilled":
          isValid = isValid && val !== "";
          break;
        default:
          isValid = true;
          break;
      }
    }
    return isValid;
  };

  placeAddedHandler = () => {
    if (this.state.placeName.value.trim() !== "") {
      this.props.onAddPlace(this.state.placeName.value);
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share The Place !</HeadingText>
          </MainText>
          <PickImage />
          <PickLocation />
          <PlaceInput
            placeName={this.state.placeName.value}
            onChangeText={this.placeNameChangeHandler}
          />
          <View style={styles.button}>
            <Button
              title="Share the Place"
              onPress={this.placeAddedHandler}
              disabled={!this.state.placeName.valid}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 5
  },
  button: {
    margin: 7
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: placeName => dispatch(addPlace(placeName))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SharePlace);
