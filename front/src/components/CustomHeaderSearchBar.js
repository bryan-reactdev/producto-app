import { StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native"
import { useRef } from "react"
import { FontAwesome6 } from '@expo/vector-icons'
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SIZING, SPACING } from "../StyleConstants"
import { LinearGradient } from "expo-linear-gradient"

export default function CustomHeader({nav, title = "Page", searchValue, onSearchChange}){
    const inputRef = useRef(null)
    
    return (
        <View style={styles.header}>
            <View style={styles.headerMain}>
                <TouchableOpacity style={styles.headerBackButton} onPress={() => nav.goBack()}>
                    <FontAwesome6 name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>{title}</Text>

                {/* Search Button */}
                <TouchableOpacity
                style={styles.searchButton}
                onPress={() => inputRef.current && inputRef.current.focus()}
                activeOpacity={0.7}
                >
                <LinearGradient
                    colors={['rgba(184, 184, 184, 0.2)', 'rgba(198, 199, 203, 0.0)']}
                    start={{ x: 0.1, y: 1.5 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.searchButtonGradient}
                >
                    <FontAwesome6
                        style={styles.searchButtonIcon}
                        name="magnifying-glass"
                        size={32}
                        color={COLORS.buttonIconPrimary}
                    />
                </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <LinearGradient
                    colors={['rgba(184, 184, 184, 0.3)', 'rgba(198, 199, 203, 0.8)']}
                    start={{ x: 0.1, y: 1.5 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.searchBarGradient}
                >
                    <FontAwesome6
                        style={styles.searchBarIcon}
                        name="magnifying-glass"
                        size={32}
                        color={COLORS.buttonIconPrimary}
                    />

                    <TextInput
                        ref={inputRef}
                        style={styles.searchBarInput}
                        placeholder="Search a product or project"
                        value={searchValue}
                        onChangeText={onSearchChange}
                        placeholderTextColor={COLORS.textPrimary}
                    />
                </LinearGradient>
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
    searchBar: {
        width: '90%',
        height: 50,
      
        alignSelf: 'center',
        justifyContent: 'center',
      
        marginBottom: SPACING.base,
        padding: 1,
      
        borderWidth: BORDER_WIDTH.base,
        borderRadius: BORDER_RADIUS.xl,
        borderBottomWidth: BORDER_WIDTH.sm,
      
        borderTopColor: '#b4b5b7',
        borderLeftColor: '#a1a2a4',
        borderRightColor: '#a1a2a4',
        borderBottomColor: '#7a7b7c',
      
        overflow: 'hidden', // required for inner gradient corners
    },
    
    searchBarGradient: {
        display:'flex',
        flex: 1,

        flexDirection:'row',
        paddingHorizontal: SIZING.xs,

        alignItems:'center',

        borderRadius: BORDER_RADIUS.xl,
    },
    
    searchBarInput: {
        flex:1,
        includeFontPadding: false,
        
        fontFamily: 'secondary-regular',
        fontSize: FONT_SIZES.sm,

        color: COLORS.textPrimary,
    },
    searchBarIcon: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.buttonIconPrimary,
    },
    
headerTitle:{
    display:'flex',
    includeFontPadding: false,
    fontFamily:'primary-regular',
    fontSize:FONT_SIZES.xxl,
    color: COLORS.textPrimary,
},
searchButton: {
    width: SIZING.lg,
    height: SIZING.lg,
    
    marginLeft: 'auto',
    marginRight: SPACING.lg,
    
    borderWidth: BORDER_WIDTH.base,
    borderRadius: BORDER_RADIUS.xxl,
    borderBottomWidth: BORDER_WIDTH.sm,
    
    borderTopColor: '#b4b5b7',
    borderLeftColor: '#a1a2a4',
    borderRightColor: '#a1a2a4',
    borderBottomColor: '#7a7b7c',
    overflow: 'hidden', // ensures rounded corners apply to gradient
},
    
searchButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
},

searchButtonIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.buttonIconPrimary,
},
      
})