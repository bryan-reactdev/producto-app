import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeaderSearchBar from "../../components/CustomHeaderSearchBar";
import { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Text, View, BackHandler, ScrollView, TouchableOpacity, ActivityIndicator, Alert, ImageBackground } from "react-native";
import styles from './ProductsStyle'
import GroupRow from "../../components/GroupRow";
import ProductRow from "../../components/ProductRow";
import useFetch from "../../hooks/useFetch";
import useGroups from "../../hooks/useGroups";
import { FontAwesome6 } from '@expo/vector-icons';
import GroupCreateModal from '../../components/GroupCreateModal';
import GroupRenameModal from '../../components/GroupRenameModal';
import useAdmin from "../../hooks/useAdmin";
import ErrorMessage from '../../components/ErrorMessage';
import * as Animatable from 'react-native-animatable';

export default function Groups({ navigation }) {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    const { groups, areGroupsLoading, groupsError, refetch } = useGroups();
    const { data: fetchedGroupData, isPending: areProductsLoading, error: productsError, refetch: refetchProducts } = useFetch(selectedGroup ? `groups/${selectedGroup.id}` : null);
    const [products, setProducts] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [groupToRename, setGroupToRename] = useState(null);
    const [deletingGroupId, setDeletingGroupId] = useState(null);

    const { isAdmin } = useAdmin();
    const isFocused = useIsFocused();

    // Track if screen has been focused once (to prevent duplicate refetch on mount)
    const hasBeenFocused = useRef(false);

    // Sync local products state with fetched data
    useEffect(() => {
        if (fetchedGroupData) {
            // fetchedGroupData is the whole group object, products inside it
            setProducts(Array.isArray(fetchedGroupData.products) ? fetchedGroupData.products : []);
        } else {
            setProducts([]);
        }
    }, [fetchedGroupData]);

    // Refetch products & groups when screen regains focus and a group is selected
    useFocusEffect(
        useCallback(() => {
            if (!selectedGroup) return;

            if (hasBeenFocused.current) {
                refetchProducts && refetchProducts();
                refetch && refetch();
            } else {
                hasBeenFocused.current = true;
            }
        }, [selectedGroup, refetchProducts, refetch])
    );

    // Back button handler to deselect group first
    const handleBackPress = useCallback(() => {
        if (selectedGroup) {
            setSelectedGroup(null);
            hasBeenFocused.current = false;
            return true; // prevent default back action
        }
        return false; // allow back action
    }, [selectedGroup]);

    useEffect(() => {
        if (!isFocused) return;

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (selectedGroup) {
                e.preventDefault();
                setSelectedGroup(null);
                hasBeenFocused.current = false;
            }
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [navigation, handleBackPress, selectedGroup, isFocused]);

    const filteredGroups = groups ? groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];
    const filteredProducts = products ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

    const handleProductDeleted = (deletedId) => {
        setProducts(prev => prev.filter(p => p.id !== deletedId));
        refetchProducts && refetchProducts();
    };

    const handleGroupCreated = () => {
        refetch && refetch();
    };

    const handleDeleteGroup = async (group) => {
        setDeletingGroupId(group.id);
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://31.220.51.108:3000'}/api/groups/${group.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                Alert.alert('Error', 'Failed to delete group.');
            } else {
                refetch && refetch();
                setSelectedGroup(null);
                hasBeenFocused.current = false;
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to delete group.');
        } finally {
            setDeletingGroupId(null);
        }
    };

    const renderLoading = (title) => (
        <ImageBackground style={styles.screen} imageStyle={{ left: -10, top: -10 }} source={require('../../../assets/images/ProdutcScreen/background.jpg')} resizeMode="cover">
            <View style={styles.blurOverlay} />
            <SafeAreaView style={styles.screen}>
                <CustomHeaderSearchBar
                    nav={navigation}
                    title={title}
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    onBackPress={() => {
                        if (selectedGroup) {
                            setSelectedGroup(null);
                            hasBeenFocused.current = false;
                            setSearchQuery("");
                        } else {
                            navigation.goBack();
                        }
                    }}
                />
                <View style={styles.container}>
                    <ScrollView style={styles.listScrollView} contentContainerStyle={{ gap: 8 }}>
                        <ActivityIndicator size="large" style={{ marginTop: 32 }} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );

    if (selectedGroup) {
        if (areProductsLoading) {
            return renderLoading(selectedGroup.name);
        }
        if (productsError) {
            return (
                <ImageBackground style={styles.screen} imageStyle={{ left: -10, top: -10 }} source={require('../../../assets/images/ProdutcScreen/background.jpg')} resizeMode="cover">
                    <View style={styles.blurOverlay} />
                    <SafeAreaView style={styles.screen}>
                        <CustomHeaderSearchBar
                            nav={navigation}
                            title={selectedGroup.name}
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                            onBackPress={() => {setSelectedGroup(null); hasBeenFocused.current = false;}}
                        />
                        <View style={styles.container}>
                            <ErrorMessage message={productsError} onRetry={refetchProducts} />
                        </View>
                    </SafeAreaView>
                </ImageBackground>
            );
        }
    }

    if (areGroupsLoading) {
        return renderLoading(!selectedGroup ? 'PROJECTS' : selectedGroup.name);
    }

    if (groupsError) {
        return (
            <ImageBackground style={styles.screen} imageStyle={{ left: -10, top: -10 }} source={require('../../../assets/images/ProdutcScreen/background.jpg')} resizeMode="cover">
                <View style={styles.blurOverlay} />
                <SafeAreaView style={styles.screen}>
                    <CustomHeaderSearchBar
                        nav={navigation}
                        title="PROJECTS"
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        onBackPress={() => navigation.goBack()}
                    />
                    <View style={styles.container}>
                        <ErrorMessage message={groupsError} onRetry={refetch} />
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground style={styles.screen} imageStyle={{ left: -10, top: -10 }} source={require('../../../assets/images/ProdutcScreen/background.jpg')} resizeMode="cover">
            <View style={styles.blurOverlay} />

            <SafeAreaView style={styles.screen}>
                <CustomHeaderSearchBar
                    nav={navigation}
                    title={!selectedGroup ? "PROJECTS" : selectedGroup.name}
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    onBackPress={() => {
                        if (selectedGroup) {
                            setSelectedGroup(null);
                            hasBeenFocused.current = false;
                            setSearchQuery("");
                        } else {
                            navigation.goBack();
                        }
                    }}
                />

                <View style={styles.container}>
                    <ScrollView style={styles.listScrollView} contentContainerStyle={{ gap: 8 }}>
                        {selectedGroup == null ? (
                            <>
                                {isAdmin &&
                                    <TouchableOpacity style={styles.createGroupButton} onPress={() => setModalVisible(true)}>
                                        <FontAwesome6 style={styles.createGroupButtonIcon} name="plus" size={24} color={'black'} />
                                        <Text style={styles.createGroupButtonLabel}>
                                            Create a new Project
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {filteredGroups.map((group, index) => (
                                    <Animatable.View
                                        key={group.id}
                                        animation="slideInUp"
                                        duration={650}
                                        delay={index * 60}
                                    >
                                        <GroupRow
                                            name={group.name}
                                            count={group.count}
                                            onPress={() => { setSelectedGroup(group); setSearchQuery(""); }}
                                            onRename={() => { setGroupToRename(group); setRenameModalVisible(true); }}
                                            onDelete={() => handleDeleteGroup(group)}
                                        />
                                    </Animatable.View>
                                ))}
                            </>
                        ) : (
                            <>
                                {isAdmin &&
                                    <TouchableOpacity style={styles.createGroupButton} onPress={() => navigation.navigate('ProductAssign', { selectedGroup })}>
                                        <FontAwesome6 style={styles.createGroupButtonIcon} name="plus" size={24} color={'black'} />
                                        <Text style={styles.createGroupButtonLabel}>
                                            Assign Products
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
                            </>
                        )}
                    </ScrollView>
                </View>

                <GroupCreateModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onCreate={handleGroupCreated}
                />
                <GroupRenameModal
                    visible={renameModalVisible}
                    onClose={() => setRenameModalVisible(false)}
                    group={groupToRename}
                    onRenamed={() => { setRenameModalVisible(false); setGroupToRename(null); if (refetch) refetch(); }}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}
