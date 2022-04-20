import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { H1 } from "../components/Comp";

import SafeArea from "../layouts/GeneralLayout";
import { Text } from "../components/Comp";
import Theme from "../const/Colors";
import Size from "../const/Sizes";

const Category = (props) => {
  const title = props.title;

  return (
    <View style={styles.category}>
      <Text style={styles.categoryText}>{title}</Text>
    </View>
  );
};

const Sub = (props) => {
  const title = props.title;
  let tag = null;
  if (props.interested) {
    tag = (
      <View style={styles.tag}>
        <Text style={styles.subText}>{title}</Text>
      </View>
    );
  } else {
    tag = (
      <View style={styles.notag}>
        <Text style={styles.subText}>{title}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        props.onPress(title);
      }}
    >
      {tag}
    </TouchableOpacity>
  );
};

const InterestsScreen = (props) => {
  const uid = useSelector((state) => state.user.value);
  const [userInterests, setUserInterests] = useState(Array());
  const [interests, setInterests] = useState(Array());
  const [loaded, setLoaded] = useState(false);

  const toggleTag = (title) => {
    if (userInterests.includes(title)) {
      fetch("http://api.sharkbait-app.ml/interests/remove", {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
          interest: title,
        }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        const newInterests = userInterests.filter((t) => t !== title);
        setUserInterests(newInterests);
      });
    } else {
      fetch("http://api.sharkbait-app.ml/interests/add", {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
          interest: title,
        }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        const newInterests = userInterests.slice();
        newInterests.push(title);
        setUserInterests(newInterests);
      });
    }
  };

  useEffect(() => {
    fetch("http://api.sharkbait-app.ml/users/" + uid)
      .then((json) => json.json())
      .then((response) => {
        if (response.error) console.log(response);
        else {
          if (!response.interests) setUserInterests(Array());
          else setUserInterests(response.interests);
        }
      });
  }, []);

  useEffect(() => {
    fetch("http://api.sharkbait-app.ml/interests")
      .then((json) => json.json())
      .then((response) => {
        if (response.error) console.log(response);
        else formatInterests(response);
      });
  }, []);

  const formatInterests = (allInterests) => {
    let result = {};
    let category;
    let subcategory;
    for (let i = 0; i < allInterests.length; i++) {
      category = allInterests[i].category;
      subcategory = allInterests[i].subcategory;

      if (!result[category]) result[category] = [subcategory];
      else result[category].push(subcategory);
    }

    setInterests(result);
    setLoaded(true);
  };

  if (!loaded)
    return (
      <SafeArea navigation={props.navigation}>
        <View style={styles.content}>
          <H1>Interests</H1>
        </View>
      </SafeArea>
    );

  return (
    <SafeArea navigation={props.navigation}>
      <View style={styles.content}>
        <H1 style={styles.h1}>Interests</H1>
        {/* <View style={{ flex: 1 }}> */}
        <ScrollView contentContainerStyle={styles.scroll}>
          <View onStartShouldSetResponder={() => true}>
            {Object.keys(interests).map((category, ind) => (
              <View key={ind}>
                <Category title={category} />
                <View style={styles.section}>
                  {interests[category].map((sub, ind) => (
                    <Sub
                      key={ind}
                      title={sub}
                      interested={userInterests.includes(sub)}
                      onPress={toggleTag}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* </View> */}
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  content: {
    // paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1,
  },

  h1: {
    paddingHorizontal: 20,
  },

  scroll: {
    // backgroundColor: "red",
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    paddingBottom: 40,
    // flex: 1,
  },

  section: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  categoryText: {
    fontSize: Size.larger,
  },

  tag: {
    backgroundColor: Theme.accent,
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: 5,
    marginRight: 20,
    marginBottom: 20,
  },

  notag: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.accent,
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: 5,
    marginRight: 20,
    marginBottom: 20,
  },

  subText: {
    fontSize: Size.small,
  },
});

export default InterestsScreen;
