import { StyleSheet, View, TouchableOpacity } from "react-native";
import DeleteIcon from "../src/images/delete-icon.svg";

export default CustomTabBar = ({ state, descriptors, navigation }) => {
  let modifiedRoutes = state.routes;

  const activeIndex = state.index;
  const showCreatePostsScreen = activeIndex === 1;

  if (activeIndex === 2) {
    modifiedRoutes = [state.routes[0], state.routes[2], state.routes[1]];
  }

  return (
    <View style={showCreatePostsScreen ? styles.createPostsBar : styles.tabBar}>
      {showCreatePostsScreen ? (
        <TouchableOpacity activeOpacity={0.6}>
          <View style={styles.deleteIcon}>
            <DeleteIcon fill={"#bdbdbd"} />
          </View>
        </TouchableOpacity>
      ) : (
        modifiedRoutes.map((route, index) => {
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const isFocused = index === 1;

          let iconComponent;
          if (isFocused && activeIndex === 2) {
            if (index === 1) {
              // Міняємо іконку для другої кнопки, коли активний третій скрін
              iconComponent = options.tabBarIcon({
                focused: isFocused,
                swapped: true,
              });
            } else if (index === 2) {
              // Міняємо іконку для третьої кнопки, коли активний третій скрін
              iconComponent = options.tabBarIcon({
                focused: isFocused,
                swapped: true,
              });
            }
          } else {
            // Використовуємо звичайні іконки для всіх інших випадків
            iconComponent = options.tabBarIcon({
              focused: isFocused,
              swapped: false,
            });
          }

          return (
            <TouchableOpacity
              activeOpacity={0.6}
              key={route.key}
              onPress={onPress}
            >
              <View
                style={[isFocused ? styles.activeIcon : styles.inactiveIcon]}
              >
                {options.tabBarIcon({ focused: isFocused })}
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activeIcon: {
    width: 70,
    height: 40,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveIcon: {
    width: 70,
    height: 40,
    backgroundColor: "#ffffff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    width: 70,
    height: 40,
    backgroundColor: "#f6f6f6",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  tabBar: {
    flexDirection: "row",
    height: 83,
    backgroundColor: "#ffffff",
    borderTopColor: "#b3b3b3",
    borderTopWidth: 0.5,
    justifyContent: "center",
    gap: 31,
    paddingTop: 9,
    paddingBottom: 34,
  },

  createPostsBar: {
    flexDirection: "row",
    height: 83,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    gap: 31,
    paddingTop: 9,
    paddingBottom: 34,
  },
});