import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebase";
import { AuthContext } from "./shared/auth-context";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";
import appImg from "./assets/chat.png";
import AddChat from "./components/AddChat";
import ChatScreen from "./components/chatScreen";

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2c6bed" },
  headerTitleStyle: { color: "#fff" },
  headerTintColor: "#fff",
  headerTitleAlign: "center",
};

export default function App() {
  const authContext = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        setIsLoggedIn(false);
      }
    });
    return unsubscribe;
  }, [auth]);
  AsyncStorage.getItem("isLoggedIn").then((val) => {
    if (val === "true") {
      setIsLoggedIn(true);
    } else if (val === "false") {
      setIsLoggedIn(false);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        setIsLoggedin: setIsLoggedIn,
      }}
    >
      {isLoading ? (
        <SafeAreaView style={styles.container}>
          <Image source={appImg} style={styles.appImage} />
        </SafeAreaView>
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isLoggedIn ? "home" : "login"}
            screenOptions={globalScreenOptions}
          >
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="addChat" component={AddChat} />
            <Stack.Screen name="chat" component={ChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  appImage: {
    height: 150,
    width: 150,
  },
});
