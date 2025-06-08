import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { User, Habit, HabitApproval, FamilyMember, Friend, Notification, HabitCompletion, HabitStats } from '../types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  HABITS: 'habits',
  HABIT_APPROVALS: 'habitApprovals',
  HABIT_COMPLETIONS: 'habitCompletions',
  FAMILY_MEMBERS: 'familyMembers',
  FRIENDS: 'friends',
  NOTIFICATIONS: 'notifications',
} as const;

// User operations
export const userService = {
  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...user,
      createdAt: Timestamp.now(),
      preferences: user.preferences || {
        notifications: {
          habits: true,
          encouragement: true,
          milestones: true,
          dailyReminders: true,
        },
        privacy: {
          profileVisibility: 'friends',
          habitVisibility: 'friends',
        },
        theme: 'dark',
      },
      stats: user.stats || {
        totalHabits: 0,
        completedHabits: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalApprovals: 0,
        totalEncouragements: 0,
        joinedDate: new Date(),
      },
    });
    return docRef.id;
  },

  async getById(userId: string): Promise<User | null> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        stats: data.stats ? {
          ...data.stats,
          joinedDate: data.stats.joinedDate?.toDate() || data.createdAt.toDate(),
        } : undefined,
      } as User;
    }
    return null;
  },

  async update(userId: string, updates: Partial<User>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const processedUpdates = { ...updates };
    
    // Handle nested stats updates
    if (updates.stats) {
      (processedUpdates as any).stats = {
        ...updates.stats,
        joinedDate: updates.stats.joinedDate ? Timestamp.fromDate(updates.stats.joinedDate) : undefined,
      };
    }
    
    await updateDoc(docRef, processedUpdates);
  },

  async getByEmail(email: string): Promise<User | null> {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('email', '==', email),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        stats: data.stats ? {
          ...data.stats,
          joinedDate: data.stats.joinedDate?.toDate() || data.createdAt.toDate(),
        } : undefined,
      } as User;
    }
    return null;
  },
};

// Habit operations
export const habitService = {
  async create(habit: Omit<Habit, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.HABITS), {
      ...habit,
      createdAt: Timestamp.now(),
      lastCompleted: habit.lastCompleted ? Timestamp.fromDate(habit.lastCompleted) : null,
      frequency: habit.frequency || { type: 'daily' },
      reminder: habit.reminder || { enabled: false },
      tags: habit.tags || [],
      difficulty: habit.difficulty || 'medium',
      estimatedTime: habit.estimatedTime || 15,
    });
    return docRef.id;
  },

  async getByUserId(userId: string): Promise<Habit[]> {
    const q = query(
      collection(db, COLLECTIONS.HABITS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        lastCompleted: data.lastCompleted ? data.lastCompleted.toDate() : undefined,
      } as Habit;
    });
  },

  async getById(habitId: string): Promise<Habit | null> {
    const docRef = doc(db, COLLECTIONS.HABITS, habitId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        lastCompleted: data.lastCompleted ? data.lastCompleted.toDate() : undefined,
      } as Habit;
    }
    return null;
  },

  async update(habitId: string, updates: Partial<Habit>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.HABITS, habitId);
    const processedUpdates = { ...updates };
    
    if (updates.lastCompleted !== undefined) {
      (processedUpdates as any).lastCompleted = updates.lastCompleted ? Timestamp.fromDate(updates.lastCompleted) : null;
    }
    
    await updateDoc(docRef, processedUpdates);
  },

  async delete(habitId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.HABITS, habitId);
    await deleteDoc(docRef);
  },

  async getSharedHabits(userId: string): Promise<Habit[]> {
    const q = query(
      collection(db, COLLECTIONS.HABITS),
      where('sharedWith', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        lastCompleted: data.lastCompleted ? data.lastCompleted.toDate() : undefined,
      } as Habit;
    });
  },

  async getStats(habitId: string): Promise<HabitStats> {
    // Get habit completions for stats calculation
    const completions = await habitCompletionService.getByHabitId(habitId);
    
    const totalCompletions = completions.length;
    const currentStreak = calculateCurrentStreak(completions);
    const longestStreak = calculateLongestStreak(completions);
    const completionRate = calculateCompletionRate(completions);
    const averageMood = calculateAverageMood(completions);
    const averageEffort = calculateAverageEffort(completions);
    const weeklyProgress = calculateWeeklyProgress(completions);
    const monthlyProgress = calculateMonthlyProgress(completions);
    
    return {
      totalCompletions,
      currentStreak,
      longestStreak,
      completionRate,
      averageMood,
      averageEffort,
      weeklyProgress,
      monthlyProgress,
    };
  },
};

