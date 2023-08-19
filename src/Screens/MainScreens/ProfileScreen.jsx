import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

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
import {
  ref,
  getStorage,
  deleteObject,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { auth, db } from "../../firebase/config";
import { updateProfile } from "firebase/auth";

import { updateUserProfile } from "../../redux/auth/authReducer";

import BG from "../../images/photo-bg.jpg";
import LogOutButton from "../../Components/LogOutButton";
import AddIcon from "../../images/add-icon.svg";
import CommentIcon from "../../images/comment-icon.svg";
import LikeIcon from "../../images/like-icon.svg";
import LocationIcon from "../../images/location-icon.svg";

export default ProfileScreen = ({ navigation }) => {
  const [hasLibraryPermission, setHasLibraryPermission] = useState(null);
  const [posts, setPosts] = useState([]);

  const dispatch = useDispatch();

  const flatListRef = useRef(null);

  const { nickName, photoURL, userId } = useSelector((state) => state.auth);

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

  useEffect(() => {
    (async () => {
      let libraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasLibraryPermission(libraryPermission.granted);
    })();
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

  const deleteProfilePhoto = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePhotos/${userId}`);

      await deleteObject(storageRef);

      const user = auth.currentUser;

      if (user) {
        await updateProfile(user, {
          photoURL: "",
        });

        dispatch(
          updateUserProfile({
            userId: user.uid,
            nickName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
        );
      }
    } catch (error) {
      Alert.alert("Помилка видалення фото профілю");
    }
  };

  const addProfilePhoto = async () => {
    try {
      if (hasLibraryPermission === null) {
        Alert.alert("Requesting library permition...");
        return;
      }
      if (hasLibraryPermission === false) {
        Alert.alert("Permition for library not granted");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 360, height: 360 } }]
        );

        const user = auth.currentUser;

        if (user) {
          const photo = await fetch(uri);
          const file = await photo.blob();

          const storage = getStorage();

          const storageRef = ref(storage, `profilePhotos/${user.uid}`);

          await uploadBytes(storageRef, file);

          const downloadUrl = await getDownloadURL(storageRef);

          await updateProfile(user, { photoURL: downloadUrl });

          dispatch(
            updateUserProfile({
              userId: user.uid,
              nickName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            })
          );
        }
      }
    } catch (error) {
      Alert.alert("Помилка додавання фото профілю");
    }
  };

  return (
    <View style={styles.wrap}>
      <Image source={BG} style={styles.bg} />

      <View style={styles.container}>
        <View style={styles.profileImage}>
          <View style={styles.profilePhotoWrap}>
            {photoURL && (
              <Image source={{ uri: photoURL }} style={styles.profilePhoto} />
            )}
          </View>
          <TouchableOpacity
            style={{
              ...styles.addButton,
              borderColor: photoURL ? "#E8E8E8" : "#FF6C00",
              transform: [{ rotate: photoURL ? "45deg" : "0deg" }],
            }}
            activeOpacity={0.6}
            onPress={photoURL ? deleteProfilePhoto : addProfilePhoto}
          >
            <AddIcon
              width={13}
              height={13}
              fill={photoURL ? "#BDBDBD" : "#FF6C00"}
            />
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
                    <Text
                      style={{
                        color: item.data.commentsCount ? "#212121" : "#BDBDBD",
                      }}
                    >
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
                      fill={
                        item.data.likedBy.includes(userId)
                          ? "#FF6C00"
                          : "transparent"
                      }
                    />
                    <Text
                      style={{
                        color: item.data.likesCount ? "#212121" : "#BDBDBD",
                      }}
                    >
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
                    {item.data.coords?.country || item.data.locationName}
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

  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    backgroundColor: "transparent",
    padding: 10,
    flexShrink: 1,
  },

  locationText: {
    textAlign: "right",
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

  addButton: {
    position: "absolute",
    right: -12,
    bottom: 14,
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },
});
