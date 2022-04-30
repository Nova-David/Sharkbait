import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import SafeArea from "../layouts/SafeArea";
import { Text, Button, Input, Link, HR, H1 } from "../components/Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import FormInput from "../components/FormInput";
import UsernameInput from "../components/UsernameInput";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/userReducer";

const initialProps = { value: "", valid: false };

const RegisterScreen = (props) => {
  /* Keeps track of all inputs */
  const [inputState, setInputState] = useState({
    username: initialProps,
    displayname: initialProps,
    password: initialProps,
    passwordcheck: initialProps,
  });

  const { username, displayname, password, passwordCheck } = inputState;
  const userState = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userState != null) props.navigation.replace("AppHome");
  }, [userState]);

  const setState = (obj) => {
    setInputState({ ...inputState, ...obj });
  };

  const displaynameHandler = (text) => {
    //Display name validate
    return true;
  };

  const passwordHandler = (text) => {
    //Password validate
    return (
      text.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#<>?!@$%^&*-]).{8,}$/
      ) !== null
    );
  };

  const passwordCheckHandler = (text) => {
    //Password check validate
    return text == password.value;
  };

  const checkAllValid = useCallback(() => {
    for (const key in inputState) {
      if (!inputState[key].valid) return false;
    }
    return true;
  }, [inputState]);

  const errorHandler = (msg) => {
    //Error here
    console.log(msg);
  };

  const registerHandler = () => {
    /* Register */
    if (checkAllValid()) {
      const data = {
        uid: username.value,
        displayname: displayname.value,
        password: password.value,
      };

      fetch("http://api.sharkbait-app.ml/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
        .then((json) => {
          return json.json();
        })
        .then((response) => {
          if (response.success) {
            dispatch(
              login({ uid: data.uid.toLowerCase(), password: data.password })
            );
          } else errorHandler(response.error);
        });
    } else console.log("Not valid yet");
  };

  return (
    <SafeArea>
      <View style={styles.content}>
        <View style={styles.header}>
          <H1 style={{ paddingRight: "40%" }}>Create your account</H1>
          <HR />
        </View>
        <View style={styles.formContainer}>
          <ScrollView contentContainerStyle={styles.form}>
            <View onStartShouldSetResponder={() => true}>
              <Text style={styles.label}>Enter a unique username:</Text>
              <UsernameInput setState={setState} />
              <Text style={styles.label}>Enter a display name:</Text>
              <FormInput
                placeholder="Display name"
                type="displayname"
                setState={setState}
                validate={displaynameHandler}
              />
              <Text style={styles.label}>Enter a password:</Text>
              <FormInput
                secureTextEntry={true}
                type="password"
                placeholder="Password"
                setState={setState}
                validate={passwordHandler}
              />
              <Text style={styles.label}>Enter password again:</Text>
              <FormInput
                secureTextEntry={true}
                type="passwordcheck"
                placeholder="Password"
                pass={password.value}
                setState={setState}
                validate={passwordCheckHandler}
              />
            </View>
          </ScrollView>
        </View>
        <Button
          style={styles.registerButton}
          title="Sign Up"
          onPress={registerHandler}
        />
        <Link
          style={styles.link}
          textStyle={styles.linkText}
          onPress={() => {
            props.navigation.replace("Login");
          }}
        >
          Tap here to sign in
        </Link>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 80,
    flex: 1,
    paddingBottom: 20,
    alignItems: "center",
  },

  header: {
    width: "100%",
    paddingHorizontal: 20,
  },

  formContainer: {
    flex: 1,
    width: "100%",
  },

  form: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "center",
  },

  label: {
    marginTop: 20,
    fontSize: Size.small,
  },

  input: {
    marginTop: 5,
  },

  registerButton: {
    width: "60%",
    marginTop: 40,
  },

  link: {
    marginTop: 10,
    width: "100%",
  },

  linkText: {
    fontSize: Size.small,
  },
});

export default RegisterScreen;