// Habit Completion operations
export const habitCompletionService = {
  async create(completion: Omit<HabitCompletion, 'id' | 'completedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.HABIT_COMPLETIONS), {
      ...completion,
      completedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async getByHabitId(habitId: string, limitCount?: number): Promise<HabitCompletion[]> {
    const q = query(
      collection(db, COLLECTIONS.HABIT_COMPLETIONS),
      where('habitId', '==', habitId),
      orderBy('completedAt', 'desc'),
      ...(limitCount ? [limit(limitCount)] : [])
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        completedAt: data.completedAt.toDate(),
      } as HabitCompletion;
    });
  },

  async getByUserId(userId: string, limitCount?: number): Promise<HabitCompletion[]> {
    const q = query(
      collection(db, COLLECTIONS.HABIT_COMPLETIONS),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      ...(limitCount ? [limit(limitCount)] : [])
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        completedAt: data.completedAt.toDate(),
      } as HabitCompletion;
    });
  },
};

// Habit Approval operations
export const approvalService = {
  async create(approval: Omit<HabitApproval, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.HABIT_APPROVALS), {
      ...approval,
      createdAt: Timestamp.now(),
      isRead: false,
      reactions: [],
    });
    return docRef.id;
  },

  async getByHabitId(habitId: string): Promise<HabitApproval[]> {
    const q = query(
      collection(db, COLLECTIONS.HABIT_APPROVALS),
      where('habitId', '==', habitId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        reactions: data.reactions?.map((reaction: any) => ({
          ...reaction,
          createdAt: reaction.createdAt.toDate(),
        })) || [],
      } as HabitApproval;
    });
  },

  async getByUserId(userId: string): Promise<HabitApproval[]> {
    const q = query(
      collection(db, COLLECTIONS.HABIT_APPROVALS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        reactions: data.reactions?.map((reaction: any) => ({
          ...reaction,
          createdAt: reaction.createdAt.toDate(),
        })) || [],
      } as HabitApproval;
    });
  },

  async markAsRead(approvalId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.HABIT_APPROVALS, approvalId);
    await updateDoc(docRef, { isRead: true });
  },
};

// Notification operations
export const notificationService = {
  async create(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
      ...notification,
      createdAt: Timestamp.now(),
      isRead: false,
    });
    return docRef.id;
  },

  async getByUserId(userId: string, limitCount: number = 50): Promise<Notification[]> {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Notification;
    });
  },

  async markAsRead(notificationId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(docRef, { isRead: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    
    await batch.commit();
  },
};

// Family Member operations
export const familyService = {
  async create(familyMember: Omit<FamilyMember, 'id' | 'joinedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.FAMILY_MEMBERS), {
      ...familyMember,
      joinedAt: Timestamp.now(),
      preferences: familyMember.preferences || {
        allowNotifications: true,
        shareProgress: true,
      },
    });
    return docRef.id;
  },

  async getByUserId(userId: string): Promise<FamilyMember[]> {
    const q = query(
      collection(db, COLLECTIONS.FAMILY_MEMBERS),
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('joinedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        joinedAt: data.joinedAt.toDate(),
        birthday: data.birthday ? data.birthday.toDate() : undefined,
      } as FamilyMember;
    });
  },

  async update(memberId: string, updates: Partial<FamilyMember>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FAMILY_MEMBERS, memberId);
    const processedUpdates = { ...updates };
    
    if (updates.birthday !== undefined) {
      (processedUpdates as any).birthday = updates.birthday ? Timestamp.fromDate(updates.birthday) : null;
    }
    
    await updateDoc(docRef, processedUpdates);
  },
};

