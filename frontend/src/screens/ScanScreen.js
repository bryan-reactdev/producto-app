import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, SafeAreaView, Alert } from 'react-native';
import * as CameraModule from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styles from './ScanScreen.styles';

// Components and hooks
import { ProductCard } from '../components/ProductCard';
import { CreateProductForm } from '../components/CreateProductForm';
import { useProductCreation } from '../hooks/useProductCreation';
import { useProductAPI } from '../hooks/useProductAPI';
import { useAdminMode } from '../contexts/AdminModeContext';
import { COLORS } from '../constants/colors';
import ImageViewing from 'react-native-image-viewing';
import { handleImagePress, handleImageModalClose } from '../utils/errorHandling';

// CameraView is the actual camera component in SDK 53+
const CameraView = CameraModule.CameraView;

// This screen allows the user to scan a barcode and fetch product info from the backend
export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);

  // Custom hooks
  const { loading: fetchLoading, error, fetchProduct, clearError } = useProductAPI();
  const { isAdminMode } = useAdminMode();

  // Image modal handlers
  const openImageModal = handleImagePress(setModalImageSource, setImageModalVisible);
  const closeImageModal = handleImageModalClose(setModalImageSource, setImageModalVisible);

  // Product creation hook
  const {
    newProduct,
    selectedImage,
    isSubmitting,
    uploadingImage,
    loading: creationLoading,
    setNewProduct,
    setBarcode,
    pickImage,
    clearImage,
    handleCreateProduct,
    handleCancel,
  } = useProductCreation({
    onSuccess: (createdProduct) => {
      setProduct(createdProduct);
      setShowCreateForm(false);
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
    },
    onCancel: () => {
      setShowCreateForm(false);
      setScanned(true);
    }
  });

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
    setBarcode(data);
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
    setBarcode('');
    clearImage();
    clearError();
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
          {(fetchLoading || creationLoading) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}

          {/* Show product card, error, or create form */}
          {(product || error || showCreateForm) && !fetchLoading && !creationLoading && (
            <View style={styles.resultsContainer}>
              {product && (
                <ProductCard 
                  product={product} 
                  onImagePress={openImageModal}
                  onProductDeleted={() => {
                    setProduct(null);
                    setScanned(true);
                    setBarcode('');
                  }}
                  isAdminMode={isAdminMode}
                />
              )}
              {error && !showCreateForm && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  {error === 'Product not found' && isAdminMode && (
                    <TouchableOpacity 
                      style={styles.createButton} 
                      onPress={() => setShowCreateForm(true)}
                    >
                      <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.createButtonText}>Register New Product</Text>
                    </TouchableOpacity>
                  )}
                  {error === 'Product not found' && !isAdminMode && (
                    <View style={styles.adminNotice}>
                      <Ionicons name="shield-outline" size={16} color={COLORS.muted} />
                      <Text style={styles.adminNoticeText}>Enable admin mode to create new products</Text>
                    </View>
                  )}
                </View>
              )}
              {showCreateForm && (
                <CreateProductForm
                  barcode={newProduct.barcode}
                  newProduct={newProduct}
                  setNewProduct={setNewProduct}
                  selectedImage={selectedImage}
                  uploadingImage={uploadingImage}
                  onPickImage={pickImage}
                  onRemoveImage={clearImage}
                  onImagePress={openImageModal}
                  onSubmit={handleCreateProduct}
                  onCancel={handleCancel}
                  loading={creationLoading || isSubmitting || uploadingImage}
                />
              )}
            </View>
          )}

          {/* Show button to scan again at the bottom */}
          {scanned && !fetchLoading && !creationLoading && (
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