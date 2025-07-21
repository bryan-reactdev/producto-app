import { Image, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, Platform } from "react-native"
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SIZING, SPACING } from "../StyleConstants"
import { FontAwesome6 } from "@expo/vector-icons"
import { useState } from 'react';
import ProductDetailsModal from './ProductDetailsModal';
import { useProductActions } from '../hooks/useProductActions';
import useAdmin from '../hooks/useAdmin';
import ErrorMessage from './ErrorMessage';

export default function ProductRow({image, name, price, barcode, id, onProductDeleted, group}){
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState("");
    const { downloadBarcode, deleteProduct, downloading, deleting } = useProductActions({ id, name, onProductDeleted, setError });
    const { isAdmin } = useAdmin();

    // Clear error when opening/closing modal
    const handleOpen = () => { setError(""); setModalVisible(true); };
    const handleClose = () => { setError(""); setModalVisible(false); };

    const handleDownloadBarcode = async () => {
        setError("");
        await downloadBarcode();
    };
    const handleDeleteProduct = async () => {
        setError("");
        await deleteProduct();
    };

    return(
        <>
        <TouchableOpacity style={styles.productRow} onPress={handleOpen}>
            <View style={styles.productRowImage}>
                {image
                    ? <Image source={{ uri: image }} style={styles.productRowImagePic} resizeMode="cover" />
                    : <FontAwesome6 style={styles.productRowIcon} name="box" size={32} color={COLORS.textPrimary}/>
                }
            </View>
            
            <View style={styles.productRowDetails}>
                <Text style={styles.productRowName}>{name}</Text>
                {group &&
                    <Text style={styles.productRowGroup}>{group}</Text>
                }
                <Text style={styles.productRowPrice}>${price}</Text>
                
                <View style={styles.productRowBarcodeContainer}>
                    <FontAwesome6 style={styles.productRowBarcodeIcon} name="barcode" size={12} color={COLORS.textSecondary}/>
                    <Text
                        style={styles.productRowBarcode}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {barcode}
                    </Text>

                    <View style={styles.productRowActions}>
                        <TouchableOpacity style={styles.productRowActionsButton} onPress={handleDownloadBarcode} disabled={downloading}>
                            {downloading ? (
                                <ActivityIndicator color={'#fff'} size={FONT_SIZES.base}/>
                            ) : (
                                <FontAwesome6 style={styles.productRowActionsButtonIcon} name="download" size={32} color={COLORS.textPrimary}/>
                            )}
                            <Text style={styles.productRowActionsSaveText}>Barcode</Text>
                        </TouchableOpacity>
                        {isAdmin && (
                            <TouchableOpacity style={styles.productRowActionsButtonDelete} onPress={handleDeleteProduct} disabled={deleting}>
                                {deleting ? (
                                    <ActivityIndicator color={COLORS.textDelete} size={20} />
                                ) : (
                                    <FontAwesome6 style={styles.productRowActionsButtonIconDelete} name="trash" size={32} color={COLORS.textPrimary}/>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                    
                </View>
                {error ? <ErrorMessage message={error} style={{ marginBottom: 8 }} /> : null}
            </View>
        </TouchableOpacity>
        <ProductDetailsModal
            visible={modalVisible}
            onClose={handleClose}
            product={{ id, image, name, price, barcode }}
            onProductDeleted={() => {
                setError("");
                setModalVisible(false);
                onProductDeleted(id);
            }}
        />
        </>
    )
}

const styles = StyleSheet.create({
    productRow:{
        display:'flex',
        width:'100%',

        flexDirection:'row',
        alignItems:'flex-start',

        padding: SPACING.sm,
        gap: SPACING.sm,

        borderWidth:BORDER_WIDTH.sm,
        borderRadius:BORDER_RADIUS.base,

        borderColor: COLORS.borderPrimary,
        backgroundColor: COLORS.backgroundPrimary,
        position: 'relative',
    },
    productRowImage:{
        display:'flex',
        width: 75,
        height:100,

        alignItems:'center',
        justifyContent:'center',

        borderWidth:BORDER_WIDTH.sm,
        borderRadius: BORDER_RADIUS.base,

        borderColor:COLORS.borderPrimary,
    },
    productRowIcon:{
        fontSize:FONT_SIZES.xxl,

        color:'#B7B0B0',
    },
    productRowImagePic: {
        width: '100%',
        height: '100%',

        borderRadius: BORDER_RADIUS.base,
    },
    productRowDetails:{
        flex: 1,

        justifyContent: 'flex-start',

        gap:SPACING.xxs,
    },
    productRowName:{
        includeFontPadding: false,
        fontFamily:'secondary-bold',
        color: COLORS.textPrimary,
    },
    productRowGroup:{
        includeFontPadding: false,
        fontFamily:'secondary-regular',

        color:COLORS.textSecondary,
    },
    productRowPrice:{
        includeFontPadding: false,
        fontFamily:'secondary-regular',

        color:COLORS.textSuccess,
    },
    productRowBarcodeContainer:{
        display:'flex',

        flexDirection:'row',
        alignItems:'center',

        gap: SPACING.xxs,
    },
    productRowBarcodeIcon:{
        fontSize: FONT_SIZES.xs, // Match text font size
    },
    productRowBarcode:{
        width:'30%',
        
        includeFontPadding: false,
        fontFamily:'secondary-regular',
        fontSize: FONT_SIZES.xs,

        color:COLORS.textSecondary,
    },
    productRowActions:{
        flexDirection:'row',
        
        marginLeft:'auto',

        gap:SPACING.xxs,
    },
    productRowActionsButton:{
        display:'flex',

        flexDirection:'row',
        alignItems:'center',

        gap:SPACING.xs,
        padding:SIZING.xxs,

        borderRadius:BORDER_RADIUS.xl,

        backgroundColor:COLORS.buttonPrimary,
    },
    productRowActionsButtonDelete:{
        display:'flex',

        flexDirection:'row',
        alignItems:'center',

        gap:SPACING.xs,
        padding:SIZING.xxs,

        borderRadius:BORDER_RADIUS.xl,

        backgroundColor:COLORS.buttonSecondary,
    },
    productRowActionsButtonIcon:{
        fontSize: FONT_SIZES.base,
        color:COLORS.textPrimaryContrast,
    },
    productRowActionsButtonIconDelete:{
        fontSize: FONT_SIZES.base,

        color:COLORS.textDelete,
    },
    productRowActionsSaveText:{
        fontFamily:'secondary-regular',
        fontSize: FONT_SIZES.xs,

        color:COLORS.textPrimaryContrast,
    },

    loading:{
        fontSize:FONT_SIZES.base,
        color:'fff',
    }
})
