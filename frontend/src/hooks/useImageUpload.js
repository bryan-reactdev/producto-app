import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const pickImage = async () => {
    try {
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
  };

  const uploadImage = async (imageUri) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'product-image.jpg',
      });

      const response = await fetch('http://192.168.3.12:3000/api/products/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImage = () => setSelectedImage(null);

  return {
    selectedImage,
    uploadingImage,
    pickImage,
    uploadImage,
    clearImage,
  };
}; 