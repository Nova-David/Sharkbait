import React, { useRef, useEffect, memo, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

import { Text } from "./Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";

const Chat = (props) => {
  const uid = useSelector((state) => state.user.value);
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

  // useEffect(() => {
  //   Animated.timing(opacity, {toValue: 1, useNativeDriver: true}).start();
  //   Animated.timing(scale, {toValue: 1, useNativeDriver: true}).start();
  // }, []);

  const chatInfo = props.data;

  const chatPressHandler = () => {
    props.navigation.closeDrawer();

    props.navigation.navigate("Messages", {
      chat_id: chatInfo.chat_id,
      name: chatInfo.members[0].displayname,
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
              <Text style={styles.name}>{chatInfo.members[0].displayname}</Text>
              {/* <Text style={styles.time}>{props.time}</Text> */}
            </View>
            <Text style={styles.msg} numberOfLines={2}>
              {(chatInfo.msg) ? chatInfo.msg : "(No messages yet)"}
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
