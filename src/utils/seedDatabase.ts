import { seedData } from '../services/firestore';
import { auth } from '../firebase/config';

/**
 * Seed the database with sample data for the current user
 * This function should be called after user authentication
 */
export const seedDatabaseForCurrentUser = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('No authenticated user found. Please sign in first.');
  }

  try {
    console.log('🌱 Seeding database with sample data for user:', currentUser.email);
    await seedData.createSampleData(currentUser.uid);
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

/**
 * Seed the database with sample data for a specific user ID
 */
export const seedDatabaseForUser = async (userId: string): Promise<void> => {
  try {
    console.log('🌱 Seeding database with sample data for user ID:', userId);
    await seedData.createSampleData(userId);
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

/**
 * Check if current user has any habits in the database
 */
export const checkUserHasData = async (): Promise<boolean> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return false;
  }

  try {
    const { habitService } = await import('../services/firestore');
    const habits = await habitService.getByUserId(currentUser.uid);
    return habits.length > 0;
  } catch (error) {
    console.error('Error checking user data:', error);
    return false;
  }
}; 