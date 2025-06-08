import React from 'react';
import { View, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../styles/globalStyles';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated';
  style?: ViewStyle;
  gradientColors?: ColorValue[];
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  style,
  gradientColors = [COLORS.accent.secondary, COLORS.accent.primary] as const
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: 16,
      padding: 24,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: COLORS.background.secondary,
          borderWidth: 1,
          borderColor: COLORS.border,
          ...SHADOWS.base,
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: COLORS.glass.background,
          borderWidth: 1,
          borderColor: COLORS.glass.border,
          ...SHADOWS.sm,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: COLORS.background.secondary,
          borderWidth: 1,
          borderColor: COLORS.border,
          ...SHADOWS.lg,
        };
      default:
        return baseStyle;
    }
  };

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            borderRadius: 16,
            padding: 24,
            ...SHADOWS.md,
          },
          style
        ]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}; 