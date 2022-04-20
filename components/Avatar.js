import React from "react";
import { View, Image, StyleSheet } from "react-native";

import Theme from '../const/Colors';

const Avatar = (props) => {
  return (
    <View style={{...styles.image, ...props.style}}>
      <Image
        style={styles.img}
        width={"100%"}
        source={require("../assets/avatar.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    backgroundColor: Theme.darker,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  img: {
    resizeMode: "contain",
    width: "60%",
    height: "70%",
  },
});

export default Avatar;
