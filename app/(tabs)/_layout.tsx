import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00E5FF",
        tabBarInactiveTintColor: "#8A8D9F",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0C101A",
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.05)",
          height: Platform.OS === "ios" ? 88 : 70,
          paddingBottom: Platform.OS === "ios" ? 30 : 12,
          paddingTop: 12,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialCommunityIcons 
                name={focused ? "home" : "home-outline"} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pulse"
        options={{
          title: "PULSE",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialCommunityIcons 
                name={focused ? "heart-pulse" : "heart-outline"} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Feeds"
        options={{
          title: "FEEDS",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialCommunityIcons 
                name={focused ? "rss" : "rss-box"} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="weathers"
        options={{
          title: "WEATHER",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialCommunityIcons 
                name={focused ? "weather-cloudy" : "weather-partly-cloudy"} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialCommunityIcons 
                name={focused ? "account" : "account-outline"} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});
