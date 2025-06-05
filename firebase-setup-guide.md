# Firebase Database Setup Guide for UpTogether

## 🚀 Quick Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `uptogether-habits`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Anonymous** (for guest users)

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select location (choose closest to your users)

### 4. Configure Firebase Rules

Replace the default Firestore rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habits: users can read/write their own habits
    match /habits/{habitId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Family/Friends: shared access based on sharing permissions
    match /shared/{shareId} {
      allow read, write: if request.auth != null && 
        (resource.data.members[request.auth.uid] != null || 
         request.resource.data.members[request.auth.uid] != null);
    }
  }
}
```

### 5. Get Configuration

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" → **Web app**
3. Click "Add app" → Register app
4. Copy the `firebaseConfig` object

### 6. Update Your App Config

Replace the config in `src/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "uptogether-habits.firebaseapp.com",
  projectId: "uptogether-habits",
  storageBucket: "uptogether-habits.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## 📊 Database Structure

### Collections Design:

```
users/
  {userId}/
    - email: string
    - name: string
    - onboardingComplete: boolean
    - createdAt: timestamp
    - peerSupportEnabled: boolean

habits/
  {habitId}/
    - userId: string (owner)
    - name: string
    - description: string
    - icon: string
    - category: 'personal' | 'family' | 'friends'
    - isShared: boolean
    - sharedWith: string[] (user IDs)
    - streakCount: number
    - completedToday: boolean
    - lastCompleted: timestamp
    - createdAt: timestamp
    - approvals: array of approval objects

families/
  {familyId}/
    - name: string
    - members: map of userId -> memberInfo
    - habits: string[] (habit IDs)
    - createdBy: string (userId)
    - createdAt: timestamp

friends/
  {friendshipId}/
    - users: [userId1, userId2]
    - status: 'pending' | 'accepted'
    - createdAt: timestamp
```

## 🔧 Environment Setup

### Install Dependencies (if not already installed):

```bash
npm install firebase
```

### Development vs Production

Create `.env` files:

**.env.development:**
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=uptogether-dev.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=uptogether-dev
```

**.env.production:**
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-prod-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=uptogether-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=uptogether-prod
```

Update `firebase/config.ts` to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};
```

## 🚀 Testing Your Setup

1. Start your app: `npm start`
2. Try creating an account
3. Add a habit
4. Check Firebase Console → Firestore to see data

## 📈 Performance Tips

1. **Indexes**: Firebase will suggest indexes for complex queries
2. **Offline Support**: Firestore includes offline caching
3. **Real-time Updates**: Your app already uses `onSnapshot` for live updates
4. **Security**: Always use proper rules in production

## 🛠️ Common Issues

### Issue: "Permission denied"
**Solution**: Check Firestore rules match your user authentication

### Issue: "Network error"
**Solution**: Verify API keys and project ID are correct

### Issue: "Quota exceeded"
**Solution**: Check Firebase usage in console, upgrade plan if needed

## 📱 Ready to Go!

Your database is now set up! The app will automatically:
- Store habits in Firestore for authenticated users
- Keep data in memory for guest users
- Sync in real-time across devices
- Handle offline/online state 