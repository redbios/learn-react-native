import React, { Component } from "react";
import { View, StyleSheet, ImageBackground, Dimensions } from "react-native";

import startMainTabs from "../MainTabs/startMainTabs";

import backgroundImage from "../../assets/background.jpg";

import Defaultinput from "../../components/UI/DefaultInput/DefaultInput";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import ButtonWithBackground from "../../components/UI/ButtonWithBackground/ButtonWithBackground";

class AuthScreen extends Component {
  state = {
    viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape"
  };

  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", this.updateStyle);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateStyle);
  }

  updateStyle = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ? "portrait" : "landscape"
    });
  };

  loginHandler = () => {
    startMainTabs();
  };
  render() {
    let headingText = null;
    if (this.state.viewMode === "portrait") {
      headingText = (
        <HeadingText style={styles.headingText}>Please Log In</HeadingText>
      );
    }
    return (
      <ImageBackground source={backgroundImage} style={styles.imageBackground}>
        <View style={styles.container}>
          {headingText}
          <ButtonWithBackground title="Switch to Login" />
          <View style={styles.inputContainer}>
            <Defaultinput
              placeholder="Your Email Address"
              style={styles.input}
            />
            <View
              style={
                this.state.viewMode === "portrait"
                  ? styles.portraiPasswordContainer
                  : styles.landscapePasswordContainer
              }
            >
              <View
                style={
                  this.state.viewMode === "portrait"
                    ? styles.portraitPasswordWrapper
                    : styles.landscapePasswordWrapper
                }
              >
                <Defaultinput placeholder="Password" style={styles.input} />
              </View>
              <View
                style={
                  this.state.viewMode === "portrait"
                    ? styles.portraitPasswordWrapper
                    : styles.landscapePasswordWrapper
                }
              >
                <Defaultinput
                  placeholder="Confirm Password"
                  style={styles.input}
                />
              </View>
            </View>
          </View>
          <ButtonWithBackground title="Login" onPress={this.loginHandler} />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageBackground: {
    width: "100%",
    flex: 1
  },
  inputContainer: {
    width: "80%"
  },
  headingText: {
    marginBottom: 10
  },
  input: {
    borderColor: "#bbb",
    backgroundColor: "#eee"
  },
  landscapePasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  portraiPasswordContainer: {
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  landscapePasswordWrapper: {
    width: "48%"
  },
  portraitPasswordWrapper: {
    width: "100%"
  }
});

export default AuthScreen;
