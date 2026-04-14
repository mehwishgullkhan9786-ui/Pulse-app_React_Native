import { Tabs } from "expo-router";
import React from "react";
import { CustomTabBar } from "@/components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="pulse" />
      <Tabs.Screen name="Feeds" />
      <Tabs.Screen name="weathers" />
      <Tabs.Screen name="CRUD" />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
}
