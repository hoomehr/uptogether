import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import OnboardingNavigator from './OnboardingNavigator';
import MainTabsScreen from '../screens/MainTabsScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user || !user.onboardingComplete ? (
          // User is not authenticated or hasn't completed onboarding
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          // User is authenticated and has completed onboarding
          <Stack.Screen name="MainTabs" component={MainTabsScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 