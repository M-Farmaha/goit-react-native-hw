import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";

import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import { useDispatch, useSelector } from "react-redux";
import { authSingUpUser } from "../../redux/auth/authOperations";
import { getIsLoading } from "../../redux/auth/selectors";

import AddIcon from "../../images/add-icon.svg";

export default RegistrationScreen = ({
  isKeyboardShown,
  setisRegistrationScreen,
}) => {
  const [hasLibraryPermission, setHasLibraryPermission] = useState(null);
  const [isInputLoginFocused, setInputLoginFocused] = useState(false);
  const [isInputEmailFocused, setInputEmailFocused] = useState(false);
  const [isInputPasswordFocused, setInputPasswordFocused] = useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoading);
  const disabledRegisterBtn = isLoading;

  useEffect(() => {
    (async () => {
      let libraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasLibraryPermission(libraryPermission.granted);
    })();
  }, []);

  const pickProfilePhoto = async () => {
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
      setProfilePhoto(uri);
    }
  };

  const deleteProfilePhoto = () => {
    setProfilePhoto(null);
  };

  const handleRegister = () => {
    if (login.length === 0) {
      Alert.alert("Логін не може бути пустим");
      return;
    }
    if (email.length === 0) {
      Alert.alert("Адреса електронної пошти не може бути пустою");
      return;
    }
    if (password.length === 0) {
      Alert.alert("Пароль не може бути пустим");
      return;
    }
    if (login.length < 6) {
      Alert.alert("Логін повинен містити щонайменше 6 символів");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Пароль повинен містити щонайменше 6 символів");
      return;
    }
    dispatch(authSingUpUser({ login, email, password, profilePhoto }));
  };

  return (
    <>
      <View style={styles.main}>
        <View style={styles.profileImage}>
          <View style={styles.profilePhotoWrap}>
            {profilePhoto && <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />}
          </View>
          <TouchableOpacity
            onPress={profilePhoto ? deleteProfilePhoto : pickProfilePhoto}
            style={{
              ...styles.addButton,
              borderColor: profilePhoto ? "#E8E8E8" : "#3470FF",
              transform: [{ rotate: profilePhoto ? "45deg" : "0deg" }],
            }}
            activeOpacity={0.6}
          >
            <AddIcon
              width={13}
              height={13}
              fill={profilePhoto ? "#BDBDBD" : "#3470FF"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Реєстрація</Text>
        <View style={styles.form}>
          <TextInput
            style={{
              ...styles.input,
              marginBottom: 16,
              backgroundColor: isInputLoginFocused ? "#ffffff" : "#F6F6F6",
              borderColor: isInputLoginFocused ? "#3470FF" : "#E8E8E8",
            }}
            placeholder={"Логін"}
            autoComplete={"off"}
            autoCorrect={false}
            selectionColor={"#3470FF"}
            value={login}
            onFocus={() => setInputLoginFocused(true)}
            onBlur={() => setInputLoginFocused(false)}
            onChangeText={(value) => setLogin(value)}
          />
          <TextInput
            style={{
              ...styles.input,
              marginBottom: 16,
              backgroundColor: isInputEmailFocused ? "#ffffff" : "#F6F6F6",
              borderColor: isInputEmailFocused ? "#3470FF" : "#E8E8E8",
            }}
            placeholder={"Адреса електронної пошти"}
            autoComplete={"off"}
            autoCorrect={false}
            selectionColor={"#3470FF"}
            value={email}
            onFocus={() => setInputEmailFocused(true)}
            onBlur={() => setInputEmailFocused(false)}
            onChangeText={(value) => setEmail(value)}
          />
          <View>
            <TextInput
              style={{
                ...styles.input,
                marginBottom: 34,
                backgroundColor: isInputPasswordFocused ? "#ffffff" : "#F6F6F6",
                borderColor: isInputPasswordFocused ? "#3470FF" : "#E8E8E8",
              }}
              placeholder={"Пароль"}
              secureTextEntry={!showPassword}
              autoComplete={"off"}
              autoCorrect={false}
              selectionColor={"#3470FF"}
              value={password}
              onFocus={() => setInputPasswordFocused(true)}
              onBlur={() => setInputPasswordFocused(false)}
              onChangeText={(value) => setPassword(value)}
            />
            <TouchableOpacity
              style={{
                ...styles.btnLink,
                position: "absolute",
                right: 6,
                top: 4,
                padding: 10,
                backgroundColor: "transparent",
              }}
              activeOpacity={0.6}
              onPress={() => setShowPassword((prevState) => !prevState)}
            >
              <Text style={styles.btnLinkText}>
                {showPassword ? "Приховати" : "Показати"}
              </Text>
            </TouchableOpacity>
          </View>
          {!isKeyboardShown && (
            <View>
              <TouchableOpacity
                disabled={disabledRegisterBtn}
                activeOpacity={0.6}
                style={{
                  ...styles.btn,
                  backgroundColor: disabledRegisterBtn ? "#f6f6f6" : "#3470FF",
                }}
                onPress={handleRegister}
              >
                {isLoading ? (
                  <ActivityIndicator size={"large"} />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      color: disabledRegisterBtn ? "#bdbdbd" : "#ffffff",
                    }}
                  >
                    Зареєструватися
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnLink}
                activeOpacity={0.6}
                onPress={() => setisRegistrationScreen(false)}
              >
                <Text style={styles.btnLinkText}>Вже є акаунт? Увійти</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  main: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  form: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
  },

  input: {
    fontSize: 16,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    marginTop: 92,
    marginBottom: 32,
  },

  profileImage: {
    position: "absolute",
    marginTop: -60,
    top: 0,
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

  btn: {
    backgroundColor: "#3470FF",
    borderRadius: 100,
    height: 50,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  btnLink: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 78,
  },
  btnLinkText: {
    color: "#1B4371",
    fontSize: 16,
  },
});
