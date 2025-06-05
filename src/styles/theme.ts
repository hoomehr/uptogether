// Theme utility file for NativeWind/Tailwind classes
// This provides consistent class combinations for common UI patterns

export const themeClasses = {
  // Container classes
  container: 'flex-1 bg-dark-700',
  safeArea: 'flex-1',
  content: 'flex-1 px-6',
  scrollContent: 'flex-1 px-6 pb-6',

  // Header classes
  header: 'px-6 pt-4 pb-6',
  headerGradient: 'pt-6 pb-6',

  // Text classes
  title: 'text-3xl font-bold text-white text-center mb-2 text-shadow',
  subtitle: 'text-lg font-semibold text-white/90 text-center mb-6 text-shadow-sm',
  sectionTitle: 'text-xl font-bold text-white mb-4',
  bodyText: 'text-base text-gray-300 leading-6',
  caption: 'text-sm text-white/70 text-shadow-sm',
  label: 'text-base font-semibold text-white mb-2 mt-4',

  // Button classes
  buttonPrimary: 'bg-violet-500 hover:bg-violet-600 shadow-lg',
  buttonSecondary: 'bg-cyan-500 hover:bg-cyan-600 shadow-lg',
  buttonGhost: 'bg-transparent border border-white/20 hover:bg-white/10',
  buttonDanger: 'bg-red-500 hover:bg-red-600 shadow-lg',

  // Card classes
  card: 'bg-dark-600 rounded-2xl p-6 my-2 shadow-md',
  cardGlass: 'bg-dark-500/80 rounded-2xl p-6 my-2 border border-white/20 shadow-sm',
  cardElevated: 'bg-dark-600 rounded-2xl p-6 my-2 shadow-lg',
  cardGradient: 'rounded-2xl p-6 my-2 shadow-lg',

  // Input classes
  input: 'bg-dark-500/80 border border-gray-500 rounded-xl p-4 text-base text-white',
  inputFocused: 'bg-dark-500/80 border border-violet-500 rounded-xl p-4 text-base text-white',
  inputError: 'bg-dark-500/80 border border-red-500 rounded-xl p-4 text-base text-white',

  // Layout classes
  row: 'flex-row items-center',
  rowBetween: 'flex-row items-center justify-between',
  column: 'flex-col',
  center: 'items-center justify-center',
  spaceBetween: 'justify-between',
  spaceAround: 'justify-around',
  spaceEvenly: 'justify-evenly',

  // Spacing classes
  spacing: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
  margin: {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
  },
  marginBottom: {
    xs: 'mb-1',
    sm: 'mb-2',
    md: 'mb-4',
    lg: 'mb-6',
    xl: 'mb-8',
  },
  marginTop: {
    xs: 'mt-1',
    sm: 'mt-2',
    md: 'mt-4',
    lg: 'mt-6',
    xl: 'mt-8',
  },

  // Modal classes
  modalContainer: 'flex-1 bg-dark-600',
  modalHeader: 'flex-row justify-between items-center p-6 border-b border-gray-600',
  modalContent: 'flex-1 p-6',
  modalOverlay: 'flex-1 bg-black/50 justify-center items-center p-6',

  // Divider classes
  divider: 'flex-row items-center my-4',
  dividerLine: 'flex-1 h-px bg-white/30',
  dividerText: 'mx-4 text-sm text-white/70 text-shadow-sm',

  // Grid classes
  grid: 'flex-row flex-wrap justify-between',
  gridItem2: 'w-[48%]',
  gridItem3: 'w-[30%]',

  // Empty state classes
  emptyState: 'p-10 items-center',
  emptyStateText: 'text-lg text-gray-300',

  // Status classes
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  info: 'text-blue-400',

  // Background gradient classes (for use with LinearGradient)
  gradients: {
    cosmic: 'from-violet-500 via-blue-600 to-dark-800',
    cosmicReverse: 'from-dark-700 via-dark-800 to-violet-500',
    purple: 'from-purple-500 to-purple-700',
    cyber: 'from-cyan-500 to-violet-500',
    dark: 'from-dark-800 to-dark-700',
    card: 'from-cyan-500 to-violet-500',
  },

  // Common shadow classes
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    glow: 'shadow-lg shadow-violet-500/30',
    cosmic: 'shadow-xl shadow-violet-500/40',
  },
};

// Utility function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Common class combinations
export const combineClasses = {
  screenContainer: cn(themeClasses.container, themeClasses.safeArea),
  gradientHeader: cn(themeClasses.headerGradient, themeClasses.center),
  formContainer: cn(themeClasses.cardGlass, themeClasses.spacing.lg),
  inputGroup: cn(themeClasses.column, themeClasses.marginBottom.md),
  buttonGroup: cn(themeClasses.row, themeClasses.spacing.md, 'justify-center'),
  sectionContainer: cn(themeClasses.marginBottom.lg),
  listItem: cn(themeClasses.card, themeClasses.row, themeClasses.spaceBetween),
}; 