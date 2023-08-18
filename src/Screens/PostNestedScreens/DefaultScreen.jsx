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
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

import CommentIcon from "../../images/comment-icon.svg";
import LikeIcon from "../../images/like-icon.svg";
import LocationIcon from "../../images/location-icon.svg";
import DefaultProfilePhoto from "../../images/default-profile-photo.jpg";

export default DefaultScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const flatListRef = useRef(null);

  const { nickName, email, photoURL, userId } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const orderedPostsRef = query(postsRef, orderBy("date", "desc"));

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
    <View style={styles.main}>
      <View style={styles.profile}>
        <View style={styles.profileImage}>
          <Image
            source={photoURL ? { uri: photoURL } : DefaultProfilePhoto}
            style={styles.profilePhoto}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{nickName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>
      </View>

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
                  {item.data.locationName}
                </Text>
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
});
