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

const FamilyHabitsScreen: React.FC = () => {
  const { user } = useAuth();
  const { getHabitsByCategory, toggleHabit, addHabit, addApproval } = useApp();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [approvalMessage, setApprovalMessage] = useState('');
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  const familyHabits = getHabitsByCategory('family');
  const completedCount = familyHabits.filter(h => h.completedToday).length;

  const encouragementOptions = [
    { emoji: '👏', message: 'Great job!' },
    { emoji: '💚', message: 'So proud of you!' },
    { emoji: '🌟', message: 'You\'re amazing!' },
    { emoji: '🔥', message: 'Keep the streak going!' },
    { emoji: '💪', message: 'You\'ve got this!' },
    { emoji: '🎉', message: 'Celebrating you!' },
  ];

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;

    try {
      await addHabit({
        name: newHabitName.trim(),
        description: newHabitDescription.trim(),
        icon: '👨‍👩‍👧‍👦',
        color: '#10B981',
        streakCount: 0,
        completedToday: false,
        category: 'family',
        isShared: true,
        visibility: 'shared',
        approvals: [],
      });
      
      setNewHabitName('');
      setNewHabitDescription('');
      setShowAddHabit(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add family habit');
    }
  };

  const handleSendApproval = async (emoji: string, message: string) => {
    if (!selectedHabitId) return;

    try {
      await addApproval(selectedHabitId, {
        userId: user?.id || '',
        userName: user?.name || 'Family Member',
        type: 'encouragement',
        emoji,
        message: approvalMessage.trim() || message,
      });
      
      setShowApprovalModal(false);
      setApprovalMessage('');
      setSelectedHabitId('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send encouragement');
    }
  };

  const openApprovalModal = (habitId: string) => {
    setSelectedHabitId(habitId);
    setShowApprovalModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Family Habits</Text>
          <Text style={styles.subtitle}>
            Building healthy routines together
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Family Progress Today</Text>
          <View style={styles.progressContent}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>
                {familyHabits.length > 0 ? 
                  Math.round((completedCount / familyHabits.length) * 100) : 0}%
              </Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressDetail}>
                {completedCount} of {familyHabits.length} completed
              </Text>
              <Text style={styles.progressMotivation}>
                Stronger together! 👨‍👩‍👧‍👦
              </Text>
            </View>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family Activities</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddHabit(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {familyHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👨‍👩‍👧‍👦</Text>
              <Text style={styles.emptyTitle}>Start Family Activities</Text>
              <Text style={styles.emptyText}>
                Add your first family habit to build stronger connections together
              </Text>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {familyHabits.map((habit) => (
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
                          🔥 {habit.streakCount} day family streak
                        </Text>
                      )}
                      <Text style={styles.sharedIndicator}>
                        🔗 Shared with family
                      </Text>
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
                      <Text style={styles.approvalsTitle}>Family Support:</Text>
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

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.encourageButton}
                      onPress={() => openApprovalModal(habit.id)}
                    >
                      <Text style={styles.encourageButtonText}>
                        💚 Send Love
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Family Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>👨‍👩‍👧‍👦 Family Wellness Tips</Text>
          <Text style={styles.tipsText}>
            • Schedule activities everyone can enjoy{'\n'}
            • Celebrate together, grow together{'\n'}
            • Make it fun, not a chore{'\n'}
            • Lead by example{'\n'}
            • Include everyone in planning
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
            <Text style={styles.modalTitle}>Add Family Habit</Text>
            <TouchableOpacity onPress={handleAddHabit}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Family Activity Name *</Text>
            <TextInput
              style={styles.modalInput}
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholder="e.g., Family dinner together"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              placeholder="Describe your family activity..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalFooter}>
              <Text style={styles.modalNote}>
                Family habits are shared and visible to all family members
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Approval Modal */}
      <Modal
        visible={showApprovalModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowApprovalModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Send Encouragement</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Choose your message:</Text>
            
            <View style={styles.encouragementGrid}>
              {encouragementOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.encouragementOption}
                  onPress={() => handleSendApproval(option.emoji, option.message)}
                >
                  <Text style={styles.encouragementEmoji}>{option.emoji}</Text>
                  <Text style={styles.encouragementMessage}>{option.message}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Or write a custom message:</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              value={approvalMessage}
              onChangeText={setApprovalMessage}
              placeholder="Write your own encouraging message..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />

            {approvalMessage.trim() && (
              <TouchableOpacity
                style={styles.sendCustomButton}
                onPress={() => handleSendApproval('💌', approvalMessage.trim())}
              >
                <Text style={styles.sendCustomButtonText}>
                  💌 Send Custom Message
                </Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#ECFDF5',
    borderWidth: 4,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
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
    backgroundColor: '#10B981',
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
    marginBottom: 4,
  },
  sharedIndicator: {
    fontSize: 12,
    color: '#10B981',
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
    backgroundColor: '#10B981',
    borderColor: '#10B981',
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
  approvalsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
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
  actionButtons: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  encourageButton: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  encourageButtonText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: '#ECFDF5',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#065F46',
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
    color: '#10B981',
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
  encouragementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  encouragementOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '47%',
  },
  encouragementEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  encouragementMessage: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  sendCustomButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  sendCustomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FamilyHabitsScreen; 