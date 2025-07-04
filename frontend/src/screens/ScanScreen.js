import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, SafeAreaView, Alert } from 'react-native';
import * as CameraModule from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styles from './ScanScreen.styles';

// Components and hooks
import { ProductCard } from '../components/ProductCard';
import { CreateProductForm } from '../components/CreateProductForm';
import { useImageUpload } from '../hooks/useImageUpload';
import { useProductAPI } from '../hooks/useProductAPI';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';
import ImageViewing from 'react-native-image-viewing';
import { getErrorMessage, handleImagePress, handleImageModalClose } from '../utils/errorHandling';

// CameraView is the actual camera component in SDK 53+
const CameraView = CameraModule.CameraView;

// This screen allows the user to scan a barcode and fetch product info from the backend
export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);

  // Custom hooks
  const { selectedImage, uploadingImage, pickImage, uploadImage, clearImage } = useImageUpload();
  const { loading, error, fetchProduct, createProduct, clearError } = useProductAPI();

  // Image modal handlers
  const openImageModal = handleImagePress(setModalImageSource, setImageModalVisible);
  const closeImageModal = handleImageModalClose(setModalImageSource, setImageModalVisible);

  // Ask for camera permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await CameraModule.Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Animate scan frame glow
  const [glow, setGlow] = useState(0);
  useEffect(() => {
    let anim;
    if (!scanned) {
      anim = setInterval(() => setGlow(g => (g + 1) % 100), 30);
    }
    return () => clearInterval(anim);
  }, [scanned]);

  // This function is called when a barcode is scanned
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setProduct(null);
    setScannedBarcode(data);
    setShowCreateForm(false);
    
    const fetchedProduct = await fetchProduct(data);
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    }
    // Error is handled by the hook and will show in the UI
  };

  // Reset scan state
  const resetScan = () => {
    setScanned(false);
    setProduct(null);
    setShowCreateForm(false);
    setNewProduct({ name: '', price: '' });
    setScannedBarcode('');
    clearImage();
    clearError();
  };

  // Function to create a new product
  const handleCreateProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price.trim()) {
      Alert.alert('Error', 'Please fill in both name and price');
      return;
    }

    // Validate price format
    const priceValue = parseFloat(newProduct.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Please enter a valid price (e.g., 9.99)');
      return;
    }

    try {
      let imageUrl = null;
      
      if (selectedImage) {
        try {
          imageUrl = await uploadImage(selectedImage.uri);
        } catch (error) {
          Alert.alert(
            'Upload Failed',
            getErrorMessage(error),
            [{ text: 'OK' }]
          );
          return;
        }
      }

      const productData = {
        name: newProduct.name.trim(),
        price: priceValue,
        barcode: scannedBarcode,
        image_url: imageUrl
      };
      
      const createdProduct = await createProduct(productData);
      setProduct(createdProduct);
      setShowCreateForm(false);
      setNewProduct({ name: '', price: '' });
      clearImage();
      
      // Show success message and reset to scanning state
      Alert.alert(
        'Success!',
        `Product "${createdProduct.name}" has been created successfully.`,
        [
          {
            text: 'Scan Again',
            onPress: resetScan
          }
        ]
      );
      
      // Immediately clear the product to prevent lingering display
      setProduct(null);
    } catch (err) {
      console.error('Create product error:', err);
      Alert.alert('Error', getErrorMessage(err));
    }
  };

  // Header with icon and title
  const Header = () => (
    <View style={styles.header}>
      <Ionicons name="barcode-outline" size={36} color={COLORS.primary} style={{ marginRight: 12 }} />
      <Text style={styles.headerTitle}> Scan Product </Text>
    </View>
  );

  if (hasPermission === null) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={COLORS.bgGradient} style={styles.gradient}>
          <Text style={styles.infoText}>Requesting camera permission...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={COLORS.bgGradient} style={styles.gradient}>
          <Text style={styles.infoText}>No access to camera</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={COLORS.bgGradient} style={styles.gradient}>
        <Header />
        
        <View style={styles.container}>
          {/* Camera view for barcode scanning */}
          {!scanned && CameraView && (
            <View style={styles.cameraContainer}>
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.camera}
                facing="back"
                cameraId="0"
                barcodeScannerSettings={{
                  barcodeTypes: ['code128'],
                }}
              />
              {/* Animated scan frame with glow */}
              <View
                style={[
                  styles.scanFrame,
                  {
                    shadowColor: COLORS.scanGlow,
                    shadowOpacity: 0.7,
                    shadowRadius: 16 + 8 * Math.abs(Math.sin(glow / 15)),
                    borderColor: COLORS.scanFrame,
                    borderWidth: 4,
                  },
                ]}
              />
              <Text style={styles.scanHint}>Align the barcode within the frame</Text>
            </View>
          )}

          {/* Show loading spinner */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}

          {/* Show product card, error, or create form */}
          {(product || error || showCreateForm) && !loading && (
            <View style={styles.resultsContainer}>
              {product && (
                <ProductCard 
                  product={product} 
                  onImagePress={openImageModal}
                  onProductDeleted={() => {
                    setProduct(null);
                    setScanned(true);
                    setScannedBarcode('');
                  }}
                />
              )}
              {error && !showCreateForm && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  {error === 'Product not found' && (
                    <TouchableOpacity 
                      style={styles.createButton} 
                      onPress={() => setShowCreateForm(true)}
                    >
                      <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.createButtonText}>Create New Product</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {showCreateForm && (
                <CreateProductForm
                  barcode={scannedBarcode}
                  newProduct={newProduct}
                  setNewProduct={setNewProduct}
                  selectedImage={selectedImage}
                  uploadingImage={uploadingImage}
                  onPickImage={pickImage}
                  onRemoveImage={clearImage}
                  onImagePress={openImageModal}
                  onSubmit={handleCreateProduct}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setNewProduct({ name: '', price: '' });
                    clearImage();
                  }}
                  loading={loading}
                />
              )}
            </View>
          )}

          {/* Show button to scan again at the bottom */}
          {scanned && !loading && (
            <TouchableOpacity style={styles.scanAgainButton} onPress={resetScan}>
              <Ionicons name="refresh" size={22} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.scanAgainText}>Tap to {error ? 'Try again' : 'Scan Again'} </Text>
            </TouchableOpacity>
          )}
        </View>
        
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