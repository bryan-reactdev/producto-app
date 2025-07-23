import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import styles from './HomeStyle'
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import AdminPinModal from '../../components/AdminPinModal';
import useAdmin from '../../hooks/useAdmin';
import { SPACING } from "../../StyleConstants";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import TransparentMenuButton from "../../components/TransparentMenuButton";
import { Asset } from "expo-asset";


export default function Home({ navigation }){
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const { checkPinAndEnable, isAdmin, disableAdmin } = useAdmin();
    const [bgLoaded, setBgLoaded] = useState(false);

    useEffect(() => {
        const loadBackground = async () => {
            await Asset.loadAsync(require('../../../assets/images/background.webp'));
            setBgLoaded(true);
        };
        loadBackground();
    }, []);

    const handleAdminPress = () => {
        if (isAdmin) {
            disableAdmin();
        } else {
            setPinModalVisible(true);
        }
    };

    if (!bgLoaded) return null;

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}> {/* solid bg container */}
        <ImageBackground style={styles.container} imageStyle={{ left:-10, top: -10 }} source={require('../../../assets/images/background.webp')} resizeMode="cover">
        <View style={styles.blurOverlay}/>

        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>INVENTORY MANAGER</Text>

            {/* Menu Actions */}


            <View style={styles.menuActions}>
                {/* Scan */}
                <TransparentMenuButton onPress={() => navigation.navigate('Scan')} icon={'expand'} title={"Scan a Product"}/>

                {/* Products */}
                <TransparentMenuButton onPress={() => navigation.navigate('AllProducts')} icon={'box'} title={"View Products"}/>

                {/* Projects */}
                <TransparentMenuButton onPress={() => navigation.navigate('Groups')} icon={'sheet-plastic'} title={"View Projects"}/>

                {/* Add Products */}
                {isAdmin &&
                    <TransparentMenuButton onPress={() => navigation.navigate('AddProduct')} icon={'plus'} title={"Add a Product"}/>
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
        </View>
    );
}