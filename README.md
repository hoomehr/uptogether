# UpTogether - Self-Care & Mindfulness App 🌟

A beautiful React Native app with a **cosmic dark theme** built with TypeScript that helps users track habits like meditation and journaling, and receive encouragement from friends and family. Features stunning gradients, glass morphism effects, smooth animations, and comprehensive peer support system.

## ✨ Features

### 🧘‍♀️ **Habit Tracking System**
- **Multi-Category Habits**: Personal, Family, and Friends habits with distinct workflows
- **Smart Streak Tracking**: Build motivation with daily streaks and visual progress indicators
- **Real-time Sync**: Firebase Firestore integration with offline support
- **Completion States**: Visual feedback for completed habits with animations

### 🤝 **Peer Support & Social Features**
- **Cheer System**: Send encouragement with emojis and custom messages
- **Peer Approval**: Approve family members and friends for their habit completions
- **Activity Feed**: See recent approvals and encouragement from your network
- **Social Visibility**: Control who can see and interact with your habits

### 👨‍👩‍👧‍👦 **Family & Friends Management**
- **Family Members**: Add family with relationships (spouse, child, parent, etc.)
- **Friends Network**: Connect with friends via email or username
- **Shared Habits**: Create habits that involve family or friends
- **Group Motivation**: Support each other's wellness journey

### 🎯 **Goal Setting & Progress**
- **Wellness Goals**: Choose from predefined self-care goals
- **Progress Visualization**: Animated SVG progress circles with cosmic colors
- **Weekly Summaries**: Track progress over time
- **Achievement System**: Streak milestones with special emojis

### 🎨 **Modern Design System**
- **Cosmic Dark Theme**: Beautiful space-inspired design with purple/violet gradients
- **Glass Morphism**: Modern glass card components with backdrop blur effects
- **Smooth Animations**: Delightful micro-interactions with spring animations
- **Responsive Layout**: Adapts to different screen sizes and orientations

## 🏗️ Tech Stack

- **React Native** with TypeScript
- **Expo** for development and building
- **Firebase** (Authentication, Firestore)
- **React Navigation** for navigation
- **NativeWind** for Tailwind CSS styling
- **Context API** for state management
- **Expo Linear Gradient** for beautiful gradient backgrounds
- **React Native SVG** for progress circles and icons
- **React Native Reanimated** for smooth animations

## 🚀 Getting Started

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

4. **Set up environment variables**
   ```bash
   cp .env.example .env.development
   # Update .env.development with your Firebase config
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## 📱 App Structure

### Navigation Flow
```
AppNavigator
├── AuthScreen (Sign In/Sign Up/Guest Mode)
└── MainTabs
    ├── Personal (Personal habits)
    ├── Family (Family habits & members)
    ├── Friends (Friends habits & network)
    ├── Dashboard (Overview & stats)
    └── HabitDetail (Detailed habit view)
```

### Key Screens

#### **AuthScreen**
- Modern flat design authentication
- Tab-based Sign In/Sign Up
- Guest mode for immediate access
- Account upgrade from guest to full user

#### **Dashboard**
- Comprehensive habit overview
- Quick stats and progress visualization
- Weekly summaries and achievements
- Admin panel for development (seeding data)

#### **Personal Habits**
- Private habit tracking
- Self-completion and self-motivation
- Personal progress tracking
- Streak management

#### **Family Habits**
- Shared family activities
- Family member management
- Peer approval for family members
- Encouragement system

#### **Friends Habits**
- Social habit tracking
- Friends network management
- Peer support and cheering
- Community motivation

#### **Habit Detail**
- Comprehensive habit information
- Progress statistics and history
- Recent activity feed
- Action buttons for interaction

## 🗄️ Data Collections

### Firestore Database Structure

#### **users**
```typescript
{
  id: string;
  email: string;
  name: string;
  onboardingComplete: boolean;
  goals: string[];
  peerSupportEnabled: boolean;
  createdAt: timestamp;
}
```

#### **habits**
```typescript
{
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  streakCount: number;
  completedToday: boolean;
  lastCompleted?: timestamp;
  category: 'personal' | 'family' | 'friends';
  isShared: boolean;
  sharedWith?: string[]; // User IDs
  visibility: 'private' | 'shared' | 'public';
  createdAt: timestamp;
}
```

#### **habitApprovals**
```typescript
{
  id: string;
  habitId: string;
  userId: string;
  userName: string;
  type: 'encouragement' | 'celebration' | 'support';
  message?: string;
  emoji: string;
  createdAt: timestamp;
}
```

#### **familyMembers**
```typescript
{
  id: string;
  userId: string; // Owner
  name: string;
  relationship: string;
  email?: string;
  isActive: boolean;
  joinedAt: timestamp;
}
```

#### **friends**
```typescript
{
  id: string;
  userId: string; // Owner
  name: string;
  email?: string;
  username?: string;
  isActive: boolean;
  addedAt: timestamp;
  avatar?: string;
}
```

## 🎯 Key Features Deep Dive

### Habit Details Modal Functionalities

#### **Peer Approve System**
- **Family Context**: Select family member to approve their habit completion
- **Friends Context**: Choose friend to give approval for their goal
- **Duplicate Prevention**: Prevents multiple approvals from same user
- **Visual Feedback**: Success messages and UI updates

#### **Cheer System**
- **Quick Reactions**: Pre-defined emoji reactions with messages
- **Custom Messages**: Write personalized encouragement
- **Real-time Updates**: Immediate sync across all users
- **Activity History**: View recent cheers and approvals

#### **Social Actions**
```typescript
// Cheer functionality
const handleSendApproval = async (emoji: string, message: string) => {
  await addApproval(habitId, {
    userId: user?.id || '',
    userName: user?.name || 'User',
    type: 'encouragement',
    emoji,
    message: message,
  });
};

