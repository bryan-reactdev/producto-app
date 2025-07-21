// front/src/screens/ScanScreen/Scan.js
import { View, Text, Button, ActivityIndicator, TouchableOpacity } from 'react-native'
import styles from './ScanStyle'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomHeader from '../../components/CustomHeader'
import * as CameraModule from 'expo-camera'
import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import ProductRow from '../../components/ProductRow'
import { FONT_SIZES, SIZING } from '../../StyleConstants'
import { FontAwesome6 } from '@expo/vector-icons'
import useAdmin from '../../hooks/useAdmin'
import { getErrorMessage, retryWithBackoff } from '../../utils/errorHandling'
import * as Animatable from 'react-native-animatable';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.3.182:3000';
const CameraView = CameraModule.CameraView;

// --- Section: Camera Permission States ---
function PermissionRequesting() {
    return (
        <SafeAreaView style={styles.screen}>
            <CustomHeader title="Scan" />
            <Text style={{padding:SIZING.base, fontFamily: 'secondary-regular', fontSize:FONT_SIZES.base}}>
                Requesting camera permission...
            </Text>
        </SafeAreaView>
    );
}
function PermissionDenied({navigation}) {
    return (
        <SafeAreaView style={styles.screen}>
            <CustomHeader nav={navigation} title="Scan" />
            <Text style={{padding:SIZING.base, fontFamily: 'secondary-regular', fontSize:FONT_SIZES.base}}>
                You chose to not allow camera access. This app can't ask for it again. Please manually allow camera usage on your device's app settings if you want to scan a product's barcode.
            </Text>
        </SafeAreaView>
    );
}

// --- Section: Render Components ---
function CameraSection({ onBarCodeScanned }) {
    return (
        <View style={styles.scannerContainerWrapper}>
            <View style={styles.scannerContainer}>
                <CameraView
                    style={styles.scannerContainerCamera}
                    facing="back"
                    cameraId="0"
                    barcodeScannerSettings={{ barcodeTypes: ['code128'] }}
                    onBarcodeScanned={onBarCodeScanned}
                />
                <Animatable.View
                    animation="zoomIn"
                    duration={400}
                    delay={40}
                    style={styles.animatedBorderOverlay}
                    pointerEvents="none"
                />
                <Text style={styles.scannerContainerText}>Align the barcode within frame</Text>
            </View>
        </View>
    );
}
function LoadingSection() {
    return (
        <View style={styles.scannerContainerWrapper}>
            <View style={styles.scannerContainer}>
                <ActivityIndicator size="large" style={styles.loadingIndicator} />
                <Text style={styles.loadingText}>Loading product...</Text>
            </View>
        </View>
    );
}
function ProductSection({ product, onScanAgain, onProductDeleted }) {
    console.log('Product passed to ProductRow:', product); // Debug log
    return (
        <View style={styles.productContainer}>
            <Animatable.View
                animation="fadeInUp"
                duration={900}
                key={product.id || product.barcode}
            >
                <ProductRow
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url}
                    barcode={product.barcode}
                    onProductDeleted={onProductDeleted}
                    group={product.product_group?.name}
                />
            </Animatable.View>

            <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain}>
                <FontAwesome6 style={styles.scanAgainButtonIcon} name="expand" size={32} color={'black'}/>
                <Text style={styles.scanAgainButtonText}>SCAN AGAIN</Text>
            </TouchableOpacity>
        </View>
    );
}
function ErrorSection({ error, isAdmin, onRegister, onScanAgain }) {
    return (
        <View style={styles.errorSection}>
            <Text style={styles.errorText}>{error}</Text>
            
            {error?.toLowerCase().includes('product not found') && (
                isAdmin ? (
                    <TouchableOpacity style={styles.scanAgainButton} onPress={onRegister}>
                        <FontAwesome6 style={styles.scanAgainButtonIcon} name="plus" size={32} color={'black'}/>
                        <Text style={styles.scanAgainButtonText}>REGISTER PRODUCT</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.errorText}>Only the admin can register a new product.</Text>
                )
            )}

            <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain}>
                <FontAwesome6 style={styles.scanAgainButtonIcon} name="expand" size={32} color={'black'}/>
                <Text style={styles.scanAgainButtonText}>SCAN AGAIN</Text>
            </TouchableOpacity>
        </View>
    );
}
function ScanAgainSection({ onScanAgain }) {
    return (
        <View style={styles.scanAgainSection}>
            <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain}>
                <FontAwesome6 style={styles.scanAgainButtonIcon} name="expand" size={32} color={'black'}/>
                <Text style={styles.scanAgainButtonText}>SCAN AGAIN</Text>
            </TouchableOpacity>
        </View>
    );
}

// --- Section: Main Scan Component ---
export default function Scan({navigation}){
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const {isAdmin} = useAdmin();

    useEffect(() => {
        (async () => {
            const { status } = await CameraModule.Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Reset error when returning to this screen
    useFocusEffect(
        React.useCallback(() => {
            setError('');
        }, [])
    );

    const handleBarCodeScanned = async ({ data }) => {
        setScanned(true);
        setBarcode(data);
        setLoading(true);
        setProduct(null);
        setError('');
        try {
            const res = await retryWithBackoff(() => fetch(`${API_BASE}/api/products?barcode=${encodeURIComponent(data)}`));
            if (!res.ok) throw new Error('Product not found');
            const products = await res.json();
            const prod = products[0];
            if (!prod) throw new Error('Product not found');
            setProduct(prod);
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setScanned(false);
        setBarcode('');
        setProduct(null);
        setError('');
    };

    // --- Early returns for permission states ---
    if (hasPermission === null) return <PermissionRequesting />;
    if (hasPermission === false) return <PermissionDenied navigation={navigation} />;

    // --- Main render ---
    return (
        <SafeAreaView style={styles.screen}>
            <CustomHeader nav={navigation} title="Scan" />
            <View style={styles.container}>
                {!scanned && (
                    <CameraSection onBarCodeScanned={handleBarCodeScanned} />
                )}
                {loading && <LoadingSection />}
                {product && !loading && (
                    <ProductSection
                        product={product}
                        onScanAgain={resetScan}
                        onProductDeleted={() => setProduct(null)}
                    />
                )}
                {error && !loading && !product && scanned && (
                    <ErrorSection
                        error={error}
                        isAdmin={isAdmin}
                        onRegister={() => navigation.navigate('AddProduct', { barcode })}
                        onScanAgain={resetScan}
                    />
                )}

                {scanned && !loading && !product && !error && (
                    <ScanAgainSection onScanAgain={resetScan} />
                )}
            </View>
        </SafeAreaView>
    );
}