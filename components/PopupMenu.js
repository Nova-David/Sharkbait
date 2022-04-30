import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import Theme from "../const/Colors";
import { HR, Text } from "./Comp";

const PopupMenu = (props) => {
  const { data: user, interests } = useSelector((state) => state.user);

  const randomHandler = () => {
    if (interests) {
      fetch("http://api.sharkbait-app.ml/users/")
        .then((response) => response.json())
        .then((data) => {
          let possibleUsers = Array();
          for (var key in data) {
            if (data[key].interests) {
              let theirInterests = data[key].interests;

              const intersection = interests.filter(
                (element) => theirInterests.indexOf(element) !== -1
              );

              var percentage =
                (intersection.length * 2) /
                (interests.length + theirInterests.length);

              console.log(data[key].uid, percentage);

              if (
                percentage >= 0.65 &&
                (!data[key].friends ||
                !data[key].friends.includes(user.uid)) &&
                data[key].uid !== user.uid
              ) {
                possibleUsers.push(data[key]);
              }
            }
          }

          console.log(possibleUsers);
          if (possibleUsers.length <= 0)
            return Toast.show({
              type: "info",
              text1: "No matches found, sorry",
              position: "bottom",
              bottomOffset: 100,
            });

          const ind = Math.floor(Math.random() * possibleUsers.length);
          props.close();
          props.navigation.navigate("Profile", possibleUsers[ind]);
        });
    } else {
      Toast.show({
        type: "info",
        text1: "You should add some interests first!",
        position: "bottom",
        bottomOffset: 100,
      });
    }
    props.close();
  };

  return (
    <View style={styles.popup}>
      <View style={styles.inner}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.close();
            props.navigation.navigate("Search");
          }}
        >
          <View style={styles.nav}>
            <Text>Find User</Text>
          </View>
        </TouchableOpacity>
        <HR
          style={{
            borderBottomColor: Theme.darker,
            width: "90%",
            marginTop: 0,
          }}
        />
        <TouchableOpacity activeOpacity={0.8} onPress={randomHandler}>
          <View style={styles.nav}>
            <Text>Meet a New Friend</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popup: {
    width: "100%",
    position: "absolute",
    top: -20,
    // height: 20,
    alignItems: "center",
    zIndex: 3,
  },

  inner: {
    // overflow: "hidden",
    width: 300,
    // minHeight: 50,
    backgroundColor: Theme.lighter,
    alignItems: "center",
    borderRadius: 35,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },

  nav: {
    alignItems: "center",
    padding: 20,
  },
});

export default PopupMenu;
