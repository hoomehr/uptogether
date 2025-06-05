import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const PersonalHabitsScreen: React.FC = () => {
  const { user } = useAuth();
  const { getHabitsByCategory, toggleHabit, addHabit, addApproval } = useApp();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  const personalHabits = getHabitsByCategory('personal');
  const completedCount = personalHabits.filter(h => h.completedToday).length;

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;

    try {
      await addHabit({
        name: newHabitName.trim(),
        description: newHabitDescription.trim(),
        icon: '✨',
        color: '#8B5CF6',
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
    } catch (error) {
      Alert.alert('Error', 'Failed to add habit');
    }
  };

  const handleSelfEncouragement = async (habitId: string) => {
    try {
      await addApproval(habitId, {
        userId: user?.id || '',
        userName: user?.name || 'You',
        type: 'encouragement',
        emoji: '💪',
        message: 'Keep going!',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add encouragement');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Personal Habits</Text>
          <Text style={styles.subtitle}>
            Your private wellness journey
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <View style={styles.progressContent}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>
                {personalHabits.length > 0 ? 
                  Math.round((completedCount / personalHabits.length) * 100) : 0}%
              </Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressDetail}>
                {completedCount} of {personalHabits.length} completed
              </Text>
              <Text style={styles.progressMotivation}>
                Focus on yourself today! 🌟
              </Text>
            </View>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Habits</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddHabit(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {personalHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>Start Your Journey</Text>
              <Text style={styles.emptyText}>
                Add your first personal habit to begin building healthy routines
              </Text>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {personalHabits.map((habit) => (
                <View key={habit.id} style={styles.habitCard}>
                  <TouchableOpacity
                    style={styles.habitContent}
                    onPress={() => toggleHabit(habit.id)}
                  >
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                    <View style={styles.habitInfo}>
                      <Text style={styles.habitName}>{habit.name}</Text>
                      <Text style={styles.habitDescription}>{habit.description}</Text>
                      {habit.streakCount > 0 && (
                        <Text style={styles.habitStreak}>
                          🔥 {habit.streakCount} day streak
                        </Text>
                      )}
                    </View>
                    <View style={[
                      styles.checkbox,
                      habit.completedToday && styles.checkboxCompleted
                    ]}>
                      {habit.completedToday && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* Approvals */}
                  {habit.approvals && habit.approvals.length > 0 && (
                    <View style={styles.approvalsContainer}>
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

                  {/* Self-encouragement button */}
                  <TouchableOpacity
                    style={styles.encourageButton}
                    onPress={() => handleSelfEncouragement(habit.id)}
                  >
                    <Text style={styles.encourageButtonText}>
                      💪 Encourage Yourself
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Personal Growth Tips</Text>
          <Text style={styles.tipsText}>
            • Start small and be consistent{'\n'}
            • Celebrate your wins{'\n'}
            • Be patient with yourself{'\n'}
            • Track your progress
          </Text>
        </View>
      </ScrollView>

      {/* Add Habit Modal */}
      <Modal
        visible={showAddHabit}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddHabit(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Personal Habit</Text>
            <TouchableOpacity onPress={handleAddHabit}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Habit Name *</Text>
            <TextInput
              style={styles.modalInput}
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholder="e.g., Morning meditation"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              placeholder="Add more details about your habit..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalFooter}>
              <Text style={styles.modalNote}>
                Personal habits are private and only visible to you
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    borderWidth: 4,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  progressInfo: {
    flex: 1,
  },
  progressDetail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  progressMotivation: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  habitsList: {
    gap: 16,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  habitDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  habitStreak: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  approvalsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  approval: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  approvalEmoji: {
    marginRight: 8,
    fontSize: 16,
  },
  approvalText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  encourageButton: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  encourageButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: '#FEF3E2',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EA580C',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#EA580C',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    marginTop: 24,
  },
  modalNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PersonalHabitsScreen; 