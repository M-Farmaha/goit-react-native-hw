import "react-native-gesture-handler";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";

import { UserContext } from "./userContext";

import RegistrationScreen from "./src/Screens/Auth/RegistrationScreen";
import LoginScreen from "./src/Screens/Auth/LoginScreen";
import Home from "./src/Screens/Main/Home";
import AuthScreen from "./src/Screens/Auth/AuthScreen";

export default App = () => {
  const [isLogined, setIsLogined] = useState(false);
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./src/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./src/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./src/fonts/Roboto-Bold.ttf"),
  });

  const AuthStack = createStackNavigator();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserContext.Provider value={{ isLogined, setIsLogined }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer>
          {!isLogined ? (
            <AuthStack.Navigator>
              <AuthStack.Screen
                name="Auth"
                options={{ headerShown: false }}
                component={AuthScreen}
              />
            </AuthStack.Navigator>
          ) : (
            <Home isLogined={isLogined} setIsLogined={setIsLogined} />
          )}
        </NavigationContainer>
      </View>
    </UserContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
