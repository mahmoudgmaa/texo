import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, KeyboardAvoidingView } from "react-native";
import { Button, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import appImg from "../assets/chat.png";
import { auth } from "../firebase";

const Login = ({ navigation }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((authUser) => {
  //     if (authUser) {
  //       navigation.replace("home");
  //     }
  //   });
  //   return unsubscribe;
  // }, []);

  const signIn = () => {
    auth
      .signInWithEmailAndPassword(userData.email, userData.password)
      .then(async () => {
        authContext.setIsLoggedin(true);
        await AsyncStorage.setItem("isLoggedIn", "true");
        navigation.replace("home");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <StatusBar style="light" />
      <Image source={appImg} style={styles.appImg} />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          type="Email"
          autoFocus
          value={userData.email}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, email: text }))
          }
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={userData.password}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, password: text }))
          }
          onSubmitEditing={signIn}
        />
        <Button title="Login" containerStyle={styles.button} onPress={signIn} />
        <Button
          title="Register"
          type="outline"
          containerStyle={styles.button}
          onPress={() => navigation.replace("register")}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  appImg: {
    width: 150,
    height: 150,
  },
  inputContainer: {
    width: 300,
    alignItems: "center",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
