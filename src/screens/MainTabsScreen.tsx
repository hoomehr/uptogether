import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';
import CustomTabBar from '../components/CustomTabBar';
import PersonalHabitsScreen from './tabs/PersonalHabitsScreen';
import FamilyHabitsScreen from './tabs/FamilyHabitsScreen';
import FriendsHabitsScreen from './tabs/FriendsHabitsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabsScreen: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="Personal"
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
    </Tab.Navigator>
  );
};

export default MainTabsScreen; 