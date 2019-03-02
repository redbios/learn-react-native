import React, { Component } from "react";
import {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet,
  Animated
} from "react-native";
import { connect } from "react-redux";

import Placelist from "../../components/PlaceList/PlaceList";
import { getPlaces } from "../../store/actions/index";

class FindPlace extends Component {
  static navigatorStyle = {
    navBarButtonColor: "orange"
  };

  state = {
    placesLoaded: false,
    removeAnim: new Animated.Value(1),
    fadeAnim: new Animated.Value(0)
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
        this.props.onLoadPlaces();
      }
    }

    if (event.type === "NavBarButtonPress") {
      if (event.id === "sideDrawerToggle") {
        this.props.navigator.toggleDrawer({
          side: "left"
        });
      }
    }
  };

  placeLoadedHandler = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  placesSearchHandler = () => {
    Animated.timing(this.state.removeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        placesLoaded: true
      });

      this.placeLoadedHandler;
    });
  };

  itemSelectHandler = key => {
    const selPlace = this.props.places.find(place => {
      return place.key === key;
    });

    this.props.navigator.push({
      screen: "awesome-place.PlaceDetailScreen",
      title: selPlace.name,
      passProps: {
        placeDetail: selPlace
      }
    });
  };

  render() {
    let animStyle = {
      opacity: this.state.removeAnim,
      transform: [
        {
          scale: this.state.removeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [12, 1]
          })
        }
      ]
    };

    let content = (
      <Animated.View style={animStyle}>
        <TouchableNativeFeedback onPress={this.placesSearchHandler}>
          <View style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Find Places</Text>
          </View>
        </TouchableNativeFeedback>
      </Animated.View>
    );
    if (this.state.placesLoaded) {
      content = (
        <Placelist
          places={this.props.places}
          onItemSelected={this.itemSelectHandler}
        />
      );
    }
    return (
      <View style={this.state.placesLoaded ? null : styles.buttonContainer}>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  searchButton: {
    borderColor: "orange",
    borderWidth: 3,
    borderRadius: 50,
    padding: 20
  },
  searchButtonText: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 26
  }
});

const mapStateToProps = state => {
  return {
    places: state.places.places
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadPlaces: () => dispatch(getPlaces())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FindPlace);
