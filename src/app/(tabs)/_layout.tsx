import { Tabs } from "expo-router";
import { DollarSign, House } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 16,
          right: 16,
          elevation: 0,
          backgroundColor: "#fff",
          borderRadius: 24,
          height: 60,
          ...Platform.select({
            android: { elevation: 5 },
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <House color={focused ? "#3B82F6" : "#999"} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions/index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <DollarSign color={focused ? "#3B82F6" : "#999"} />
          ),
        }}
      />
    </Tabs>
  );
}
