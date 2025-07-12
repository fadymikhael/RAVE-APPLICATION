import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import RaveScreen from '../screens/RaveScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1976d2",
        tabBarInactiveTintColor: "#8ba0b9",
        tabBarStyle: {
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 62,
          backgroundColor: "#fff",
          position: 'absolute',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          if (route.name === "Record") iconName = "mic";
          if (route.name === "RAVE") iconName = "sparkles";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="RAVE" component={RaveScreen} />
    </Tab.Navigator>
  );
}
