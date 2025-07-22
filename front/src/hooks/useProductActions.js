// front/src/hooks/useProductActions.js
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getErrorMessage, retryWithBackoff } from '../utils/errorHandling';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://31.220.51.108:3000';

export function useProductActions({ id, name, onProductDeleted, setError }) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const assignGroupToProducts = (groupId, productIds) => {
    if (!groupId || !Array.isArray(productIds) || productIds.length === 0) return;
  
    Alert.alert(
      'Assign Group',
      `Are you sure you want to assign this group to ${productIds.length} product(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          style: 'default',
          onPress: async () => {
            setAssigning(true); // you should define this state like setDeleting
            try {
              const res = await retryWithBackoff(() =>
                fetch(`${API_BASE}/api/products/assign-group`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ group_id: groupId, product_ids: productIds }),
                })
              );
              if (!res.ok) throw new Error('Could not assign group to products. Please try again later.');
              if (onGroupAssigned) onGroupAssigned(groupId, productIds); // your callback if needed
            } catch (e) {
              if (setError) setError(getErrorMessage(e));
            } finally {
              setAssigning(false);
            }
          },
        },
      ]
    );
  };

  const downloadBarcode = async () => {
    if (!id) return;
    setDownloading(true);
    try {
      const url = `${API_BASE}/api/products/${id}/barcode-pdf`;
      // Fetch the PDF and get the filename from Content-Disposition
      const response = await fetch(url);
      if (!response.ok) throw new Error('Could not download barcode. Please try again later.');
      const contentDisposition = response.headers.get('Content-Disposition') || '';
      let filename = `barcode-${id}.pdf`;
      const match = contentDisposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) filename = match[1];
      const fileUri = FileSystem.cacheDirectory + filename;
      const blob = await response.blob();
      // Save blob to fileUri
      const reader = new FileReader();
      const fileWritePromise = new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          const base64data = reader.result.split(',')[1];
          await FileSystem.writeAsStringAsync(fileUri, base64data, { encoding: FileSystem.EncodingType.Base64 });
          resolve();
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      await fileWritePromise;

      if (Platform.OS === 'android' && FileSystem.StorageAccessFramework) {
        // Let user pick location and save
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) throw new Error('Permission not granted to access storage.');
        const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          'application/pdf'
        );
        const fileData = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.writeAsStringAsync(destUri, fileData, { encoding: FileSystem.EncodingType.Base64 });
        Alert.alert('Success', 'Barcode PDF saved!');
      } else {
        await Sharing.shareAsync(fileUri);
      }
    } catch (e) {
      if (setError) setError(getErrorMessage(e));
    } finally {
      setDownloading(false);
    }
  };

  const deleteProduct = () => {
    if (!id) return;
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const res = await retryWithBackoff(() => fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' }));
              if (!res.ok) throw new Error('Could not delete product. Please try again later.');
              if (onProductDeleted) onProductDeleted(id);
            } catch (e) {
              if (setError) setError(getErrorMessage(e));
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  return { downloadBarcode, assignGroupToProducts, deleteProduct, downloading, deleting };
} 