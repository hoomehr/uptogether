// Re-export navigation types
export * from './navigation';

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
  category: 'personal' | 'family' | 'friends';
  isShared: boolean;
  sharedWith?: string[]; // User IDs
  approvals?: HabitApproval[];
  visibility: 'private' | 'shared' | 'public';
}

export interface HabitApproval {
  id: string;
  habitId: string;
  userId: string;
  userName: string;
  type: 'encouragement' | 'celebration' | 'support';
  message?: string;
  emoji: string;
  createdAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  joinedAt: Date;
  isActive: boolean;
}

export interface Friend {
  id: string;
  name: string;
  email?: string;
  username?: string;
  addedAt: Date;
  isActive: boolean;
  avatar?: string;
}

export interface EncouragementOption {
  emoji: string;
  message: string;
}

// Navigation types are now exported from './navigation'

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
  addApproval: (habitId: string, approval: Omit<HabitApproval, 'id' | 'habitId' | 'createdAt'>) => Promise<void>;
  getHabitsByCategory: (category: 'personal' | 'family' | 'friends') => Habit[];
  getHabitById: (habitId: string) => Habit | undefined;
} 