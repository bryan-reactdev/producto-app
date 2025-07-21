import { StyleSheet} from 'react-native';
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SPACING } from '../../StyleConstants';

export default StyleSheet.create({
    container:{
        flex: 1,

        backgroundColor:COLORS.backgroundPrimary,
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
    menuButton:{
        display:'flex',
        alignItems:'center',
        width:'80%',
        
        borderWidth: BORDER_WIDTH.sm,
        borderRadius: BORDER_RADIUS.base,

        borderColor: COLORS.borderSecondary,
        backgroundColor:COLORS.backgroundPrimary,
    },
    menuButtonIcon:{
        marginTop:SPACING.base,

        fontSize:FONT_SIZES.xxxl,
    },
    menuButtonText:{
        includeFontPadding: false,

        marginTop:SPACING.base,
        marginBottom:SPACING.base,
        
        fontFamily:'primary-medium',
        fontSize:FONT_SIZES.base,
        color: COLORS.textPrimary,
    },
    menuAdminButton:{
        display:'flex',
        width:'80%',
        
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

        gap:SPACING.xs,

        borderWidth: BORDER_WIDTH.sm,
        borderRadius: BORDER_RADIUS.base,

        borderColor: COLORS.borderSecondary,
        backgroundColor:COLORS.backgroundPrimary,
    },
    menuAdminButtonIcon:{
        fontSize:FONT_SIZES.base,
        color: COLORS.textPrimary,
    },
    menuAdminButtonText:{
        includeFontPadding: false,

        marginTop:SPACING.base,
        marginBottom:SPACING.base,
        
        fontFamily:'primary-medium',
        fontSize:FONT_SIZES.base,
        color: COLORS.textPrimary,
    },
    animatableWrapper: {
        width: '100%',
        alignItems: 'center',
    },
});