import {
  SET_PLACES,
  REMOVE_PLACE,
  PLACE_ADDED,
  START_ADD_PLACE
} from "./actionTypes";
import { uiStartLoading, uiStopLoading, authGetToken } from "./index";

export const startAddPlace = () => {
  return {
    type: START_ADD_PLACE
  };
};

export const placeAdded = () => {
  return {
    type: PLACE_ADDED
  };
};

export const addPlace = (placeName, location, image) => {
  return dispatch => {
    let authToken;
    dispatch(uiStartLoading());
    dispatch(authGetToken())
      .then(token => {
        authToken = token;
        return fetch(
          "https://us-central1-awesome-places-1550104733636.cloudfunctions.net/storeImage",
          {
            method: "POST",
            body: JSON.stringify({
              image: image.base64
            }),
            headers: {
              Authorization: "Bearer " + authToken
            }
          }
        );
      })
      .catch(() => {
        alert("No valid token found!");
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong!! Please Try again");
        dispatch(uiStopLoading());
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return new Error();
        }
      })
      .then(parsedRes => {
        const placeData = {
          name: placeName,
          location: location,
          image: parsedRes.imageUrl,
          imagePath: parsedRes.imagePath
        };
        return fetch(
          "https://awesome-places-1550104733636.firebaseio.com/places.json?auth=" +
            authToken,
          {
            method: "POST",
            body: JSON.stringify(placeData)
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
        console.log(parsedRes);
        dispatch(uiStopLoading());
        dispatch(placeAdded());
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong!! Please Try again");
        dispatch(uiStopLoading());
      });
  };
};

export const getPlaces = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(token => {
        return fetch(
          "https://awesome-places-1550104733636.firebaseio.com/places.json?auth=" +
            token
        );
      })
      .catch(() => {
        alert("No valid token found!");
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return new Error();
        }
      })
      .then(parsedData => {
        if (parsedData.error) {
          alert(parsedData.error);
        } else {
          const places = [];
          for (let key in parsedData) {
            places.push({
              ...parsedData[key],
              image: {
                uri: parsedData[key].image
              },
              key: key
            });
          }
          dispatch(setPlaces(places));
        }
      })
      .catch(err => {
        alert("get data failed, try again");
        console.log(err);
      });
  };
};

export const setPlaces = places => {
  return {
    type: SET_PLACES,
    places: places
  };
};

export const deletePlace = key => {
  return dispatch => {
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
      })
      .then(token => {
        dispatch(removePlace(key));
        return fetch(
          "https://awesome-places-1550104733636.firebaseio.com/places/" +
            key +
            ".json?auth=" +
            token,
          {
            method: "DELETE"
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
        console.log("Done");
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong!! Please Try again");
      });
  };
};

export const removePlace = key => {
  return {
    type: REMOVE_PLACE,
    key: key
  };
};
