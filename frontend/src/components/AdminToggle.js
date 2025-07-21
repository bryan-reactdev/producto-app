import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '../constants/colors';

export default function AdminToggle({ isAdminMode, toggleAdminMode }) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isAdminMode && styles.containerActive
      ]}
      onPress={toggleAdminMode}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={isAdminMode ? "shield" : "shield-outline"} 
          size={14} 
          color={isAdminMode ? COLORS.success : COLORS.muted} 
        />
      </View>
      <Text style={[
        styles.text,
        isAdminMode && styles.textActive
      ]}>
        Admin {isAdminMode ? 'On' : 'Off'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    ...SHADOWS.small,
  },
  containerActive: {
    backgroundColor: 'rgba(67, 160, 71, 0.1)',
    borderColor: 'rgba(67, 160, 71, 0.3)',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.muted,
    fontWeight: '500',
  },
  textActive: {
    color: COLORS.success,
  },
}); 