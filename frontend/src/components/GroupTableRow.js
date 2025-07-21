// frontend/src/components/GroupTableRow.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';

export const GroupTableRow = ({ group, onPress }) => {
  if (!group) return null;
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(group)}>
      <View style={styles.iconCell}>
        <Ionicons name="albums-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.infoCell}>
        <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
        <Text style={styles.groupId}>ID: {group.id}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    padding: SPACING.sm,
    ...SHADOWS.sm,
  },
  iconCell: {
    marginRight: SPACING.sm,
  },
  infoCell: {
    flex: 1,
  },
  groupName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  groupId: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.muted,
  },
}); 