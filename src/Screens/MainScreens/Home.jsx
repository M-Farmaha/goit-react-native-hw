import "react-native-gesture-handler";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostsScreen from "./PostsScreen";
import CreatePostScreen from "./CreatePostScreen";
import ProfileScreen from "./ProfileScreen";
import CustomTabBar from "../../Components/CustomTabBar";

import GridIcon from "../../images/grid-icon.svg";
import UserIcon from "../../images/user-icon.svg";
import AddIcon from "../../images/add-icon.svg";
import BackIcon from "../../images//back-icon.svg";

export default Home = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.bottomTab,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <GridIcon fill={focused ? "#ffffff" : "#4d4d4d"} />
          ),
        }}
      />
      <Tab.Screen
        name="CreatePosts"
        component={CreatePostScreen}
        options={{
          title: "Створити публікацію",
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
              <BackIcon fill={"#BDBDBD"} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused }) => (
            <AddIcon fill={focused ? "#ffffff" : "#4d4d4d"} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <UserIcon fill={focused ? "#ffffff" : "#4d4d4d"} />
          ),
        }}
      />
    </Tab.Navigator>
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
