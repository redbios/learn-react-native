import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";

class PickLocation extends Component {
  state = {
    focusedLocation: {
      latitude: -7.220297,
      longitude: 112.750788,
      latitudeDelta: 0.0122,
      longitudeDelta:
        (Dimensions.get("window").width / Dimensions.get("window").height) *
        0.0122
    },
    locationChosen: false
  };

  pickLocationHandler = event => {
    const coord = event.nativeEvent.coordinate;
    this.map.animateToRegion({
      ...this.state.focusedLocation,
      latitude: coord.latitude,
      longitude: coord.longitude
    });
    this.setState(prevState => {
      return {
        focusedLocation: {
          ...prevState.focusedLocation,
          latitude: coord.latitude,
          longitude: coord.longitude
        },
        locationChosen: true
      };
    });
    this.props.onPickLocation({
      latitude: coord.latitude,
      longitude: coord.longitude
    });
  };

  getLocationHadler = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const conrdEvent = {
          nativeEvent: {
            coordinate: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          }
        };
        this.pickLocationHandler(conrdEvent);
      },
      error => {
        console.log(error);
        alert("Fetching the position failed, please pick manually !");
      }
    );
  };

  render() {
    let marker = null;

    if (this.state.locationChosen) {
      marker = <MapView.Marker coordinate={this.state.focusedLocation} />;
    }
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={this.state.focusedLocation}
          style={styles.map}
          onPress={this.pickLocationHandler}
          ref={ref => (this.map = ref)}
        >
          {marker}
        </MapView>
        <View style={styles.button}>
          <Button title="Locate Me" onPress={this.getLocationHadler} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center"
  },
  map: {
    width: "100%",
    height: 250
  },
  button: {
    margin: 7
  }
});

export default PickLocation;
