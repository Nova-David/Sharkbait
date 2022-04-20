import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { Input } from "./Comp";
import Theme from '../const/Colors';

const SearchIcon = (props) => {
  return (
    <Input
      {...props}
      leftAlign={props.left != undefined ? props.left : true}
      marginChange={80}
      icon="search1"
      style={styles.search}
      placeholder="Search"
      inputStyle={styles.searchInput}
    >
      <View style={styles.icon}>
        <Icon name='search1' size={25} color={Theme.darker} />
      </View>
    </Input>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SearchIcon;
