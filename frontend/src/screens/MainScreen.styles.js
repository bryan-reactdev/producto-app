// frontend/src/screens/MainScreen.styles.js
import { StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/colors';

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 24,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  header: {
    fontSize: FONT_SIZE.xxxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.muted,
    fontWeight: FONT_WEIGHT.medium,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  menuSection: {
    width: '100%',
    maxWidth: 320,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  buttonContent: {
    flex: 1,
  },
  menuText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.muted,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default styles; 