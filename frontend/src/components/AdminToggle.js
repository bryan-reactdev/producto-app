import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function AdminToggle({ isAdminMode, toggleAdminMode }) {
  const anim = useRef(new Animated.Value(isAdminMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isAdminMode ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isAdminMode]);

  const thumbLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 30],
  });
  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0eafc', 'rgba(67, 160, 71, 0.22)'],
  });
  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.muted, COLORS.success],
  });

  return (
    <TouchableOpacity
      style={styles.toggleContainer}
      onPress={toggleAdminMode}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{ checked: isAdminMode }}
    >
      <Animated.View style={[styles.toggleTrack, { backgroundColor: trackBg, borderColor }]}> 
        <Animated.View style={[styles.toggleThumb, { left: thumbLeft, backgroundColor: isAdminMode ? COLORS.success : '#fff', borderColor: isAdminMode ? COLORS.success : '#ddd', shadowOpacity: isAdminMode ? 0.18 : 0.08 }]}> 
          <Ionicons
            name={isAdminMode ? 'shield-checkmark' : 'shield-outline'}
            size={20}
            color={isAdminMode ? '#fff' : COLORS.muted}
          />
        </Animated.View>
      </Animated.View>
      <View style={styles.labelRow}>
        <Text style={[styles.toggleLabel, isAdminMode && styles.labelOn]}>Admin Mode</Text>
        {isAdminMode && (
          <View style={styles.onBadge}>
            <Text style={styles.onBadgeText}>ON</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  toggleTrack: {
    width: 56,
    height: 32,
    borderRadius: 18,
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    backgroundColor: '#e0eafc',
    borderColor: COLORS.muted,
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    top: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  labelOn: {
    color: COLORS.success,
  },
  onBadge: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
  },
  onBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
  },
}); 