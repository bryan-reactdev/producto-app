import { StyleSheet} from 'react-native';
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SPACING } from '../../StyleConstants';

export default StyleSheet.create({
    blurOverlay:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        zIndex: 0,
    },
    container:{
        flex: 1,
    },
    header:{
        width:'100%',
        height:100,
        includeFontPadding: false,

        textAlign:'center',
        textAlignVertical:'center',

        fontFamily: 'primary-regular',
        fontSize:FONT_SIZES.xxl,
        color: COLORS.textPrimary,
    },
    menuActions:{
        flex:1,
        display:'flex',

        alignItems:'center',

        gap:SPACING.lg,
    },
    menuAdminButton:{
        display:'flex',
        width:'80%',
        
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

        gap:SPACING.xs,

        borderWidth: BORDER_WIDTH.base,
        borderRadius: BORDER_RADIUS.xl,
        borderBottomWidth:BORDER_WIDTH.sm,

        borderTopColor: '#b4b5b7',
        borderLeftColor: '#a1a2a4',
        borderRightColor: '#a1a2a4',
        borderBottomColor: '#7a7b7c',
    },
    menuAdminButtonIcon:{
        fontSize:FONT_SIZES.base,
        color: COLORS.buttonIconPrimary,
    },
    menuAdminButtonText:{
        includeFontPadding: false,

        marginTop:SPACING.base,
        marginBottom:SPACING.base,

        fontFamily:'primary-medium',
        fontSize:FONT_SIZES.sm,
        color: COLORS.buttonTextPrimary,
    },
});