import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, SafeAreaView } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import PersonalHabitsScreen from '../screens/tabs/PersonalHabitsScreen';
import FamilyHabitsScreen from '../screens/tabs/FamilyHabitsScreen';
import FriendsHabitsScreen from '../screens/tabs/FriendsHabitsScreen';
import { COLORS } from '../styles/globalStyles';
import { getFontSize, getSpacing, getPadding, screenData } from '../utils/responsive';

const Tab = createMaterialTopTabNavigator();

const MainTabsScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background.primary }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.accent.primary,
          tabBarInactiveTintColor: COLORS.text.muted,
          tabBarLabelStyle: {
            fontSize: getFontSize(screenData.isSmallDevice ? 12 : 14),
            fontWeight: '600',
            textTransform: 'none',
            marginHorizontal: 0,
            paddingHorizontal: getPadding(4),
          },
          tabBarStyle: {
            backgroundColor: COLORS.background.secondary,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
            height: getPadding(screenData.isSmallDevice ? 40 : 48),
            paddingHorizontal: getSpacing(8),
          },
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.accent.primary,
            height: getSpacing(3),
            borderRadius: getSpacing(1.5),
            marginHorizontal: getSpacing(screenData.isSmallDevice ? 8 : 12),
          },
          tabBarContentContainerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarItemStyle: {
            paddingHorizontal: getPadding(screenData.isSmallDevice ? 4 : 8),
            marginHorizontal: getSpacing(2),
            minHeight: getPadding(screenData.isSmallDevice ? 40 : 48),
            justifyContent: 'center',
          },
          tabBarPressColor: COLORS.accent.secondary,
          tabBarPressOpacity: 0.8,
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            tabBarLabel: screenData.isSmallDevice ? 'Home' : 'Dashboard',
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
            tabBarLabel: screenData.isSmallDevice ? 'Me' : 'Personal',
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MainTabsScreen; 