import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

import SafeArea from "../layouts/HomeLayout";
import { Text, H1, Input } from "../components/Comp";
import SearchIcon from "../components/SearchIcon";
import Friend from "../components/Friend";
import Theme from "../const/Colors";
import Size from "../const/Sizes";

const FriendsScreen = (props) => {
  const [search, setSearch] = useState("");

  const { friends, requests } = useSelector((state) => state.user);

  const filter = (friends, search) => {
    /* Filter friends based on search */
    let res = Object.values(friends);
    search = search.toLowerCase();

    return res.filter((friend) =>
      friend.displayname.toLowerCase().includes(search)
    );
  };

  return (
    <SafeArea navigation={props.navigation} inverse={true}>
      <View style={styles.head}>
        <View style={styles.searchContainer}>
          <SearchIcon value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate("Requests", requests);
          }}
        >
          <View style={styles.requests}>
            <Text style={styles.requestsText}>Requests</Text>
            {requests ? (
              <Text style={styles.new}>
                {requests.length} new
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <H1 style={styles.h1}>Friends</H1>
      </View>
      <FlatList
        columnWrapperStyle={{ justifyContent: "space-around" }}
        numColumns={3}
        contentContainerStyle={styles.friendList}
        keyExtractor={(item, ind) => ind}
        data={friends ? filter(friends, search) : [null]}
        renderItem={(itemData) => {
          if (!itemData.item) return <Text>No chats yet!</Text>;
          else
            return (
              <Friend friend={itemData.item} navigation={props.navigation} />
            );
        }}
      />
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  head: {
    paddingHorizontal: 20,
  },

  searchContainer: {
    marginRight: 100,
    marginVertical: 10,
  },

  search: {
    borderRadius: 25,
  },

  friendList: {
    paddingHorizontal: 15,
    alignContent: "center",
    paddingBottom: 210,
  },

  requests: {
    backgroundColor: Theme.lighter,
    alignSelf: "flex-start",
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
  },

  requestsText: {
    fontSize: Size.small,
  },

  new: {
    color: Theme.red,
    fontSize: Size.smaller,
    marginLeft: 10,
  },
});

export default FriendsScreen;
