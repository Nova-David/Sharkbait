import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import { Text } from "./Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import Avatar from "../components/Avatar";

const Request = (props) => {
  const friend = props.friend;

  return (
    <View onStartShouldSetResponder={() => true} style={styles.request}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate("Profile", friend);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{friend.displayname}</Text>
            <Text style={styles.uid}>@{friend.uid}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.icons}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.accept(friend);
          }}
        >
          <View style={styles.icon}>
            <Icon name="check" size={30} color={Theme.positive} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.reject(friend);
          }}
        >
          <View style={styles.icon}>
            <Icon name="cross" size={30} color={Theme.red} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  request: {
    width: "100%",
    backgroundColor: Theme.lighter,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  uid: {
    color: Theme.accent,
    fontSize: Size.small,
  },

  name: {
    marginBottom: 5,
  },

  icons: {
    flexDirection: "row",
  },

  icon: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: Theme.primary,
    marginLeft: 10,
  },
});

export default Request;
