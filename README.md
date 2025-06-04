# UpTogether - Self-Care & Mindfulness App

A React Native app built with TypeScript that helps users track habits like meditation and journaling, and receive encouragement from friends.

## Features

- 🧘‍♀️ **Habit Tracking**: Track daily self-care habits with streaks
- 🎯 **Goal Setting**: Choose from predefined wellness goals
- 🤝 **Peer Support**: Optional community encouragement
- 📱 **Clean UI**: Minimal and modern design
- 🔥 **Streak Tracking**: Build motivation with daily streaks
- 📊 **Progress Visualization**: See your daily completion rates

## Tech Stack

- **React Native** with TypeScript
- **Expo** for development and building
- **Firebase** (Auth, Firestore)
- **React Navigation** for navigation
- **NativeWind** for Tailwind CSS styling
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UpTogether
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Copy your Firebase config and update `src/firebase/config.ts`:
   
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com", 
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Project Structure

```
UpTogether/
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   ├── firebase/          # Firebase configuration
│   │   └── config.ts
│   ├── navigation/        # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── OnboardingNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── onboarding/    # Onboarding flow screens
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── GoalsScreen.tsx
│   │   │   └── PeerSupportScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Utility functions and mock data
│       └── mockData.ts
├── App.tsx               # Main app component
├── package.json
└── README.md
```

## App Flow

1. **Welcome Screen**: User creates account with name, email, password
2. **Goals Selection**: Choose from 6 wellness goals (stress reduction, sleep, etc.)
3. **Peer Support**: Toggle community features on/off
4. **Dashboard**: Main screen with habit tracking and progress

## Key Features

### Authentication
- Firebase email/password authentication
- User profile creation and management
- Secure sign out functionality

### Habit Tracking
- Pre-populated habits (meditation, journaling, etc.)
- One-tap completion tracking
- Streak counting and motivation
- Visual progress indicators

### Onboarding
- 3-step guided setup process
- Goal selection from curated list
- Peer support preference setting
- Smooth navigation flow

## Customization

### Adding New Goals
Edit `src/utils/mockData.ts` to add new wellness goals:

```typescript
export const MOCK_GOALS: Goal[] = [
  {
    id: '7',
    title: 'New Goal',
    description: 'Description of the goal',
    icon: '🎯',
    color: '#3B82F6'
  }
];
```

### Adding New Habits
Modify the `MOCK_HABITS` array in the same file to include new habit templates.

### Styling
The app uses NativeWind (Tailwind CSS for React Native). Update `tailwind.config.js` to customize the color scheme and design tokens.

## Firebase Setup Details

### Firestore Collections

The app uses these Firestore collections:

1. **users** - User profiles
   ```
   {
     name: string,
     email: string,
     onboardingComplete: boolean,
     goals: string[],
     peerSupportEnabled: boolean,
     createdAt: timestamp
   }
   ```

2. **habits** - User habits
   ```
   {
     userId: string,
     name: string,
     description: string,
     icon: string,
     color: string,
     streakCount: number,
     completedToday: boolean,
     lastCompleted: timestamp,
     createdAt: timestamp
   }
   ```

### Security Rules
Set up basic Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team. 