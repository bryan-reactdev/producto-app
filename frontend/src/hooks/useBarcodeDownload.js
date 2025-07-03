import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

export const useBarcodeDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadBarcode = async (barcodeUrl, productName) => {
    try {
      setDownloading(true);
      
      // Download temporarily and share directly
      const safeName = productName.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = Date.now();
      const filename = `barcode_${safeName}_${timestamp}.pdf`;
      
      const downloadResult = await FileSystem.downloadAsync(
        barcodeUrl,
        FileSystem.cacheDirectory + filename
      );

      if (downloadResult.status === 200) {
        await shareBarcode(downloadResult.uri, productName);
      } else {
        throw new Error('Failed to download barcode PDF');
      }
      
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        'Download Failed',
        'Failed to download barcode PDF. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setDownloading(false);
    }
  };

  const shareBarcode = async (fileUri, productName) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: `Barcode PDF for ${productName}`,
        });
      } else {
        Alert.alert(
          'Sharing Not Available',
          'Sharing is not available on this device.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert(
        'Share Failed',
        'Failed to share barcode PDF. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return {
    downloading,
    downloadBarcode,
    shareBarcode,
  };
}; 