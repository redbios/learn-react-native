import { SET_AUTH_TOKEN, AUTH_REMOVE_TOKEN } from "../actions/actionTypes";

const intialState = {
  token: null,
  expiryDate: null
};

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return {
        ...state,
        token: action.token,
        expiryDate: action.expiryDate
      };
      break;
    case AUTH_REMOVE_TOKEN:
      return {
        ...state,
        token: null,
        expiryDate: null
      };
    default:
      return state;
      break;
  }
};

export default reducer;
