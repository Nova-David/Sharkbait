import React, { memo, useRef } from "react";
import {
  View,
  Text as ReactText,
  TextInput,
  Pressable as ReactButton,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

import Theme from "../const/Colors";
import Size from "../const/Sizes";

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export const Text = (props) => {
  return (
    <ReactText {...props} style={{ ...styles.text, ...props.style }}>
      {props.children}
    </ReactText>
  );
};

export const Input = (props) => {
  const marginToChange = props.marginChange ? props.marginChange : 10;

  const progress = useRef(new Animated.Value(marginToChange)).current;
  const animatedMargin = props.leftAlign
    ? { marginRight: progress }
    : { marginHorizontal: progress };

  const inputFocusHandler = () => {
    Animated.spring(progress, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    if (props.onFocus) props.onFocus();
  };

  const inputBlurHandler = () => {
    Animated.spring(progress, {
      toValue: marginToChange,
      useNativeDriver: false,
    }).start();
  };

  const childInput = useRef();

  return (
    <TouchableWithoutFeedback onPress={() => childInput.current.focus()}>
      <Animated.View
        style={[{ ...styles.inputContainer, ...props.style }, animatedMargin]}
      >
        <TextInput
          {...props}
          ref={childInput}
          children={null}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
          placeholderTextColor={props.color ? props.color : Theme.darker}
          style={{ ...styles.input, ...props.inputStyle }}
        />
        {props.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const Button = (props) => {
  return (
    <ReactButton {...props} style={{ ...styles.button, ...props.style }}>
      <Text style={{ ...styles.buttonText, ...props.textStyle }}>
        {props.title}
      </Text>
    </ReactButton>
  );
};

export const Link = (props) => {
  return (
    <ReactButton {...props} style={{ ...styles.link, ...props.style }}>
      <Text
        style={{
          ...styles.linkText,
          ...props.textStyle,
        }}
      >
        {props.children}
      </Text>
    </ReactButton>
  );
};

export const HR = (props) => {
  return <View style={{ ...styles.HR, ...props.style }}></View>;
};

export const H1 = (props) => {
  return (
    <Text {...props} style={{ ...styles.h1, ...props.style }}>
      {props.children}
    </Text>
  );
};

export const Search = (props) => {
  return <Input {...props} style={{ ...styles.input, ...props.style }} />;
};

const styles = StyleSheet.create({
  text: {
    color: Theme.white,
    fontSize: Size.regular,
  },

  inputContainer: {
    flexDirection: "row",
    backgroundColor: Theme.lighter,
    borderRadius: 35,
    // borderColor: Theme.accent,
  },

  input: {
    backgroundColor: "transparent",
    flex: 1,
    marginRight: 0,
    color: Theme.white,
    // borderRadius: 35,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: Size.regular,
    width: "100%",
  },

  button: {
    backgroundColor: Theme.accent,
    color: Theme.white,
    borderRadius: 35,
    padding: 10,
    width: "100%",
  },

  buttonText: {
    textAlign: "center",
  },

  link: {
    width: "100%",
  },

  linkText: {
    color: Theme.accent,
    textAlign: "center",
  },

  HR: {
    borderBottomWidth: 2,
    borderBottomColor: Theme.lighter,
    width: "100%",
    marginTop: 10,
  },

  h1: {
    color: Theme.lighter,
    fontSize: Size.header,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});