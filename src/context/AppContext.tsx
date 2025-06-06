import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppContextType, Habit, HabitApproval } from '../types';
import { useAuth } from './AuthContext';
import { habitService, approvalService, seedData } from '../services/firestore';

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
      
      const updates = {
        completedToday: !habit.completedToday,
        lastCompleted: !habit.completedToday ? new Date() : undefined,
        streakCount: !habit.completedToday ? habit.streakCount + 1 : Math.max(0, habit.streakCount - 1),
      };
      
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
      console.error('Error toggling habit:', error);
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
        id: user.id.startsWith('guest_') ? `guest_approval_${Date.now()}` : '',
        habitId,
        createdAt: new Date(),
      };
      
      if (user.id.startsWith('guest_')) {
        // For guest users, add to local state
        newApproval.id = `guest_approval_${Date.now()}`;
        setHabits(prev => prev.map(habit => 
          habit.id === habitId 
            ? { ...habit, approvals: [newApproval, ...(habit.approvals || [])] }
            : habit
        ));
      } else {
        // For authenticated users, add to Firestore
        const approvalId = await approvalService.create({
          ...approvalData,
          habitId,
        });
        
        newApproval.id = approvalId;
        setHabits(prev => prev.map(habit => 
          habit.id === habitId 
            ? { ...habit, approvals: [newApproval, ...(habit.approvals || [])] }
            : habit
        ));
      }
    } catch (error) {
      console.error('Error adding approval:', error);
      throw error;
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
    deleteHabit,
    refreshHabits,
    addApproval,
    getHabitsByCategory,
    getHabitById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 