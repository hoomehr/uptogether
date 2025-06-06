const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, writeBatch, Timestamp } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

// Load environment variables
require('dotenv').config({ path: '.env.development' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedFirestore() {
  try {
    console.log('🔥 Starting Firestore seeding...');
    console.log('📡 Project ID:', firebaseConfig.projectId);

    // Create a test user first
    let userId;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        'test@uptogether.app', 
        'password123'
      );
      userId = userCredential.user.uid;
      console.log('✅ Test user created:', userId);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️ Test user already exists, using existing user');
        // For this script, we'll use a dummy user ID
        userId = 'test_user_' + Date.now();
      } else {
        throw error;
      }
    }

    const batch = writeBatch(db);

    // Create user document
    const userRef = doc(collection(db, 'users'), userId);
    batch.set(userRef, {
      email: 'test@uptogether.app',
      name: 'Test User',
      onboardingComplete: true,
      goals: ['Exercise', 'Meditation', 'Reading'],
      peerSupportEnabled: true,
      createdAt: Timestamp.now(),
    });

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
        category: 'personal',
        isShared: false,
        visibility: 'private',
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
        category: 'personal',
        isShared: false,
        visibility: 'private',
      },
      {
        userId,
        name: 'Evening Walk',
        description: 'Take a relaxing walk in the evening',
        icon: '🚶‍♂️',
        color: '#10b981',
        streakCount: 3,
        completedToday: false,
        category: 'family',
        isShared: true,
        sharedWith: [userId],
        visibility: 'shared',
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
        category: 'personal',
        isShared: false,
        visibility: 'private',
      },
      {
        userId,
        name: 'Workout',
        description: 'Stay active with regular exercise',
        icon: '💪',
        color: '#ef4444',
        streakCount: 0,
        completedToday: false,
        category: 'friends',
        isShared: true,
        sharedWith: [userId],
        visibility: 'shared',
      },
    ];

    // Add habits to batch
    sampleHabits.forEach((habit, index) => {
      const habitRef = doc(collection(db, 'habits'));
      batch.set(habitRef, {
        ...habit,
        createdAt: Timestamp.now(),
        lastCompleted: habit.lastCompleted ? Timestamp.fromDate(habit.lastCompleted) : null,
      });
      console.log(`📝 Queued habit ${index + 1}: ${habit.name}`);
    });

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

    sampleFamily.forEach((member, index) => {
      const memberRef = doc(collection(db, 'familyMembers'));
      batch.set(memberRef, {
        ...member,
        joinedAt: Timestamp.now(),
      });
      console.log(`👨‍👩‍👧‍👦 Queued family member ${index + 1}: ${member.name}`);
    });

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

    sampleFriends.forEach((friend, index) => {
      const friendRef = doc(collection(db, 'friends'));
      batch.set(friendRef, {
        ...friend,
        addedAt: Timestamp.now(),
      });
      console.log(`👥 Queued friend ${index + 1}: ${friend.name}`);
    });

    // Commit all data to Firestore
    console.log('🚀 Committing batch to Firestore...');
    await batch.commit();
    
    console.log('\n🎉 SUCCESS! Firestore seeded with sample data:');
    console.log('📊 1 user');
    console.log('🎯 5 habits');
    console.log('👨‍👩‍👧‍👦 2 family members');
    console.log('👥 2 friends');
    console.log('\n💡 You can now view this data in your Firebase Console!');
    console.log(`🔗 https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
    
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    console.error('💡 Make sure your .env.development file has valid Firebase credentials');
  }
}

// Run the seeding
seedFirestore().then(() => {
  console.log('\n✅ Seeding script completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Seeding script failed:', error);
  process.exit(1);
}); 