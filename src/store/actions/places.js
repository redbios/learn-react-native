import { SET_PLACES, REMOVE_PLACE } from "./actionTypes";
import { uiStartLoading, uiStopLoading } from "./index";

export const addPlace = (placeName, location, image) => {
  return dispatch => {
    dispatch(uiStartLoading());
    fetch(
      "https://us-central1-awesome-places-1550104733636.cloudfunctions.net/storeImage",
      {
        method: "POST",
        body: JSON.stringify({
          image: image.base64
        })
      }
    )
      .catch(err => {
        console.log(err);
        alert("Something went wrong!! Please Try again");
        dispatch(uiStopLoading());
      })
      .then(res => res.json())
      .then(parsedRes => {
        const placeData = {
          name: placeName,
          location: location,
          image: parsedRes.imageUrl
        };
        return fetch(
          "https://awesome-places-1550104733636.firebaseio.com/places.json",
          {
            method: "POST",
            body: JSON.stringify(placeData)
          }
        );
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong!! Please Try again");
        dispatch(uiStopLoading());
      })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        dispatch(uiStopLoading());
      });
  };
};

export const getPlaces = () => {
  return dispatch => {
    return fetch(
      "https://awesome-places-1550104733636.firebaseio.com/places.json"
    )
      .catch(err => {
        alert("get data failed, try again");
        console.log(err);
      })
      .then(res => res.json())
      .then(parsedData => {
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
    dispatch(removePlace(key));
    fetch(
      "https://awesome-places-1550104733636.firebaseio.com/places/" +
        key +
        ".json",
      {
        method: "DELETE"
      }
    )
      .catch(err => {
        console.log(err);
        alert("Something went wrong!! Please Try again");
      })
      .then(res => res.json())
      .then(parsedRes => {
        console.log("Done");
      });
  };
};

export const removePlace = key => {
  return {
    type: REMOVE_PLACE,
    key: key
  };
};
