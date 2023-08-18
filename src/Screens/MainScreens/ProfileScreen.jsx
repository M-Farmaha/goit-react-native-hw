import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  updateDoc,
  increment,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/config";

import BG from "../../images/photo-bg.jpg";
import LogOutButton from "../../Components/LogOutButton";
import AddIcon from "../../images/add-icon.svg";
import CommentIcon from "../../images/comment-icon.svg";
import LikeIcon from "../../images/like-icon.svg";
import LocationIcon from "../../images/location-icon.svg";
import DefaultProfilePhoto from "../../images/default-profile-photo.jpg";

export default ProfileScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const { nickName, photoURL, userId } = useSelector((state) => state.auth);

  const flatListRef = useRef(null);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const orderedPostsRef = query(
      postsRef,
      orderBy("date", "desc"),
      where("userId", "==", userId)
    );

    onSnapshot(orderedPostsRef, (snapshot) => {
      const allPosts = snapshot.docs.map((post) => {
        return {
          id: post.id,
          data: post.data(),
        };
      });

      setPosts(allPosts);
    });

    if (posts.length > 0) {
      flatListRef?.current?.scrollToIndex({ index: 0 });
    }
  }, []);

  const handleLike = async (post) => {
    const postRef = doc(db, "posts", post.id);

    if (post.data.likedBy.includes(userId)) {
      await updateDoc(postRef, {
        likesCount: increment(-1),
        likedBy: arrayRemove(userId),
      });
    } else {
      await updateDoc(postRef, {
        likesCount: increment(1),
        likedBy: arrayUnion(userId),
      });
    }
  };

  return (
    <View style={styles.wrap}>
      <Image source={BG} style={styles.bg} />

      <View style={styles.container}>
        <View style={styles.profileImage}>
          <View style={styles.profilePhotoWrap}>
            <Image
              source={photoURL ? { uri: photoURL } : DefaultProfilePhoto}
              style={styles.profilePhoto}
            />
          </View>
          <TouchableOpacity style={styles.removeBtn} activeOpacity={0.6}>
            <AddIcon width={13} height={13} fill={"#E8E8E8"} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{nickName}</Text>

        <FlatList
          ref={flatListRef}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <>
              <View style={styles.postImageWrap}>
                <Image
                  source={{ uri: item.data.photo }}
                  style={styles.postImage}
                />
              </View>
              <Text style={styles.postName}>{item.data.postName}</Text>

              <View style={styles.postOptionsWrap}>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <TouchableOpacity
                    style={styles.commentButton}
                    activeOpacity={0.6}
                    onPress={() => {
                      navigation.navigate("CommentsScreen", {
                        postId: item.id,
                        postPhoto: item.data.photo,
                      });
                    }}
                  >
                    <CommentIcon
                      stroke={item.data.commentsCount ? "#FF6C00" : "#BDBDBD"}
                      strokeWidth={"1px"}
                      fill={item.data.commentsCount ? "#FF6C00" : "transparent"}
                    />
                    <Text style={styles.commentAmount}>
                      {item.data.commentsCount}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.commentButton}
                    activeOpacity={0.6}
                    onPress={() => handleLike(item)}
                  >
                    <LikeIcon
                      stroke={item.data.likesCount ? "#FF6C00" : "#BDBDBD"}
                      strokeWidth={"1px"}
                      fill={"transparent"}
                    />
                    <Text style={styles.commentAmount}>
                      {item.data.likesCount}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.locationButton}
                  activeOpacity={0.6}
                  onPress={() => {
                    navigation.navigate("MapScreen", {
                      postName: item.data.postName,
                      locationName: item.data.locationName,
                      coords: item.data.coords,
                    });
                  }}
                >
                  <LocationIcon fill={"#bdbdbd"} />
                  <Text style={styles.locationText}>
                    {item.data.coords.country}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        />

        <LogOutButton
          style={{
            position: "absolute",
            top: 12,
            right: 6,
            padding: 10,
            backgroundColor: "transparent",
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },

  bg: {
    position: "absolute",
    top: 0,
    width: "100%",
  },

  container: {
    flex: 1,
    marginTop: 150,
    backgroundColor: "#ffffff",

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  profileImage: {
    position: "absolute",
    top: -60,
    alignSelf: "center",
  },

  profilePhotoWrap: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    overflow: "hidden",
  },

  profilePhoto: {
    width: 120,
    height: 120,
  },

  title: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    marginTop: 92,
    marginBottom: 32,
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
    backgroundColor: "transparent",
    padding: 10,
  },

  commentAmount: {
    fontSize: 16,
    fontWeight: 400,
    color: "#BDBDBD",
  },

  locationButton: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    backgroundColor: "transparent",
    padding: 10,
    flexShrink: 1,
  },

  locationText: {
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 400,
    color: "#212121",
    textDecorationLine: "underline",
    flexShrink: 1,
  },

  postOptionsWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 6,
    marginBottom: 22,
    gap: 10,
  },

  removeBtn: {
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    right: -12,
    bottom: 14,
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
});
