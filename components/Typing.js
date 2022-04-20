import { memo } from "react";
import { View, StyleSheet } from "react-native";

import { Text } from "./Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
// import Icon from "react-native-vector-icons/Entypo";
import { TypingAnimation } from "react-native-typing-animation";

const Typing = (props) => {
  return (
    <View
      onStartShouldSetResponder={() => true}
      style={{ ...styles.messageContainer, ...props.style }}
    >
      <View style={{ ...styles.message, ...props.bubbleStyle }}>
        <TypingAnimation
          style={styles.dots}
          dotColor={Theme.lighter}
          dotMargin={10}
          dotAmplitude={3}
          dotSpeed={0.1}
          dotRadius={5}
          dotX={-5}
          dotY={5}
        />
        {/* <Icon name="dots-three-horizontal" size={25} color={Theme.lighter} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  message: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
    minWidth: 70,
    minHeight: 40,
    maxWidth: "70%",
    alignItems: "center",
    backgroundColor: Theme.darker,
  },
});

export default memo(Typing);
