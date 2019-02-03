import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

// Import All Screen we need
import AuthScreen from "./src/screens/Auth/Auth";
import SharePlace from "./src/screens/SharePlace/SharePlace";
import FindPlace from "./src/screens/FindPlace/FindPlace";
import PlaceDetail from "./src/screens/placeDetail/placeDetail";
import SideDrawer from "./src/screens/SideDrawer/SideDrawer";

//implement redux
import configureStore from "./src/store/configureStore";

const store = configureStore();

// Register Screens
Navigation.registerComponent(
  "awesome-places.AuthScreen",
  () => AuthScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.SharePlace",
  () => SharePlace,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.FindPlace",
  () => FindPlace,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-place.PlaceDetailScreen",
  () => PlaceDetail,
  store,
  Provider
);
Navigation.registerComponent("awesome-place.SideDrawer", () => SideDrawer);

// Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "awesome-places.AuthScreen",
    title: "Login"
  }
});
