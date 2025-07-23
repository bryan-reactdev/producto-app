import { StyleSheet } from "react-native";
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SPACING } from "../../StyleConstants";

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
    header:{
        display:'flex',
        flexDirection:'row',

        alignItems:'center',
    },
    container:{
        display:'flex',

        alignItems:'center',
    },
    title:{
        includeFontPadding: false,

        fontFamily:'primary-regular',
        fontSize:FONT_SIZES.lg,

        marginBottom:15,
        color: COLORS.textPrimary,
    },
    listScrollView: {
        display: 'flex',
        width: '90%',
        height: '75%',
      
        padding: SPACING.sm,
      
        borderRadius: BORDER_RADIUS.xl,
        borderBottomWidth: BORDER_WIDTH.sm,
      
        backgroundColor: COLORS.backgroundSecondary,
    },
    createGroupButton:{
        display:'flex',
        width:'100%',
        height:65,

        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

        gap:SPACING.xs,

        borderWidth:BORDER_WIDTH.base,
        borderStyle:'dashed',
        borderRadius:BORDER_RADIUS.xl,

        borderColor:COLORS.borderPrimary,
        backgroundColor:COLORS.inputPrimary,
    },
    createGroupButtonIcon:{
        includeFontPadding: false,
        fontSize: FONT_SIZES.lg,

        color: COLORS.textPrimary,
    },
    createGroupButtonLabel:{
        includeFontPadding:false,

        fontSize:FONT_SIZES.base,
        fontFamily:'secondary-bold',

        color:COLORS.textPrimary,
    },
})