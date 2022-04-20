import { memo } from "react";
import { View, StyleSheet } from "react-native";

import { Text } from "./Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";

const Message = (props) => {
  const flex = props.sender ? "flex-end" : "flex-start";
  const messageStyle = props.sender
    ? {
        backgroundColor: Theme.accent,
        borderBottomEndRadius: 0,
      }
    : {
        backgroundColor: Theme.darker,
        borderBottomStartRadius: 0,
      };

  return (
    <View onStartShouldSetResponder={() => true} style={{ ...styles.messageContainer, ...props.style, ...{ justifyContent: flex } }}>
      <View style={{ ...styles.message, ...messageStyle, ...props.bubbleStyle }}>
        <Text>{props.children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    width: "100%",
    flexDirection: "row",
  },

  message: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
    minWidth: 70,
    maxWidth: '70%',
    alignItems: 'center',
  }
})

export default memo(Message)