import { Goal, Habit } from '../types';

export const MOCK_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Reduce Stress',
    description: 'Find calm and peace in daily life',
    icon: '🧘‍♀️',
    color: '#3b82f6'
  },
  {
    id: '2',
    title: 'Sleep Better',
    description: 'Improve sleep quality and routine',
    icon: '😴',
    color: '#10b981'
  },
  {
    id: '3',
    title: 'Build Focus',
    description: 'Enhance concentration and mindfulness',
    icon: '🎯',
    color: '#f59e0b'
  },
  {
    id: '4',
    title: 'Emotional Wellness',
    description: 'Process emotions and build resilience',
    icon: '💜',
    color: '#a855f7'
  },
  {
    id: '5',
    title: 'Physical Health',
    description: 'Move body and build healthy habits',
    icon: '🏃‍♂️',
    color: '#ef4444'
  },
  {
    id: '6',
    title: 'Social Connection',
    description: 'Strengthen relationships and community',
    icon: '🤝',
    color: '#06b6d4'
  }
];

export const MOCK_HABITS: Omit<Habit, 'id' | 'userId' | 'createdAt'>[] = [
  {
    name: 'Morning Meditation',
    description: 'Start the day with 10 minutes of mindfulness',
    icon: '🧘‍♀️',
    color: '#8B5CF6',
    streakCount: 0,
    completedToday: false,
    category: 'personal',
    isShared: false,
    visibility: 'private',
    approvals: [],
  },
  {
    name: 'Evening Gratitude',
    description: 'Write down 3 things I\'m grateful for',
    icon: '📝',
    color: '#F59E0B',
    streakCount: 0,
    completedToday: false,
    category: 'personal',
    isShared: false,
    visibility: 'private',
    approvals: [],
  },
  {
    name: 'Family Dinner',
    description: 'Eat together as a family without distractions',
    icon: '🍽️',
    color: '#10B981',
    streakCount: 0,
    completedToday: false,
    category: 'family',
    isShared: true,
    visibility: 'shared',
    approvals: [],
  },
  {
    name: 'Call a Friend',
    description: 'Connect with someone I care about',
    icon: '📞',
    color: '#EF4444',
    streakCount: 0,
    completedToday: false,
    category: 'friends',
    isShared: true,
    visibility: 'shared',
    approvals: [],
  },
  {
    name: 'Exercise Together',
    description: 'Family workout or outdoor activity',
    icon: '🏃‍♀️',
    color: '#06B6D4',
    streakCount: 0,
    completedToday: false,
    category: 'family',
    isShared: true,
    visibility: 'shared',
    approvals: [],
  },
  {
    name: 'Weekly Coffee Chat',
    description: 'Meet up with friends for quality time',
    icon: '☕',
    color: '#8B5CF6',
    streakCount: 0,
    completedToday: false,
    category: 'friends',
    isShared: true,
    visibility: 'shared',
    approvals: [],
  },
]; 