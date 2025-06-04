import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { AppContextType, Habit } from '../types';
import { useAuth } from './AuthContext';

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

  const isGuest = user?.id.startsWith('guest_');

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    if (isGuest) {
      // For guest users, habits are stored in component state
      setLoading(false);
      return;
    }

    // For authenticated users, use Firestore
    const habitsQuery = query(
      collection(db, 'habits'),
      where('userId', '==', user.id)
    );

    const unsubscribe = onSnapshot(habitsQuery, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastCompleted: doc.data().lastCompleted?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Habit[];
      
      setHabits(habitsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, isGuest]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    try {
      if (isGuest) {
        // For guest users, add to local state
        const newHabit: Habit = {
          ...habitData,
          id: 'habit_' + Date.now(),
          userId: user.id,
          createdAt: new Date(),
        };
        setHabits(prev => [...prev, newHabit]);
      } else {
        // For authenticated users, add to Firestore
        await addDoc(collection(db, 'habits'), {
          ...habitData,
          userId: user.id,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  const toggleHabit = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastCompletedDate = habit.lastCompleted ? 
        new Date(habit.lastCompleted.getFullYear(), habit.lastCompleted.getMonth(), habit.lastCompleted.getDate()) : 
        null;

      const isCompletingToday = !habit.completedToday;
      const wasCompletedYesterday = lastCompletedDate && 
        (today.getTime() - lastCompletedDate.getTime()) === 24 * 60 * 60 * 1000;

      let newStreakCount = habit.streakCount;
      if (isCompletingToday) {
        newStreakCount = wasCompletedYesterday || habit.streakCount === 0 ? habit.streakCount + 1 : 1;
      } else {
        newStreakCount = 0;
      }

      const updates = {
        completedToday: isCompletingToday,
        streakCount: newStreakCount,
        lastCompleted: isCompletingToday ? now : undefined,
      };

      if (isGuest) {
        // For guest users, update local state
        setHabits(prev => prev.map(h => 
          h.id === habitId ? { ...h, ...updates } : h
        ));
      } else {
        // For authenticated users, update Firestore
        await updateDoc(doc(db, 'habits', habitId), {
          ...updates,
          lastCompleted: isCompletingToday ? Timestamp.fromDate(now) : null,
        });
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      if (isGuest) {
        // For guest users, remove from local state
        setHabits(prev => prev.filter(h => h.id !== habitId));
      } else {
        // For authenticated users, delete from Firestore
        await deleteDoc(doc(db, 'habits', habitId));
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  const refreshHabits = async () => {
    setLoading(true);
    // The real-time listener will automatically update the habits
    setLoading(false);
  };

  const value: AppContextType = {
    habits,
    loading,
    addHabit,
    toggleHabit,
    deleteHabit,
    refreshHabits,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 