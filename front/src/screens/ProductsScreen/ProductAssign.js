import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeaderSearchBar from "../../components/CustomHeaderSearchBar";
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import styles from './ProductsStyle'
import ProductRow from "../../components/ProductRow";
import useFetch from "../../hooks/useFetch";
import { FontAwesome6 } from '@expo/vector-icons';
import ErrorMessage from '../../components/ErrorMessage';
import * as Animatable from 'react-native-animatable';
import { useCallback, useEffect, useState } from "react";
import { getErrorMessage, retryWithBackoff } from "../../utils/errorHandling";
import { useFocusEffect } from "@react-navigation/native";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://31.220.51.108:3000';

export default function ProductAssign({navigation, route}){
    const passedGroup = route?.params?.selectedGroup || null;

    const [searchQuery, setSearchQuery] = useState("");
    const [localProducts, setLocalProducts] = useState([]);

    const {data: products, isPending: areProductsLoading, error: productsError, refetch: refetchProducts} = useFetch('products');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState(null);

    const handleSelect = (selectedProductId) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(selectedProductId)) {
                // Already selected → remove it
                return prevSelected.filter(id => id !== selectedProductId);
            } else {
                // Not selected → add it
                return [...prevSelected, selectedProductId];
            }
        });
    };

    const handleGroupAssign = () => {
      if (!passedGroup || !Array.isArray(selectedProducts) || selectedProducts.length === 0) return;
    
      Alert.alert(
        'Assign Group',
        `Are you sure you want to assign this group to ${selectedProducts.length} product(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Assign',
            style: 'default',
            onPress: async () => {
              setAssigning(true);
              try {
                const res = await retryWithBackoff(() =>
                  fetch(`${API_BASE}/api/products/assign-group`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      group_id: passedGroup.id,        // use passedGroup.id here
                      product_ids: selectedProducts,   // use selectedProducts here
                    }),
                  })
                );
                                
                if (!res.ok) {
                    let errorMessage = 'Could not assign group to products. Please try again later.';
                
                    try {
                    const data = await res.json();
                    if (data && data.error) {
                        errorMessage = data.error;
                    } else if (data && data.message) {
                        errorMessage = data.message;
                    }
                    } catch {
                    // If response isn't JSON, fallback to status text or default message
                    errorMessage = res.statusText || errorMessage;
                    }
                
                    throw new Error(errorMessage);
                }

                Alert.alert(`Succesfully assigned ${selectedProducts.length} products to group: ` + passedGroup.name)
                navigation.goBack();
              } catch (e) {
                Alert.alert(getErrorMessage(e))
              } finally {
                setAssigning(false);
              }
            },
          },
        ]
      );
    };

    useFocusEffect(
        useCallback(() => {
          if (products && passedGroup) {
            const filtered = products.filter(p => {
              return !passedGroup.products.some(gp => gp.id === p.id);
            });
            setLocalProducts(filtered);
          }
        }, [products, passedGroup])
      );

    // --- Shared loading component ---
    const renderLoading = () => (
        <SafeAreaView style={styles.screen}>
            <CustomHeaderSearchBar 
                nav={navigation}
                title={"Products"}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onBackPress={() => { navigation.goBack(); } }
            />
            
            <View style={styles.container}>
                <ActivityIndicator size="large" style={{ marginTop: 32 }} />
            </View>
        </SafeAreaView>
    );

    if (areProductsLoading){
        return renderLoading();
    }

    if (productsError) {
        return (
            <SafeAreaView style={styles.screen}>
                <CustomHeaderSearchBar 
                    nav={navigation}
                    title={selectedGroup.name}
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    onBackPress={() => setSelectedGroup(null)}
                />
                <View style={styles.container}>
                    <ErrorMessage message={productsError} onRetry={refetchProducts} />
                </View>
            </SafeAreaView>
        );
    }

    return(
        <SafeAreaView style={styles.screen}>
            <CustomHeaderSearchBar 
                nav={navigation} 
                title={"Products"}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onBackPress={() => { navigation.goBack(); }}
            />

            <View style={styles.container}>
                <ScrollView style={[styles.listScrollView, selectedProducts.length > 0 && customStyle.listScrollView]} contentContainerStyle={{gap:8}}>
                    {localProducts.map((product, index) => (
                        <Animatable.View
                            key={product.id}
                            animation="slideInUp"
                            duration={650}
                            delay={index * 60}
                        >
                            <ProductRow
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image_url}
                                barcode={product.barcode}
                                handleSelect={() => handleSelect(product.id)}
                                isSelected={selectedProducts.includes(product.id)}
                            />
                        </Animatable.View>
                    ))}
                </ScrollView>
            </View>

            {selectedProducts.length > 0 &&
                <Animatable.View animation="slideInUp" delay={0} duration={450} easing="ease-out-cubic" style={styles.animatableWrapper}>
                        <TouchableOpacity style={styles.createGroupButton} onPress={() => handleGroupAssign()}>
                            <FontAwesome6 style={styles.createGroupButtonIcon} name="box" size={32} color={'#000'}/>
                            <Text style={styles.createGroupButtonLabel}>Assign Products to Project</Text>
                        </TouchableOpacity>
                </Animatable.View>
            }
        </SafeAreaView>
    )
}

const customStyle = StyleSheet.create({
    listScrollView:{
        height:'60%',
    }
})