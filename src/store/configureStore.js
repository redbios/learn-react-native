import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import placesReducer from "./reducers/places";
import uiReducer from "./reducers/ui";

const rootReducer = combineReducers({
  places: placesReducer,
  ui: uiReducer
});

let composeEnhancer = compose;

if (__DEV__) {
  composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)));
};

export default configureStore;