// Friend operations
export const friendService = {
  async create(friend: Omit<Friend, 'id' | 'addedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.FRIENDS), {
      ...friend,
      addedAt: Timestamp.now(),
      status: friend.status || 'accepted',
      preferences: friend.preferences || {
        allowNotifications: true,
        shareProgress: true,
      },
    });
    return docRef.id;
  },

  async getByUserId(userId: string): Promise<Friend[]> {
    const q = query(
      collection(db, COLLECTIONS.FRIENDS),
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('addedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        addedAt: data.addedAt.toDate(),
        lastInteraction: data.lastInteraction ? data.lastInteraction.toDate() : undefined,
      } as Friend;
    });
  },

  async update(friendId: string, updates: Partial<Friend>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FRIENDS, friendId);
    const processedUpdates = { ...updates };
    
    if (updates.lastInteraction !== undefined) {
      (processedUpdates as any).lastInteraction = updates.lastInteraction ? Timestamp.fromDate(updates.lastInteraction) : null;
    }
    
    await updateDoc(docRef, processedUpdates);
  },
};

// Helper functions for habit stats calculations
function calculateCurrentStreak(completions: HabitCompletion[]): number {
  if (completions.length === 0) return 0;
  
  const sortedCompletions = completions.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const completion of sortedCompletions) {
    const completionDate = new Date(completion.completedAt);
    completionDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }
  
  return streak;
}

function calculateLongestStreak(completions: HabitCompletion[]): number {
  if (completions.length === 0) return 0;
  
  const sortedCompletions = completions.sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
  let longestStreak = 0;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedCompletions.length; i++) {
    const prevDate = new Date(sortedCompletions[i - 1].completedAt);
    const currentDate = new Date(sortedCompletions[i].completedAt);
    
    prevDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }
  
  return Math.max(longestStreak, currentStreak);
}

function calculateCompletionRate(completions: HabitCompletion[]): number {
  if (completions.length === 0) return 0;
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentCompletions = completions.filter(c => c.completedAt >= thirtyDaysAgo);
  return Math.round((recentCompletions.length / 30) * 100);
}

function calculateAverageMood(completions: HabitCompletion[]): number | undefined {
  const completionsWithMood = completions.filter(c => c.mood);
  if (completionsWithMood.length === 0) return undefined;
  
  const moodValues = { great: 5, good: 4, okay: 3, difficult: 2 };
  const totalMood = completionsWithMood.reduce((sum, c) => sum + (moodValues[c.mood as keyof typeof moodValues] || 3), 0);
  
  return Math.round((totalMood / completionsWithMood.length) * 10) / 10;
}

function calculateAverageEffort(completions: HabitCompletion[]): number | undefined {
  const completionsWithEffort = completions.filter(c => c.effort);
  if (completionsWithEffort.length === 0) return undefined;
  
  const totalEffort = completionsWithEffort.reduce((sum, c) => sum + (c.effort || 0), 0);
  return Math.round((totalEffort / completionsWithEffort.length) * 10) / 10;
}

function calculateWeeklyProgress(completions: HabitCompletion[]): number[] {
  const weeks = Array(7).fill(0);
  const now = new Date();
  
  for (let i = 0; i < 7; i++) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    
    const weekCompletions = completions.filter(c => 
      c.completedAt >= weekStart && c.completedAt < weekEnd
    );
    
    weeks[6 - i] = weekCompletions.length;
  }
  
  return weeks;
}

function calculateMonthlyProgress(completions: HabitCompletion[]): number[] {
  const months = Array(12).fill(0);
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthCompletions = completions.filter(c => 
      c.completedAt >= monthStart && c.completedAt <= monthEnd
    );
    
    months[11 - i] = monthCompletions.length;
  }
  
  return months;
}

