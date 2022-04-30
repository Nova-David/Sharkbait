import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SafeArea from "../layouts/EmptyLayout";
import Icon from "react-native-vector-icons/AntDesign";

import { Button, Text, Input } from "../components/Comp";
import ChatTitle from "../components/ChatTitle";
import Size from "../const/Sizes";
import Theme from "../const/Colors";

const SearchScreen = (props) => {
  const [user, setUser] = useState("");
  const [notFound, setNotFound] = useState(false);

  const searchHandler = () => {
    /* Find user typed in text input, navigate to their profile if found */
    if (user != "") {
      fetch("http://api.sharkbait-app.ml/users/" + user.toLowerCase())
        .then((json) => json.json())
        .then((response) => {
          if (response.error || response.notfound) setNotFound(true);
          else {
            props.navigation.navigate('Profile', response);
          }
        });
    }
  };

  return (
    <SafeArea>
      <ChatTitle navigation={props.navigation} name="Find a User" />
      <View style={styles.screen}>
        <Input
          placeholder="Enter a username to find..."
          value={user}
          style={styles.input}
          inputStyle={styles.inputText}
          onChangeText={(text) => {
            setUser(text);
            setNotFound(false);
          }}
        ><View style={styles.icon}>
        <Icon name='search1' size={30} color={Theme.darker} />
      </View></Input>
        {notFound && <Text style={styles.warn}>User not found...</Text>}
        <Button title="Search" style={styles.button} onPress={searchHandler} />
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 80,
    // justifyContent: 'center',
    alignItems: "center",
    paddingHorizontal: 20,
  },

  input: {
    padding: 5
  },

  warn: {
    fontSize: Size.small,
    color: Theme.red,
    marginTop: 10,
  },

  button: {
    width: 200,
    marginTop: 20,
    padding: 15,
  },

  icon: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SearchScreen;
