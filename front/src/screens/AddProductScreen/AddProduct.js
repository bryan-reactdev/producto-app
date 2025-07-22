import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert } from 'react-native'
import CustomHeader from '../../components/CustomHeader'
import styles from './AddProductStyle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome6 } from '@expo/vector-icons'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { getErrorMessage, retryWithBackoff } from '../../utils/errorHandling'
import ErrorMessage from '../../components/ErrorMessage'
import SuccessMessage from '../../components/SuccessMessage'
import * as Animatable from 'react-native-animatable';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://31.220.51.108:3000';

export default function AddProduct({navigation, route}){
    const passedBarcode = route?.params?.barcode || null;

    const [imageUri, setImageUri] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        if (!name || !price) {
            setError("Please fill all fields.");
            setSuccess(false);
            return;
        }
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            let imageUrl = null;
            if (imageUri) {
                // Upload image first
                const formData = new FormData();
                formData.append('image', {
                    uri: imageUri,
                    name: 'product.jpg',
                    type: 'image/jpeg',
                });
                const imgRes = await retryWithBackoff(() => fetch(`${API_BASE}/api/products/upload-image`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }));
                if (imgRes.ok) {
                    const imgData = await imgRes.json();
                    imageUrl = imgData.imageUrl;
                } else {
                    throw new Error('Image upload failed. Please try a different image.');
                }
            }
            // Create product
            const res = await retryWithBackoff(() => fetch(`${API_BASE}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    image_url: imageUrl,
                    ...(passedBarcode ? { barcode: passedBarcode } : {}),
                }),
            }));
            if (res.ok) {
                setLoading(false);
                setSuccess(true);
                setError("");
                setName(""); setPrice("");
                setImageUri(null);
                if (passedBarcode) navigation.goBack();
            } else {
                const err = await res.json();
                setError(getErrorMessage(err) || 'Failed to create product. Please check your input and try again.');
                setSuccess(false);
                setLoading(false);
            }
        } catch (e) {
            setError(getErrorMessage(e));
            setSuccess(false);
            setLoading(false);
        }
    };

    return(
        <SafeAreaView style={styles.screen}>
            <CustomHeader nav={navigation} title='Add Product'/> 

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Image input */}
                <Animatable.View animation="slideInUp" duration={650} delay={60} style={styles.imageInputContainer}>
                    <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                        {imageUri
                            ? <Image style={styles.imagePicked} source={{ uri: imageUri }}/>
                            : <>
                                <FontAwesome6 style={styles.imagePickerIcon} name="camera" size={24} color={'black'}/>
                                <Text style={styles.imagePickerLabel}>Add Image</Text>
                              </>
                        }

                    </TouchableOpacity>
                </Animatable.View>

                {/* Name input */}
                <Animatable.View animation="slideInUp" duration={650} delay={180} style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter product name"
                        value={name}
                        onChangeText={setName}
                    />
                </Animatable.View>

                {/* Price input */}
                <Animatable.View animation="slideInUp" duration={650} delay={240} style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Price</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter price"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />
                </Animatable.View>

                {/* Barcode input */}
                {passedBarcode &&
                    <Animatable.View animation="slideInUp" duration={650} delay={300} style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Custom Barcode</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: '#f0f0f0', color: '#888' }]}
                            value={passedBarcode}
                            editable={false}
                        />
                    </Animatable.View>
                }

                {success ? (
                    <SuccessMessage message="Product created successfully!" />
                ) : null}

                {error ? <ErrorMessage message={error} /> : null}

                {/* Action buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Go Back</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>Register</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}