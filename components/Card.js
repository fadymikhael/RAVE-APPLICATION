import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#1976d2",
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginVertical: 12,
    marginHorizontal: 6,
    borderWidth: 0.3,
    borderColor: '#dbeafe',
  }
});
