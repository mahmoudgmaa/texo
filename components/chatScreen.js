import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import chatImg from "../assets/profile_pic.png";
import firebase from "firebase/app";
import { auth, db } from "../firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoUrl: auth.currentUser.photoURL,
    });

    setInput("");
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar rounded source={{ uri: messages[0]?.data.photoUrl }} />
          <Text style={{ color: "#fff", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
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
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  useLayoutEffect(() => {
    const unSubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((sp) =>
        setMessages(
          sp.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unSubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.constainer}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView
              contentContainerStyle={{
                paddingTop: 15,
              }}
            >
              {messages.map(({ id, data }) => {
                return data.email === auth.currentUser.email ? (
                  <View style={styles.receiverContainer} key={id}>
                    <Avatar
                      position="absolute"
                      bottom={-15}
                      right={-5}
                      containerStyle={{
                        bottom: -15,
                        right: -5,
                        position: "absolute",
                      }}
                      rounded
                      size={24}
                      source={{ uri: data.photoUrl }}
                    />
                    <Text style={styles.receiverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View style={styles.senderContainer} key={id}>
                    <Avatar
                      position="absolute"
                      bottom={-15}
                      right={-5}
                      containerStyle={{
                        bottom: -15,
                        right: -5,
                        position: "absolute",
                      }}
                      rounded
                      size={24}
                      source={{ uri: data.photoUrl }}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.displayName}</Text>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="Enter your message"
                style={styles.textInput}
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={20} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "#000",
    borderRadius: 30,
  },
  receiverContainer: {
    padding: 15,
    backgroundColor: "#ececec",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderContainer: {
    padding: 15,
    backgroundColor: "#2b68e6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  receiverText: {
    color: "#000",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderText: {
    fontWeight: "500",
    paddingLeft: 10,
    marginBottom: 15,
    color: "#fff",
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "#fff",
  },
});
