import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import ChatTitle from "../components/ChatTitle";
import SafeArea from "../layouts/EmptyLayout";
import Icon from "react-native-vector-icons/Entypo";

import { Text } from "../components/Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import Avatar from "../components/Avatar";
import { useSelector } from "react-redux";

const RequestsScreen = (props) => {
  const [requests, setRequests] = useState(props.route.params);
  const uid = useSelector(state => state.user.value)

  const acceptHandler = (friendUID) => {
    fetch("http://api.sharkbait-app.ml/friends/accept", {
      method: "POST",
      body: JSON.stringify({uid: uid, friend: friendUID}),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const newRequests = {...requests};
      delete newRequests[friendUID];
      setRequests(newRequests);
    });
  };

  const rejectHandler = (friendUID) => {
    fetch("http://api.sharkbait-app.ml/friends/reject", {
      method: "POST",
      body: JSON.stringify({uid: uid, friend: friendUID}),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const newRequests = {...requests};
      delete newRequests[friendUID];
      setRequests(newRequests);
    });
  };

  return (
    <SafeArea>
      <ChatTitle name="Requests" navigation={props.navigation} />
      <FlatList
        contentContainerStyle={styles.friendList}
        keyExtractor={(item) => item.uid}
        data={Object.values(requests)}
        renderItem={(itemData) => (
          <View onStartShouldSetResponder={() => true} style={styles.request}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate("Profile", itemData.item);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.name}>{itemData.item.displayname}</Text>
                  <Text style={styles.uid}>@{itemData.item.uid}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.icons}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={acceptHandler.bind(this, itemData.item.uid)}
              >
                <View style={styles.icon}>
                  <Icon name="check" size={30} color={Theme.positive} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={rejectHandler.bind(this, itemData.item.uid)}
              >
                <View style={styles.icon}>
                  <Icon name="cross" size={30} color={Theme.red} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  friendList: {
    padding: 20,
  },
  
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

export default RequestsScreen;
