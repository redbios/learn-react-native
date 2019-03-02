import React, { Component } from "react";
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import PlaceInput from "../../components/PlaceInput/PlaceInput";
import MainText from "../../components/UI/MainText/MainText";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import PickImage from "../../components/PickImage/PickImage";
import PickLocation from "../../components/PickLocation/PickLocation";

import { addPlace, startAddPlace } from "../../store/actions/index";

class SharePlace extends Component {
  static navigatorStyle = {
    navBarButtonColor: "orange"
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentWillMount() {
    this.reset();
  }

  componentDidUpdate() {
    if (this.props.placeAdded) {
      this.props.navigator.switchToTab({ tabIndex: 0 });
    }
  }

  reset = () => {
    this.setState({
      placeName: {
        value: "",
        valid: false,
        validationRules: {
          isFilled: true
        }
      },
      location: {
        value: null,
        valid: false
      },
      image: {
        value: null,
        valid: false
      }
    });
  };

  onNavigatorEvent = event => {
    //saat tab akan tampil
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
        if (this.props.placeAdded) {
          this.props.onStartAddPlace();
        }
      }
    }

    //saat ganti tab
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

  pickLocationHandler = location => {
    this.setState({
      location: {
        value: location,
        valid: true
      }
    });
  };

  imagePickedHandler = image => {
    this.setState({
      image: {
        value: image,
        valid: true
      }
    });
  };

  placeAddedHandler = () => {
    this.props.onAddPlace(
      this.state.placeName.value,
      this.state.location.value,
      this.state.image.value
    );
    this.reset();
    this.imagePicker.reset();
    this.locationPicker.reset();
  };

  render() {
    let submitButton = (
      <Button
        title="Share the Place"
        onPress={this.placeAddedHandler}
        disabled={!this.state.placeName.valid || !this.state.location.valid}
      />
    );

    if (this.props.isLoading) {
      submitButton = <ActivityIndicator size="large" />;
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share The Place !</HeadingText>
          </MainText>
          <PickImage
            onImagePicked={this.imagePickedHandler}
            ref={ref => (this.imagePicker = ref)}
          />
          <PickLocation
            onPickLocation={this.pickLocationHandler}
            ref={ref => (this.locationPicker = ref)}
          />
          <PlaceInput
            placeName={this.state.placeName.value}
            onChangeText={this.placeNameChangeHandler}
          />
          <View style={styles.button}>{submitButton}</View>
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

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    placeAdded: state.places.placeAdded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: (placeName, location, image) =>
      dispatch(addPlace(placeName, location, image)),
    onStartAddPlace: () => dispatch(startAddPlace())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SharePlace);
