import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { deletePlace } from "../../store/actions/index";

import Icon from "react-native-vector-icons/Ionicons";

class PlaceDetail extends Component {
  state = {
    viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape"
  };

  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", this.updateViewMode);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateViewMode);
  }

  updateViewMode = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ? "portrait" : "landscape"
    });
  };

  itemDeleteHandler = () => {
    this.props.onDeletePlace(this.props.placeDetail.key);
    this.props.navigator.pop();
  };

  render() {
    return (
      <ScrollView style={styles.modalContainer}>
        <View style={styles.imageWrapperLandscape}>
          <Image
            source={this.props.placeDetail.image}
            style={
              this.state.viewMode === "portrait"
                ? styles.placeImagePotrait
                : styles.placeImageLandscape
            }
            resizeMode="cover"
          />
          <Text style={styles.placeName}>{this.props.placeDetail.name}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={this.itemDeleteHandler}>
            <View style={styles.deleteButton}>
              <Icon
                size={30}
                name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
                color="red"
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 22
  },
  placeImagePotrait: {
    width: "100%",
    height: 200
  },
  placeImageLandscape: {
    width: "70%",
    height: 200
  },
  placeName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  deleteButton: {
    alignItems: "center"
  },
  imageWrapperPotrait: {
    alignItems: "flex-start"
  },
  imageWrapperLandscape: {
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
