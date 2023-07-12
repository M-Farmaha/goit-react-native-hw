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
} from "react-native";
import React, { useState, useEffect } from "react";

import BackIcon from "../../images//back-icon.svg";
import { dataTransformation } from "../../tools/dataTransformation";

export default СomentsScreen = ({ route }) => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  const [isInputCommentFocused, setInputCommentFocused] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([
    { id: "photo", photo: route.params.photo },
  ]);

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

  const addComment = () => {
    setComments((prev) => [
      ...prev,
      { comment: commentInput.trim(), data: dataTransformation(Date.now()) },
    ]);
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
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            if (item.id === "photo") {
              return (
                <View style={styles.postImageWrap}>
                  <Image
                    source={{ uri: item.photo }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
              );
            }
            return (
              <View style={styles.commentWrap}>
                <View style={styles.commentProfileWrap}>
                  <Text>M</Text>
                </View>

                <View style={styles.commentTextWrap}>
                  <Text style={styles.commentText}>{item.comment}</Text>

                  <Text style={styles.commentData}>{item.data}</Text>
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
    marginBottom: 32,
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
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
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
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 16,
  },

  commentText: {
    color: "#212121",
    fontSize: 13,
    lineHeight: 18,
  },

  commentData: {
    color: "#BDBDBD",
    fontSize: 10,
  },
});
