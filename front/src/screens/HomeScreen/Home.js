import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import styles from './HomeStyle'
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from 'react';
import AdminPinModal from '../../components/AdminPinModal';
import useAdmin from '../../hooks/useAdmin';
import { COLORS } from "../../StyleConstants";

export default function Home({ navigation }){
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const { checkPinAndEnable, isAdmin, disableAdmin } = useAdmin();

    const handleAdminPress = () => {
        if (isAdmin) {
            disableAdmin();
        } else {
            setPinModalVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>INVENTORY MANAGER</Text>

            {/* Menu Actions */}
            <View style={styles.menuActions}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Scan')}>
                    <FontAwesome6 style={styles.menuButtonIcon} name="expand" size={32} color={'#000'}/>
                    <Text style={styles.menuButtonText}>Scan a Product</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Products')}>
                    <FontAwesome6 style={styles.menuButtonIcon} name="box" size={32} color={'#000'}/>
                    <Text style={styles.menuButtonText}>View Product Groups</Text>
                </TouchableOpacity>

                {isAdmin &&
                    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('AddProduct')}>
                        <FontAwesome6 style={styles.menuButtonIcon} name="plus" size={32} color={'#000'}/>
                        <Text style={styles.menuButtonText}>Add Product</Text>
                    </TouchableOpacity>
                }


                <TouchableOpacity style={styles.menuAdminButton} onPress={handleAdminPress}>
                    <FontAwesome6 style={styles.menuAdminButtonIcon} name="shield" size={32} color={'black'}/>
                    
                    {!isAdmin
                    ? 
                    <Text style={styles.menuAdminButtonText}>
                        Enable Admin Mode
                    </Text>
                    :
                    <Text style={[styles.menuAdminButtonText, { color: COLORS.textDelete }]}>
                        Disable Admin Mode
                    </Text>
                    }
                </TouchableOpacity>
            </View>

            <AdminPinModal
                visible={pinModalVisible}
                onSubmit={checkPinAndEnable}
                onClose={() => setPinModalVisible(false)}
            />
        </SafeAreaView>
    );
}