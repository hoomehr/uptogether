import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppContextType, Habit, HabitApproval, HabitCompletion, HabitStats } from '../types';
import { useAuth } from './AuthContext';
import { habitService, approvalService, seedData, habitCompletionService } from '../services/firestore';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [user]);

  const loadHabits = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let userHabits: Habit[] = [];
      
      if (user.id.startsWith('guest_')) {
        // For guest users, create sample data locally
        userHabits = await createGuestHabits();
      } else {
        // For authenticated users, load from Firestore
        userHabits = await habitService.getByUserId(user.id);
        
        // If user has no habits yet, seed with sample data
        if (userHabits.length === 0) {
          await seedData.createSampleData(user.id);
          userHabits = await habitService.getByUserId(user.id);
        }
      }
      
      // Load approvals for each habit
      const habitsWithApprovals = await Promise.all(
        userHabits.map(async (habit) => {
          if (user.id.startsWith('guest_')) {
            // Create sample approvals for guest users
            return {
              ...habit,
              approvals: createSampleApprovals(habit.id),
            };
          } else {
            const approvals = await approvalService.getByHabitId(habit.id);
            return {
              ...habit,
              approvals,
            };
          }
        })
      );
      
      setHabits(habitsWithApprovals);
    } catch (error) {
      console.error('Error loading habits:', error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const createGuestHabits = async (): Promise<Habit[]> => {
    return [
      {
        id: 'guest_habit_1',
        userId: user!.id,
        name: 'Morning Meditation',
        description: 'Start the day with 10 minutes of mindfulness',
        icon: '🧘‍♀️',
        color: '#8b5cf6',
        streakCount: 5,
        completedToday: false,
        createdAt: new Date(),
        category: 'personal',
        isShared: false,
        visibility: 'private',
        frequency: { type: 'daily' },
        reminder: { enabled: true, time: '07:00', message: 'Time for morning meditation' },
        tags: ['mindfulness', 'morning', 'wellness'],
        difficulty: 'easy',
        estimatedTime: 10,
      },
      {
        id: 'guest_habit_2',
        userId: user!.id,
        name: 'Drink Water',
        description: 'Stay hydrated throughout the day',
        icon: '💧',
        color: '#06b6d4',
        streakCount: 12,
        completedToday: true,
        lastCompleted: new Date(),
        createdAt: new Date(),
        category: 'personal',
        isShared: false,
        visibility: 'private',
        frequency: { type: 'daily' },
        reminder: { enabled: true, time: '09:00', message: 'Remember to drink water' },
        tags: ['health', 'hydration'],
        difficulty: 'easy',
        estimatedTime: 1,
      },
      {
        id: 'guest_habit_3',
        userId: user!.id,
        name: 'Evening Walk',
        description: 'Take a relaxing walk in the evening',
        icon: '🚶‍♂️',
        color: '#10b981',
        streakCount: 3,
        completedToday: false,
        createdAt: new Date(),
        category: 'family',
        isShared: true,
        sharedWith: [user!.id],
        visibility: 'shared',
        frequency: { type: 'daily' },
        reminder: { enabled: true, time: '18:00', message: 'Time for evening walk with family' },
        tags: ['exercise', 'family', 'outdoor'],
        difficulty: 'medium',
        estimatedTime: 30,
      },
      {
        id: 'guest_habit_4',
        userId: user!.id,
        name: 'Read for 30min',
        description: 'Read books to expand knowledge and relax',
        icon: '📚',
        color: '#f59e0b',
        streakCount: 8,
        completedToday: true,
        lastCompleted: new Date(),
        createdAt: new Date(),
        category: 'personal',
        isShared: false,
        visibility: 'private',
        frequency: { type: 'daily' },
        reminder: { enabled: true, time: '20:00', message: 'Reading time before bed' },
        tags: ['learning', 'relaxation', 'evening'],
        difficulty: 'medium',
        estimatedTime: 30,
      },
      {
        id: 'guest_habit_5',
        userId: user!.id,
        name: 'Workout',
        description: 'Stay active with regular exercise',
        icon: '💪',
        color: '#ef4444',
        streakCount: 0,
        completedToday: false,
        createdAt: new Date(),
        category: 'friends',
        isShared: true,
        sharedWith: [user!.id],
        visibility: 'shared',
        frequency: { type: 'weekly', daysOfWeek: [1, 3, 5] },
        reminder: { enabled: true, time: '17:00', message: 'Workout time with friends!' },
        tags: ['fitness', 'friends', 'strength'],
        difficulty: 'hard',
        estimatedTime: 60,
      },
    ];
  };

  const createSampleApprovals = (habitId: string): HabitApproval[] => {
    return [
      {
        id: `approval_${habitId}_1`,
        habitId,
        userId: user!.id,
        userName: user!.name,
        type: 'encouragement',
        emoji: '💪',
        message: 'Keep going strong!',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        id: `approval_${habitId}_2`,
        habitId,
        userId: 'sample_user_1',
        userName: 'Sophie Wilson',
        type: 'support',
        emoji: '👍',
        message: `${user!.name} approves Sophie Wilson's effort!`,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
      {
        id: `approval_${habitId}_3`,
        habitId,
        userId: 'sample_user_2',
        userName: 'Maria Rodriguez',
        type: 'support',
        emoji: '👍',
        message: `${user!.name} approves Maria Rodriguez's effort!`,
        createdAt: new Date(Date.now() - 10800000), // 3 hours ago
      },
    ];
  };

  const addHabit = async (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      if (user.id.startsWith('guest_')) {
        // For guest users, add to local state
        const newHabit: Habit = {
          ...habitData,
          id: `guest_habit_${Date.now()}`,
          userId: user.id,
          createdAt: new Date(),
          approvals: [],
        };
        setHabits(prev => [newHabit, ...prev]);
      } else {
        // For authenticated users, add to Firestore
        const habitId = await habitService.create({
          ...habitData,
          userId: user.id,
        });
        
        const newHabit = await habitService.getById(habitId);
        if (newHabit) {
          setHabits(prev => [{ ...newHabit, approvals: [] }, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  const toggleHabit = async (habitId: string) => {
    if (!user) return;
    
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;
      
      const newCompletedState = !habit.completedToday;
      const now = new Date();
      
      if (user.id.startsWith('guest_')) {
        // For guest users, update local state
        setHabits(prev => prev.map(h => 
          h.id === habitId 
            ? { 
                ...h, 
                completedToday: newCompletedState,
                lastCompleted: newCompletedState ? now : undefined,
                streakCount: newCompletedState ? h.streakCount + 1 : Math.max(0, h.streakCount - 1)
              }
            : h
        ));
      } else {
        // For authenticated users, update Firestore
        const updates: Partial<Habit> = {
          completedToday: newCompletedState,
          lastCompleted: newCompletedState ? now : undefined,
          streakCount: newCompletedState ? habit.streakCount + 1 : Math.max(0, habit.streakCount - 1)
        };
        
        await habitService.update(habitId, updates);
        
        setHabits(prev => prev.map(h => 
          h.id === habitId ? { ...h, ...updates } : h
        ));
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    if (!user) return;
    
    try {
      if (user.id.startsWith('guest_')) {
        // For guest users, update local state
        setHabits(prev => prev.map(h => 
          h.id === habitId ? { ...h, ...updates } : h
        ));
      } else {
        // For authenticated users, update Firestore
        await habitService.update(habitId, updates);
        setHabits(prev => prev.map(h => 
          h.id === habitId ? { ...h, ...updates } : h
        ));
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!user) return;
    
    try {
      if (user.id.startsWith('guest_')) {
        // For guest users, remove from local state
        setHabits(prev => prev.filter(h => h.id !== habitId));
      } else {
        // For authenticated users, delete from Firestore
        await habitService.delete(habitId);
        setHabits(prev => prev.filter(h => h.id !== habitId));
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  const addApproval = async (habitId: string, approvalData: Omit<HabitApproval, 'id' | 'habitId' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      const newApproval: HabitApproval = {
        ...approvalData,
        id: `approval_${Date.now()}`,
        habitId,
        createdAt: new Date(),
      };
      
      if (user.id.startsWith('guest_')) {
        // For guest users, add to local state
        setHabits(prev => prev.map(h => 
          h.id === habitId 
            ? { ...h, approvals: [...(h.approvals || []), newApproval] }
            : h
        ));
      } else {
        // For authenticated users, add to Firestore
        await approvalService.create({
          ...approvalData,
          habitId,
        });
        
        setHabits(prev => prev.map(h => 
          h.id === habitId 
            ? { ...h, approvals: [...(h.approvals || []), newApproval] }
            : h
        ));
      }
    } catch (error) {
      console.error('Error adding approval:', error);
      throw error;
    }
  };

  const addHabitCompletion = async (habitId: string, completion: Omit<HabitCompletion, 'id' | 'habitId' | 'userId' | 'completedAt'>) => {
    if (!user) return;
    
    try {
      if (!user.id.startsWith('guest_')) {
        // For authenticated users, add to Firestore
        await habitCompletionService.create({
          ...completion,
          habitId,
          userId: user.id,
        });
      }
      // For guest users, we don't store completions separately
    } catch (error) {
      console.error('Error adding habit completion:', error);
      throw error;
    }
  };

  const getHabitCompletions = async (habitId: string, limit?: number): Promise<HabitCompletion[]> => {
    if (!user || user.id.startsWith('guest_')) {
      // For guest users, return empty array
      return [];
    }
    
    try {
      return await habitCompletionService.getByHabitId(habitId, limit);
    } catch (error) {
      console.error('Error getting habit completions:', error);
      return [];
    }
  };

  const getHabitStats = async (habitId: string): Promise<HabitStats> => {
    if (!user || user.id.startsWith('guest_')) {
      // For guest users, return mock stats
      const habit = habits.find(h => h.id === habitId);
      return {
        totalCompletions: habit?.streakCount || 0,
        currentStreak: habit?.streakCount || 0,
        longestStreak: habit?.streakCount || 0,
        completionRate: habit?.completedToday ? 80 : 60,
        weeklyProgress: [3, 4, 2, 5, 3, 4, 2],
        monthlyProgress: [15, 18, 12, 20, 16, 22, 19, 25, 21, 18, 23, 20],
      };
    }
    
    try {
      return await habitService.getStats(habitId);
    } catch (error) {
      console.error('Error getting habit stats:', error);
      return {
        totalCompletions: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
        monthlyProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
    }
  };

  const refreshHabits = async () => {
    await loadHabits();
  };

  const getHabitsByCategory = (category: 'personal' | 'family' | 'friends') => {
    return habits.filter(habit => habit.category === category);
  };

  const getHabitById = (habitId: string) => {
    return habits.find(habit => habit.id === habitId);
  };

  const value: AppContextType = {
    habits,
    loading,
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
    refreshHabits,
    addApproval,
    addHabitCompletion,
    getHabitCompletions,
    getHabitStats,
    getHabitsByCategory,
    getHabitById,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider; 