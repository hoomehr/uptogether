import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width: screenWidth } = Dimensions.get('window');

const TabIcon: React.FC<{ 
  name: string; 
  focused: boolean; 
  icon: string; 
  color: string;
}> = ({ name, focused, icon, color }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, { color: focused ? color : '#9CA3AF' }]}>
      {icon}
    </Text>
    <Text style={[styles.tabLabel, { color: focused ? color : '#9CA3AF' }]}>
      {name}
    </Text>
    {focused && (
      <View style={[styles.activeIndicator, { backgroundColor: color }]} />
    )}
  </View>
);

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const tabs = [
    { name: 'Personal', icon: '🧘‍♀️', color: '#8B5CF6' },
    { name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#10B981' },
    { name: 'Friends', icon: '👥', color: '#F59E0B' },
  ];

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = screenWidth / state.routes.length;
    return {
      transform: [{ translateX: withTiming(state.index * tabWidth, { duration: 300 }) }],
      width: tabWidth,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slidingIndicator, indicatorStyle]} />
      
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = tabs[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <TabIcon
                name={tab.name}
                focused={isFocused}
                icon={tab.icon}
                color={tab.color}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20,
    paddingTop: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  slidingIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 60,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default CustomTabBar; 