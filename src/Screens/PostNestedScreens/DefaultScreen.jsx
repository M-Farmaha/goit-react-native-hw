import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";

import CommentIcon from "../../images/comment-icon.svg";
import LocationIcon from "../../images/location-icon.svg";
import ProfilePhoto from "../../images/profile-photo.jpg";

export default DefaultScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (route.params) {
      setPosts((prev) => [...prev, route.params]);
    }
  }, [route.params]);

  return (
    <View style={styles.main}>
      <View style={styles.profile}>
        <View style={styles.profileImage}>
          <Image source={ProfilePhoto} style={styles.profilePhoto} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Maks Farmaha</Text>
          <Text style={styles.profileEmail}>maks.farmaha@gmail.com</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            <View style={styles.postImageWrap}>
              <Image source={{ uri: item.photo }} style={styles.postImage} />
            </View>
            <Text style={styles.postName}>{item.postName}</Text>

            <View style={styles.postOptionsWrap}>
              <TouchableOpacity
                style={styles.commentButton}
                activeOpacity={0.6}
              >
                <CommentIcon stroke={"#BDBDBD"} strokeWidth={"1px"} />
                <Text style={styles.commentAmount}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.locationButton}
                activeOpacity={0.6}
              >
                <LocationIcon fill={"#bdbdbd"} />
                <Text style={styles.locationText}>{item.location}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  profile: {
    marginTop: 32,
    marginBottom: 32,
    marginHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    overflow: "hidden",
  },
  profilePhoto: {
    width: 60,
    height: 60,
  },

  profileName: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
  },
  profileEmail: {
    fontSize: 11,
  },

  postImageWrap: {
    height: 240,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: 16,
  },

  postImage: {
    width: "100%",
    height: "100%",
  },

  postName: {
    fontSize: 16,
    fontWeight: 500,
    color: "#212121",
    marginHorizontal: 16,
  },

  commentButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#99ff7a",
    padding: 10,
  },

  commentAmount: {
    fontSize: 16,
    fontWeight: 400,
    color: "#BDBDBD",
  },

  locationButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#99ff7a",
    padding: 10,
  },

  locationText: {
    fontSize: 16,
    fontWeight: 400,
    color: "#212121",
    textDecorationLine: "underline",
  },

  postOptionsWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 6,
    marginBottom: 22,
  },
});
