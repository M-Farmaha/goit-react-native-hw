import { createStackNavigator } from "@react-navigation/stack";

import MapScreen from "../PostNestedScreens/MapScreen";
import DefaultScreen from "../PostNestedScreens/DefaultScreen";
import CommentsScreen from "../PostNestedScreens/ComentsScreen";

const PostNestedNavigation = createStackNavigator();

export default function PostsScreen() {
  return (
    <PostNestedNavigation.Navigator>
      <PostNestedNavigation.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <PostNestedNavigation.Screen
        name="DefaultScreen"
        component={DefaultScreen}
      />
      <PostNestedNavigation.Screen
        name="CommentsScreen"
        component={CommentsScreen}
      />
    </PostNestedNavigation.Navigator>
  );
}
