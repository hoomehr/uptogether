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
import { User, Habit, HabitApproval, FamilyMember, Friend } from '../types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  HABITS: 'habits',
  HABIT_APPROVALS: 'habitApprovals',
  FAMILY_MEMBERS: 'familyMembers',
  FRIENDS: 'friends',
} as const;

// User operations
export const userService = {
  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...user,
      createdAt: Timestamp.now(),
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
      } as User;
    }
    return null;
  },

  async update(userId: string, updates: Partial<User>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, updates);
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
};

// Habit Approval operations
export const approvalService = {
  async create(approval: Omit<HabitApproval, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.HABIT_APPROVALS), {
      ...approval,
      createdAt: Timestamp.now(),
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
      } as HabitApproval;
    });
  },
};

// Family Member operations
export const familyService = {
  async create(familyMember: Omit<FamilyMember, 'id' | 'joinedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.FAMILY_MEMBERS), {
      ...familyMember,
      joinedAt: Timestamp.now(),
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
      } as FamilyMember;
    });
  },
};

// Friend operations
export const friendService = {
  async create(friend: Omit<Friend, 'id' | 'addedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.FRIENDS), {
      ...friend,
      addedAt: Timestamp.now(),
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
      } as Friend;
    });
  },
};

// Seed data function
export const seedData = {
  async createSampleData(userId: string): Promise<void> {
    const batch = writeBatch(db);

    // Sample habits
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

    // Sample family members
    const sampleFamily = [
      {
        userId,
        name: 'Sarah Johnson',
        relationship: 'Spouse',
        email: 'sarah@example.com',
        isActive: true,
      },
      {
        userId,
        name: 'Emma Johnson',
        relationship: 'Daughter',
        isActive: true,
      },
    ];

    for (const member of sampleFamily) {
      const memberRef = doc(collection(db, COLLECTIONS.FAMILY_MEMBERS));
      batch.set(memberRef, {
        ...member,
        joinedAt: Timestamp.now(),
      });
    }

    // Sample friends
    const sampleFriends = [
      {
        userId,
        name: 'Mike Rodriguez',
        email: 'mike@example.com',
        username: 'mike_r',
        isActive: true,
      },
      {
        userId,
        name: 'Jennifer Lee',
        email: 'jen@example.com',
        username: 'jen_lee',
        isActive: true,
      },
    ];

    for (const friend of sampleFriends) {
      const friendRef = doc(collection(db, COLLECTIONS.FRIENDS));
      batch.set(friendRef, {
        ...friend,
        addedAt: Timestamp.now(),
      });
    }

    await batch.commit();
    console.log('Sample data created successfully!');
  },
}; 