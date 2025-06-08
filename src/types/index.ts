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
  avatar?: string;
  timezone?: string;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  notifications: {
    habits: boolean;
    encouragement: boolean;
    milestones: boolean;
    dailyReminders: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    habitVisibility: 'public' | 'friends' | 'private';
  };
  theme: 'dark' | 'light' | 'auto';
}

export interface UserStats {
  totalHabits: number;
  completedHabits: number;
  currentStreak: number;
  longestStreak: number;
  totalApprovals: number;
  totalEncouragements: number;
  joinedDate: Date;
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
  frequency?: HabitFrequency;
  reminder?: HabitReminder;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: number; // in minutes
}

export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  customDays?: Date[];
}

export interface HabitReminder {
  enabled: boolean;
  time?: string; // HH:MM format
  message?: string;
}

export interface HabitApproval {
  id: string;
  habitId: string;
  userId: string;
  userName: string;
  type: 'encouragement' | 'celebration' | 'support' | 'milestone';
  message?: string;
  emoji: string;
  createdAt: Date;
  isRead?: boolean;
  reactions?: ApprovalReaction[];
}

export interface ApprovalReaction {
  userId: string;
  userName: string;
  emoji: string;
  createdAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category?: string;
  isActive?: boolean;
}

export interface FamilyMember {
  id: string;
  userId: string; // Owner
  name: string;
  relationship: string;
  email?: string;
  joinedAt: Date;
  isActive: boolean;
  avatar?: string;
  birthday?: Date;
  preferences?: {
    allowNotifications: boolean;
    shareProgress: boolean;
  };
}

export interface Friend {
  id: string;
  userId: string; // Owner
  name: string;
  email?: string;
  username?: string;
  addedAt: Date;
  isActive: boolean;
  avatar?: string;
  status?: 'pending' | 'accepted' | 'blocked';
  mutualFriends?: number;
  lastInteraction?: Date;
  preferences?: {
    allowNotifications: boolean;
    shareProgress: boolean;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'habit_reminder' | 'encouragement' | 'milestone' | 'friend_request' | 'approval';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any; // Additional data for the notification
  actionUrl?: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  note?: string;
  mood?: 'great' | 'good' | 'okay' | 'difficult';
  effort?: number; // 1-5 scale
}

export interface EncouragementOption {
  emoji: string;
  message: string;
  category?: 'motivation' | 'celebration' | 'support';
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
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
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
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  addHabitCompletion: (habitId: string, completion: Omit<HabitCompletion, 'id' | 'habitId' | 'userId' | 'completedAt'>) => Promise<void>;
  getHabitCompletions: (habitId: string, limit?: number) => Promise<HabitCompletion[]>;
  getHabitStats: (habitId: string) => Promise<HabitStats>;
}

export interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // percentage
  averageMood?: number;
  averageEffort?: number;
  weeklyProgress: number[];
  monthlyProgress: number[];
} 