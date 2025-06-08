import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';
import { MainTabParamList } from '../types';
import DashboardScreen from './DashboardScreen';
import PersonalHabitsScreen from './tabs/PersonalHabitsScreen';
import FamilyHabitsScreen from './tabs/FamilyHabitsScreen';
import FriendsHabitsScreen from './tabs/FriendsHabitsScreen';
import { COLORS, globalStyles } from '../styles/globalStyles';

const Tab = createMaterialTopTabNavigator<MainTabParamList>();

const MainTabsScreen: React.FC = () => {
  return (
    <View style={globalStyles.container}>
      {/* Top Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarActiveTintColor: COLORS.accent.primary,
          tabBarInactiveTintColor: COLORS.text.muted,
          tabBarPressColor: COLORS.accent.secondary,
          tabBarScrollEnabled: false,
        }}
        initialRouteName="Dashboard"
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tab.Screen 
          name="Family" 
          component={FamilyHabitsScreen}
          options={{
            tabBarLabel: 'Family',
          }}
        />
        <Tab.Screen 
          name="Friends" 
          component={FriendsHabitsScreen}
          options={{
            tabBarLabel: 'Friends',
          }}
        />
        <Tab.Screen 
          name="Personal" 
          component={PersonalHabitsScreen}
          options={{
            tabBarLabel: 'Personal',
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = {
  tabBarStyle: {
    backgroundColor: COLORS.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    height: 48,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    textTransform: 'none' as const,
    marginTop: -4,
  },
  tabBarIndicator: {
    backgroundColor: COLORS.accent.primary,
    height: 3,
    borderRadius: 2,
  },
};

export default MainTabsScreen; 