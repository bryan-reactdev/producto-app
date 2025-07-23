import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeaderSearchBar from "../../components/CustomHeaderSearchBar";
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from "react-native";
import styles from './ProductsStyle';
import ProductRow from "../../components/ProductRow";
import useFetch from "../../hooks/useFetch";
import { FontAwesome6 } from '@expo/vector-icons';
import useAdmin from "../../hooks/useAdmin";
import ErrorMessage from '../../components/ErrorMessage';
import * as Animatable from 'react-native-animatable';
import { useCallback, useEffect, useState, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function AllProducts({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [localProducts, setLocalProducts] = useState([]);
    const { data: products, isPending: areProductsLoading, error: productsError, refetch: refetchProducts } = useFetch('products');
    const { isAdmin } = useAdmin();

    // Track if screen was focused before to avoid duplicate fetches on initial mount
    const hasBeenFocused = useRef(false);

    // Sync products into local state when products data changes
    useEffect(() => {
        if (products) {
            setLocalProducts(products);
        }
    }, [products]);

    // Refetch products only when screen regains focus after initial mount
    useFocusEffect(
        useCallback(() => {
            if (hasBeenFocused.current) {
                refetchProducts();
            } else {
                hasBeenFocused.current = true;
            }
        }, [refetchProducts])
    );

    const filteredProducts = localProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProductDeleted = (deletedId) => {
        setLocalProducts(prev => prev.filter(p => p.id !== deletedId));
    };

    if (areProductsLoading) {
        return (
            <ImageBackground
                style={styles.screen}
                imageStyle={{ left: -10, top: -10 }}
                source={require('../../../assets/images/ProdutcScreen/background.jpg')}
                resizeMode="cover"
            >
                <View style={styles.blurOverlay} />
                <SafeAreaView style={styles.screen}>
                    <CustomHeaderSearchBar
                        nav={navigation}
                        title={"Products"}
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        onBackPress={() => { navigation.goBack(); }}
                    />
                    <View style={styles.container}>
                        <ScrollView style={styles.listScrollView} contentContainerStyle={{ gap: 8 }}>
                            <ActivityIndicator size="large" style={{ marginTop: 32 }} />
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }

    if (productsError) {
        return (
            <ImageBackground
                style={styles.screen}
                imageStyle={{ left: -10, top: -10 }}
                source={require('../../../assets/images/ProdutcScreen/background.jpg')}
                resizeMode="cover"
            >
                <View style={styles.blurOverlay} />
                <SafeAreaView style={styles.screen}>
                    <CustomHeaderSearchBar
                        nav={navigation}
                        title={"Products"}
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        onBackPress={() => navigation.goBack()}
                    />
                    <View style={styles.container}>
                        <ErrorMessage message={productsError} onRetry={refetchProducts} />
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            style={styles.screen}
            imageStyle={{ left: -10, top: -10 }}
            source={require('../../../assets/images/ProdutcScreen/background.jpg')}
            resizeMode="cover"
        >
            <View style={styles.blurOverlay} />
            <SafeAreaView style={styles.screen}>
                <CustomHeaderSearchBar
                    nav={navigation}
                    title={"Products"}
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    onBackPress={() => { navigation.goBack(); }}
                />

                <View style={styles.container}>
                    <ScrollView style={styles.listScrollView} contentContainerStyle={{ gap: 8 }}>
                        {isAdmin &&
                            <TouchableOpacity style={styles.createGroupButton} onPress={() => navigation.navigate('AddProduct')}>
                                <FontAwesome6 style={styles.createGroupButtonIcon} name="plus" size={24} color={'black'} />
                                <Text style={styles.createGroupButtonLabel}>
                                    Create a new Product
                                </Text>
                            </TouchableOpacity>
                        }

                        {filteredProducts.map((product, index) => (
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
        </ImageBackground>
    );
}
