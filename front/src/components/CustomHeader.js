import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import { FontAwesome6 } from '@expo/vector-icons'
import { FONT_SIZES, SPACING, COLORS } from "../StyleConstants"

export default function CustomHeader({nav, title = "Page"}){
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerBackButton} onPress={() => nav.goBack()}>
                <FontAwesome6 name="arrow-left" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header:{
        display:'flex',
        width:'100%',
        height:75,
        
        flexDirection:'row',
        alignItems:'center',
        
        marginTop:SPACING.sm,
        marginLeft:SPACING.sm,
        gap:SPACING.sm,

    },
    headerTitle:{
        display:'flex',
        includeFontPadding: false,
        fontFamily:'primary-regular',
        fontSize:FONT_SIZES.xxl,
        color: COLORS.textPrimary,
    },
})