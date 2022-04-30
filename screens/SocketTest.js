import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userReducer";

const SocketTest = (props) => {
  const { data: user, chats, friends, requests, interests, sent } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <View>
      <SafeAreaView>
        <Text>Welcome, {user.displayname}!</Text>
        <Text>Chats:</Text>
        {chats ? (
          chats.map((x, ind) => <Text key={ind}>{x}</Text>)
        ) : (
          <Text>No chats</Text>
        )}
        <Text>Friends:</Text>
        {friends ? (
          friends.map((x, ind) => <Text key={ind}>{x}</Text>)
        ) : (
          <Text>No friends</Text>
        )}
        <Text>Requests:</Text>
        {requests ? (
          requests.map((x, ind) => <Text key={ind}>{x}</Text>)
        ) : (
          <Text>No requests</Text>
        )}
        <Text>Interests:</Text>
        {interests ? (
          interests.map((x, ind) => <Text key={ind}>{x}</Text>)
        ) : (
          <Text>No interests</Text>
        )}
        <Text>Sent:</Text>
        {sent ? (
          sent.map((x, ind) => <Text key={ind}>{x}</Text>)
        ) : (
          <Text>None sent</Text>
        )}
        <Button title="Logout" onPress={logoutHandler}></Button>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SocketTest;
