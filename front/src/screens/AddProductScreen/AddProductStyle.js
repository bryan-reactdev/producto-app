import { StyleSheet } from "react-native";
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SIZING, SPACING } from "../../StyleConstants";

export default StyleSheet.create({
    blurOverlay:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        zIndex: 0,
    },
    screen:{
        display:'flex',
        flex:1,
    },
    container:{
        display:'flex',
        width:'80%',

        alignSelf:'center',

        alignItems:'center',
        justifyContent:'center',

        gap:SPACING.lg,
        padding:SIZING.sm,

        borderWidth:BORDER_WIDTH.sm,
        borderRadius:BORDER_RADIUS.xl,
        
        borderColor:COLORS.borderSecondary,
        backgroundColor:COLORS.backgroundPrimary,
    },

    imageInputContainer:{
        display:'flex',
    },
    imagePickerButton:{
        display:'flex',
        width:175,
        height:200,

        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

        gap:SPACING.xs,

        borderWidth:BORDER_WIDTH.base,
        borderStyle:'dashed',
        borderRadius:BORDER_RADIUS.xl,
        
        borderColor:COLORS.borderSecondary,
        backgroundColor:COLORS.inputSecondary,
    },
    imagePicked:{
        width:'90%',
        height:'90%',
        
        borderRadius:BORDER_RADIUS.base,
    },
    imagePickerIcon:{
        includeFontPadding:false,
        fontSize: FONT_SIZES.base,

        color:COLORS.textSave
    },
    imagePickerLabel:{
        includeFontPadding:false,

        fontSize:FONT_SIZES.base,
        fontFamily:'secondary-bold',
        color: COLORS.textPrimaryContrast,
    },

    inputContainer: {
        width: '100%',

        gap:SPACING.xs,
    },
    inputLabel:{
        includeFontPadding:false,
        fontFamily:'secondary-regular',
        fontSize:FONT_SIZES.base,
        color: COLORS.textPrimaryContrast,
    },
    input: {
        width: '100%',
        minHeight:65,

        padding:SIZING.xs,

        borderWidth: BORDER_WIDTH.sm,
        borderRadius: BORDER_RADIUS.xl,

        justifyContent:'center',

        includeFontPadding:false,
        fontFamily:'secondary-regular',
        fontSize:FONT_SIZES.base,

        color:COLORS.textPrimaryContrast,
        borderColor:COLORS.borderSecondary,
        backgroundColor:COLORS.inputSecondary,
    },
    inputPlaceholder:{
        includeFontPadding:false,
        fontFamily:'secondary-regular',
        fontSize:FONT_SIZES.base,

        color:COLORS.textSecondary,
        backgroundColor:COLORS.inputSecondary,
    },
    dropdownItem: {
        fontSize: FONT_SIZES.base,
        fontFamily: 'secondary-regular',
        
        color: COLORS.textPrimaryContrast,
    },
    
    buttonRow:{
        display:'flex',
        
        flexDirection:'row',
        marginTop:SPACING.sm,

        gap:SPACING.sm,
    },
    cancelButton:{
        display:'flex',

        alignItems:'center',
        justifyContent:'center',

        width:100,
        height:50,

        borderWidth:BORDER_WIDTH.sm,
        borderRadius: BORDER_RADIUS.lg,

        borderColor:COLORS.borderSecondary,
        backgroundColor:COLORS.buttonSecondary,
    },
    registerButton:{
        display:'flex',

        alignItems:'center',
        justifyContent:'center',

        width:100,
        height:50,

        borderRadius: BORDER_RADIUS.lg,

        backgroundColor:COLORS.buttonPrimary,
    },
    cancelButtonText:{
        includeFontPadding:false,
        fontFamily:'secondary-regular',

        color:COLORS.textSecondary,
    },
    registerButtonText:{
        includeFontPadding:false,
        fontFamily:'secondary-regular',

        color:COLORS.textPrimary,
    }
})