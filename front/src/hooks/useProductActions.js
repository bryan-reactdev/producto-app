// front/src/hooks/useProductActions.js
import { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getErrorMessage, retryWithBackoff } from '../utils/errorHandling';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.3.182:3000';

export function useProductActions({ id, name, onProductDeleted, setError }) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const downloadBarcode = async () => {
    if (!id) return;
    setDownloading(true);
    try {
      const url = `${API_BASE}/api/products/${id}/barcode-pdf`;
      const fileUri = FileSystem.cacheDirectory + `barcode-${id}.pdf`;
      const res = await retryWithBackoff(() => FileSystem.downloadAsync(url, fileUri));
      if (res.status !== 200) throw new Error('Could not download barcode. Please try again later.');
      await Sharing.shareAsync(res.uri);
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

  return { downloadBarcode, deleteProduct, downloading, deleting };
} 