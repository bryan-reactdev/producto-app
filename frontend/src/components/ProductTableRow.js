import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductAPI } from '../hooks/useProductAPI';
import { useBarcodeDownload } from '../hooks/useBarcodeDownload';
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

export const ProductTableRow = ({ product, onImagePress, onProductDeleted, isAdminMode = false }) => {
  const { loading, deleteProduct } = useProductAPI();
  const { downloading, downloadBarcode } = useBarcodeDownload();
  const deleteRotate = useSharedValue(0);
  
  const handleDeleteProduct = () => {
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

  const handleDownloadBarcode = () => {
    downloadBarcode(product.id, product.name);
  };

  const deleteAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${deleteRotate.value}rad` }]
  }));

  const handleImagePress = () => {
    onImagePress({ uri: product.image_url });
  };

  return (
    <Animated.View 
      style={styles.row}
      entering={FadeInUp.springify().damping(15)}
      exiting={FadeOut}
      layout={Layout.springify()}
    >
      <TouchableOpacity 
        style={styles.imageCell}
        onPress={handleImagePress}
      >
        {product.image_url ? (
          <Image 
            source={{ uri: product.image_url }} 
            style={styles.productImage} 
            resizeMode="cover" 
          />
        ) : (
          <View style={styles.noImage}>
            <Ionicons name="image-outline" size={20} color={COLORS.muted} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.infoCell}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        {/* Product Group */}
        <Text style={styles.productGroup} numberOfLines={1}>
          {product.product_group?.name || (product.product_group?.id ? `Group #${product.product_group_id}` : 'No Group')}
        </Text>
        <Text style={styles.productPrice}>
          ${Number(product.price).toFixed(2)}
        </Text>
        <View style={styles.barcodeRow}>
          <Ionicons name="barcode-outline" size={12} color={COLORS.muted} style={{ marginRight: 2 }} />
          <Text style={styles.barcodeText}>{product.barcode}</Text>
        </View>
      </View>

      <View style={styles.actionsCell}>
        <TouchableOpacity 
          style={styles.downloadBtn}
          onPress={handleDownloadBarcode}
          disabled={downloading}
        >
          <Ionicons 
            name={downloading ? "hourglass-outline" : "download-outline"} 
            size={20} 
            color={COLORS.primary}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.downloadBtnText}>
            {downloading ? '' : 'Save Barcode'}
          </Text>
        </TouchableOpacity>

        {isAdminMode && (
          <AnimatedTouchable 
            style={[styles.deleteBtn, deleteAnimStyle]}
            onPress={handleDeleteProduct}
            disabled={loading}
          >
            <Ionicons 
              name={loading ? "hourglass-outline" : "trash-outline"} 
              size={20} 
              color={COLORS.error} 
            />
          </AnimatedTouchable>
        )}
      </View>
    </Animated.View>
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
  imageCell: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#eee',
  },
  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCell: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  productName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  productGroup: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.muted,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.muted,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  actionsCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs,
    paddingRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  downloadBtnText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  deleteBtn: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
}); 