import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeaderSearchBar from "../../components/CustomHeaderSearchBar";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Text, View, BackHandler, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
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

export default function Products({navigation}){
    // --- Group Stuff ---
    const { groups, areGroupsLoading, groupsError, refetch } = useGroups();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const {data: fetchedProducts, isPending: areProductsLoading, error: productsError, refetch: refetchProducts} = useFetch(`groups/${selectedGroup?.id}`);
    const [products, setProducts] = useState([]);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [groupToRename, setGroupToRename] = useState(null);
    const [deletingGroupId, setDeletingGroupId] = useState(null);

    const {isAdmin} = useAdmin();
    const isFocused = useIsFocused();

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
        if (!isFocused) return;
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
    }, [navigation, handleBackPress, selectedGroup, isFocused]);

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

    const handleDeleteGroup = async (group) => {
      setDeletingGroupId(group.id);
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://192.168.3.182:3000'}/api/groups/${group.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          Alert.alert('Error', 'Failed to delete group.');
        } else {
          if (refetch) refetch();
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to delete group.');
      } finally {
        setDeletingGroupId(null);
      }
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
    if (selectedGroup) {
        if (areProductsLoading) {
            return renderLoading(selectedGroup.name);
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
                        )
                    }
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
    )
}