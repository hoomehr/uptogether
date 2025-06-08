import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  HabitDetail: { habitId: string };
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Goals: undefined;
  PeerSupport: undefined;
};

export type MainTabParamList = {
  Personal: undefined;
  Family: undefined;
  Friends: undefined;
  Dashboard: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> =
  StackScreenProps<OnboardingStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Specific screen types
export type HabitDetailScreenNavigationProp = StackScreenProps<RootStackParamList, 'HabitDetail'>['navigation'];
export type HabitDetailScreenRouteProp = StackScreenProps<RootStackParamList, 'HabitDetail'>['route'];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 