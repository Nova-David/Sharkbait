import React, { useEffect, memo } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import moment from "moment";

import { Text } from "./Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";

const Chat = (props) => {
  const chat = useSelector((state) => state.user.chats[props.chat]);

  const scaleRange = [
    -1,
    0,
    (85 + 40) * props.index,
    (85 + 40) * (props.index + 0.5),
  ];

  const opacityRange = [
    -1,
    0,
    (85 + 40) * props.index,
    (85 + 40) * (props.index + 0.5),
  ];

  const scale = props.scrollY.interpolate({
    inputRange: scaleRange,
    outputRange: [1, 1, 1, 0.9],
  });

  const opacity = props.scrollY.interpolate({
    inputRange: opacityRange,
    outputRange: [1, 1, 1, 0],
  });

  if (!chat || !chat.chat_id) {
    return (
      <View onStartShouldSetResponder={() => true}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
          <Animated.View
            style={[styles.chat, { transform: [{ scale }], opacity: opacity }]}
          >
            <Avatar />
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.name}>...</Text>
              </View>
              <Text style={styles.msg} numberOfLines={2}>
                ...
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }

  const title = chat.title
    ? chat.title
    : chat.members.map((member) => member.displayname).join(", ");

  const chatPressHandler = () => {
    props.navigation.closeDrawer();

    props.navigation.navigate("Messages", {
      chat_id: chat.chat_id,
      name: title,
      members: chat.members,
    });
  };

  // const comp = props.read ? null : <View style={styles.notification} />;

  return (
    <View onStartShouldSetResponder={() => true}>
      <TouchableOpacity activeOpacity={0.9} onPress={chatPressHandler}>
        <Animated.View
          style={[styles.chat, { transform: [{ scale }], opacity: opacity }]}
        >
          {/* {comp} */}
          <Avatar />
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.name} numberOfLines={1}>{title}</Text>
              <Text style={styles.time}>{moment(chat.last_update).fromNow()}</Text>
            </View>
            <Text style={styles.msg} numberOfLines={2}>
              {chat.msg ? chat.msg : "(No messages yet)"}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  chat: {
    width: "100%",
    backgroundColor: Theme.lighter,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 20,
    // opacity: 0,
    // transform: [ { scale: 0 } ]
  },

  content: {
    marginLeft: 10,
    flex: 1,
    justifyContent: "space-between",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingRight: 10,
    marginTop: -5,
  },

  name: {
    color: Theme.darker,
    fontWeight: "bold",
    fontStyle: "italic",
    flex: 1,
    marginRight: 10,
  },

  time: {
    color: Theme.darker,
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: Size.smaller,
  },

  msg: {
    color: Theme.dim,
    fontSize: Size.small,
    marginTop: 5,
    marginRight: 20,
  },

  notification: {
    position: "absolute",
    right: -5,
    top: -3,
    backgroundColor: Theme.red,
    height: 20,
    width: 20,
    borderRadius: 50,
  },
});

export default memo(Chat);
