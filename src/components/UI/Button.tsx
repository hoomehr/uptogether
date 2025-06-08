import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SHADOWS } from '../../styles/globalStyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon}
      <Text 
        style={[
          styles.text,
          styles[`${variant}Text`],
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 0,
    ...SHADOWS.base,
  },

  // Variants
  primary: {
    backgroundColor: COLORS.accent.primary,
    ...SHADOWS.base,
  },
  secondary: {
    backgroundColor: COLORS.accent.secondary,
    ...SHADOWS.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.accent.primary,
    shadowColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
  },

  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },

  // States
  disabled: {
    backgroundColor: COLORS.text.disabled,
    shadowColor: 'transparent',
    opacity: 0.6,
  },

  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 4,
  },
  primaryText: {
    color: COLORS.text.inverse,
    fontSize: 16,
  },
  secondaryText: {
    color: COLORS.text.primary,
    fontSize: 16,
  },
  outlineText: {
    color: COLORS.accent.primary,
    fontSize: 16,
  },
  ghostText: {
    color: COLORS.accent.primary,
    fontSize: 16,
  },
  disabledText: {
    color: COLORS.text.disabled,
  },
});

export default Button; 