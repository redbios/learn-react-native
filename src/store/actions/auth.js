import { AsyncStorage } from "react-native";

import { SET_AUTH_TOKEN, AUTH_REMOVE_TOKEN } from "./actionTypes";
import { uiStartLoading, uiStopLoading } from "./index";

import App from "../../../App";

import startMainTabs from "../../screens/MainTabs/startMainTabs";

const API_KEY = "AIzaSyD0N2zGkn7PXEISFibDwJxhzv4tfDWllNQ";

export const tryAuth = (authData, authmode) => {
  return dispatch => {
    dispatch(uiStartLoading());
    let typeUrl = "signupNewUser";
    if (authmode === "login") {
      typeUrl = "verifyPassword";
    }
    let url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/" +
      typeUrl +
      "?key=" +
      API_KEY;
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return new Error();
        }
      })
      .then(parsedRes => {
        dispatch(uiStopLoading());
        if (parsedRes.error || !parsedRes.idToken) {
          alert("gagal login, coba lagi ya");
        } else {
          dispatch(
            authStoreToken(
              parsedRes.idToken,
              parsedRes.expiresIn,
              parsedRes.refreshToken
            )
          );
          startMainTabs();
        }
        console.log(parsedRes);
      })
      .catch(err => {
        console.log(err);
        alert("Login gagal, coba lagi");
        dispatch(uiStopLoading());
      });
  };
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(sethAuthToken(token, expiryDate));
    AsyncStorage.setItem("ap:auth:token", token);
    AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
    AsyncStorage.setItem("ap:auth:refreshToken", refreshToken);
  };
};

export const sethAuthToken = (token, expiryDate) => {
  return {
    type: SET_AUTH_TOKEN,
    token: token,
    expiryDate: expiryDate
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const expiryDate = getState().auth.expiryDate;
      if (!token || new Date(expiryDate) <= new Date()) {
        let fethedToken;
        AsyncStorage.getItem("ap:auth:token")
          .catch(err => reject())
          .then(tokenFromStorage => {
            if (!tokenFromStorage) {
              reject();
              return;
            }
            fethedToken = tokenFromStorage;
            return AsyncStorage.getItem("ap:auth:expiryDate");
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date();
            if (parsedExpiryDate > now) {
              dispatch(sethAuthToken(fethedToken));
              resolve(fethedToken);
            } else {
              reject();
            }
          })
          .catch(err => reject());
      } else {
        resolve(token);
      }
    });
    return promise
      .catch(err => {
        return AsyncStorage.getItem("ap:auth:refreshToken")
          .then(refreshToken => {
            return fetch(
              "https://securetoken.googleapis.com/v1/token?key=" + API_KEY,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "grant_type=refresh_token&refresh_token=" + refreshToken
              }
            );
          })
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              return new Error();
            }
          })
          .then(parsedRes => {
            if (parsedRes.id_token) {
              dispatch(
                authStoreToken(
                  parsedRes.id_token,
                  parsedRes.expires_in,
                  parsedRes.refresh_token
                )
              );
              return parsedRes.id_token;
            } else {
              dispatch(authClearStorage());
            }
          });
      })
      .then(token => {
        if (!token) {
          throw new Error();
        } else {
          return token;
        }
      });
  };
};

export const authAutoSignIn = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(token => {
        startMainTabs();
      })
      .catch(err => console.log("Failed to fetch token!"));
  };
};

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem("ap:auth:token");
    AsyncStorage.removeItem("ap:auth:expiryDate");
    return AsyncStorage.removeItem("ap:auth:refreshToken");
  };
};

export const authLogout = () => {
  return dispatch => {
    dispatch(authClearStorage()).then(() => {
      App();
    });
    dispatch(authRemoveToken());
  };
};

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
