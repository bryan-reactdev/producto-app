// front/src/components/ProductDetailsModal.js
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SPACING, BORDER_WIDTH, SIZING } from '../StyleConstants';
import { useProductActions } from '../hooks/useProductActions';
import { useState } from 'react';
import ImageViewing from 'react-native-image-viewing';
import useAdmin from '../hooks/useAdmin';
import ErrorMessage from './ErrorMessage';
import * as Animatable from 'react-native-animatable';

export default function ProductDetailsModal({ visible, onClose, product, onProductDeleted }) {
  if (!product) return null;
  const [error, setError] = useState("");
  const { downloadBarcode, deleteProduct, downloading, deleting } = useProductActions({ id: product.id, name: product.name, onProductDeleted, setError });
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const {isAdmin} = useAdmin();

  // Reset error on open/close
  const handleOpen = () => setError("");
  const handleClose = () => { setError(""); onClose(); };
  const handleDownloadBarcode = async () => { setError(""); await downloadBarcode(); };
  const handleAssignGroup = async () => { setError(""); await deleteProduct(); };
  const handleDeleteProduct = async () => { setError(""); await deleteProduct(); };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      onShow={handleOpen}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={handleClose}
      >
        <Animatable.View
          animation="fadeInUp"
          duration={650}
          delay={40}
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
          onResponderStart={e => e.stopPropagation && e.stopPropagation()}
        >
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <FontAwesome6 style={styles.closeButtonIcon} name="xmark" size={24} color={COLORS.textPrimaryContrast} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {product.image && (
              <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
              </TouchableOpacity>
            )}

            <Text style={styles.name}>{product.name}</Text>

            <Text style={styles.price}>${product.price}</Text>

            <View style={styles.barcodeRow}>
              <FontAwesome6 name="barcode" size={16} color={COLORS.textDetail} />
              <Text style={styles.barcode}>{product.barcode}</Text>
            </View>
            {error ? <ErrorMessage message={error} style={{ marginTop: 12 }} /> : null}
          </ScrollView>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleDownloadBarcode} disabled={downloading}>
              {downloading ? (
                <ActivityIndicator color={'#fff'} size={FONT_SIZES.base} />
              ) : (
                <FontAwesome6 name="download" size={24} color={'#fff'} />
              )}
              <Text style={styles.actionText}>Save Barcode</Text>
            </TouchableOpacity>

            {isAdmin &&
                <TouchableOpacity style={styles.actionButtonDelete} onPress={handleDeleteProduct} disabled={deleting}>
                {deleting ? (
                    <ActivityIndicator color={COLORS.textDelete} size={20} />
                ) : (
                    <FontAwesome6 name="trash" size={24} color={COLORS.textDelete} />
                )}
                </TouchableOpacity>
            }
          </View>

          {/* Image Viewing Modal */}
          <ImageViewing
            images={product.image ? [{ uri: product.image }] : []}
            imageIndex={0}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
            swipeToCloseEnabled={true}
            doubleTapToZoomEnabled={true}
          />
        </Animatable.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.backgroundPrimary,
    borderRadius: BORDER_RADIUS.base,
    padding: SPACING.lg,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    display:'flex',
    width:35,
    height:35,

    alignItems:'center',
    justifyContent:'center',

    position: 'absolute',
    top: 10,
    right: 10,

    borderWidth:BORDER_WIDTH.sm,
    borderRadius:BORDER_RADIUS.xl,

    borderColor:COLORS.buttonSecondary,
    backgroundColor:COLORS.buttonSecondary,
  },
  closeButtonIcon:{
    fontSize:FONT_SIZES.base,
    
    zIndex: 2,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 32,
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: BORDER_RADIUS.base,
    marginBottom: SPACING.md,
  },
  name: {
    marginBottom: SPACING.xs,
    fontFamily: 'secondary-bold',
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimaryContrast,
  },
  price: {
    fontFamily: 'secondary-regular',
    fontSize: FONT_SIZES.base,
    color: COLORS.textSuccess,
    marginBottom: SPACING.xs,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barcode: {
    fontFamily: 'secondary-regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textDetail,
    marginLeft: SPACING.xs,
  },
  actionsRow: {
    display:'flex',
    flexDirection: 'row',

    justifyContent: 'flex-end',
    alignItems: 'center',

    gap: SPACING.sm,
    marginTop: SPACING.base,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.buttonPrimary,
  },
  actionButtonDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.buttonSecondary,
  },
  actionButtonAssign: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.buttonSecondary,
  },
  actionText: {
    fontFamily: 'secondary-regular',
    fontSize: FONT_SIZES.base,

    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
}); 