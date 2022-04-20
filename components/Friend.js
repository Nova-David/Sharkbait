import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";

import { Text } from "./Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";

const Friend = (props) => {
  const friendPressHandler = () => {
    props.navigation.getParent().closeDrawer();

    props.navigation.navigate('Profile', props.friend);
  }

  return (
    <View onStartShouldSetResponder={() => true} style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={friendPressHandler}
      >
        <View>
          <Avatar style={styles.avatar} />
          <Text style={styles.name}>{props.friend.displayname}</Text>
          <Text style={styles.username}>@{props.friend.uid}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    alignItems: "flex-start",
    flexDirection: "column",
    // backgroundColor: 'red',
    // flex: 1,
  },

  avatar: {
    // flex: 1,
    width: 100,
    height: 100,
    borderRadius: 100,
  },

  name: {
    textAlign: "center",
    marginTop: 5,
  },

  username: {
    textAlign: "center",
    marginTop: 3,
    fontSize: Size.smaller,
    color: Theme.dim,
    marginLeft: -5,
  },
});

export default Friend;
