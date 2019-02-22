import { TRY_AUTH } from "./actionTypes";
import { uiStartLoading, uiStopLoading } from "./index";

import startMainTabs from "../../screens/MainTabs/startMainTabs";

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
      "?key=AIzaSyD0N2zGkn7PXEISFibDwJxhzv4tfDWllNQ";
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
      .then(res => res.json())
      .then(parsedRes => {
        dispatch(uiStopLoading());
        if (parsedRes.error) {
          alert("gagal login, coba lagi ya");
        } else {
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

export const authSignup = authData => {
  return dispatch => {};
};
