import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";

import { store } from "./src/redux/store";
import Main from "./src/Components/Main.jsx";

export default App = () => {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./src/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./src/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./src/fonts/Roboto-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};
