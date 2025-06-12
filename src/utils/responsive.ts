import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on modern 6.1-inch display family (iPhone 15 / 14 / 13 / 12 – 393×852)
const guidelineBaseWidth = 393; // iPhone 15/14/13/12 width in points
const guidelineBaseHeight = 852; // iPhone 15/14/13/12 height in points

// Horizontal scaling function
export const horizontalScale = (size: number): number => {
  return (SCREEN_WIDTH / guidelineBaseWidth) * size;
};

// Vertical scaling function  
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / guidelineBaseHeight) * size;
};

// Moderate scaling function (recommended for font sizes)
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (horizontalScale(size) - size) * factor;
};

// Get responsive font size
export const getFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / guidelineBaseWidth;
  const newSize = size * scale;
  
  // Ensure font size doesn't get too small or too large
  const minSize = size * 0.8;
  const maxSize = size * 1.2;
  
  return Math.max(minSize, Math.min(maxSize, newSize));
};

// Get responsive spacing
export const getSpacing = (size: number): number => {
  return horizontalScale(size);
};

// Get responsive padding/margin
export const getPadding = (size: number): number => {
  return moderateScale(size, 0.3);
};

// Check if device is tablet
export const isTablet = (): boolean => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return (
    (Platform.OS === 'ios' && aspectRatio < 1.6) ||
    (Platform.OS === 'android' && aspectRatio < 1.6)
  );
};

// Get device type
export const getDeviceType = (): 'phone' | 'tablet' => {
  return isTablet() ? 'tablet' : 'phone';
};

// Screen dimension utilities
export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isIPhoneX: () => {
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTV &&
      ((SCREEN_HEIGHT === 780 || SCREEN_WIDTH === 780) ||
        (SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812) ||
        (SCREEN_HEIGHT === 844 || SCREEN_WIDTH === 844) || // iPhone 12/13/14
        (SCREEN_HEIGHT === 852 || SCREEN_WIDTH === 852) || // iPhone 15 / 15 Pro
        (SCREEN_HEIGHT === 896 || SCREEN_WIDTH === 896) ||
        (SCREEN_HEIGHT === 926 || SCREEN_WIDTH === 926) ||
        (SCREEN_HEIGHT === 932 || SCREEN_WIDTH === 932))
    );
  },
};

// Responsive breakpoints
export const breakpoints = {
  xs: 320,
  sm: 375,
  md: 414,
  lg: 768,
  xl: 1024,
};

// Get responsive value based on screen width
export const getResponsiveValue = (values: {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}): number => {
  if (SCREEN_WIDTH >= breakpoints.xl && values.xl !== undefined) return values.xl;
  if (SCREEN_WIDTH >= breakpoints.lg && values.lg !== undefined) return values.lg;
  if (SCREEN_WIDTH >= breakpoints.md && values.md !== undefined) return values.md;
  if (SCREEN_WIDTH >= breakpoints.sm && values.sm !== undefined) return values.sm;
  return values.xs || 0;
};

// Safe area utilities for iPhone X and newer
export const getSafeAreaPadding = () => {
  if (screenData.isIPhoneX()) {
    return {
      paddingTop: verticalScale(44),
      paddingBottom: verticalScale(34),
    };
  }
  return {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(0),
  };
};

export default {
  horizontalScale,
  verticalScale,
  moderateScale,
  getFontSize,
  getSpacing,
  getPadding,
  screenData,
  breakpoints,
  getResponsiveValue,
  getSafeAreaPadding,
  isTablet,
  getDeviceType,
}; 