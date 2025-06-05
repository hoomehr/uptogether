import React from 'react';
import { View, Text, TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { Habit } from '../../types';
import { COLORS } from '../../styles/globalStyles';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  style?: ViewStyle;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, style }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const checkmarkAnim = React.useRef(new Animated.Value(habit.completedToday ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(checkmarkAnim, {
      toValue: habit.completedToday ? 1 : 0,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  }, [habit.completedToday, checkmarkAnim]);

  const handlePress = () => {
    // Press animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    onToggle(habit.id);
  };

  const getCardStyle = () => {
    return {
      backgroundColor: habit.completedToday ? COLORS.accent.secondary : COLORS.background.secondary,
      borderRadius: 16,
      padding: 20,
      marginVertical: 6,
      shadowColor: habit.completedToday ? COLORS.accent.primary : COLORS.primary[800],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: habit.completedToday ? 0.15 : 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: habit.completedToday ? COLORS.accent.primary : COLORS.border,
    };
  };

  const getCheckboxStyle = () => {
    return {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: habit.completedToday ? COLORS.accent.primary : COLORS.text.disabled,
      backgroundColor: habit.completedToday ? COLORS.accent.primary : 'transparent',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={getCardStyle()}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Habit Icon */}
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: habit.completedToday ? COLORS.accent.primary : COLORS.background.tertiary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
              borderWidth: 1,
              borderColor: habit.completedToday ? COLORS.accent.primary : COLORS.border,
            }}
          >
            <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
          </View>

          {/* Habit Info */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600' as const,
                color: habit.completedToday ? COLORS.accent.primary : COLORS.text.primary,
                marginBottom: 4,
              }}
            >
              {habit.name}
            </Text>
            
            {habit.description && (
              <Text
                style={{
                  fontSize: 14,
                  color: habit.completedToday ? COLORS.accent.primary : COLORS.text.muted,
                  lineHeight: 20,
                  marginBottom: habit.streakCount > 0 ? 8 : 0,
                }}
              >
                {habit.description}
              </Text>
            )}

            {habit.streakCount > 0 && (
              <View
                style={{
                  flexDirection: 'row' as const,
                  alignItems: 'center' as const,
                  backgroundColor: habit.completedToday ? COLORS.accent.primary : COLORS.accent.secondary,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  alignSelf: 'flex-start' as const,
                }}
              >
                <Text style={{ fontSize: 12, marginRight: 4 }}>🔥</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600' as const,
                    color: habit.completedToday ? COLORS.text.inverse : COLORS.accent.primary,
                  }}
                >
                  {habit.streakCount} day streak
                </Text>
              </View>
            )}
          </View>

          {/* Checkbox */}
          <View style={getCheckboxStyle()}>
            <Animated.View
              style={{
                transform: [{ scale: checkmarkAnim }],
                opacity: checkmarkAnim,
              }}
            >
              <Text
                style={{
                  color: COLORS.text.inverse,
                  fontSize: 16,
                  fontWeight: 'bold' as const,
                }}
              >
                ✓
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Completion Message */}
        {habit.completedToday && (
          <View
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: COLORS.accent.primary,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: COLORS.accent.primary,
                fontWeight: '500' as const,
                textAlign: 'center' as const,
              }}
            >
              Great job! You've completed this habit today! 🎉
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}; 