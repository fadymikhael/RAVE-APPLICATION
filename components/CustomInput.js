import React from "react";
import { TextInput, StyleSheet } from "react-native";

// CUSTOM INPUT COMPONENT FOR CONSISTENT TEXT INPUT STYLING
export default function CustomInput({ style, ...props }) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#5a6473"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f3f5fa",
    borderRadius: 16,
    padding: 12,
    fontSize: 16,
    borderWidth: 0,
    marginVertical: 8,
    color: "#222",
  },
});
