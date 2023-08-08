import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";

import { auth } from "../firebase/config.js";
import Home from "../Screens/MainScreens/Home";
import AuthScreen from "../Screens/AuthScreens/AuthScreen";
import { useDispatch, useSelector } from "react-redux";
import { authStateChangeUser } from "../redux/auth/authOperations.js";

const AuthStack = createStackNavigator();

export default Main = () => {
  const { stateChange } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  return (
    <NavigationContainer>
      {!stateChange ? (
        <AuthStack.Navigator>
          <AuthStack.Screen
            name="Auth"
            options={{ headerShown: false }}
            component={AuthScreen}
          />
        </AuthStack.Navigator>
      ) : (
        <Home />
      )}
    </NavigationContainer>
  );
};
