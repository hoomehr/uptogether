import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  style?: ViewStyle;
  animated?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#8B5CF6',
  backgroundColor = '#475569',
  showText = true,
  style,
  animated = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const halfCircle = size / 2;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(percentage);
    }
  }, [percentage, animated, animatedValue]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      if (circleRef.current) {
        const strokeDashoffset = circumference - (circumference * value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => animatedValue.removeListener(listener);
  }, [animatedValue, circumference]);

  const getProgressColor = () => {
    if (percentage === 100) return '#8B5CF6';
    if (percentage >= 75) return '#A855F7';
    if (percentage >= 50) return '#06B6D4';
    if (percentage >= 25) return '#22D3EE';
    return '#7C3AED';
  };

  const progressColor = color || getProgressColor();

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          {/* Background Circle */}
          <Circle
            cx={halfCircle}
            cy={halfCircle}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <AnimatedCircle
            ref={circleRef}
            cx={halfCircle}
            cy={halfCircle}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * percentage) / 100}
          />
        </G>
      </Svg>
      
      {showText && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: size * 0.2,
              fontWeight: '700',
              color: progressColor,
            }}
          >
            {Math.round(percentage)}%
          </Text>
          <Text
            style={{
              fontSize: size * 0.08,
              color: '#CBD5E1',
              marginTop: 2,
            }}
          >
            Complete
          </Text>
        </View>
      )}
    </View>
  );
}; 