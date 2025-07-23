import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SPACING } from "../StyleConstants";


export default function TransparentMenuButton({onPress, icon, children}){
    return(
    <Animatable.View animation="slideInLeft" delay={60} duration={650} easing="ease-out-cubic" style={styles.animatableWrapper}>
        <TouchableOpacity style={styles.menuButton} onPress={onPress}>
            <LinearGradient 
            colors={['rgba(184, 184, 184, 0.2)', 'rgba(198, 199, 203, 0.0)']}
            start={{ x: 0.1, y: 1.5 }}
            end={{ x: 0, y: 0 }}
            style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}
            >
                <FontAwesome6 style={styles.menuButtonIcon} name={icon} size={32} color={'#000'}/>
                <Text style={styles.menuButtonText}>{children}</Text>

            </LinearGradient>
        </TouchableOpacity>
    </Animatable.View>
    )
}

const styles = StyleSheet.create({
    animatableWrapper: {
        width: '80%',
        alignItems: 'center',
    },
    menuButton:{
        display:'flex',
        alignItems:'center',
        width:'100%',
        height:100,
        
        borderWidth: BORDER_WIDTH.base,
        borderRadius: BORDER_RADIUS.xl,
        borderBottomWidth:BORDER_WIDTH.sm,

        borderTopColor: '#b4b5b7',
        borderLeftColor: '#a1a2a4',
        borderRightColor: '#a1a2a4',
        borderBottomColor: '#7a7b7c',
    },
    menuButtonIcon:{
        marginTop:SPACING.base,

        fontSize:FONT_SIZES.xxl,

        color: COLORS.buttonIconPrimary,
    },
    menuButtonText:{
        includeFontPadding: false,

        marginTop:SPACING.xs,
        marginBottom:SPACING.base,
        
        fontFamily:'primary-medium',
        fontSize:FONT_SIZES.sm,
        color: COLORS.buttonTextPrimary,
    },
})