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
    description: '10 minutes of mindful breathing',
    icon: '🧘‍♀️',
    color: '#3b82f6',
    streakCount: 0,
    completedToday: false
  },
  {
    name: 'Gratitude Journal',
    description: 'Write 3 things you\'re grateful for',
    icon: '📝',
    color: '#10b981',
    streakCount: 0,
    completedToday: false
  },
  {
    name: 'Evening Walk',
    description: '15 minute walk outside',
    icon: '🚶‍♀️',
    color: '#f59e0b',
    streakCount: 0,
    completedToday: false
  },
  {
    name: 'Digital Detox',
    description: '1 hour away from screens',
    icon: '📱',
    color: '#a855f7',
    streakCount: 0,
    completedToday: false
  }
]; 