import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import backgroundImage from "../../assets/background.jpg";

import validate from "../../utility/Validation";
import { tryAuth } from "../../store/actions/index";

import Defaultinput from "../../components/UI/DefaultInput/DefaultInput";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import ButtonWithBackground from "../../components/UI/ButtonWithBackground/ButtonWithBackground";

class AuthScreen extends Component {
  state = {
    viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape",
    authMode: "login",
    controls: {
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
        },
        touched: false
      },
      password: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 6
        },
        touched: false
      },
      confirmPassword: {
        value: "",
        valid: false,
        validationRules: {
          equalTo: "password"
        },
        touched: false
      }
    }
  };

  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", this.updateStyle);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateStyle);
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        authMode: prevState.authMode === "login" ? "signup" : "login"
      };
    });
  };

  updateStyle = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ? "portrait" : "landscape"
    });
  };

  tryAuthHandler = () => {
    let authData = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value
    };
    this.props.tryAuth(authData, this.state.authMode);
  };

  updateInputState = (key, value) => {
    let connectedValue = {};
    if (this.state.controls[key].validationRules.equalTo) {
      const equalControl = this.state.controls[key].validationRules.equalTo;
      const equalValue = this.state.controls[equalControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalValue
      };
    }
    if (key === "password") {
      connectedValue = {
        ...connectedValue,
        equalTo: value
      };
    }
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          confirmPassword: {
            ...prevState.controls.confirmPassword,
            valid:
              key === "password"
                ? validate(
                    prevState.controls.confirmPassword.value,
                    prevState.controls.confirmPassword.validationRules,
                    connectedValue
                  )
                : prevState.controls.confirmPassword.valid
          },
          [key]: {
            ...prevState.controls[key],
            value: value,
            valid: validate(
              value,
              prevState.controls[key].validationRules,
              connectedValue
            ),
            touched: true
          }
        }
      };
    });
  };

  render() {
    let headingText = null;
    let confirmPassword = null;
    let submitButton = (
      <ButtonWithBackground
        onPress={this.tryAuthHandler}
        disabled={
          !this.state.controls.email.valid ||
          !this.state.controls.password.valid ||
          (!this.state.controls.confirmPassword.valid &&
            this.state.authMode === "signup")
        }
      >
        {this.state.authMode === "login" ? "LOGIN" : "SIGNUP"}
      </ButtonWithBackground>
    );
    if (this.state.viewMode === "portrait") {
      headingText = (
        <HeadingText style={styles.headingText}>
          Please {this.state.authMode === "login" ? "LOG IN" : "SIGN UP"}
        </HeadingText>
      );
    }
    if (this.state.authMode === "signup") {
      confirmPassword = (
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
            value={this.state.controls.confirmPassword.value}
            onChangeText={val => this.updateInputState("confirmPassword", val)}
            valid={this.state.controls.confirmPassword.valid}
            touched={this.state.controls.confirmPassword.touched}
            secureTextEntry
          />
        </View>
      );
    }
    if (this.props.isLoading) {
      submitButton = <ActivityIndicator size="large" />;
    }
    return (
      <ImageBackground source={backgroundImage} style={styles.imageBackground}>
        <KeyboardAvoidingView style={styles.container}>
          {headingText}
          <ButtonWithBackground onPress={this.switchAuthModeHandler}>
            Switch to {this.state.authMode === "login" ? "Sign Up" : "Login"}
          </ButtonWithBackground>
          <View style={styles.inputContainer}>
            <Defaultinput
              placeholder="Your Email Address"
              style={styles.input}
              value={this.state.controls.email.value}
              onChangeText={val => this.updateInputState("email", val)}
              valid={this.state.controls.email.valid}
              touched={this.state.controls.email.touched}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
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
                  this.state.viewMode === "portrait" ||
                  this.state.authMode === "login"
                    ? styles.portraitPasswordWrapper
                    : styles.landscapePasswordWrapper
                }
              >
                <Defaultinput
                  placeholder="Password"
                  style={styles.input}
                  value={this.state.controls.password.value}
                  onChangeText={val => this.updateInputState("password", val)}
                  valid={this.state.controls.password.valid}
                  touched={this.state.controls.password.touched}
                  secureTextEntry
                />
              </View>
              {confirmPassword}
            </View>
          </View>
          {submitButton}
        </KeyboardAvoidingView>
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

const mapStateToStore = state => {
  return {
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToStore = dispatch => {
  return {
    tryAuth: (authData, autohmode) => dispatch(tryAuth(authData, autohmode))
  };
};

export default connect(
  mapStateToStore,
  mapDispatchToStore
)(AuthScreen);
