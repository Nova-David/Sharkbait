import React, { useState, useContext } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import ChatTitle from "../components/ChatTitle";
import SafeArea from "../layouts/EmptyLayout";
import Icon from "react-native-vector-icons/Entypo";

import { Text } from "../components/Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import Avatar from "../components/Avatar";
import { useSelector } from "react-redux";
import Request from "../components/Request";
import { SocketContext } from "../socket/Socket";

const RequestsScreen = (props) => {
  const {
    data: user,
    requests,
  } = useSelector((state) => state.user);

  const ctx = useContext(SocketContext);

  const acceptHandler = (friend) => {
    /* Accept friend request */
    console.log("Accept", friend.uid)
    ctx.acceptRequest(user, friend);
  };

  const rejectHandler = (friend) => {
    /* Reject friend request */
    console.log("Reject", friend.uid)
    ctx.rejectRequest(user, friend);
  };

  return (
    <SafeArea>
      <ChatTitle name="Requests" navigation={props.navigation} />
      <FlatList
        contentContainerStyle={styles.friendList}
        keyExtractor={(item, ind) => ind}
        data={requests ? requests : [null]}
        renderItem={(itemData) => {
          if (!itemData.item) return <Text>No requests!</Text>;
          else
            return (
              <Request
                navigation={props.navigation}
                friend={itemData.item}
                accept={acceptHandler}
                reject={rejectHandler}
              />
            );
        }}
      />
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  friendList: {
    padding: 20,
  },
});

export default RequestsScreen;
