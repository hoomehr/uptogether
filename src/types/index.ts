export interface User {
  id: string;
  email: string;
  name: string;
  onboardingComplete: boolean;
  goals: string[];
  peerSupportEnabled: boolean;
  createdAt: Date;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  streakCount: number;
  completedToday: boolean;
  lastCompleted?: Date;
  createdAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Welcome: undefined;
  Goals: undefined;
  PeerSupport: undefined;
  Main: undefined;
  Dashboard: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Goals: undefined;
  PeerSupport: undefined;
};

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  continueAsGuest: (name?: string) => Promise<void>;
}

export interface AppContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
} 