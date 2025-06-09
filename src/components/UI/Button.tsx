import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../styles/globalStyles';
import { 
  getFontSize, 
  getSpacing, 
  getPadding, 
  verticalScale, 
  screenData 
} from '../../utils/responsive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.baseText,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        disabled && styles.disabledText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: getSpacing(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: getSpacing(4),
    flexDirection: 'row',
  },

  // Variants
  primary: {
    backgroundColor: COLORS.accent.primary,
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: getSpacing(4),
    elevation: 3,
  },

  secondary: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  small: {
    paddingHorizontal: getPadding(screenData.isSmallDevice ? 12 : 16),
    paddingVertical: getPadding(screenData.isSmallDevice ? 6 : 8),
    minHeight: verticalScale(screenData.isSmallDevice ? 32 : 36),
  },

  medium: {
    paddingHorizontal: getPadding(screenData.isSmallDevice ? 16 : 20),
    paddingVertical: getPadding(screenData.isSmallDevice ? 10 : 12),
    minHeight: verticalScale(screenData.isSmallDevice ? 40 : 44),
  },

  large: {
    paddingHorizontal: getPadding(screenData.isSmallDevice ? 20 : 24),
    paddingVertical: getPadding(screenData.isSmallDevice ? 12 : 16),
    minHeight: verticalScale(screenData.isSmallDevice ? 48 : 52),
  },

  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },

  // Text styles
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },

  primaryText: {
    color: COLORS.text.inverse,
  },

  secondaryText: {
    color: COLORS.text.primary,
  },

  ghostText: {
    color: COLORS.accent.primary,
  },

  disabledText: {
    opacity: 0.7,
  },

  // Text sizes
  smallText: {
    fontSize: getFontSize(screenData.isSmallDevice ? 12 : 14),
    lineHeight: getFontSize(screenData.isSmallDevice ? 12 : 14) * 1.2,
  },

  mediumText: {
    fontSize: getFontSize(screenData.isSmallDevice ? 14 : 16),
    lineHeight: getFontSize(screenData.isSmallDevice ? 14 : 16) * 1.2,
  },

  largeText: {
    fontSize: getFontSize(screenData.isSmallDevice ? 16 : 18),
    lineHeight: getFontSize(screenData.isSmallDevice ? 16 : 18) * 1.2,
  },
});

export default Button; 