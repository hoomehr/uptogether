import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { globalStyles, COLORS, GRADIENTS } from '../../styles/globalStyles';

const PersonalHabitsScreen: React.FC = () => {
  const { user } = useAuth();
  const { getHabitsByCategory, toggleHabit, addHabit, addApproval, refreshHabits } = useApp();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const personalHabits = getHabitsByCategory('personal');
  const completedCount = personalHabits.filter(h => h.completedToday).length;

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

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    try {
      await addHabit({
        name: newHabitName.trim(),
        description: newHabitDescription.trim(),
        icon: '✨',
        color: COLORS.accent.primary,
        streakCount: 0,
        completedToday: false,
        category: 'personal',
        isShared: false,
        visibility: 'private',
        approvals: [],
      });
      
      setNewHabitName('');
      setNewHabitDescription('');
      setShowAddHabit(false);
      Alert.alert('Success', 'Personal habit added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add habit');
    }
  };

  const handleSelfComplete = async (habitId: string) => {
    try {
      await toggleHabit(habitId);
      Alert.alert('🎉 Well done!', 'Personal habit completed! Keep up the great work!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete habit');
    }
  };

  const handleSelfEncouragement = async (habitId: string) => {
    try {
      await addApproval(habitId, {
        userId: user?.id || '',
        userName: user?.name || 'You',
        type: 'encouragement',
        emoji: '💪',
        message: 'Keep going strong!',
      });
      Alert.alert('💪 Motivated!', 'Self-encouragement added! You\'ve got this!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add encouragement');
    }
  };

  const getProgressPercentage = () => {
    return personalHabits.length > 0 ? Math.round((completedCount / personalHabits.length) * 100) : 0;
  };

  return (
    <View style={globalStyles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={GRADIENTS.primary as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={globalStyles.headerGradient}
      >
        <SafeAreaView>
          <View style={globalStyles.header}>
            <Text style={styles.title}>Personal Habits</Text>
            <Text style={styles.subtitle}>Your private wellness journey</Text>
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
            <Text style={globalStyles.statNumber}>{personalHabits.length}</Text>
            <Text style={globalStyles.statLabel}>Personal Habits</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{completedCount}</Text>
            <Text style={globalStyles.statLabel}>Completed Today</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{getProgressPercentage()}%</Text>
            <Text style={globalStyles.statLabel}>Progress</Text>
          </View>
        </View>

        {/* Habits Section */}
        <View style={globalStyles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionTitle}>Your Habits</Text>
            <TouchableOpacity
              style={globalStyles.sectionAction}
              onPress={() => setShowAddHabit(true)}
            >
              <Text style={globalStyles.sectionActionText}>+ Add Habit</Text>
            </TouchableOpacity>
          </View>

          {personalHabits.length === 0 ? (
            <View style={globalStyles.emptyState}>
              <Text style={globalStyles.emptyStateIcon}>🎯</Text>
              <Text style={globalStyles.emptyStateTitle}>Start Your Journey</Text>
              <Text style={globalStyles.emptyStateText}>
                Add your first personal habit to begin building healthy routines
              </Text>
            </View>
          ) : (
            <View style={globalStyles.habitsList}>
              {personalHabits.map((habit) => (
                <View key={habit.id} style={styles.habitCard}>
                  <View style={styles.habitContent}>
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                    <View style={styles.habitInfo}>
                      <Text style={styles.habitName}>{habit.name}</Text>
                      <Text style={styles.habitDescription}>{habit.description}</Text>
                      {habit.streakCount > 0 && (
                        <Text style={styles.habitStreak}>
                          🔥 {habit.streakCount} day personal streak
                        </Text>
                      )}
                      <Text style={styles.privateIndicator}>
                        🔒 Private habit
                      </Text>
                    </View>
                    {habit.completedToday && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✅ Done!</Text>
                      </View>
                    )}
                  </View>

                  {/* Approvals */}
                  {habit.approvals && habit.approvals.length > 0 && (
                    <View style={styles.approvalsContainer}>
                      <Text style={styles.approvalsTitle}>Self-Motivation:</Text>
                      {habit.approvals.slice(-3).map((approval, index) => (
                        <View key={index} style={styles.approval}>
                          <Text style={styles.approvalEmoji}>{approval.emoji}</Text>
                          <Text style={styles.approvalText}>
                            {approval.userName}: {approval.message}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Personal Action Buttons */}
                  <View style={styles.actionButtonsContainer}>
                    {!habit.completedToday ? (
                      <TouchableOpacity
                        style={styles.completeButton}
                        onPress={() => handleSelfComplete(habit.id)}
                      >
                        <Text style={styles.completeButtonText}>✅ Mark Complete</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.encourageButton}
                        onPress={() => handleSelfEncouragement(habit.id)}
                      >
                        <Text style={styles.encourageButtonText}>💪 Self-Motivate</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Habit Modal */}
      <Modal
        visible={showAddHabit}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddHabit(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Add Personal Habit</Text>
            <TouchableOpacity onPress={handleAddHabit}>
              <Text style={styles.saveText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.inputLabel}>Habit Name</Text>
            <TextInput
              style={globalStyles.input}
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholder="e.g., Morning meditation"
              placeholderTextColor={COLORS.text.disabled}
            />

            <Text style={globalStyles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[globalStyles.input, styles.textArea]}
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              placeholder="Describe your personal habit..."
              placeholderTextColor={COLORS.text.disabled}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.noteText}>
              💡 Personal habits are private and only visible to you.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.text.inverse,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Habit styles
  habitCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.primary[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  habitContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 4,
  },
  habitStreak: {
    fontSize: 12,
    color: COLORS.accent.primary,
    fontWeight: '500' as const,
  },
  privateIndicator: {
    fontSize: 12,
    color: COLORS.text.disabled,
    marginTop: 2,
  },

  // Completed badge styles
  completedBadge: {
    backgroundColor: COLORS.accent.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: COLORS.accent.primary,
  },

  // Approval styles
  approvalsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  approvalsTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
    marginBottom: 6,
  },
  approval: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  approvalEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  approvalText: {
    fontSize: 12,
    color: COLORS.text.muted,
    flex: 1,
  },

  // Button styles
  actionButtonsContainer: {
    marginTop: 12,
  },
  completeButton: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center' as const,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },
  encourageButton: {
    backgroundColor: COLORS.accent.secondary,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center' as const,
  },
  encourageButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.accent.primary,
  },

  // Modal styles
  cancelText: {
    fontSize: 16,
    color: COLORS.text.muted,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.accent.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top' as const,
  },
  noteText: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    marginTop: 16,
  },
};

export default PersonalHabitsScreen; 