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
  TextInput,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProductTableRow } from '../components/ProductTableRow';
import ImageViewing from 'react-native-image-viewing';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';
import styles from './ProductsListScreen.styles';
import { getErrorMessage, handleImagePress, handleImageModalClose } from '../utils/errorHandling';
import { API_BASE } from '../utils/apiConfig';
import { useAdminMode } from '../contexts/AdminModeContext';
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
import { useFocusEffect } from '@react-navigation/native';
import { GroupTableRow } from '../components/GroupTableRow';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function ProductsListScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  const [search, setSearch] = useState('');
  const { isAdminMode } = useAdminMode();

  // Image modal handlers
  const openImageModal = handleImagePress(setModalImageSource, setImageModalVisible);
  const closeImageModal = handleImageModalClose(setModalImageSource, setImageModalVisible);

  // Animation values
  const searchBarTranslateY = useSharedValue(-50);
  const fabScale = useSharedValue(1);

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${API_BASE}/groups`);
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch groups');
      }
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for a group
  const fetchProducts = async (groupId) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${API_BASE}/groups/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch products');
      }
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch groups
  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
      searchBarTranslateY.value = withSpring(0, { damping: 15 });
    }, [])
  );

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedGroup) {
      await fetchProducts(selectedGroup.id);
    } else {
      await fetchGroups();
    }
    setRefreshing(false);
  };

  // Animated styles
  const searchBarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: searchBarTranslateY.value }]
  }));
  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }]
  }));

  // Filtered products by search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(search.toLowerCase()))
  );

  // Render group row
  const renderGroup = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <GroupTableRow group={item} onPress={(group) => {
        setSelectedGroup(group);
        fetchProducts(group.id);
      }} />
    </Animated.View>
  );

  // Render product row
  const renderProduct = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <ProductTableRow 
        product={item} 
        onImagePress={openImageModal}
        onProductDeleted={(deletedProductId) => {
          setProducts(prevProducts => 
            prevProducts.filter(product => product.id !== deletedProductId)
          );
        }}
        isAdminMode={isAdminMode}
      />
    </Animated.View>
  );

  // Header with icon and title
  const Header = () => (
    <Animated.View 
      style={styles.header}
      entering={FadeIn.delay(100).springify()}
    >
      {selectedGroup ? (
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedGroup(null)}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      ) : null}
      
      <Ionicons name={selectedGroup ? "cube-outline" : "albums-outline"} size={28} color={COLORS.primary} style={{ marginRight: 12 }} />
      <Text style={styles.headerTitle}>{selectedGroup ? selectedGroup.name : 'All Groups'}</Text>
      <View style={styles.headerRight}>
        <Text style={styles.productCount}>
          {selectedGroup ? `${filteredProducts.length} products` : `${groups.length} groups`}
        </Text>
      </View>
    </Animated.View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <Animated.View 
      style={styles.emptyContainer}
      entering={FadeIn.delay(500).springify()}
    >
      <Ionicons name={selectedGroup ? "cube-outline" : "albums-outline"} size={64} color={COLORS.muted} />
      <Text style={styles.emptyTitle}>{selectedGroup ? 'No Products Found' : 'No Groups Found'}</Text>
      <Text style={styles.emptySubtitle}>
        {selectedGroup ? 'No products in this group yet.' : 'Start by adding a group.'}
      </Text>
    </Animated.View>
  );

  // Render error state
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
        onPress={selectedGroup ? () => fetchProducts(selectedGroup.id) : fetchGroups}
        entering={FadeInDown.delay(500)}
      >
        <Ionicons name="refresh" size={16} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </AnimatedTouchable>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.statusBar} barStyle="dark-content" />
      <LinearGradient colors={COLORS.bgGradient} style={styles.gradient}>
        <Header />
        {/* Search Bar: only show when viewing products */}
        {selectedGroup && (
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
        )}
        <View style={styles.container}>
          {loading ? (
            <Animated.View 
              style={styles.loadingContainer}
              entering={FadeIn}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>{selectedGroup ? 'Loading products...' : 'Loading groups...'}</Text>
            </Animated.View>
          ) : error ? (
            renderErrorState()
          ) : selectedGroup ? (
            <AnimatedFlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
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
          ) : (
            <AnimatedFlatList
              data={groups}
              renderItem={renderGroup}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
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
        {/* Floating Add Button - Only show in admin mode and when viewing products */}
        {isAdminMode && selectedGroup && (
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
        )}
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