// Peer approve functionality
const handlePeerApprove = async (memberId: string, memberName: string) => {
  await addApproval(habitId, {
    userId: currentUserId,
    userName: user?.name || 'User',
    type: 'support',
    emoji: '👍',
    message: `${user?.name} approves ${memberName}'s effort!`,
  });
};
```

### Data Management Best Practices

#### **Optimized Queries**
- Indexed queries for performance
- Proper pagination for large datasets
- Real-time listeners for live updates
- Offline support with Firestore caching

#### **Security Rules**
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habits are accessible by owner and shared users
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.uid in resource.data.sharedWith);
    }
    
    // Approvals are readable by habit participants
    match /habitApprovals/{approvalId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == request.data.userId;
    }
  }
}
```

## 🛠️ Development Tools

### Admin Panel (Development Only)
- **Seed Sample Data**: Populate Firestore with test data
- **Data Status Check**: Verify user data in Firestore
- **Refresh Data**: Reload data from Firestore
- **Clear Data**: Reset user data for testing

### Firestore Services
- `userService`: User CRUD operations
- `habitService`: Habit management with categories
- `approvalService`: Social approval system
- `familyService`: Family member management
- `friendService`: Friends network management
- `seedData`: Sample data creation

## 🎨 Design System

### Color Palette (Fresh Light-Green Theme)
```typescript
const COLORS = {
  /* Primary green palette */
  primary: {
    50: '#F6FB7A',     // Light yellow-green
    200: '#B4E380',    // Light green
    400: '#88D66C',    // Medium green (brand)
    600: '#73BBA3',    // Teal green
    800: '#5A9B7D',    // Dark teal
    900: '#4A8066',    // Deep green
  },

  /* Accent colours derived from the palette */
  accent: {
    primary: '#88D66C',      // Medium green – main accent / check-mark colour
    secondary: '#B4E380',    // Light green – subtle tint / card background
    tertiary: '#F6FB7A',     // Yellow-green – highlights
    quaternary: '#73BBA3',   // Teal – informational accents
  },

  /* Backgrounds */
  background: {
    primary: '#FFFFFF',     // White
    secondary: '#F8FDF8',   // Ultra-light green
    tertiary: '#F0F9F0',    // Light green sheet
    quaternary: '#E8F5E8',  // Slightly darker sheet
  },

  /* Text */
  text: {
    primary: '#1A2E1A',   // Almost-black green
    secondary: '#2D4A2D', // Dark green
    muted: '#4A6B4A',     // Grey-green for secondary text
    disabled: '#7A9A7A',  // Light grey-green
    inverse: '#FFFFFF',   // On dark surfaces
  },
};
```

### ✨ Glowing Shadows
The green brand glow is central to the UpTogether aesthetic.  Instead of hand-coding individual shadows, use the shared `SHADOWS` helpers exported from `src/styles/globalStyles.ts`.

- `SHADOWS.glowHabit` – default card shadow used for habit cards.
- `SHADOWS.glowCard`  – generic elevated card shadow.
- `SHADOWS.glowSelected` – strong glow used to highlight selections.

Applying the glow:

```tsx
import { SHADOWS } from '@/styles/globalStyles';

<View style={{ ...SHADOWS.glowHabit, borderRadius: 16 }} />
```

From v1.3 onwards **all cards/components must rely on these helpers** to guarantee design consistency.

### Component Library
- **Card**: Glass morphism effects with variants
- **Button**: Multiple styles and states
- **HabitCard**: Interactive habit display
- **ProgressCircle**: Animated SVG progress
- **Modal**: Consistent modal design
- **TabBar**: Custom tab navigation

## 🚀 Deployment

### Building for Production

1. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "UpTogether",
       "slug": "uptogether",
       "version": "1.0.0",
       "platforms": ["ios", "android"],
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png"
       }
     }
   }
   ```

2. **Build commands**
   ```bash
   # iOS build
   expo build:ios
   
   # Android build
   expo build:android
   
   # Web build
   expo build:web
   ```

## 🔧 Customization

### Adding New Habit Categories
```typescript
// Update types
type HabitCategory = 'personal' | 'family' | 'friends' | 'work';

// Add to navigation
<Tab.Screen name="Work" component={WorkHabitsScreen} />

// Create new screen following existing patterns
```

### Adding New Approval Types
```typescript
type ApprovalType = 'encouragement' | 'celebration' | 'support' | 'milestone';

// Update approval service and UI components
```

## 📊 Performance Optimizations

- **Lazy Loading**: Screens loaded on demand
- **Memoization**: React.memo for expensive components
- **Efficient Queries**: Firestore query optimization
- **Image Optimization**: Proper image sizing and caching
- **Bundle Splitting**: Code splitting for better load times

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

### Test Coverage
- Component unit tests
- Service integration tests
- Navigation flow tests
- Firebase integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Expo for development platform
- React Native community for excellent libraries
- Design inspiration from modern wellness apps

---

**UpTogether** - Building better habits together! 🌟 