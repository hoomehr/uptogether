import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            await loadUserData(firebaseUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth:', error);
        }
      }
    };
  }, []);

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name,
          onboardingComplete: userData.onboardingComplete || false,
          goals: userData.goals || [],
          peerSupportEnabled: userData.peerSupportEnabled || false,
          createdAt: userData.createdAt?.toDate() || new Date(),
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        onboardingComplete: false,
        goals: [],
        peerSupportEnabled: false,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const continueAsGuest = async (name?: string) => {
    try {
      // Create a guest user without Firebase authentication
      const guestUser: User = {
        id: 'guest_' + Date.now(),
        email: 'guest@local.app',
        name: name || 'Guest User',
        onboardingComplete: false,
        goals: [],
        peerSupportEnabled: false,
        createdAt: new Date(),
      };
      
      setUser(guestUser);
    } catch (error) {
      console.error('Guest login error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (user?.id.startsWith('guest_')) {
        // For guest users, just clear the state
        setUser(null);
      } else {
        // For Firebase users, sign out properly
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      if (user.id.startsWith('guest_')) {
        // For guest users, just update local state
        setUser({ ...user, ...updates });
      } else {
        // For Firebase users, update Firestore
        await updateDoc(doc(db, 'users', user.id), updates);
        setUser({ ...user, ...updates });
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const updateUserPreferences = async (preferences: any) => {
    if (!user) return;
    
    try {
      if (user.id.startsWith('guest_')) {
        // For guest users, just update local state
        setUser({ ...user, ...preferences });
      } else {
        // For Firebase users, update Firestore
        await updateDoc(doc(db, 'users', user.id), preferences);
        setUser({ ...user, ...preferences });
      }
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
    updateUserPreferences,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 