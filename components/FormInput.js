import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { Input } from "./Comp";
import Theme from "../const/Colors";

const FormInput = (props) => {
  const [inputState, setInputState] = useState({
    valid: false,
    warn: false,
    value: "",
  });

  var timeout = useRef();

  const setState = (obj) => {
    setInputState({ ...inputState, ...obj });
  };

  const { valid, warn, value } = inputState;

  const pass = props.pass;

  useEffect(() => {
    setState({value: "", valid: false, warn: false})
  }, [pass]);

  useEffect(() => {
    clearTimeout(timeout.current);
    const val = value;
    if (val != "") {
      timeout.current = setTimeout(() => {
        setState({ warn: true });
      }, 500);
    }
  }, [value]);

  const inputChangeHandler = (text) => {
    let isValid = props.validate(text);

    if (text == "") {
      setState({
        value: text,
        valid: false,
        warn: false,
      });
    } else {
      setState({
        value: text,
        valid: isValid,
        warn: false,
      });
    }

    let val = {};
    val[props.type] = {value: text, valid: isValid};
    props.setState(val);
  };

  let iconView = null;

  if (warn && !valid) {
    iconView = (
      <View style={[styles.icon, styles.warn]}>
        <Icon name="close" size={15} color={Theme.white} />
      </View>
    );
  } else if (warn && valid) {
    iconView = (
      <View style={[styles.icon, styles.success]}>
        <Icon name="check" size={15} color={Theme.white} />
      </View>
    );
  }

  return (
    <Input
      {...props}
      value={value}
      onChangeText={inputChangeHandler}
      style={styles.input}
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

export default FormInput;
