import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CreateProductForm } from '../components/CreateProductForm';
import { useImageUpload } from '../hooks/useImageUpload';
import { useProductAPI } from '../hooks/useProductAPI';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';
import styles from './AddProductScreen.styles';
import { getErrorMessage, handleImagePress, handleImageModalClose } from '../utils/errorHandling';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  Layout
} from 'react-native-reanimated';
import ImageViewing from 'react-native-image-viewing';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AddProductScreen({ navigation }) {
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [barcode, setBarcode] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);

  // Custom hooks
  const { selectedImage, uploadingImage, pickImage, uploadImage, clearImage } = useImageUpload();
  const { loading, createProduct } = useProductAPI();
  
  // Image modal handlers
  const openImageModal = handleImagePress(setModalImageSource, setImageModalVisible);
  const closeImageModal = handleImageModalClose(setModalImageSource, setImageModalVisible);

  // Form reset handler
  const resetForm = () => {
    setNewProduct({ name: '', price: '' });
    setBarcode('');
    clearImage();
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const price = parseFloat(newProduct.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    try {
      let imageUrl = null;
      if (selectedImage) {
        try {
          imageUrl = await uploadImage(selectedImage.uri);
        } catch (error) {
          Alert.alert('Upload Failed', getErrorMessage(error));
          return;
        }
      }

      await createProduct({
        name: newProduct.name.trim(),
        price: price,
        barcode: barcode,
        image_url: imageUrl
      });

      resetForm();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  const handleCancel = () => {
    resetForm();
    navigation.goBack();
  };

  // Header with icon and title
  const Header = () => (
    <Animated.View 
      style={styles.header}
      entering={FadeIn.delay(100).springify()}
    >
      <AnimatedTouchable 
        style={styles.backBtn}
        onPress={handleCancel}
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
      </AnimatedTouchable>
      <Ionicons name="add-circle-outline" size={28} color={COLORS.primary} style={{ marginRight: 12 }} />
      <Text style={styles.headerTitle}>Add New Product</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={COLORS.bgGradient} style={styles.gradient}>
        <Header />
        
        <Animated.View 
          style={styles.container}
          entering={FadeInUp.springify()}
        >
          <CreateProductForm
            barcode={barcode}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            selectedImage={selectedImage}
            uploadingImage={uploadingImage}
            onPickImage={pickImage}
            onRemoveImage={clearImage}
            onImagePress={openImageModal}
            onSubmit={handleCreateProduct}
            onCancel={handleCancel}
            loading={loading}
          />
        </Animated.View>
        
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