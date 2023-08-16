import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  Image,
  KeyboardAvoidingView,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { db } from "../../firebase/config.js";

import DefaultProfilePhoto from "../../images/default-profile-photo.jpg";
import BackIcon from "../../images//back-icon.svg";
import { dataTransformation } from "../../tools/dataTransformation";

export default СomentsScreen = ({ route }) => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [isInputCommentFocused, setInputCommentFocused] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const { postId, postPhoto } = route.params;
  const [comments, setComments] = useState([{ id: "photo", postPhoto }]);

  const flatListRef = useRef(null);
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", postId, "comments"),
      async (snapshot) => {
        const allComments = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const storage = getStorage();
            const photoRef = ref(storage, `profilePhotos/${doc.data().userId}`);

            let photoURL = null;
            try {
              photoURL = await getDownloadURL(photoRef);
            } catch (error) {}

            return {
              id: doc.id,
              data: doc.data(),
              photoURL,
            };
          })
        );

        setComments([{ id: "photo", postPhoto }, ...allComments]);

        flatListRef.current.scrollToEnd();
      }
    );
  }, []);

  useEffect(() => {
    const showKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardShown(true);
        if (Platform.OS == "ios")
          Keyboard.scheduleLayoutAnimation({
            duration: 500,
            easing: "keyboard",
          });
      }
    );
    const hideKB = Keyboard.addListener(
      Platform.OS == "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardShown(false);
        if (Platform.OS == "ios")
          Keyboard.scheduleLayoutAnimation({
            duration: 500,
            easing: "keyboard",
          });
      }
    );

    return () => {
      showKB.remove();
      hideKB.remove();
    };
  }, []);

  const writeCommentToFirestore = async (id, data) => {
    try {
      const postDocRef = doc(db, "posts", id);

      const commentsCollectionRef = collection(postDocRef, "comments");

      await addDoc(commentsCollectionRef, data);
    } catch (error) {
      Alert.alert(`Помилка запису до бази даних, ${error.message}`);
    }
  };

  const addComment = async () => {
    const comment = {
      comment: commentInput.trim(),
      date: Date.now(),
      userId,
    };

    await writeCommentToFirestore(postId, comment);

    setCommentInput("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View
        style={{
          ...styles.main,
          paddingBottom: isKeyboardShown && Platform.OS == "ios" ? 104 : 16,
        }}
      >
        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (item.id === "photo") {
              return (
                <View style={styles.postImageWrap}>
                  <Image
                    source={{ uri: item.postPhoto }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
              );
            }
            return (
              <View
                style={{
                  ...styles.commentWrap,
                  flexDirection:
                    item.data.userId === userId ? "row-reverse" : "row",
                }}
              >
                <View style={styles.commentProfileWrap}>
                  <Image
                    source={
                      item.photoURL
                        ? { uri: item.photoURL }
                        : DefaultProfilePhoto
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>

                <View
                  style={{
                    ...styles.commentTextWrap,
                    borderTopLeftRadius: item.data.userId === userId ? 6 : 0,
                    borderTopRightRadius: item.data.userId === userId ? 0 : 6,
                  }}
                >
                  <Text style={styles.commentText}>{item.data.comment}</Text>

                  <Text
                    style={{
                      ...styles.commentDate,
                      alignSelf:
                        item.data.userId === userId ? "flex-start" : "flex-end",
                    }}
                  >
                    {dataTransformation(item.data.date)}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <View style={styles.form}>
          <TextInput
            style={{
              ...styles.input,
              backgroundColor: isInputCommentFocused ? "#ffffff" : "#F6F6F6",
              borderColor: isInputCommentFocused ? "#FF6C00" : "#E8E8E8",
            }}
            placeholder={"Коментувати..."}
            autoComplete={"off"}
            autoCorrect={false}
            selectionColor={"#FF6C00"}
            value={commentInput}
            onFocus={() => setInputCommentFocused(true)}
            onBlur={() => setInputCommentFocused(false)}
            onChangeText={(value) => setCommentInput(value)}
          />
          <TouchableOpacity
            disabled={!commentInput.trim()}
            style={styles.addCommentButton}
            activeOpacity={0.6}
            onPress={addComment}
          >
            <BackIcon fill={"#ffffff"} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  main: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#ffffff",
  },

  postImageWrap: {
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 8,
    height: 240,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    overflow: "hidden",
  },

  form: {
    backgroundColor: "#ffffff",
    marginTop: 16,
    marginHorizontal: 16,
  },

  input: {
    fontSize: 16,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  addCommentButton: {
    width: 34,
    height: 34,
    borderRadius: 34,
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "90deg" }],
  },

  commentWrap: {
    display: "flex",

    gap: 16,
    marginTop: 24,
    marginHorizontal: 16,
  },

  commentProfileWrap: {
    width: 28,
    height: 28,
    borderRadius: 28,
    backgroundColor: "#cdcdcd",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  commentTextWrap: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignSelf: "flex-start",
    gap: 8,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 16,
  },

  commentText: {
    color: "#212121",
    fontSize: 13,
    lineHeight: 18,
  },

  commentDate: {
    color: "#BDBDBD",
    fontSize: 10,
  },
});
