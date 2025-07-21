// front/src/components/SuccessMessage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../StyleConstants';

export default function SuccessMessage({ message, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
    padding: SPACING.base,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.textSuccess,
  },
  text: {
    color: COLORS.textSuccess,
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
}); 