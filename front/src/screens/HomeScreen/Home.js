import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import styles from './HomeStyle'
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from 'react';
import AdminPinModal from '../../components/AdminPinModal';
import useAdmin from '../../hooks/useAdmin';
import { BORDER_RADIUS, COLORS, SPACING } from "../../StyleConstants";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import TransparentMenuButton from "../../components/TransparentMenuButton";


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
        <ImageBackground style={styles.container} imageStyle={{ left:-10, top: -10 }} source={require('../../../assets/images/background.jpg')} resizeMode="cover">
        <View style={styles.blurOverlay}/>

        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>INVENTORY MANAGER</Text>

            {/* Menu Actions */}


            <View style={styles.menuActions}>
                {/* Scan */}
                <TransparentMenuButton onPress={() => navigation.navigate('Scan')} icon={'expand'}>
                    Scan a Product
                </TransparentMenuButton>

                {/* Products */}
                <TransparentMenuButton onPress={() => navigation.navigate('AllProducts')} icon={'box'}>
                    View Products
                </TransparentMenuButton>

                {/* Projects */}
                <TransparentMenuButton onPress={() => navigation.navigate('Groups')} icon={'sheet-plastic'}>
                    View Projects
                </TransparentMenuButton>

                {/* Add Products */}
                {isAdmin &&
                    <TransparentMenuButton onPress={() => navigation.navigate('AddProduct')} icon={'plus'}>
                        Add a Product
                    </TransparentMenuButton>
                }

                <Animatable.View animation="slideInUp" delay={240} duration={650} easing="ease-out-cubic" style={styles.animatableWrapper}>
                    <TouchableOpacity style={styles.menuAdminButton} onPress={handleAdminPress}>
                    <LinearGradient 
                          colors={['rgba(149, 150, 156, 0.2)', 'rgba(198, 199, 203, 0.0)']}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 0 }}
                        style={{display:'flex', width:'100%', height:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center', gap: SPACING.xs,}}
                    >
                        <FontAwesome6 style={styles.menuAdminButtonIcon} name="shield" size={32} color={'black'}/>

                        {!isAdmin
                            ? <Text style={styles.menuAdminButtonText}> Enable Admin Mode </Text>
                            : <Text style={styles.menuAdminButtonText}> Disable Admin Mode </Text>
                        }

                    </LinearGradient>
                    </TouchableOpacity>
                </Animatable.View>

            </View>

            <AdminPinModal
                visible={pinModalVisible}
                onSubmit={checkPinAndEnable}
                onClose={() => setPinModalVisible(false)}
            />
            
        </SafeAreaView>
        </ImageBackground>
    );
}