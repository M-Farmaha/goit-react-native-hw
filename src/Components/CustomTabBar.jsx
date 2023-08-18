import { StyleSheet, View, TouchableOpacity } from "react-native";

export default CustomTabBar = ({ state, descriptors, navigation }) => {
  const { index, routes } = state;
  const deepIndex = routes[0]?.state?.index;

  hideTabBar = index === 1 || deepIndex === 1;

  return (
    !hideTabBar && (
      <View style={styles.tabBar}>
        {routes.map((route, i) => {
          const { options } = descriptors[route.key];

          const handlePress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              activeOpacity={0.6}
              key={route.key}
              onPress={handlePress}
            >
              <View style={[i === 1 ? styles.activeIcon : styles.inactiveIcon]}>
                {options.tabBarIcon({ focused: i === 1 ? true : false })}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    )
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "transparent",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
