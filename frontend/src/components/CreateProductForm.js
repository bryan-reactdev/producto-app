import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Modal, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  Layout
} from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import { API_BASE } from '../utils/apiConfig';
import { GroupTableRow } from './GroupTableRow';

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
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${API_BASE}/groups`);
        if (res.ok) {
          const data = await res.json();
          setGroups(data);
        }
      } catch (e) {
      }
    };
    fetchGroups();
  }, []);

  // When group changes, update newProduct
  useEffect(() => {
    setNewProduct(prev => ({ ...prev, product_group_id: selectedGroup?.id || null }));
  }, [selectedGroup]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setGroupModalVisible(false);
  };

  const renderGroupItem = ({ item }) => (
    <GroupTableRow 
      group={item} 
      onPress={handleGroupSelect}
    />
  );

  return (
    <>
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
        {/* Group Selection */}
        <View style={styles.groupPickerSection}>
          <Text style={styles.groupPickerLabel}>Product Group</Text>
          <TouchableOpacity 
            style={styles.groupPickerWrapper}
            onPress={() => setGroupModalVisible(true)}
          >
            <Text style={styles.groupPickerText}>
              {selectedGroup ? selectedGroup.name : 'Select a group...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      
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
          placeholderTextColor={COLORS.textDetail}
          entering={FadeInUp.delay(300)}
        />
        
        <AnimatedTextInput
          style={styles.input}
          placeholder="Price (e.g., 9.99)"
          value={newProduct.price}
          onChangeText={(text) => setNewProduct(prev => ({ ...prev, price: text }))}
          keyboardType="numeric"
          placeholderTextColor={COLORS.textDetail}
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

      {/* Group Selection Modal */}
      <Modal
        visible={groupModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setGroupModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Product Group</Text>
            <View style={{ width: 24 }} />
          </View>
          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.modalList}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </>
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
  groupPickerSection: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  groupPickerLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.muted,
    marginBottom: SPACING.xs,
    textAlign: 'left',
  },
  groupPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#f8f9fa',
    padding: SPACING.md,
  },
  groupPickerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCloseButton: {
    padding: SPACING.xs,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  modalList: {
    padding: SPACING.sm,
  },
}); 