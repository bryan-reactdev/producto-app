import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';
import styles from './MainScreen.styles';
import Animated, { 
  FadeInDown,
  FadeIn
} from 'react-native-reanimated';
import { API_URL } from '../utils/apiConfig';
import { useAdminMode } from '../contexts/AdminModeContext';
import AdminToggle from '../components/AdminToggle';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function MainScreen({ navigation }) {
  const { isAdminMode, toggleAdminMode } = useAdminMode();

  // Helper for admin button style
  const adminButtonStyle = [
    styles.menuButton,
    isAdminMode && {
      backgroundColor: 'rgba(67, 160, 71, 0.15)',
      borderColor: 'rgba(67, 160, 71, 0.5)',
      borderWidth: 1.5,
      elevation: 0, // Remove Android shadow
    },
  ];
  const adminIconStyle = [
    styles.buttonIcon,
    isAdminMode && { backgroundColor: 'rgba(67, 160, 71, 0.25)' },
  ];
  const adminTextStyle = [styles.menuText, isAdminMode && { color: COLORS.success }];

  return (
    <LinearGradient colors={COLORS.bgGradient} style={styles.gradient}>
      <View style={styles.container}>
        <Animated.View 
          style={styles.headerSection}
          entering={FadeIn.delay(200).springify()}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="cube" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.header}>ProductoApp</Text>
          <Text style={styles.subtitle}>Manage your products with ease</Text>
        </Animated.View>

        <AdminToggle isAdminMode={isAdminMode} toggleAdminMode={toggleAdminMode} />

        <View style={styles.menuSection}>
          <AnimatedTouchable 
            entering={FadeInDown.delay(300).springify()}
            style={styles.menuButton}
            onPress={() => navigation.navigate('Scan')}
            activeOpacity={0.7}
          >
            <View style={styles.buttonIcon}>
              <Ionicons name="barcode-outline" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.menuText}>Scan Product</Text>
              <Text style={styles.menuSubtext}>Scan barcodes to find products</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
          </AnimatedTouchable>

          <AnimatedTouchable 
            entering={FadeInDown.delay(400).springify()}
            style={[styles.menuButton, !isAdminMode && { opacity: 0, position: 'absolute', width: '100%' }]}
            onPress={isAdminMode ? () => navigation.navigate('AddProduct') : undefined}
            activeOpacity={0.7}
            disabled={!isAdminMode}
            pointerEvents={isAdminMode ? 'auto' : 'none'}
          >
            <View style={styles.buttonIcon}>
              <MaterialIcons name="add-box" size={32} color={COLORS.success} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.menuText}>Add Product</Text>
              <Text style={styles.menuSubtext}>Create new product entries</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
          </AnimatedTouchable>

          <AnimatedTouchable 
            entering={FadeInDown.delay(500).springify()}
            style={styles.menuButton}
            onPress={() => navigation.navigate('ProductsList')}
            activeOpacity={0.7}
          >
            <View style={styles.buttonIcon}>
              <Ionicons name="list-outline" size={32} color={COLORS.accent} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.menuText}>View All Products</Text>
              <Text style={styles.menuSubtext}>Browse your product catalog</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
          </AnimatedTouchable>
        </View>
      </View>
    </LinearGradient>
  );
} 