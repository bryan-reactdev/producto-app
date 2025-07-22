import { StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native"
import { useRef } from "react"
import { FontAwesome6 } from '@expo/vector-icons'
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SIZING, SPACING } from "../StyleConstants"

export default function CustomHeader({nav, title = "Page", searchValue, onSearchChange}){
    const inputRef = useRef(null)
    
    return (
        <View style={styles.header}>
            <View style={styles.headerMain}>
                <TouchableOpacity style={styles.headerBackButton} onPress={() => nav.goBack()}>
                    <FontAwesome6 name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>{title}</Text>

                <TouchableOpacity style={styles.searchButton} onPress={() => inputRef.current && inputRef.current.focus()}>
                    <FontAwesome6 style={styles.searchButtonIcon} name="magnifying-glass" size={32} color={COLORS.textPrimary}/>
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <TextInput 
                    ref={inputRef}
                    style={styles.searchBarInput} 
                    placeholder="Search a product or project"
                    value={searchValue}
                    onChangeText={onSearchChange}
                    placeholderTextColor={COLORS.textSecondary}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header:{

    },
    headerMain:{
        display:'flex',
        width:'100%',
        height:75,
        
        flexDirection:'row',
        alignItems:'center',
        
        marginTop:SPACING.sm,
        marginLeft:SPACING.sm,
        gap:SPACING.sm,
    },
    searchBar:{
        display:'flex',
        width:'90%',
        height:50,

        alignSelf: 'center',
        justifyContent:'center',

        paddingHorizontal:SIZING.xs,
        marginBottom:SPACING.base,

        borderWidth:BORDER_WIDTH.sm,
        borderRadius: BORDER_RADIUS.xxl,

        borderColor:COLORS.borderSecondary,
        backgroundColor:COLORS.inputSecondary
    },
    searchBarInput:{
        includeFontPadding:false,
        
        fontFamily:'secondary-regular',
        fontSize:FONT_SIZES.sm,

        color:COLORS.textPrimary,
    },

    headerTitle:{
        display:'flex',
        includeFontPadding: false,
        fontFamily:'primary-regular',
        fontSize:FONT_SIZES.xxl,
        color: COLORS.textPrimary,
    },
    searchButton:{
        display:'flex',
        width:SIZING.lg,
        height:SIZING.lg,

        alignItems:'center',
        justifyContent:'center',

        marginLeft:'auto',
        marginRight:SPACING.lg,
        borderWidth:BORDER_WIDTH.sm,
        borderRadius:BORDER_RADIUS.xxl,

        borderColor:COLORS.borderPrimary,
        backgroundColor:COLORS.backgroundPrimary
    },
    searchButtonIcon:{
        fontSize: FONT_SIZES.lg,
    },
})