import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text } from "../components/Comp";
import Avatar from "./Avatar";
import Theme from "../const/Colors";
import Size from "../const/Sizes";

const ChatTitle = (props) => {
  const avatar = props.img ? <Avatar style={styles.avatar} /> : null;
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => {
        props.navigation.pop();
      }}>
        <View style={styles.backButton}>
          <Icon name="chevron-back" size={40} color={Theme.lighter} />
        </View>
      </TouchableOpacity>
      {avatar}
      <Text style={styles.title}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  backButton: {
    paddingHorizontal: 15,
  },

  title: {
    color: Theme.lighter,
    fontWeight: "bold",
    fontSize: Size.larger,
  },

  avatar: {
    width: 60,
    height: 60,
    backgroundColor: Theme.lighter,
    marginRight: 10
  },
});

export default ChatTitle;
