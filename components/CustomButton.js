import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({
  title,
  onPress,
  color = "#1976d2",
  style,
  textColor = "#fff",
  ...props
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={onPress}
      {...props}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 4,
    elevation: 2,
    minWidth: 70,
    maxWidth: 140,
    shadowColor: "#1976d2",
    shadowOpacity: 0.10,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  text: {
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
    textAlign: 'center',
  }
});
