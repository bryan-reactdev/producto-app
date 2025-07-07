import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import { getErrorMessage } from '../utils/errorHandling';
import { API_URL, getApiUrl } from '../utils/apiConfig';

// Maximum number of upload retries
const MAX_RETRIES = 3;

export const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const uploadImage = useCallback(async (imageUri, retryCount = 0) => {
    setUploadingImage(true);
    setUploadProgress(0);
    
    try {
      // Handle case where entire image object is passed instead of just URI
      if (imageUri && typeof imageUri === 'object' && imageUri.uri) {
        imageUri = imageUri.uri;
      }
      
      // Validate image URI - be more flexible with validation
      if (!imageUri) {
        throw new Error('No image URI provided');
      }
      
      if (typeof imageUri !== 'string') {
        imageUri = String(imageUri);
      }

      // Handle platform-specific URI formatting
      if (Platform.OS === 'ios' && imageUri.startsWith('file://')) {
        // iOS sometimes needs the file:// prefix
      } else if (Platform.OS === 'android' && !imageUri.startsWith('file://')) {
        // Android sometimes needs file:// prefix added
        imageUri = `file://${imageUri}`;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'product-image.jpg',
      });

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
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
      setUploadProgress(100);
      return result.imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      
      // Implement retry logic
      if (error.name === 'AbortError' || error.message.includes('network') || error.message.includes('timeout')) {
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying upload (attempt ${retryCount + 1} of ${MAX_RETRIES})...`);
          return uploadImage(imageUri, retryCount + 1);
        }
      }
      
      throw new Error(getErrorMessage(error));
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const clearImage = useCallback(() => setSelectedImage(null), []);

  return {
    selectedImage,
    uploadingImage,
    uploadProgress,
    pickImage,
    uploadImage,
    clearImage,
  };
}; 