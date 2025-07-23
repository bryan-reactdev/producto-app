import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native"
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SPACING, SIZING } from "../StyleConstants"
import { FontAwesome6 } from "@expo/vector-icons"
import useAdmin from '../hooks/useAdmin';

export default function GroupRow({name, count, onPress, hideIcon, onRename, onDelete}){
    const { isAdmin } = useAdmin();
    return(
        <TouchableOpacity style={styles.groupRow} onPress={onPress}>
            <FontAwesome6 style={styles.groupRowIcon} name="box" size={32} color={COLORS.textPrimary}/>

            <View>
                <Text style={styles.groupRowName}>{name}</Text>
                <Text style={styles.groupRowCount}>Products: {count}</Text>
            </View>

            {!hideIcon && (
                <View style={styles.groupRowActions}>
                    {isAdmin && (
                        <>
                        <TouchableOpacity
                            style={styles.renameButton}
                            onPress={e => {
                                e.stopPropagation && e.stopPropagation();
                                if (onRename) onRename();
                            }}
                        >
                        <FontAwesome6 name="pen" size={FONT_SIZES.xs} color={COLORS.buttonIconPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={e => {
                                e.stopPropagation && e.stopPropagation();
                                Alert.alert(
                                  'Delete Group',
                                  'Are you sure you want to delete this group and all its products?',
                                  [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Delete', style: 'destructive', onPress: () => { if (onDelete) onDelete(); } }
                                  ]
                                );
                            }}
                        >
                            <FontAwesome6 name="trash" size={FONT_SIZES.xs} color={COLORS.textDelete} />
                        </TouchableOpacity>
                        </>
                    )}
                    <FontAwesome6 style={styles.groupRowArrow} name="angle-right" size={FONT_SIZES.lg} color={COLORS.textPrimaryContrast}/>
                </View>
            )}
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

        color:COLORS.textPrimaryContrast,
    },
    groupRowDetails:{
        display:'flex',
    },
    groupRowName:{
        includeFontPadding: false,
        fontFamily:'secondary-bold',

        color:COLORS.textPrimaryContrast,
    },
    groupRowCount:{
        includeFontPadding: false,

        fontFamily:'secondary-regular',
        color:COLORS.textDetail,
    },
    groupRowActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        gap: SPACING.xs,
    },
    groupRowArrow:{
        display:'flex',
    },
    renameButton: {
        display: 'flex',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        padding: SIZING.xxs,
        marginLeft: SPACING.xxs,

        borderRadius: BORDER_RADIUS.xl,

        backgroundColor: COLORS.buttonPrimary,
    },
    deleteButton: {
        display: 'flex',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        padding: SIZING.xxs,
        marginLeft: SPACING.xxs,

        borderRadius: BORDER_RADIUS.xl,

        backgroundColor: COLORS.buttonSecondary,
    },
})