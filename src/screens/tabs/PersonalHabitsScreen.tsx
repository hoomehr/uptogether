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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { globalStyles, COLORS, GRADIENTS, SHADOWS } from '../../styles/globalStyles';
import { RootStackParamList } from '../../types/navigation';
import { getPadding, getFontSize, getSpacing, verticalScale, screenData } from '../../utils/responsive';

type PersonalHabitsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const PersonalHabitsScreen: React.FC = () => {
  const navigation = useNavigation<PersonalHabitsScreenNavigationProp>();
  const { user } = useAuth();
  const { getHabitsByCategory, toggleHabit, addHabit, addApproval, refreshHabits } = useApp();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Sample personal habits
  const personalHabitSamples = [
    {
      name: 'Morning Meditation',
      description: '10 minutes of mindfulness to start the day',
      icon: '🧘‍♀️'
    },
    {
      name: 'Daily Exercise',
      description: '30 minutes of physical activity',
      icon: '💪'
    },
    {
      name: 'Read Daily',
      description: 'Read for at least 20 minutes each day',
      icon: '📚'
    },
    {
      name: 'Drink Water',
      description: 'Drink 8 glasses of water daily',
      icon: '💧'
    },
    {
      name: 'Gratitude Journal',
      description: 'Write down 3 things you\'re grateful for',
      icon: '📝'
    },
    {
      name: 'Sleep Early',
      description: 'Go to bed before 10 PM',
      icon: '😴'
    }
  ];

  const personalHabits = getHabitsByCategory('personal');
  const completedToday = personalHabits.filter(h => h.completedToday).length;

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
    return personalHabits.length > 0 ? Math.round((completedToday / personalHabits.length) * 100) : 0;
  };



  return (
    <View style={globalStyles.container}>
      {/* Sub-header for Personal */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Your Habits</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddHabit(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={globalStyles.statLabel}>Total</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{completedToday}</Text>
            <Text style={globalStyles.statLabel}>Completed</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{getProgressPercentage()}%</Text>
            <Text style={globalStyles.statLabel}>Progress</Text>
          </View>
        </View>

        {/* Habits List */}
        {personalHabits.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateIcon}>🎯</Text>
            <Text style={globalStyles.emptyStateTitle}>No personal habits yet</Text>
            <Text style={globalStyles.emptyStateText}>
              Create your first personal habit to get started!
            </Text>
            <TouchableOpacity style={globalStyles.button} onPress={() => setShowAddHabit(true)}>
              <Text style={globalStyles.buttonText}>Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {personalHabits.map((habit) => (
              <TouchableOpacity 
                key={habit.id} 
                style={[
                  globalStyles.habitCardGlow,
                  habit.completedToday && {
                    borderColor: COLORS.accent.secondary,
                    borderWidth: 2,
                    ...SHADOWS.glowSelected
                  }
                ]}
                onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
                activeOpacity={0.8}
              >
                <View style={styles.habitContent}>
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                  <View style={styles.habitInfo}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <Text style={styles.habitDescription}>{habit.description}</Text>
                    <Text style={styles.habitStreak}>🔥 {habit.streakCount} day streak</Text>
                    <Text style={styles.privateIndicator}>🔒 Private</Text>
                  </View>
                  {habit.completedToday ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✅ Done</Text>
                    </View>
                  ) : null}
                </View>

                {/* Show approvals if any */}
                {habit.approvals && habit.approvals.length > 0 && (
                  <View style={styles.approvalsContainer}>
                    <Text style={styles.approvalsTitle}>Recent encouragement:</Text>
                    {habit.approvals.slice(0, 2).map((approval) => (
                      <View key={approval.id} style={styles.approval}>
                        <Text style={styles.approvalEmoji}>{approval.emoji}</Text>
                        <Text style={styles.approvalText}>
                          {approval.userName}: {approval.message}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Action buttons */}
                <View style={styles.actionButtonsContainer}>
                  {!habit.completedToday && (
                    <TouchableOpacity 
                      style={styles.completeButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleSelfComplete(habit.id);
                      }}
                    >
                      <Text style={styles.completeButtonText}>Mark Complete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.encourageButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleSelfEncouragement(habit.id);
                    }}
                  >
                    <Text style={styles.encourageButtonText}>Self Encourage</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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

          <ScrollView style={globalStyles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Choose a Personal Habit</Text>
            
            {/* Sample Habit Cards */}
            <View style={styles.habitSamples}>
              {personalHabitSamples.map((sample, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    globalStyles.suggestionCard,
                    newHabitName === sample.name && globalStyles.suggestionCardPressed
                  ]}
                  onPress={() => {
                    setNewHabitName(sample.name);
                    setNewHabitDescription(sample.description);
                  }}
                >
                  <Text style={styles.sampleIcon}>{sample.icon}</Text>
                  <View style={styles.sampleContent}>
                    <Text style={styles.sampleName}>{sample.name}</Text>
                    <Text style={styles.sampleDescription}>{sample.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.orText}>— OR —</Text>

            <Text style={globalStyles.inputLabel}>Custom Habit Name</Text>
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
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = {
  subHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: getPadding(16),
    paddingVertical: getPadding(12),
    backgroundColor: COLORS.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: verticalScale(screenData.isSmallDevice ? 50 : 60),
  },
  subHeaderTitle: {
    fontSize: getFontSize(screenData.isSmallDevice ? 16 : 20),
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    flex: 1,
  },
  addButton: {
    paddingHorizontal: getPadding(screenData.isSmallDevice ? 8 : 12),
    paddingVertical: getPadding(6),
    borderRadius: getSpacing(6),
    backgroundColor: COLORS.accent.primary,
    minHeight: verticalScale(screenData.isSmallDevice ? 32 : 36),
    justifyContent: 'center' as const,
  },
  addButtonText: {
    fontSize: getFontSize(screenData.isSmallDevice ? 12 : 14),
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },

  // Habits list
  habitsList: {
    gap: 16,
  },

  // Habit styles
  habitCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.text.primary, // Dark text on light background
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
    backgroundColor: COLORS.background.quaternary,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: COLORS.accent.secondary,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  habitSamples: {
    gap: 12,
    marginBottom: 16,
  },
  sampleCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  sampleCardSelected: {
    borderColor: COLORS.accent.primary,
    backgroundColor: COLORS.accent.secondary,
  },
  sampleIcon: {
    fontSize: 24,
    marginRight: 12,
    textAlign: 'center' as const,
  },
  sampleContent: {
    flex: 1,
  },
  sampleName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  sampleDescription: {
    fontSize: 14,
    color: COLORS.text.muted,
    lineHeight: 18,
  },
  orText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    textAlign: 'center' as const,
    marginVertical: 16,
  },
};

export default PersonalHabitsScreen; 