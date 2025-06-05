import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import { MainTabParamList } from '../types';
import DashboardScreen from './DashboardScreen';
import PersonalHabitsScreen from './tabs/PersonalHabitsScreen';
import FamilyHabitsScreen from './tabs/FamilyHabitsScreen';
import FriendsHabitsScreen from './tabs/FriendsHabitsScreen';
import { COLORS } from '../styles/globalStyles';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Tab Bar Component for Light Theme
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={tabBarStyles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined 
          ? options.tabBarLabel 
          : options.title !== undefined 
          ? options.title 
          : route.name;

        const isFocused = state.index === index;

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

        // Get icon for each tab
        const getTabIcon = (tabName: string) => {
          switch (tabName) {
            case 'Personal': return '🏠';
            case 'Family': return '👨‍👩‍👧‍👦';
            case 'Friends': return '👥';
            case 'Dashboard': return '📊';
            default: return '📱';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              tabBarStyles.tab,
              isFocused && tabBarStyles.activeTab
            ]}
          >
            <Text style={tabBarStyles.tabIcon}>
              {getTabIcon(route.name)}
            </Text>
            <Text
              style={[
                tabBarStyles.tabText,
                isFocused && tabBarStyles.activeTabText
              ]}
            >
              {label}
            </Text>
            {isFocused && <View style={tabBarStyles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const tabBarStyles = {
  container: {
    flexDirection: 'row' as const,
    backgroundColor: COLORS.background.secondary,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: COLORS.primary[800],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 4,
    position: 'relative' as const,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: COLORS.accent.secondary,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: COLORS.text.muted,
    textAlign: 'center' as const,
  },
  activeTabText: {
    color: COLORS.accent.primary,
    fontWeight: '600' as const,
  },
  indicator: {
    position: 'absolute' as const,
    bottom: 2,
    width: 20,
    height: 2,
    backgroundColor: COLORS.accent.primary,
    borderRadius: 1,
  },
};

const MainTabsScreen: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="Dashboard"
    >
      <Tab.Screen 
        name="Personal" 
        component={PersonalHabitsScreen}
        options={{
          tabBarLabel: 'Personal',
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
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabsScreen; 