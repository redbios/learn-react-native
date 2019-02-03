import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";

import Placelist from "../../components/PlaceList/PlaceList";

class FindPlace extends Component {
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
    return (
      <View>
        <Placelist
          places={this.props.places}
          onItemSelected={this.itemSelectHandler}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    places: state.places.places
  };
};

export default connect(mapStateToProps)(FindPlace);
