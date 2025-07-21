import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import { getErrorMessage } from '../utils/errorHandling';
import { API_URL, getApiUrl } from '../utils/apiConfig';

// Maximum number of upload retries
const MAX_RETRIES = 3;
// Exponential backoff delay (ms)
const RETRY_DELAY = 1000;

export const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const requestPermissions = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to select images for your products.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  }, []);

  const pickImage = useCallback(async () => {
    try {
      // Request permissions first
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        const fileSizeMB = asset.fileSize / (1024 * 1024);
        
        if (fileSizeMB > 10) {
          Alert.alert(
            'Image Too Large',
            'Please select an image smaller than 10MB. You can try selecting a lower quality image or resizing it first.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        if (fileSizeMB > 5) {
          Alert.alert(
            'Large Image Detected',
            'This image is quite large and may take longer to upload. Consider selecting a smaller image for better performance.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Continue', onPress: () => setSelectedImage(asset) }
            ]
          );
          return;
        }
        
        setSelectedImage(asset);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, [requestPermissions]);

  const uploadImage = useCallback(async (imageUri) => {
    if (!imageUri) {
      throw new Error('No image to upload');
    }

    if (uploadingImage) {
      throw new Error('Upload already in progress');
    }

    setUploadingImage(true);

    try {
      // Handle case where entire image object is passed instead of just URI
      const uri = imageUri?.uri || imageUri;
      
      if (typeof uri !== 'string') {
        throw new Error('Invalid image URI');
      }

      // Handle platform-specific URI formatting
      const formattedUri = Platform.OS === 'android' && !uri.startsWith('file://')
        ? `file://${uri}`
        : uri;

      const formData = new FormData();
      formData.append('image', {
        uri: formattedUri,
        type: 'image/jpeg',
        name: 'product-image.jpg',
      });

      let lastError = null;
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          const response = await fetch(getApiUrl('/products/upload-image'), {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload image');
          }

          const result = await response.json();
          return result.imageUrl;
        } catch (error) {
          lastError = error;
          if (attempt < MAX_RETRIES - 1) {
            // Wait before retrying, using exponential backoff
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt)));
          }
        }
      }

      throw lastError || new Error('Failed to upload image after retries');
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return {
    selectedImage,
    uploadingImage,
    pickImage,
    uploadImage,
    clearImage,
  };
}; 