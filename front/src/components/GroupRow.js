import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SPACING } from "../StyleConstants"
import { FontAwesome6 } from "@expo/vector-icons"

export default function GroupRow({name, count, onPress, hideIcon}){
    return(
        <TouchableOpacity style={styles.groupRow} onPress={onPress}>
            <FontAwesome6 style={styles.groupRowIcon} name="box" size={32} color={COLORS.textPrimary}/>

            <View>
                <Text style={styles.groupRowName}>{name}</Text>
                <Text style={styles.groupRowCount}>Products: {count}</Text>
            </View>

            {!hideIcon &&
                <FontAwesome6 style={styles.groupRowArrow} name="caret-right" size={32} color={COLORS.textPrimary}/>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    groupRow:{
        display:'flex',
        width:'100%',

        flexDirection:'row',
        alignItems:'center',

        padding: SPACING.sm,
        gap: SPACING.sm,

        borderWidth:BORDER_WIDTH.sm,
        borderRadius:BORDER_RADIUS.base,

        borderColor: COLORS.borderPrimary,
        backgroundColor: COLORS.backgroundPrimary,
    },
    groupRowIcon:{
        fontSize:FONT_SIZES.xxl,
    },
    groupRowDetails:{
        display:'flex',
    },
    groupRowName:{
        includeFontPadding: false,
        fontFamily:'secondary-bold',
        color: COLORS.textPrimary,
    },
    groupRowCount:{
        includeFontPadding: false,

        fontFamily:'secondary-regular',
        color:COLORS.textSecondary,
    },
    groupRowArrow:{
        display:'flex',

        marginLeft:'auto'
    }
})