import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Platform, 
  SafeAreaView,
  RefreshControl,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProductCard } from '../components/ProductCard';
import ImageViewing from 'react-native-image-viewing';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';
import styles from './ProductsListScreen.styles';
import { getErrorMessage, handleImagePress, handleImageModalClose } from '../utils/errorHandling';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
  SlideInRight,
  Easing
} from 'react-native-reanimated';

// API base URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.3.12:3000';
const API_BASE = `${API_URL}/api`;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function ProductsListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  const [search, setSearch] = useState('');

  // Image modal handlers
  const openImageModal = handleImagePress(setModalImageSource, setImageModalVisible);
  const closeImageModal = handleImageModalClose(setModalImageSource, setImageModalVisible);

  // Animation values
  const searchBarTranslateY = useSharedValue(-50);
  const fabScale = useSharedValue(1);

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch products');
      }
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProducts().finally(() => {
      setLoading(false);
      // Start entrance animations
      searchBarTranslateY.value = withSpring(0, { damping: 15 });
    });
  }, []);

  // Animated styles
  const searchBarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: searchBarTranslateY.value }]
  }));

  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }]
  }));

  // Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(search.toLowerCase()))
  );

  const renderProduct = ({ item, index }) => (
    <View style={{ flex: 1, marginHorizontal: 4 }}>
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <View style={styles.productItem}>
        <ProductCard 
          product={item} 
          onImagePress={openImageModal}
          onProductDeleted={(deletedProductId) => {
            setProducts(prevProducts => 
              prevProducts.filter(product => product.id !== deletedProductId)
            );
          }}
        />
      </View>
    </Animated.View>
    </View>
  );

  const renderEmptyState = () => (
    <Animated.View 
      style={styles.emptyContainer}
      entering={FadeIn.delay(500).springify()}
    >
      <Ionicons name="cube-outline" size={64} color={COLORS.muted} />
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        Start by adding products or scanning barcodes
      </Text>
      <AnimatedTouchable 
        style={styles.addFirstButton}
        onPress={() => navigation.navigate('AddProduct')}
        entering={FadeInDown.delay(800)}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.addFirstButtonText}>Add Your First Product</Text>
      </AnimatedTouchable>
    </Animated.View>
  );

  const renderErrorState = () => (
    <Animated.View 
      style={styles.errorContainer}
      entering={FadeIn.delay(300)}
    >
      <Ionicons name="alert-circle-outline" size={51} color={COLORS.error} />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorText}>{error}</Text>
      <AnimatedTouchable 
        style={styles.retryButton}
        onPress={fetchProducts}
        entering={FadeInDown.delay(500)}
      >
        <Ionicons name="refresh" size={16} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </AnimatedTouchable>
    </Animated.View>
  );

  // Header with icon and title
  const Header = () => (
    <Animated.View 
      style={styles.header}
      entering={FadeIn.delay(100).springify()}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
      </TouchableOpacity>
      <Ionicons name="list-outline" size={28} color={COLORS.primary} style={{ marginRight: 12 }} />
      <Text style={styles.headerTitle}>All Products</Text>
      <View style={styles.headerRight}>
        <Text style={styles.productCount}>{filteredProducts.length} products</Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={COLORS.bgGradient} style={styles.gradient}>
        <Header />
        {/* Search Bar */}
        <Animated.View style={[styles.searchBarContainer, searchBarAnimStyle]}>
          <Ionicons name="search" size={16} color={COLORS.muted} style={{ marginRight: 8 }} />
          <AnimatedTextInput
            style={styles.searchBar}
            placeholder="Search by name or barcode..."
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </Animated.View>
        <View style={styles.container}>
          {loading ? (
            <Animated.View 
              style={styles.loadingContainer}
              entering={FadeIn}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading products...</Text>
            </Animated.View>
          ) : error ? (
            renderErrorState()
          ) : (
            <AnimatedFlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.listContainer}
              columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 8 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
              ListEmptyComponent={renderEmptyState}
              entering={FadeIn}
            />
          )}
        </View>
        {/* Floating Add Button */}
        <AnimatedTouchable
          style={[styles.fab, fabAnimStyle]}
          onPress={() => navigation.navigate('AddProduct')}
          entering={SlideInRight.delay(1000).springify()}
          onPressIn={() => {
            fabScale.value = withSpring(0.9);
          }}
          onPressOut={() => {
            fabScale.value = withSpring(1);
          }}
        >
          <Ionicons name="add" size={25} color={COLORS.card} />
        </AnimatedTouchable>
        {/* Image Modal */}
        {imageModalVisible && modalImageSource && modalImageSource.uri && (
          <ImageViewing
            images={[{ uri: modalImageSource.uri }]}
            imageIndex={0}
          visible={imageModalVisible}
            key={modalImageSource.uri}
            onRequestClose={closeImageModal}
        />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
} 