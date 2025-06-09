import { StyleSheet, Dimensions, Platform } from 'react-native';
import { 
  horizontalScale, 
  verticalScale, 
  moderateScale, 
  getFontSize, 
  getSpacing, 
  getPadding,
  screenData,
  getSafeAreaPadding
} from '../utils/responsive';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Updated Color Palette - Light Green Theme
export const COLORS = {
  // Primary green palette
  primary: {
    50: '#F6FB7A',   // Light yellow-green
    100: '#F6FB7A',
    200: '#B4E380',  // Light green
    300: '#B4E380',
    400: '#88D66C',  // Medium green
    500: '#88D66C',
    600: '#73BBA3',  // Teal green
    700: '#73BBA3',
    800: '#5A9B7D',  // Darker teal
    900: '#4A8066',  // Dark green
  },
  
  // Accent colors derived from the palette
  accent: {
    primary: '#88D66C',    // Medium green - main accent
    secondary: '#B4E380',  // Light green - secondary accent
    tertiary: '#F6FB7A',   // Yellow-green - highlights
    quaternary: '#73BBA3', // Teal - special elements
  },
  
  // Light background colors
  background: {
    primary: '#FFFFFF',     // Pure white
    secondary: '#F8FDF8',   // Very light green tint
    tertiary: '#F0F9F0',    // Light green background
    quaternary: '#E8F5E8',  // Slightly darker green background
  },
  
  // Dark text colors for light backgrounds
  text: {
    primary: '#1A2E1A',     // Very dark green
    secondary: '#2D4A2D',   // Dark green
    muted: '#4A6B4A',       // Medium green-gray
    disabled: '#7A9A7A',    // Light green-gray
    inverse: '#FFFFFF',     // White for dark backgrounds
  },
  
  // Border colors
  border: '#D4E6D4',        // Light green border
  borderLight: '#E8F5E8',   // Very light border
  
  // Status colors with green tints
  success: '#88D66C',       // Medium green
  warning: '#F6FB7A',       // Yellow-green
  error: '#E85D75',         // Soft red (keeping for contrast)
  info: '#73BBA3',          // Teal
  
  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Glass morphism for light theme
  glass: {
    background: 'rgba(136, 214, 108, 0.1)',  // Medium green with opacity
    border: 'rgba(136, 214, 108, 0.3)',      // Medium green border
    backdrop: 'rgba(255, 255, 255, 0.9)',    // Light backdrop
  },
};

// Gradients using the new light color palette
export const GRADIENTS = {
  primary: ['#F6FB7A', '#88D66C'],           // Yellow-green to medium green
  secondary: ['#B4E380', '#73BBA3'],         // Light green to teal
  accent: ['#88D66C', '#73BBA3'],            // Medium green to teal
  background: ['#FFFFFF', '#F8FDF8'],        // White to light green
  card: ['#F8FDF8', '#F0F9F0'],             // Light card gradient
  button: ['#88D66C', '#73BBA3'],            // Button gradient
  success: ['#B4E380', '#88D66C'],           // Success gradient
  warning: ['#F6FB7A', '#B4E380'],           // Warning gradient
};

// Typography
export const TYPOGRAPHY = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  fontWeights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

