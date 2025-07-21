import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useImageUpload } from './useImageUpload';
import { useProductAPI } from './useProductAPI';
import { getErrorMessage } from '../utils/errorHandling';

export const useProductCreation = ({ onSuccess, onCancel } = {}) => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [barcode, setBarcode] = useState('');
  const [groupId, setGroupId] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { selectedImage, uploadingImage, pickImage, uploadImage, clearImage } = useImageUpload();
  const { loading, createProduct } = useProductAPI();

  const resetForm = useCallback(() => {
    setNewProduct({ name: '', price: '' });
    setBarcode('');
    setGroupId(0)
    clearImage();
    setIsSubmitting(false);
  }, [clearImage]);

  const validateForm = useCallback(() => {
    if (!newProduct.name.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return false;
    }

    if (!newProduct.price.trim()) {
      Alert.alert('Error', 'Please enter a price');
      return false;
    }

    const price = parseFloat(newProduct.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    return true;
  }, [newProduct]);

  const handleCreateProduct = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting || loading || uploadingImage) {
      return;
    }

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // First create the product without the image
      const productData = {
        name: newProduct.name.trim(),
        price: parseFloat(newProduct.price),
        barcode,
        groupId
      };

      // If there's a selected image, upload it first
      if (selectedImage) {
        try {
          const imageUrl = await uploadImage(selectedImage);
          productData.image_url = imageUrl;
        } catch (error) {
          console.error('Image upload error:', error);
          Alert.alert(
            'Upload Failed', 
            'Failed to upload image. Would you like to continue creating the product without an image?',
            [
              { 
                text: 'Cancel', 
                style: 'cancel',
                onPress: () => setIsSubmitting(false)
              },
              { 
                text: 'Continue', 
                onPress: async () => {
                  try {
                    const createdProduct = await createProduct(productData);
                    resetForm();
                    onSuccess?.(createdProduct);
                  } catch (error) {
                    console.error('Product creation error:', error);
                    Alert.alert('Error', getErrorMessage(error));
                  }
                }
              }
            ]
          );
          return;
        }
      }

      const createdProduct = await createProduct(productData);
      resetForm();
      onSuccess?.(createdProduct);
    } catch (error) {
      console.error('Product creation error:', error);
      Alert.alert('Error', getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    loading,
    uploadingImage,
    validateForm,
    selectedImage,
    uploadImage,
    newProduct,
    barcode,
    createProduct,
    resetForm,
    onSuccess
  ]);

  const handleCancel = useCallback(() => {
    if (isSubmitting) {
      Alert.alert('Please wait', 'Product creation in progress...');
      return;
    }
    resetForm();
    onCancel?.();
  }, [isSubmitting, resetForm, onCancel]);

  return {
    // State
    newProduct,
    barcode,
    selectedImage,
    isSubmitting,
    uploadingImage,
    loading,

    // Setters
    setNewProduct,
    setBarcode,

    // Actions
    pickImage,
    clearImage,
    handleCreateProduct,
    handleCancel,

    // Image handlers
    onImagePress: selectedImage ? { uri: selectedImage.uri } : null,
  };
}; 