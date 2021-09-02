import React, { useState } from "react";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import profilePic from "../assets/profile_pic.png";
import { db } from "../firebase";

const customListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    const unSubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        setChatMessages(snap.docs.map((doc) => doc.data()));
      });
    return unSubscribe;
  },[]);
  return (
    <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName)}>
      <Avatar rounded source={{ uri: chatMessages?.[0]?.photoUrl }} />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.displayName}:{chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default customListItem;
const styles = StyleSheet.create({});
