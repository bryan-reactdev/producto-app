import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBarcodeDownload } from '../hooks/useBarcodeDownload';
import { useProductAPI } from '../hooks/useProductAPI';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeInUp,
  FadeOut,
  Layout,
  Easing
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export const ProductCard = ({ product, onImagePress, onProductDeleted }) => {
  const { downloading, downloadBarcode, getBarcodeUrl } = useBarcodeDownload();
  const { loading, deleteProduct } = useProductAPI();
  
  // Animation values - only keep delete rotation
  const deleteRotate = useSharedValue(0);
  
  if (!product) return null;

  const barcodeImageUrl = getBarcodeUrl(product.id, 'print');

  const handleDownloadBarcode = () => {
    downloadBarcode(product.id, product.name);
  };

  const handleDeleteProduct = () => {
    // Trigger delete animation
    deleteRotate.value = withSequence(
      withTiming(-0.1, { duration: 100 }),
      withSpring(0.1, { damping: 3 }),
      withSpring(-0.1, { damping: 3 }),
      withSpring(0, { damping: 3 })
    );

    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              if (onProductDeleted) {
                onProductDeleted(product.id);
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  // Only keep delete animation style
  const deleteAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${deleteRotate.value}rad` }]
  }));

  const handleImagePress = () => {
    onImagePress({ uri: product.image_url });
  };

  return (
    <Animated.View 
      style={styles.card}
      entering={FadeInUp.springify().damping(15)}
      exiting={FadeOut}
    >
      {product.image_url && (
        <AnimatedTouchable 
          onPress={handleImagePress}
          style={styles.imageContainer}
        >
          <AnimatedImage source={{ uri: product.image_url }} style={styles.productImage} resizeMode="cover" />
          <Animated.View 
            style={styles.imageOverlay}
            entering={FadeInUp.delay(200)}
          >
            <Ionicons name="expand-outline" size={19} color="#fff" />
          </Animated.View>
        </AnimatedTouchable>
      )}
      
      <Animated.Text 
        style={styles.productName}
        entering={FadeInUp.delay(100)}
      >
        {product.name}
      </Animated.Text>
      
      <Animated.Text 
        style={styles.productPrice}
        entering={FadeInUp.delay(200)}
      >
        ${Number(product.price).toFixed(2)}
      </Animated.Text>
      
      <Animated.View 
        style={styles.barcodeSection}
        entering={FadeInUp.delay(300)}
      >
        <View style={styles.barcodeContainer}>
          <AnimatedImage 
            source={{ uri: barcodeImageUrl }} 
            style={styles.barcodeImage} 
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.actionButtons}>
          <AnimatedTouchable 
            style={styles.downloadBtn}
            onPress={handleDownloadBarcode}
            disabled={downloading || loading}
          >
            <Ionicons 
              name={downloading ? "hourglass-outline" : "download-outline"} 
              size={14} 
              color={COLORS.card} 
              style={{ marginRight: 4 }} 
            />
            <Text style={styles.downloadBtnText}>
              {!downloading && 'Barcode'}
            </Text>
          </AnimatedTouchable>
          
          <AnimatedTouchable 
            style={[styles.deleteBtn, deleteAnimStyle]}
            onPress={handleDeleteProduct}
            disabled={loading}
          >
            <Ionicons 
              name={loading ? "hourglass-outline" : "trash-outline"} 
              size={16} 
              color={COLORS.card} 
            />
          </AnimatedTouchable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: SPACING.xs,
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#eee',
  },
  imageOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BORDER_RADIUS.md,
    padding: 2,
  },
  productName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    marginBottom: 2,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primary,
    marginBottom: 2,
    textAlign: 'center',
  },
  barcodeSection: {
    alignItems: 'center',
    marginTop: 2,
    width: '100%',
  },
  barcodeContainer: {
    marginBottom: 2,
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.sm,
    padding: 0,
  },
  barcodeImage: {
    width: 120,
    height: 32,
    backgroundColor: 'transparent',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 2,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
    flex: 1,
    marginRight: 6,
    ...SHADOWS.sm,
    elevation: 2,
  },
  downloadBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.card,
    textAlign: 'center',
  },
  deleteBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    padding: 8,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: 6,
    ...SHADOWS.sm,
    elevation: 2,
  },
}); 