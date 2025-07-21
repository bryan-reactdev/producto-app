import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeaderSearchBar from "../../components/CustomHeaderSearchBar";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, BackHandler, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from './ProductsStyle'
import GroupRow from "../../components/GroupRow";
import ProductRow from "../../components/ProductRow";
import useFetch from "../../hooks/useFetch";
import useGroups from "../../hooks/useGroups";
import { FontAwesome6 } from '@expo/vector-icons';
import GroupCreateModal from '../../components/GroupCreateModal';
import useAdmin from "../../hooks/useAdmin";
import ErrorMessage from '../../components/ErrorMessage';

export default function Products({navigation}){
    // --- Group Stuff ---
    const { groups, areGroupsLoading, groupsError, refetch } = useGroups();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const {data: fetchedProducts, isPending: areProductsLoading, error: productsError, refetch: refetchProducts} = useFetch(`groups/${selectedGroup?.id}`);
    const [products, setProducts] = useState([]);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);

    const {isAdmin} = useAdmin();

    // Sync local products state with fetched data
    useEffect(() => {
        if (fetchedProducts) setProducts(fetchedProducts);
    }, [fetchedProducts]);

    // Refetch products when screen regains focus and a group is selected
    useFocusEffect(
        useCallback(() => {
            if (selectedGroup && refetchProducts) {
                refetchProducts();
            }
        }, [selectedGroup, refetchProducts])
    );

    // Handle back button press
    const handleBackPress = useCallback(() => {
        if (selectedGroup) {
            setSelectedGroup(null);
            return true;
        }
        return false;
    }, [selectedGroup]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackPress
        );

        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (selectedGroup) {
                e.preventDefault();
                setSelectedGroup(null);
            }
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [navigation, handleBackPress, selectedGroup]);

    // Filtered lists
    const filteredGroups = groups ? groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];
    const filteredProducts = products ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

    // Optimistic update handler
    const handleProductDeleted = (deletedId) => {
        setProducts(prev => prev.filter(p => p.id !== deletedId));
        if (refetchProducts) refetchProducts();
    };

    // --- Group creation handler ---
    // Optionally, refresh groups after creation
    // If useGroups exposes a refetch, call it here. Otherwise, rely on re-render or manual refresh.
    const handleGroupCreated = () => {
        if (refetch) refetch();
    };

    // --- Shared loading component ---
    const renderLoading = (title) => (
        <SafeAreaView style={styles.screen}>
            <CustomHeaderSearchBar 
                nav={navigation}
                title={title}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onBackPress={() => {
                    if (selectedGroup) {
                        setSelectedGroup(null);
                        setSearchQuery("");
                    } else {
                        navigation.goBack();
                    }
                }}
            />
            <View style={styles.container}>
                <ActivityIndicator size="large" style={{ marginTop: 32 }} />
            </View>
        </SafeAreaView>
    );

    // --- Product error/empty handling ---
    if (selectedGroup && areProductsLoading) {
        return renderLoading(selectedGroup.name);
    }

    if (selectedGroup && productsError) {
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

    if (selectedGroup && !areProductsLoading && !productsError && filteredProducts.length === 0) {
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
                    <ErrorMessage message="No products found in this group." />
                </View>
            </SafeAreaView>
        );
    }

    // --- Group loading handling ---
    if (areGroupsLoading) {
        return renderLoading('GROUPS');
    }

    if (groupsError) {
        return (
            <SafeAreaView style={styles.screen}>
                <CustomHeaderSearchBar 
                    nav={navigation} 
                    title="GROUPS"
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    onBackPress={() => navigation.goBack()}
                />
                <View style={styles.container}>
                    <ErrorMessage message={groupsError} onRetry={refetch} />
                </View>
            </SafeAreaView>
        );
    }

    // Show message if no groups found (but only if not loading and no error)
    if (!areGroupsLoading && !groupsError && (!groups || groups.length === 0)) {
        return (
            <SafeAreaView style={styles.screen}>
                <CustomHeaderSearchBar 
                    nav={navigation} 
                    title="GROUPS"
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    onBackPress={() => navigation.goBack()}
                />
                <View style={styles.container}>
                    <ErrorMessage message="No groups found." />
                </View>
            </SafeAreaView>
        );
    }

    return(
        <SafeAreaView style={styles.screen}>
            <CustomHeaderSearchBar 
                nav={navigation} 
                title={!selectedGroup
                    ? "GROUPS"
                    : selectedGroup.name
                }
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onBackPress={() => {
                    if (selectedGroup) {
                        setSelectedGroup(null);
                        setSearchQuery("");
                    } else {
                        navigation.goBack();
                    }
                }}
            />

            <View style={styles.container}>
                <ScrollView style={styles.listScrollView} contentContainerStyle={{gap:8}}>
                    {selectedGroup == null
                        ? (
                            <>
                                {isAdmin && 
                                    <TouchableOpacity style={styles.createGroupButton} onPress={() => setModalVisible(true)}>
                                        <FontAwesome6 style={styles.createGroupButtonIcon} name="plus" size={24} color={'black'} />
                                        <Text style={styles.createGroupButtonLabel}>
                                            Create a new Group
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {filteredGroups.map((group, index) => (
                                    <GroupRow
                                        key={index}
                                        name={group.name}
                                        count={group.count}
                                        onPress={() => { setSelectedGroup(group); setSearchQuery(""); }}
                                    />
                                ))}
                            </>
                        )
                        : (
                            <>
                                {isAdmin &&
                                    <TouchableOpacity style={styles.createGroupButton} onPress={() => navigation.navigate('AddProduct', { selectedGroup })}>
                                        <FontAwesome6 style={styles.createGroupButtonIcon} name="plus" size={24} color={'black'} />
                                        <Text style={styles.createGroupButtonLabel}>
                                            Create a new Product
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {filteredProducts.map((product, index) => (
                                    <ProductRow
                                        key={index}
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        image={product.image_url}
                                        barcode={product.barcode}
                                        onProductDeleted={handleProductDeleted}
                                    />
                                ))}
                            </>
                        )
                    }
                </ScrollView>
            </View>
            
            <GroupCreateModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCreate={handleGroupCreated}
            />
        </SafeAreaView>
    )
}