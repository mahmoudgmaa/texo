import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import { auth } from "../firebase";
import { AuthContext } from "../shared/auth-context";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native";
import CustomList from "../shared/custom-list-item";
import { Avatar } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { db } from "../firebase";

const Home = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        authContext.setIsLoggedin(false);
        navigation.replace("login");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unSubscribe = db.collection("chats").onSnapshot((snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unSubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Texo",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "#000" },
      headerTintColor: "#000",
      headerTitleAlign: "left",
      headerLeft: () => (
        <View style={{ marginLeft: 15,marginRight:10 }}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camera" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("addChat")}
          >
            <SimpleLineIcons name="pencil" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const logOut = () => {
    auth.signOut().then(async () => {
      authContext.setIsLoggedin(false);
      await AsyncStorage.setItem("isLoggedIn", false);
      navigation.replace("login");
    });
  };

  const enterChat=(id,chatName)=>{
    navigation.navigate("chat",{
      id:id,
      chatName:chatName
    })
  }

  console.log(chats);
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => {
          return <CustomList key={id} id={id} chatName={chatName} enterChat={enterChat}/>;
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
