import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import { KeyboardAvoidingView } from "react-native";
import { StyleSheet, Text, View,Image } from "react-native";
import { Input, Button } from "react-native-elements";
import { db, auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../shared/auth-context";
import appImg from "../assets/chat.png";

const Register = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    imgUrl:
      "https://firebasestorage.googleapis.com/v0/b/signal-clone-d7aef.appspot.com/o/profile_pic.png?alt=media&token=fc9fed60-9324-40a7-aeea-ec1b327c7faf",
  });
  const register = () => {
    auth
      .createUserWithEmailAndPassword(userData.email, userData.password)
      .then(async (authUser) => {
        authUser.user.updateProfile({
          displayName: userData.name,
          photoURL: userData.imgUrl,
        });
        authContext.setIsLoggedin(true);
        await AsyncStorage.setItem("isLoggedIn", "true");
        navigation.replace("home");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <StatusBar style="light" />
      <Image source={appImg} style={styles.appImg} />
      <View style={styles.inputContainer}>
        <Input
          autoFocus
          placeholder="full name"
          type="text"
          value={userData.name}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, name: text }))
          }
        />
        <Input
          autoFocus
          placeholder="Email"
          type="email"
          value={userData.email}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, email: text }))
          }
        />
        <Input
          autoFocus
          placeholder="password"
          type="password"
          secureTextEntry
          value={userData.password}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, password: text }))
          }
          onSubmitEditing={register}
        />
      </View>
      <Button
        raised
        onPress={register}
        title="Register"
        style={styles.button}
      />
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  inputContainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
  appImg: {
    width: 150,
    height: 150,
    marginBottom:10
  },
});
