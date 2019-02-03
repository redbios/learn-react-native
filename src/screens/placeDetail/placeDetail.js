import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { deletePlace } from "../../store/actions/index";

import Icon from "react-native-vector-icons/Ionicons";

class PlaceDetail extends Component {
  itemDeleteHandler = () => {
    this.props.onDeletePlace(this.props.placeDetail.key);
    this.props.navigator.pop();
  };

  render() {
    return (
      <View style={styles.modalContainer}>
        <View>
          <Image
            source={this.props.placeDetail.image}
            style={styles.placeImage}
          />
          <Text style={styles.placeName}>{this.props.placeDetail.name}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={this.itemDeleteHandler}>
            <View style={styles.deleteButton}>
              <Icon size={30} name="ios-trash" color="red" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 22
  },
  placeImage: {
    width: "100%",
    height: 200
  },
  placeName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  deleteButton: {
    alignItems: "center"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: key => dispatch(deletePlace(key))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PlaceDetail);
