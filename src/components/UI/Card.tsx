import React from 'react';
import { View, ViewStyle, StyleSheet, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  gradientColors = ['#667eea', '#764ba2'] as const
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
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 1,
          borderColor: '#F5F5F5',
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.07,
          shadowRadius: 15,
          elevation: 2,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: '#FFFFFF',
          shadowColor: '#262626',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 25,
          elevation: 8,
          borderWidth: 1,
          borderColor: '#FAFAFA',
        };
      default:
        return baseStyle;
    }
  };

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            borderRadius: 16,
            padding: 24,
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 25,
            elevation: 8,
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