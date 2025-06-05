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

const FriendsHabitsScreen: React.FC = () => {
  const { user } = useAuth();
  const { getHabitsByCategory, toggleHabit, addHabit, addApproval } = useApp();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [approvalMessage, setApprovalMessage] = useState('');
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  const friendsHabits = getHabitsByCategory('friends');
  const completedCount = friendsHabits.filter(h => h.completedToday).length;

  const supportOptions = [
    { emoji: '🙌', message: 'You inspire me!' },
    { emoji: '💙', message: 'Thinking of you!' },
    { emoji: '✨', message: 'You\'re doing great!' },
    { emoji: '🎯', message: 'Stay focused!' },
    { emoji: '🌈', message: 'Brighter days ahead!' },
    { emoji: '🤝', message: 'We\'re in this together!' },
  ];

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;

    try {
      await addHabit({
        name: newHabitName.trim(),
        description: newHabitDescription.trim(),
        icon: '👥',
        color: '#F59E0B',
        streakCount: 0,
        completedToday: false,
        category: 'friends',
        isShared: true,
        visibility: 'shared',
        approvals: [],
      });
      
      setNewHabitName('');
      setNewHabitDescription('');
      setShowAddHabit(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add social habit');
    }
  };

  const handleSendSupport = async (emoji: string, message: string) => {
    if (!selectedHabitId) return;

    try {
      await addApproval(selectedHabitId, {
        userId: user?.id || '',
        userName: user?.name || 'Friend',
        type: 'support',
        emoji,
        message: approvalMessage.trim() || message,
      });
      
      setShowApprovalModal(false);
      setApprovalMessage('');
      setSelectedHabitId('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send support');
    }
  };

  const openSupportModal = (habitId: string) => {
    setSelectedHabitId(habitId);
    setShowApprovalModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Friends Support</Text>
          <Text style={styles.subtitle}>
            Growing together with your circle
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Social Connection Today</Text>
          <View style={styles.progressContent}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>
                {friendsHabits.length > 0 ? 
                  Math.round((completedCount / friendsHabits.length) * 100) : 0}%
              </Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressDetail}>
                {completedCount} of {friendsHabits.length} completed
              </Text>
              <Text style={styles.progressMotivation}>
                Your circle believes in you! 👥
              </Text>
            </View>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Social Habits</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddHabit(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {friendsHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>Connect with Friends</Text>
              <Text style={styles.emptyText}>
                Add habits to share your wellness journey with friends and get support
              </Text>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {friendsHabits.map((habit) => (
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
                      <Text style={styles.sharedIndicator}>
                        🌐 Shared with friends
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
                      <Text style={styles.approvalsTitle}>Friend Support:</Text>
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
                      style={styles.supportButton}
                      onPress={() => openSupportModal(habit.id)}
                    >
                      <Text style={styles.supportButtonText}>
                        🤝 Send Support
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Community Features */}
        <View style={styles.communityCard}>
          <Text style={styles.communityTitle}>🌟 Friend Circle Benefits</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefit}>💬 Share your wellness journey</Text>
            <Text style={styles.benefit}>🎉 Celebrate wins together</Text>
            <Text style={styles.benefit}>💪 Get motivated by peers</Text>
            <Text style={styles.benefit}>🤗 Offer and receive support</Text>
          </View>
        </View>

        {/* Social Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Social Wellness Tips</Text>
          <Text style={styles.tipsText}>
            • Be authentic in your sharing{'\n'}
            • Celebrate others' achievements{'\n'}
            • Ask for help when you need it{'\n'}
            • Create accountability partnerships{'\n'}
            • Check in on friends regularly
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
            <Text style={styles.modalTitle}>Add Social Habit</Text>
            <TouchableOpacity onPress={handleAddHabit}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Social Habit Name *</Text>
            <TextInput
              style={styles.modalInput}
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholder="e.g., Weekly coffee with friends"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              placeholder="Describe your social habit..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalFooter}>
              <Text style={styles.modalNote}>
                Social habits are shared with your friend circle for support and encouragement
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Support Modal */}
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
            <Text style={styles.modalTitle}>Send Support</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Choose your support message:</Text>
            
            <View style={styles.supportGrid}>
              {supportOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.supportOption}
                  onPress={() => handleSendSupport(option.emoji, option.message)}
                >
                  <Text style={styles.supportEmoji}>{option.emoji}</Text>
                  <Text style={styles.supportMessage}>{option.message}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Or write a personal message:</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              value={approvalMessage}
              onChangeText={setApprovalMessage}
              placeholder="Write your own supportive message..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />

            {approvalMessage.trim() && (
              <TouchableOpacity
                style={styles.sendCustomButton}
                onPress={() => handleSendSupport('💝', approvalMessage.trim())}
              >
                <Text style={styles.sendCustomButtonText}>
                  💝 Send Personal Message
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
    backgroundColor: '#FEF3C7',
    borderWidth: 4,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
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
    backgroundColor: '#F59E0B',
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
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
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
  supportButton: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
  communityCard: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefit: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#92400E',
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
    color: '#F59E0B',
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
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  supportOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '47%',
  },
  supportEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  supportMessage: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  sendCustomButton: {
    backgroundColor: '#F59E0B',
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

export default FriendsHabitsScreen; 