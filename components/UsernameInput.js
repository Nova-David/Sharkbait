import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { Input } from "./Comp";
import Theme from "../const/Colors";

const validateUsername = (text) => {
  //VALIDATE USERNAME FUNCTION
  return text.match(/^[a-zA-Z][\w]*([-{1}][\w]+)?$/i) !== null;
};

var timeout;

const UsernameInput = (props) => {
  const [inputState, setInputState] = useState({
    loading: false,
    valid: false,
    warn: false,
    unique: false,
    value: "",
  });

  const setState = (obj) => {
    setInputState({ ...inputState, ...obj });
  };

  const { loading, valid, warn, unique, value } = inputState;

  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const anim = useRef(
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.in(),
        useNativeDriver: true,
      })
    )
  ).current;

  useEffect(() => {
    if (loading) {
      anim.start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading]);

  useEffect(() => {
    clearTimeout(timeout);
    const user = value;
    if (valid) {
      setState({ loading: true });
      timeout = setTimeout(() => {
        fetch("http://api.sharkbait-app.ml/users/" + user)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.notfound) {
              setState({ loading: false, unique: true });
              props.setState({username: {value: user, valid: true}});
            } else {
              setState({ loading: false, unique: false, warn: true });
            }
          });
      }, 500);
    }
  }, [value, valid]);

  const inputChangeHandler = (text) => {
    let isValid = validateUsername(text);
    let warning = false;

    if (text == "") {
      setState({
        value: text,
        valid: false,
        warn: false,
        unique: false,
        loading: false,
      });
    } else {
      setState({
        value: text,
        valid: isValid,
        warn: !isValid,
        unique: false,
      });
    }

    props.setState({username: {value: text, valid: false}});
  };

  let iconView = null;

  if (warn) {
    iconView = (
      <Animated.View style={[styles.icon, styles.warn]}>
        <Icon name="close" size={15} color={Theme.white} />
      </Animated.View>
    );
  } else if (loading) {
    iconView = (
      <Animated.View style={[styles.icon, { transform: [{ rotate: spin }] }]}>
        <Icon name="loading1" size={15} color={Theme.white} />
      </Animated.View>
    );
  } else if (unique) {
    iconView = (
      <Animated.View style={[styles.icon, styles.success]}>
        <Icon name="check" size={15} color={Theme.white} />
      </Animated.View>
    );
  }

  return (
    <Input
      value={value}
      onChangeText={inputChangeHandler}
      style={styles.input}
      placeholder="Unique username"
    >
      {iconView}
    </Input>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },

  warn: {
    backgroundColor: Theme.red,
    margin: 10,
    width: 30,
  },

  success: {
    backgroundColor: Theme.green,
    margin: 10,
    width: 30,
  },
});

export default UsernameInput;
