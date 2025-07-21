// front/src/components/ErrorMessage.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../StyleConstants';

export default function ErrorMessage({ message, onRetry, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
    padding: SPACING.base,
    backgroundColor: COLORS.backgroundPrimary,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.textDelete,
  },
  text: {
    color: COLORS.textDelete,
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: COLORS.textDelete,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.xs,
  },
  retryText: {
    color: COLORS.textPrimaryContrast,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },
}); 