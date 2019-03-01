import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableNativeFeedback,
  Platform
} from "react-native";
import { connect } from "react-redux";

import { authLogout } from "../../store/actions/index";

import Icon from "react-native-vector-icons/Ionicons";

class SideDrawer extends Component {
  render() {
    return (
      <View
        style={[
          style.container,
          { width: Dimensions.get("window").width * 0.8 }
        ]}
      >
        <TouchableNativeFeedback onPress={this.props.onLogout}>
          <View style={style.drawerItem}>
            <Icon
              name={Platform.OS === "android" ? "md-log-out" : "ios-log-out"}
              size={30}
              color="#686868"
              style={style.drawerItemIcon}
            />
            <Text>Sign Out</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: "white",
    flex: 1
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#eee"
  },
  drawerItemIcon: {
    marginRight: 10
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogout())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SideDrawer);
