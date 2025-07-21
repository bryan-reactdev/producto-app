import { StyleSheet} from 'react-native';
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, FONT_SIZES, SIZING, SPACING } from '../../StyleConstants';

export default StyleSheet.create({
    screen:{
        display:'flex',
        flex:1,

        backgroundColor:COLORS.backgroundPrimary,
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
        
        padding:SPACING.xxs,

        borderWidth:BORDER_WIDTH.sm,
        borderRadius:BORDER_RADIUS.xl,
        
        borderColor:COLORS.borderSecondary,
        backgroundColor:COLORS.backgroundSecondary,
    },
    scannerContainer:{
        display:'flex',
        height:'90%',
        width:'90%',

        alignItems:'center',
        justifyContent:'center',

        padding:SIZING.sm,

        borderWidth:BORDER_WIDTH.sm,
        borderRadius:BORDER_RADIUS.xxl,

        borderColor:COLORS.borderPrimary,
        backgroundColor: COLORS.inputPrimary,
    },
    scannerContainerCamera:{
        width:'90%',
        height:'90%',

        borderRadius:BORDER_RADIUS.base,
    },
    scannerContainerText:{
        marginTop:'auto',
        includeFontPadding: false,
        fontFamily:'secondary-regular',
        fontSize:FONT_SIZES.base,
        color: COLORS.textPrimary,
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