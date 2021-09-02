import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { db } from "../firebase";
const AddChat = ({ navigation }) => {
  const [input, setInput] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
    });
  });

  const createChat =async () => {
    await db
      .collection("chats")
      .add({ chatName: input })
      .then(() => navigation.goBack())
      .catch((err) => alert(err));
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={20} color="#000" />
        }
        onSubmitEditing={createChat}
      />
      <Button disabled={!input} onPress={createChat} title="create new chat" />
    </View>
  );
};

export default AddChat;

const styles = StyleSheet.create({
  container: {
      padding: 30,
      height: "100%",
      backgroundColor:"#fff"
  },
});
