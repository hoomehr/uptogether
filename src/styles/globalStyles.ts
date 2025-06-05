import { StyleSheet } from 'react-native';

// Color System - Light Theme with Green/Yellow Palette
export const COLORS = {
  // Primary Colors (Green)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#347928', // Main dark green
    900: '#14532d',
  },
  
  // Secondary Colors (Yellow/Gold)
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  
  // Light Green Accent
  accent: {
    primary: '#347928',    // Dark green
    secondary: '#C0EBA6',  // Light green
    tertiary: '#FCCD2A',   // Golden yellow
  },
  
  // Background Colors (Light Theme)
  background: {
    primary: '#FFFBE6',    // Cream background
    secondary: '#ffffff',   // Pure white for cards
    tertiary: '#f8fafc',   // Light gray
    elevated: '#ffffff',    // White for elevated cards
  },
  
  // Text Colors (Dark on Light)
  text: {
    primary: '#347928',     // Dark green for primary text
    secondary: '#065f46',   // Darker green for headers
    muted: '#6b7280',      // Gray for muted text
    disabled: '#9ca3af',   // Light gray for disabled
    inverse: '#ffffff',    // White text for dark backgrounds
  },
  
  // Status Colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Border and Divider
  border: '#e5e7eb',
  divider: '#f3f4f6',
  
  // Glass effect colors
  glass: {
    background: 'rgba(255, 251, 230, 0.8)',
    border: 'rgba(52, 121, 40, 0.2)',
  },
};

// Gradients - Light and Fresh
export const GRADIENTS = {
  primary: ['#C0EBA6', '#347928'],           // Light to dark green
  secondary: ['#FFFBE6', '#FCCD2A'],        // Cream to golden
  accent: ['#FCCD2A', '#f59e0b'],           // Golden gradient
  card: ['#ffffff', '#f8fafc'],             // Subtle white gradient
  fresh: ['#C0EBA6', '#FFFBE6', '#FCCD2A'], // Multi-color fresh gradient
};

// Typography System
export const TYPOGRAPHY = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': { fontSize: 36, lineHeight: 40 },
  
  // Text styles
  heading: {
    fontWeight: '700' as const,
    color: COLORS.text.secondary,
  },
  body: {
    fontWeight: '400' as const,
    color: COLORS.text.primary,
  },
  caption: {
    fontWeight: '500' as const,
    color: COLORS.text.muted,
  },
};

// Spacing System
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Shadow System - Light Theme Shadows
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.primary[800],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.primary[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: COLORS.primary[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: COLORS.primary[800],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Global Styles
export const globalStyles = StyleSheet.create({
  // Base containers
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  
  // Header
  header: {
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  
  // Layout utilities
  row: {
    flexDirection: 'row',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  
  // Spacing utilities
  mt_xs: { marginTop: SPACING.xs },
  mt_sm: { marginTop: SPACING.sm },
  mt_md: { marginTop: SPACING.md },
  mt_lg: { marginTop: SPACING.lg },
  mt_xl: { marginTop: SPACING.xl },
  mt_2xl: { marginTop: SPACING['2xl'] },
  
  mb_xs: { marginBottom: SPACING.xs },
  mb_sm: { marginBottom: SPACING.sm },
  mb_md: { marginBottom: SPACING.md },
  mb_lg: { marginBottom: SPACING.lg },
  mb_xl: { marginBottom: SPACING.xl },
  mb_2xl: { marginBottom: SPACING['2xl'] },
  
  mx_xs: { marginHorizontal: SPACING.xs },
  mx_sm: { marginHorizontal: SPACING.sm },
  mx_md: { marginHorizontal: SPACING.md },
  mx_lg: { marginHorizontal: SPACING.lg },
  mx_xl: { marginHorizontal: SPACING.xl },
  
  my_xs: { marginVertical: SPACING.xs },
  my_sm: { marginVertical: SPACING.sm },
  my_md: { marginVertical: SPACING.md },
  my_lg: { marginVertical: SPACING.lg },
  my_xl: { marginVertical: SPACING.xl },
  
  // Padding utilities
  p_xs: { padding: SPACING.xs },
  p_sm: { padding: SPACING.sm },
  p_md: { padding: SPACING.md },
  p_lg: { padding: SPACING.lg },
  p_xl: { padding: SPACING.xl },
  p_2xl: { padding: SPACING['2xl'] },
  
  // Cards and containers
  card: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  cardElevated: {
    backgroundColor: COLORS.background.elevated,
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  cardGlass: {
    backgroundColor: COLORS.glass.background,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.glass.border,
    ...SHADOWS.sm,
  },
  
  // Typography
  title: {
    ...TYPOGRAPHY['2xl'],
    ...TYPOGRAPHY.heading,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.xl,
    ...TYPOGRAPHY.heading,
    marginBottom: SPACING.md,
  },
  bodyText: {
    ...TYPOGRAPHY.base,
    ...TYPOGRAPHY.body,
  },
  captionText: {
    ...TYPOGRAPHY.sm,
    ...TYPOGRAPHY.caption,
  },
  
  // Buttons
  button: {
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  buttonPrimary: {
    backgroundColor: COLORS.accent.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.accent.secondary,
  },
  buttonText: {
    ...TYPOGRAPHY.base,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },
  
  // Inputs
  input: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: SPACING.md,
    ...TYPOGRAPHY.base,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    ...TYPOGRAPHY.sm,
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['2xl'],
  },
  
  // Button container
  buttonContainer: {
    marginTop: SPACING.lg,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
  
  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  gridItem: {
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.md,
  },
  
  // Empty state
  emptyState: {
    padding: SPACING['2xl'],
    alignItems: 'center',
  },
  emptyStateText: {
    ...TYPOGRAPHY.lg,
    color: COLORS.text.muted,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.xl,
    ...TYPOGRAPHY.heading,
    marginBottom: 8,
  },
  emptyStateButton: {
    minWidth: 160,
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
    ...SHADOWS.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.accent.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: '500' as const,
  },

  // Progress card
  progressCard: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.accent.primary,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
    marginLeft: 24,
  },
  progressMessage: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  progressDetails: {
    fontSize: 14,
    color: COLORS.text.muted,
  },

  // Header styles
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(52, 121, 40, 0.8)',
    fontWeight: '500' as const,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text.inverse,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.text.inverse,
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
  sectionAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionActionText: {
    fontSize: 14,
    color: COLORS.accent.primary,
    fontWeight: '500' as const,
  },

  // Guest card
  guestCard: {
    backgroundColor: COLORS.background.secondary,
    borderColor: COLORS.accent.primary,
    borderWidth: 1,
    marginBottom: 20,
  },
  guestCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guestCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  guestCardContent: {
    flex: 1,
  },
  guestCardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.accent.primary,
    marginBottom: 4,
  },
  guestCardText: {
    fontSize: 14,
    color: COLORS.text.muted,
  },

  // Habits list
  habitsList: {
    gap: 8,
  },
  showMoreButton: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.sm,
  },
  showMoreText: {
    fontSize: 14,
    color: COLORS.accent.primary,
    fontWeight: '500' as const,
  },

  // Weekly card
  weeklyCard: {
    marginBottom: 32,
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
    marginBottom: 8,
  },
  weeklySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStat: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text.inverse,
    marginBottom: 4,
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Modal styles
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.text.muted,
    textAlign: 'center',
    marginBottom: 32,
  },
}); 