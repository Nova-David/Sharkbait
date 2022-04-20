import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { H1 } from "../components/Comp";

import SafeArea from "../layouts/GeneralLayout";

const SettingsScreen = (props) => {
  return (
    <SafeArea navigation={props.navigation}>
      <View style={styles.content}>
        <H1>Settings</H1>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 10
  }
});

export default SettingsScreen;