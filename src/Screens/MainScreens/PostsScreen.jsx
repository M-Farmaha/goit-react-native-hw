import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import MapScreen from "../PostNestedScreens/MapScreen";
import DefaultScreen from "../PostNestedScreens/DefaultScreen";
import CommentsScreen from "../PostNestedScreens/ComentsScreen";

import { StyleSheet, TouchableOpacity } from "react-native";
import BackIcon from "../../images/back-icon.svg";
import LogOutButton from "../../Components/LogOutButton";

export default PostsScreen = () => {
  const PostNestedNavigation = createStackNavigator();
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <PostNestedNavigation.Navigator>
      <PostNestedNavigation.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{
          title: "Публікації",
          headerTitleAlign: "center",
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerRight: () => (
            <LogOutButton
              style={{
                position: "absolute",
                top: 0,
                right: 6,
                padding: 10,
                backgroundColor: "#99ff7a",
              }}
            />
          ),
        }}
      />
      <PostNestedNavigation.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          title: "Карта",
          headerTitleAlign: "center",
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 6,
                padding: 10,
                backgroundColor: "#99ff7a",
              }}
              activeOpacity={0.6}
              onPress={handleBackPress}
            >
              <BackIcon fill={"#212121"} />
            </TouchableOpacity>
          ),
        }}
      />
      <PostNestedNavigation.Screen
        name="CommentsScreen"
        component={CommentsScreen}
        options={{
          title: "Коментарі",
          headerTitleAlign: "center",
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 6,
                padding: 10,
                backgroundColor: "#99ff7a",
              }}
              activeOpacity={0.6}
              onPress={handleBackPress}
            >
              <BackIcon fill={"#212121"} />
            </TouchableOpacity>
          ),
        }}
      />
    </PostNestedNavigation.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 88,
    backgroundColor: "#ffffff",
    borderBottomColor: "#b3b3b3",
    borderBottomWidth: 0.5,
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 17,
  },
});
