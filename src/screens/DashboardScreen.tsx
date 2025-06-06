import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { MOCK_HABITS } from '../utils/mockData';
import { Card, Button, HabitCard, ProgressCircle } from '../components/UI';
import { globalStyles, GRADIENTS, COLORS } from '../styles/globalStyles';
import { themeClasses, cn } from '../styles/theme';
import AdminPanel from '../components/AdminPanel';

const DashboardScreen: React.FC = () => {
  const { user, signOut, signUp, signIn } = useAuth();
  const { habits, loading, addHabit, toggleHabit, refreshHabits } = useApp();
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isGuest = user?.id.startsWith('guest_');

  useEffect(() => {
    if (habits.length === 0 && !loading) {
      MOCK_HABITS.forEach(habit => {
        addHabit(habit);
      });
    }
  }, [habits, loading, addHabit]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'signup') {
        await signUp(email, password, user?.name || 'User');
        Alert.alert('Success', 'Account created successfully! Your progress has been saved.');
      } else {
        await signIn(email, password);
        Alert.alert('Success', 'Signed in successfully!');
      }
      setShowUserManagement(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshHabits();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const completedHabits = habits.filter(habit => habit.completedToday).length;
  const completionPercentage = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (completionPercentage === 100) return "Perfect day! You're crushing it! 🌟";
    if (completionPercentage >= 75) return "You're doing amazing! Keep it up! 💪";
    if (completionPercentage >= 50) return "Great progress! You're halfway there! 🚀";
    if (completionPercentage >= 25) return "Good start! Every step counts! 👏";
    return "Ready to make today great? Let's start! ✨";
  };

  return (
    <View style={globalStyles.container}>
      {/* Modern Header with Cosmic Gradient Background */}
      <LinearGradient
        colors={GRADIENTS.primary as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={globalStyles.headerGradient}
      >
                  <SafeAreaView>
            <View style={globalStyles.header}>
              <View style={globalStyles.headerContent}>
                <Text style={globalStyles.greeting}>{getGreeting()},</Text>
                <Text style={globalStyles.name}>
                  {user?.name || 'User'}! {isGuest ? '👤' : '👋'}
                </Text>
              </View>
              <TouchableOpacity style={globalStyles.profileButton} onPress={handleSignOut}>
                <Text style={globalStyles.profileInitial}>
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={globalStyles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent.primary}
            colors={[COLORS.accent.primary]}
          />
        }
      >
        {/* Quick Stats */}
        <View style={globalStyles.statsContainer}>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{habits.length}</Text>
            <Text style={globalStyles.statLabel}>Total Habits</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{completedHabits}</Text>
            <Text style={globalStyles.statLabel}>Completed</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{Math.max(...habits.map(h => h.streakCount), 0)}</Text>
            <Text style={globalStyles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Guest User Management Card */}
        {isGuest && (
          <Card variant="default" style={globalStyles.guestCard}>
            <View style={globalStyles.guestCardHeader}>
              <Text style={globalStyles.guestCardIcon}>🔒</Text>
              <View style={globalStyles.guestCardContent}>
                <Text style={globalStyles.guestCardTitle}>Save Your Progress</Text>
                <Text style={globalStyles.guestCardText}>
                  Create an account to sync across devices
                </Text>
              </View>
            </View>
            <Button
              title="Create Account"
              onPress={() => setShowUserManagement(true)}
              variant="secondary"
              size="small"
            />
          </Card>
        )}

        {/* Progress Card */}
        <Card variant="elevated" style={globalStyles.progressCard}>
          <View style={globalStyles.progressHeader}>
            <Text style={globalStyles.progressTitle}>Today's Progress</Text>
            <Text style={globalStyles.progressPercentage}>{completionPercentage}%</Text>
          </View>
          
          <View style={globalStyles.progressContent}>
            <ProgressCircle
              percentage={completionPercentage}
              size={120}
              strokeWidth={8}
              animated={true}
            />
            <View style={globalStyles.progressInfo}>
              <Text style={globalStyles.progressMessage}>
                {getMotivationalMessage()}
              </Text>
              <Text style={globalStyles.progressDetails}>
                {completedHabits} of {habits.length} habits completed
              </Text>
            </View>
          </View>
        </Card>

        {/* Habits Section */}
        <View style={globalStyles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionTitle}>Your Habits</Text>
            <TouchableOpacity style={globalStyles.sectionAction}>
              <Text style={globalStyles.sectionActionText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {habits.length === 0 ? (
            <Card variant="glass" style={globalStyles.emptyState}>
              <Text style={globalStyles.emptyStateIcon}>🎯</Text>
              <Text style={globalStyles.emptyStateTitle}>No habits yet</Text>
              <Text style={globalStyles.emptyStateText}>
                Start building better habits today!
              </Text>
              <Button
                title="Add Your First Habit"
                onPress={() => console.log('Add habit')}
                variant="primary"
                size="small"
                style={globalStyles.emptyStateButton}
              />
            </Card>
          ) : (
            <View style={globalStyles.habitsList}>
              {habits.slice(0, 5).map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                />
              ))}
              {habits.length > 5 && (
                <TouchableOpacity style={globalStyles.showMoreButton}>
                  <Text style={globalStyles.showMoreText}>
                    View {habits.length - 5} more habits
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Weekly Summary */}
        <Card variant="gradient" gradientColors={GRADIENTS.card as any} style={globalStyles.weeklyCard}>
          <Text style={globalStyles.weeklyTitle}>🏆 This Week</Text>
          <Text style={globalStyles.weeklySubtitle}>
            You've completed 28 habits this week. Keep up the momentum!
          </Text>
          <View style={globalStyles.weeklyStats}>
            <View style={globalStyles.weeklyStat}>
              <Text style={globalStyles.weeklyStatValue}>4.2</Text>
              <Text style={globalStyles.weeklyStatLabel}>Avg/Day</Text>
            </View>
            <View style={globalStyles.weeklyStat}>
              <Text style={globalStyles.weeklyStatValue}>85%</Text>
              <Text style={globalStyles.weeklyStatLabel}>Success Rate</Text>
            </View>
          </View>
        </Card>

        {/* Development Admin Panel */}
        <AdminPanel />
      </ScrollView>

      {/* User Management Modal */}
      <Modal
        visible={showUserManagement}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <Button
              title="Cancel"
              onPress={() => setShowUserManagement(false)}
              variant="ghost"
            />
            <Text style={globalStyles.modalTitle}>
              {authMode === 'signup' ? 'Create Account' : 'Sign In'}
            </Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.modalSubtitle}>
              {authMode === 'signup' 
                ? 'Create an account to save your progress' 
                : 'Sign in to your existing account'}
            </Text>

            <View style={globalStyles.flex1}>
              <Text style={globalStyles.inputLabel}>Email</Text>
              <TextInput
                style={globalStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.text.disabled}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={globalStyles.inputLabel}>Password</Text>
              <TextInput
                style={globalStyles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.text.disabled}
                secureTextEntry
              />

              <View style={globalStyles.buttonContainer}>
                <Button
                  title={isLoading 
                    ? 'Loading...' 
                    : authMode === 'signup' 
                      ? 'Create Account' 
                      : 'Sign In'}
                  onPress={handleAuth}
                  disabled={!email || !password}
                  loading={isLoading}
                />
              </View>

              <View style={globalStyles.mt_md}>
                <Button
                  title={authMode === 'signup' 
                    ? 'Already have an account? Sign In' 
                    : 'Need an account? Sign Up'}
                  onPress={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                  variant="ghost"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default DashboardScreen; 