// Border radius
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadows with green tints for light theme
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Global styles
export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  
  // Card styles
  card: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.base,
  },
  
  cardElevated: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  
  cardGlass: {
    backgroundColor: COLORS.glass.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.glass.border,
  },
  
  // Text styles
  heading1: {
    fontSize: TYPOGRAPHY.fontSizes['4xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.lineHeights.tight * TYPOGRAPHY.fontSizes['4xl'],
    textShadowColor: 'rgba(136, 214, 108, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  heading2: {
    fontSize: TYPOGRAPHY.fontSizes['3xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.lineHeights.tight * TYPOGRAPHY.fontSizes['3xl'],
  },
  
  heading3: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.lineHeights.snug * TYPOGRAPHY.fontSizes['2xl'],
  },
  
  heading4: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.lineHeights.snug * TYPOGRAPHY.fontSizes.xl,
  },
  
  bodyLarge: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.lg,
  },
  
  body: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.base,
  },
  
  bodySmall: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    color: COLORS.text.muted,
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
  },
  
  caption: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    color: COLORS.text.muted,
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.xs,
  },
  
  // Button styles
  button: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.base,
  },
  
  buttonSecondary: {
    backgroundColor: COLORS.background.quaternary,
    borderWidth: 1,
    borderColor: COLORS.accent.secondary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.accent.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.inverse,
  },
  
  buttonTextSecondary: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.accent.primary,
  },
  
  buttonTextOutline: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.accent.primary,
  },
  
  // Input styles
  input: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.primary,
    minHeight: 48,
  },
  
  inputFocused: {
    borderColor: COLORS.accent.primary,
    borderWidth: 2,
  },
  
  inputLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Utility styles
  flex1: {
    flex: 1,
  },
  
  flexGrow: {
    flexGrow: 1,
  },
  
  flexShrink: {
    flexShrink: 1,
  },
  
  // Margin utilities
  mt: {
    marginTop: SPACING.md,
  },
  
  mb: {
    marginBottom: SPACING.md,
  },
  
  ml: {
    marginLeft: SPACING.md,
  },
  
  mr: {
    marginRight: SPACING.md,
  },
  
  mx: {
    marginHorizontal: SPACING.md,
  },
  
  my: {
    marginVertical: SPACING.md,
  },
  
  // Padding utilities
  pt: {
    paddingTop: SPACING.md,
  },
  
  pb: {
    paddingBottom: SPACING.md,
  },
  
  pl: {
    paddingLeft: SPACING.md,
  },
  
  pr: {
    paddingRight: SPACING.md,
  },
  
  px: {
    paddingHorizontal: SPACING.md,
  },
  
  py: {
    paddingVertical: SPACING.md,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background.secondary,
  },
  
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.primary,
  },
  
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  
  // Empty state styles
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING['2xl'],
  },
  
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
    opacity: 0.6,
  },
  
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.muted,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeights.relaxed * TYPOGRAPHY.fontSizes.base,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.primary,
  },
  
  loadingText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.muted,
    marginTop: SPACING.md,
  },
  
  // Habit specific styles
  habitsList: {
    gap: SPACING.md,
  },
  
  habitCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.base,
  },
  
  habitCardCompleted: {
    backgroundColor: COLORS.glass.background,
    borderColor: COLORS.accent.secondary,
    borderWidth: 2,
  },
  
  // Progress styles
  progressContainer: {
    backgroundColor: COLORS.background.quaternary,
    borderRadius: BORDER_RADIUS.full,
    height: 8,
    overflow: 'hidden',
  },
  
  progressBar: {
    backgroundColor: COLORS.accent.primary,
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
  
  // Badge styles
  badge: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignSelf: 'flex-start',
  },
  
  badgeText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.inverse,
  },
  
  badgeSecondary: {
    backgroundColor: COLORS.accent.secondary,
  },
  
  badgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent.primary,
  },
  
  badgeOutlineText: {
    color: COLORS.accent.primary,
  },

  // Header styles
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.normal,
    color: COLORS.text.inverse,
    opacity: 0.9,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.text.inverse,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.inverse,
  },
  
  // Stats container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: -4,
  },
  statCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.accent.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: '500',
  },
  
  // Guest card styles
  guestCard: {
    marginBottom: SPACING.lg,
  },
  guestCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  guestCardIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  guestCardContent: {
    flex: 1,
  },
  guestCardTitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  guestCardText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.muted,
  },
  
  // Progress card styles
  progressCard: {
    marginBottom: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.primary,
  },
  progressPercentage: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.accent.primary,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  progressInfo: {
    flex: 1,
  },
  progressMessage: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  progressDetails: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.muted,
  },
  
  // Weekly card styles
  weeklyCard: {
    marginBottom: SPACING.lg,
  },
  weeklyTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  weeklySubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.muted,
    marginBottom: SPACING.md,
  },
  weeklyStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  weeklyStat: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.accent.primary,
  },
  weeklyStatLabel: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.text.muted,
    textTransform: 'uppercase',
  },
  
  // Empty state button
  emptyStateButton: {
    marginTop: SPACING.md,
  },
  
  // Show more button
  showMoreButton: {
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  showMoreText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.accent.primary,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  
  // Section styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text.primary,
  },
  sectionAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionActionText: {
    fontSize: 14,
    color: COLORS.accent.primary,
    fontWeight: '500',
  },
});

// Screen dimensions
export const SCREEN = {
  width: screenWidth,
  height: screenHeight,
  isSmall: screenWidth < 375,
  isMedium: screenWidth >= 375 && screenWidth < 414,
  isLarge: screenWidth >= 414,
};

// Animation durations
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};


export default globalStyles; 