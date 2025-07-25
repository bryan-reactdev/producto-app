import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import styles from './MainScreen.styles';
import Animated, { 
  FadeInDown,
  FadeIn,
  SlideInDown
} from 'react-native-reanimated';
import { useAdminMode } from '../contexts/AdminModeContext';
import AdminToggle from '../components/AdminToggle';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function MainScreen({ navigation }) {
  const { isAdminMode, toggleAdminMode } = useAdminMode();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.statusBar} barStyle="dark-content" />
      <LinearGradient colors={COLORS.bgGradient} style={styles.gradient}>
        <View style={styles.container}>
          <Animated.View 
            style={styles.headerSection}
            entering={FadeIn.delay(200).springify()}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="cube" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.header}>Inventory Manager</Text>
            <Text style={styles.subtitle}>Manage your products with ease</Text>
          </Animated.View>

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

            {isAdminMode && (
              <AnimatedTouchable 
                entering={FadeInDown.delay(500).springify()}
                style={styles.menuButton}
                onPress={() => navigation.navigate('AddProduct')}
                activeOpacity={0.7}
              >
                <View style={styles.buttonIcon}>
                  <Ionicons name="add-circle-outline" size={32} color={COLORS.success} />
                </View>
                <View style={styles.buttonContent}>
                  <Text style={styles.menuText}>Add Product</Text>
                  <Text style={styles.menuSubtext}>Create new product entries</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
              </AnimatedTouchable>
            )}
          </View>
        </View>

        <Animated.View 
          style={styles.adminSection}
          entering={SlideInDown.delay(700).springify()}
        >
          <AdminToggle isAdminMode={isAdminMode} toggleAdminMode={toggleAdminMode} />
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
} 