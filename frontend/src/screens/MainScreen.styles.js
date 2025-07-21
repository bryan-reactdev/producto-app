// frontend/src/screens/MainScreen.styles.js
import { StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgGradient[0],
  },
  gradient: {
    flex: 1,
    position: 'relative', // Ensure proper stacking context
  },
  container: {
    flex: 1,
    paddingTop: SPACING.xl,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.muted,
    marginBottom: SPACING.xl,
  },
  menuSection: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 90 : 80, // Reduced padding since admin section is smaller
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  buttonContent: {
    flex: 1,
  },
  menuText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.muted,
  },
  adminSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? 24 : SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
}); 