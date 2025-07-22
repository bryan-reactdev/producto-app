import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeaderSearchBar from "../../components/CustomHeaderSearchBar";
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from './ProductsStyle'
import ProductRow from "../../components/ProductRow";
import useFetch from "../../hooks/useFetch";
import { FontAwesome6 } from '@expo/vector-icons';
import useAdmin from "../../hooks/useAdmin";
import ErrorMessage from '../../components/ErrorMessage';
import * as Animatable from 'react-native-animatable';
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function AllProducts({navigation}){
    const [searchQuery, setSearchQuery] = useState("");
    const [localProducts, setLocalProducts] = useState([]);
    const {data: products, isPending: areProductsLoading, error: productsError, refetch: refetchProducts} = useFetch('products');


    // Modal state
    const {isAdmin} = useAdmin();

    // Optimistic update handler
    const handleProductDeleted = (deletedId) => {
        setLocalProducts(prev => prev.filter(p => p.id !== deletedId));
    };

    // Refetch when screen regains focus for product add button
    useFocusEffect(
        useCallback(() => {
            refetchProducts();
        }, [refetchProducts])
    );

    useEffect(() => {
        if (products) {
            setLocalProducts(products);
        }
    }, [products]);

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
                <ScrollView style={styles.listScrollView} contentContainerStyle={{gap:8}}>
                    {isAdmin &&
                        <TouchableOpacity style={styles.createGroupButton} onPress={() => navigation.navigate('AddProduct')}>
                            <FontAwesome6 style={styles.createGroupButtonIcon} name="plus" size={24} color={'black'} />
                            <Text style={styles.createGroupButtonLabel}>
                                Create a new Product
                            </Text>
                        </TouchableOpacity>
                    }

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
                                onProductDeleted={handleProductDeleted}
                            />
                        </Animatable.View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}