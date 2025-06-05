import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    };

    // Size styles
    const sizeStyles = {
      small: { paddingHorizontal: 16, paddingVertical: 8 },
      medium: { paddingHorizontal: 24, paddingVertical: 12 },
      large: { paddingHorizontal: 32, paddingVertical: 16 },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? '#64748B' : '#8B5CF6',
        shadowColor: disabled ? 'transparent' : '#8B5CF6',
        shadowOpacity: disabled ? 0 : 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
      },
      secondary: {
        backgroundColor: disabled ? '#475569' : '#06B6D4',
        shadowColor: disabled ? 'transparent' : '#06B6D4',
        shadowOpacity: disabled ? 0 : 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? '#64748B' : '#8B5CF6',
        shadowOpacity: 0,
      },
      ghost: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size text styles
    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    // Variant text styles
    const variantTextStyles = {
      primary: {
        color: disabled ? '#64748B' : '#FFFFFF',
      },
      secondary: {
        color: disabled ? '#64748B' : '#FFFFFF',
      },
      outline: {
        color: disabled ? '#64748B' : '#8B5CF6',
      },
      ghost: {
        color: disabled ? '#64748B' : '#FFFFFF',
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : '#8B5CF6'}
          style={{ marginRight: 8 }}
        />
      )}
      {icon && !loading && (
        <Text style={{ fontSize: size === 'large' ? 18 : 16, marginRight: 8 }}>
          {icon}
        </Text>
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
}; 