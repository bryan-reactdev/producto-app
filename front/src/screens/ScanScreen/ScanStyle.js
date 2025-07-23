import { StyleSheet} from 'react-native';
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SIZING, SPACING } from '../../StyleConstants';

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
        flex:1,
        display:'flex',

        alignItems:'center',
        justifyContent:'center',

        marginBottom:'25%'
    },
    scannerContainerWrapper:{
        display:'flex',
        width:'90%',
        height:'70%',

        alignItems:'center',
        justifyContent:'center',
        
        padding:SIZING.sm,

        borderWidth: BORDER_WIDTH.base,
        borderRadius: BORDER_RADIUS.xl,
        borderBottomWidth: BORDER_WIDTH.sm,
      
        borderTopColor: '#b4b5b7',
        borderLeftColor: '#a1a2a4',
        borderRightColor: '#a1a2a4',
        borderBottomColor: '#7a7b7c',

        backgroundColor:COLORS.backgroundPrimary,
    },
    scannerContainer:{
        display:'flex',
        height:'100%',
        width:'100%',
        
        alignItems:'center',
        justifyContent:'center',
        
        padding:SIZING.sm,
        
        borderWidth:BORDER_WIDTH.base,
        borderRadius:BORDER_RADIUS.xxl,
        
        borderColor:COLORS.borderSecondary,
        backgroundColor:COLORS.backgroundSecondary,

        overflow: 'hidden',
    },
    scannerContainerCamera:{
        width:'90%',
        height:'90%',
    },
    scannerContainerText:{
        marginTop:'auto',
        includeFontPadding: false,

        fontFamily:'secondary-regular',
        fontSize:FONT_SIZES.base,
        
        color: COLORS.textPrimaryContrast,
    },
    productContainer: {
        flex: 1,
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center',

        padding: SIZING.base,
        gap:SPACING.base,
    },
    scanAgainButton: {
        minWidth:150,
        minHeight:50,
        display: 'flex',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',

        gap: SPACING.xs,
        padding: SIZING.xxs,

        borderRadius: BORDER_RADIUS.xxl,

        backgroundColor: COLORS.buttonPrimary,
    },
    scanAgainButtonIcon: {
        fontSize: FONT_SIZES.base,

        color: COLORS.textPrimaryContrast,
    },
    scanAgainButtonText: {
        includeFontPadding:false,
        fontFamily: 'secondary-bold',
        fontSize: FONT_SIZES.xs,

        color: COLORS.textPrimaryContrast,
    },
    loadingIndicator: {
        margin: 24,
    },
    loadingText: {
        fontFamily: 'secondary-regular',
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
    },
    errorSection:{
        alignItems: 'center',

        gap:SPACING.base,
    },
    errorText:{
        marginTop:'auto',

        includeFontPadding: false,

        fontFamily:'secondary-bold',
        fontSize:FONT_SIZES.base,

        color:COLORS.textDelete,
    },
    scanAgainSection: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
})