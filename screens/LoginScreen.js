import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import SafeArea from "../layouts/SafeArea";
import { Text, Button, Input, Link } from "../components/Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";
import Logo from "../assets/Logo";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/userReducer";

const LoginScreen = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user.value);

  const errorHandler = () => {
    setError(true);
  };

  const errorMsg = error ? <Text style={styles.warning}>Incorrect username/password</Text> : null;

  const loginHandler = () => {
    /* Login */
    
    if (username != "" && password != "") {
      const data = {
        uid: username,
        password: password,
      };

      fetch("http://api.sharkbait-app.ml/verify", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
        .then((json) => json.json())
        .then((response) => {
          if (response.valid) dispatch(login(username.toLowerCase()));
          else errorHandler();
        });
    } else {
      console.log("invalid login");
    }
  };

  useEffect(() => {
    if (userState != null) props.navigation.replace("AppHome");
  }, [userState]);

  return (
    <SafeArea>
      <View style={styles.content}>
        <Logo width={"100%"} height={50} fill={Theme.accent} />
        <Text style={styles.title}>SharkBait</Text>
        <View style={styles.formContainer}>
          <Input
            style={styles.input}
            placeholder="Username"
            animate={true}
            value={username}
            onChangeText={text => {setUsername(text); setError(false)}}
          />
          <Input
            style={styles.input}
            secureTextEntry={true}
            placeholder="Password"
            animate={true}
            value={password}
            onChangeText={text => {setPassword(text); setError(false)}}
          />
        </View>
        {errorMsg}
        <Button
          style={styles.loginButton}
          title="Login"
          onPress={loginHandler}
        />
        <Link
          style={styles.link}
          textStyle={styles.linkText}
          onPress={() => {
            props.navigation.replace("Register");
          }}
        >
          Tap here to create a new account
        </Link>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
    flex: 1,
    paddingBottom: 20,
  },

  title: {
    fontSize: Size.header,
    marginTop: 5,
    marginBottom: 20,
    textAlign: "center",
  },

  formContainer: {
    width: "100%",
    justifyContent: "center",
    paddingBottom: 20,
  },

  input: {
    marginTop: 20,
  },

  loginButton: {
    marginTop: 40,
    width: "60%",
  },

  link: {
    marginTop: 10,
    width: "70%",
  },

  linkText: {
    fontSize: Size.small,
  },

  warning: {
    color: Theme.red,
    fontSize: Size.small,
  }
});

export default LoginScreen;
