import "react-native-gesture-handler";
import React from "react";
import { Platform } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawerContent from "../components/CustomDrawerContent";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import MessagesScreen from "../screens/MessagesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import InterestsScreen from "../screens/InterestsScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import RequestsScreen from "../screens/RequestsScreen";

const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigation = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation:
            Platform.OS === ".." ? "slide_from_left" : "fade_from_bottom",
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animation:
            Platform.OS === ".." ? "slide_from_right" : "fade_from_bottom",
        }}
      />
      <Stack.Screen
        name="AppHome"
        component={MainNavigation}
        options={{
          animation:
            Platform.OS === ".." ? "slide_from_right" : "fade_from_bottom",
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          animation:
            Platform.OS === ".." ? "slide_from_right" : "fade_from_bottom",
        }}
      />

      <Stack.Screen
        name="Messages"
        component={MessagesScreen}
        options={({ route }) => ({
          animation:
            Platform.OS === ".." ? "slide_from_right" : "fade_from_bottom",
          headerShown: false,
        })}
      />

      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={({ route }) => ({
          animation:
            Platform.OS === ".." ? "slide_from_right" : "fade_from_bottom",
          headerShown: false,
        })}
      />

<Stack.Screen
        name="Requests"
        component={RequestsScreen}
        options={({ route }) => ({
          animation:
            Platform.OS === ".." ? "slide_from_right" : "fade_from_bottom",
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

const MainNavigation = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="NavHome"
        component={HomeTabs}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
          if (routeName == "Messages") return { swipeEnabled: false };
        }}
      />
      <Drawer.Screen name="Interests" component={InterestsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

const HomeTabs = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        swipeEnabled: false,
      }}
    >
      <Drawer.Screen name="HomeTab" component={HomeScreen} />
      <Drawer.Screen name="FriendsTab" component={FriendsScreen} />
    </Drawer.Navigator>
  );
};

export default AppNavigation;
