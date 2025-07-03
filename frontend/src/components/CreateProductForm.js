import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  Layout
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export const CreateProductForm = ({ 
  barcode, 
  newProduct, 
  setNewProduct, 
  selectedImage, 
  uploadingImage, 
  onPickImage, 
  onRemoveImage, 
  onImagePress,
  onSubmit, 
  onCancel, 
  loading 
}) => {
  return (
    <Animated.View 
      style={styles.createFormCard}
      entering={FadeInUp.springify()}
      layout={Layout.springify()}
    >
      <Animated.Text 
        style={styles.createFormTitle}
        entering={FadeInUp.delay(100)}
      >
        Create New Product
      </Animated.Text>
      
      {barcode && (
        <Animated.Text 
          style={styles.barcodeText}
          entering={FadeInUp.delay(200)}
        >
          Barcode: {barcode}
        </Animated.Text>
      )}
      
      <AnimatedTextInput
        style={styles.input}
        placeholder="Product Name"
        value={newProduct.name}
        onChangeText={(text) => setNewProduct(prev => ({ ...prev, name: text }))}
        placeholderTextColor={COLORS.muted}
        entering={FadeInUp.delay(300)}
      />
      
      <AnimatedTextInput
        style={styles.input}
        placeholder="Price (e.g., 9.99)"
        value={newProduct.price}
        onChangeText={(text) => setNewProduct(prev => ({ ...prev, price: text }))}
        keyboardType="numeric"
        placeholderTextColor={COLORS.muted}
        entering={FadeInUp.delay(400)}
      />
      
      <Animated.View 
        style={styles.imageUploadSection}
        entering={FadeInUp.delay(500)}
      >
        <Animated.Text 
          style={styles.imageUploadLabel}
          entering={FadeIn.delay(600)}
        >
          Product Image (Optional)
        </Animated.Text>
        
        {selectedImage ? (
          <Animated.View 
            style={styles.selectedImageContainer}
            entering={FadeIn}
            layout={Layout.springify()}
          >
            <AnimatedTouchable 
              onPress={() => onImagePress({ uri: selectedImage.uri })} 
              style={styles.selectedImageWrapper}
            >
              <AnimatedImage 
                source={{ uri: selectedImage.uri }} 
                style={styles.selectedImage}
                entering={FadeIn}
              />
              <Animated.View 
                style={styles.selectedImageOverlay}
                entering={FadeIn.delay(100)}
              >
                <Ionicons name="expand-outline" size={16} color="#fff" />
              </Animated.View>
            </AnimatedTouchable>
            <AnimatedTouchable 
              style={styles.removeImageButton} 
              onPress={onRemoveImage}
              entering={FadeIn.delay(200)}
            >
              <Ionicons name="close-circle" size={19} color={COLORS.error} />
            </AnimatedTouchable>
          </Animated.View>
        ) : (
          <AnimatedTouchable 
            style={styles.imagePickerButton}
            onPress={onPickImage} 
            disabled={uploadingImage}
            entering={FadeIn.delay(600)}
          >
            {uploadingImage ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
                <Text style={styles.imagePickerText}>Add Photo</Text>
              </>
            )}
          </AnimatedTouchable>
        )}
      </Animated.View>
      
      <Animated.View 
        style={styles.formButtons}
        entering={FadeInUp.delay(700)}
      >
        <AnimatedTouchable 
          style={[styles.formButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </AnimatedTouchable>
        
        <AnimatedTouchable 
          style={[styles.formButton, styles.createFormButton]}
          onPress={onSubmit}
          disabled={loading || uploadingImage}
        >
          <Text style={styles.createFormButtonText}>
            {loading ? 'Creating...' : 'Create'}
          </Text>
        </AnimatedTouchable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  createFormCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
    width: '90%',
    maxWidth: 400,
    marginBottom: 100,
  },
  createFormTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  barcodeText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'monospace',
    color: COLORS.muted,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    backgroundColor: '#f8f9fa',
    color: COLORS.text,
  },
  imageUploadSection: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  imageUploadLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.muted,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.lg,
    backgroundColor: '#f8f9fa',
  },
  imagePickerText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  selectedImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  selectedImageWrapper: {
    position: 'relative',
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#f0f0f0',
  },
  selectedImageOverlay: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  removeImageButton: {
    position: 'absolute',
    top: -SPACING.xs,
    right: -SPACING.xs,
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.sm,
    padding: 2,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.xs,
  },
  formButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: COLORS.muted,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  createFormButton: {
    backgroundColor: COLORS.primary,
  },
  createFormButtonText: {
    color: COLORS.card,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
}); 