// Seed data function
export const seedData = {
  async createSampleData(userId: string): Promise<void> {
    const batch = writeBatch(db);

    // Sample habits with enhanced data
    const sampleHabits = [
      {
        userId,
        name: 'Morning Meditation',
        description: 'Start the day with 10 minutes of mindfulness',
        icon: '🧘‍♀️',
        color: '#8b5cf6',
        streakCount: 5,
        completedToday: false,
        category: 'personal' as const,
        isShared: false,
        visibility: 'private' as const,
        frequency: { type: 'daily' as const },
        reminder: { enabled: true, time: '07:00', message: 'Time for morning meditation' },
        tags: ['mindfulness', 'morning', 'wellness'],
        difficulty: 'easy' as const,
        estimatedTime: 10,
      },
      {
        userId,
        name: 'Drink Water',
        description: 'Stay hydrated throughout the day',
        icon: '💧',
        color: '#06b6d4',
        streakCount: 12,
        completedToday: true,
        lastCompleted: new Date(),
        category: 'personal' as const,
        isShared: false,
        visibility: 'private' as const,
        frequency: { type: 'daily' as const },
        reminder: { enabled: true, time: '09:00', message: 'Remember to drink water' },
        tags: ['health', 'hydration'],
        difficulty: 'easy' as const,
        estimatedTime: 1,
      },
      {
        userId,
        name: 'Evening Walk',
        description: 'Take a relaxing walk in the evening',
        icon: '🚶‍♂️',
        color: '#10b981',
        streakCount: 3,
        completedToday: false,
        category: 'family' as const,
        isShared: true,
        sharedWith: [userId],
        visibility: 'shared' as const,
        frequency: { type: 'daily' as const },
        reminder: { enabled: true, time: '18:00', message: 'Time for evening walk with family' },
        tags: ['exercise', 'family', 'outdoor'],
        difficulty: 'medium' as const,
        estimatedTime: 30,
      },
      {
        userId,
        name: 'Read for 30min',
        description: 'Read books to expand knowledge and relax',
        icon: '📚',
        color: '#f59e0b',
        streakCount: 8,
        completedToday: true,
        lastCompleted: new Date(),
        category: 'personal' as const,
        isShared: false,
        visibility: 'private' as const,
        frequency: { type: 'daily' as const },
        reminder: { enabled: true, time: '20:00', message: 'Reading time before bed' },
        tags: ['learning', 'relaxation', 'evening'],
        difficulty: 'medium' as const,
        estimatedTime: 30,
      },
      {
        userId,
        name: 'Workout',
        description: 'Stay active with regular exercise',
        icon: '💪',
        color: '#ef4444',
        streakCount: 0,
        completedToday: false,
        category: 'friends' as const,
        isShared: true,
        sharedWith: [userId],
        visibility: 'shared' as const,
        frequency: { type: 'weekly' as const, daysOfWeek: [1, 3, 5] }, // Mon, Wed, Fri
        reminder: { enabled: true, time: '17:00', message: 'Workout time with friends!' },
        tags: ['fitness', 'friends', 'strength'],
        difficulty: 'hard' as const,
        estimatedTime: 60,
      },
    ];

    // Add habits
    for (const habit of sampleHabits) {
      const habitRef = doc(collection(db, COLLECTIONS.HABITS));
      batch.set(habitRef, {
        ...habit,
        createdAt: Timestamp.now(),
        lastCompleted: habit.lastCompleted ? Timestamp.fromDate(habit.lastCompleted) : null,
      });
    }

    // Sample family members with enhanced data
    const sampleFamily = [
      {
        userId,
        name: 'Sarah Johnson',
        relationship: 'Spouse',
        email: 'sarah@example.com',
        isActive: true,
        preferences: {
          allowNotifications: true,
          shareProgress: true,
        },
      },
      {
        userId,
        name: 'Emma Johnson',
        relationship: 'Daughter',
        isActive: true,
        birthday: new Date('2010-05-15'),
        preferences: {
          allowNotifications: false,
          shareProgress: true,
        },
      },
    ];

    for (const member of sampleFamily) {
      const memberRef = doc(collection(db, COLLECTIONS.FAMILY_MEMBERS));
      batch.set(memberRef, {
        ...member,
        joinedAt: Timestamp.now(),
        birthday: member.birthday ? Timestamp.fromDate(member.birthday) : null,
      });
    }

    // Sample friends with enhanced data
    const sampleFriends = [
      {
        userId,
        name: 'Mike Rodriguez',
        email: 'mike@example.com',
        username: 'mike_r',
        isActive: true,
        status: 'accepted' as const,
        mutualFriends: 3,
        lastInteraction: new Date(),
        preferences: {
          allowNotifications: true,
          shareProgress: true,
        },
      },
      {
        userId,
        name: 'Jennifer Lee',
        email: 'jen@example.com',
        username: 'jen_lee',
        isActive: true,
        status: 'accepted' as const,
        mutualFriends: 1,
        lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        preferences: {
          allowNotifications: true,
          shareProgress: true,
        },
      },
    ];

    for (const friend of sampleFriends) {
      const friendRef = doc(collection(db, COLLECTIONS.FRIENDS));
      batch.set(friendRef, {
        ...friend,
        addedAt: Timestamp.now(),
        lastInteraction: friend.lastInteraction ? Timestamp.fromDate(friend.lastInteraction) : null,
      });
    }

    await batch.commit();
    console.log('Enhanced sample data created successfully!');
  },
}; 