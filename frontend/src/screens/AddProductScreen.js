import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CreateProductForm } from '../components/CreateProductForm';
import { COLORS } from '../constants/colors';
import styles from './AddProductScreen.styles';
import { handleImagePress, handleImageModalClose } from '../utils/errorHandling';
import Animated, {
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import ImageViewing from 'react-native-image-viewing';
import { useProductCreation } from '../hooks/useProductCreation';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AddProductScreen({ navigation }) {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageSource, setModalImageSource] = useState(null);
  // Removed successMessage state
  
  // Image modal handlers
  const openImageModal = handleImagePress(setModalImageSource, setImageModalVisible);
  const closeImageModal = handleImageModalClose(setModalImageSource, setImageModalVisible);

  const {
    newProduct,
    barcode,
    selectedImage,
    isSubmitting,
    uploadingImage,
    loading,
    setNewProduct,
    setBarcode,
    pickImage,
    clearImage,
    handleCreateProduct,
    handleCancel,
  } = useProductCreation({
    onSuccess: () => {
      Alert.alert('Success', 'Product created successfully!');
      // Form is already reset by the hook
    },
    onCancel: () => navigation.goBack(),
  });

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
      <StatusBar backgroundColor={COLORS.statusBar} barStyle="dark-content" />
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
            loading={loading || isSubmitting || uploadingImage}
          />
        </Animated.View>
        
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