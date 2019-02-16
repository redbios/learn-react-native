import { ADD_PLACE, DELETE_PLACE } from "../actions/actionTypes";

const initialState = {
  places: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLACE:
      return {
        ...state,
        places: state.places.concat({
          key: Math.random(),
          name: action.placeName,
          image: {
            uri:
              "https://assets3.thrillist.com/v1/image/2779417/size/tl-full_width_tall_mobile.jpg"
          },
          location: action.location
        })
      };
    case DELETE_PLACE:
      return {
        ...state,
        places: state.places.filter(place => {
          return action.placeKey !== place.key;
        })
      };
    default:
      return state;
  }
};

export default reducer;
