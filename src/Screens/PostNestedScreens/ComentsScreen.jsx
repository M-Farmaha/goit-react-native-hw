import { View, Text, StyleSheet, Dimensions } from "react-native";

export default function CommentsScreen() {
  return (
    <View style={styles.container}>
      <Text>COMMENTS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#259e82",
    alignItems: "center",
    justifyContent: "center",
  },
});
