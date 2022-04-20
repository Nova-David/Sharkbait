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
  const [friends, setFriends] = useState({});
  const [requests, setRequests] = useState({});
  const [repeater, setRepeater] = useState(0);
  const [userInfo, setUserInfo] = useState();

  const uid = useSelector((state) => state.user.value);
  
  useEffect(() => {
    fetch("http://api.sharkbait-app.ml/users/" + uid)
      .then(json => json.json())
      .then(response => {
        setUserInfo(response);
      })
  }, [])

  useEffect(() => {
    console.log("...fetching", repeater);
    fetch("http://api.sharkbait-app.ml/users/" + uid + "/friends")
      .then((json) => {
        return json.json();
      })
      .then((response) => {
        setFriends(response.friends);
        setRequests(response.requests);
      });

    setTimeout(() => setRepeater(prevState => prevState + 1), 10000);
  }, [repeater]);

  return (
    <SafeArea navigation={props.navigation} inverse={true} userInfo={userInfo}>
      <View style={styles.head}>
        <View style={styles.searchContainer}>
          <SearchIcon value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          props.navigation.navigate("Requests", requests);
        }}>
          <View style={styles.requests}>
            <Text style={styles.requestsText}>Requests</Text>
            {Object.values(requests).length > 0 ? <Text style={styles.new}>{Object.values(requests).length} new</Text> : null}
          </View>
        </TouchableOpacity>
        <H1 style={styles.h1}>Friends</H1>
      </View>
      <FlatList
        columnWrapperStyle={{ justifyContent: "space-around" }}
        numColumns={3}
        contentContainerStyle={styles.friendList}
        keyExtractor={(item) => item.uid}
        data={Object.values(friends).filter((friend) =>
          friend.displayname.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={(itemData) => (
          <Friend friend={itemData.item} navigation={props.navigation} />
        )}
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
