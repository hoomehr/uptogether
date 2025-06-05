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

// Family member interface
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  joinedAt: Date;
  isActive: boolean;
}

const FamilyHabitsScreen: React.FC = () => {
  const { user } = useAuth();
  const { getHabitsByCategory, toggleHabit, addHabit, addApproval, refreshHabits } = useApp();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPeerApprovalModal, setShowPeerApprovalModal] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [approvalMessage, setApprovalMessage] = useState('');
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelationship, setNewMemberRelationship] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Mock family members data - in real app this would come from API
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Mother',
      email: 'sarah@example.com',
      joinedAt: new Date('2024-01-15'),
      isActive: true,
    },
    {
      id: '2',
      name: 'Mike Johnson',
      relationship: 'Father',
      email: 'mike@example.com',
      joinedAt: new Date('2024-01-20'),
      isActive: true,
    },
    {
      id: '3',
      name: 'Emma Johnson',
      relationship: 'Sister',
      email: 'emma@example.com',
      joinedAt: new Date('2024-02-01'),
      isActive: false,
    },
  ]);

  const familyHabits = getHabitsByCategory('family');
  const completedCount = familyHabits.filter(h => h.completedToday).length;
  const activeMembersCount = familyMembers.filter(m => m.isActive).length;

  const encouragementOptions = [
    { emoji: '👏', message: 'Great job!' },
    { emoji: '💚', message: 'So proud of you!' },
    { emoji: '🌟', message: 'You\'re amazing!' },
    { emoji: '🔥', message: 'Keep the streak going!' },
    { emoji: '💪', message: 'You\'ve got this!' },
    { emoji: '🎉', message: 'Celebrating you!' },
  ];

  const relationshipOptions = [
    'Parent', 'Child', 'Sibling', 'Partner', 'Grandparent', 'Other'
  ];

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
        icon: '👨‍👩‍👧‍👦',
        color: COLORS.accent.primary,
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
      Alert.alert('Success', 'Family habit added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add family habit');
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberRelationship.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      relationship: newMemberRelationship,
      email: newMemberEmail.trim() || undefined,
      joinedAt: new Date(),
      isActive: true,
    };

    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName('');
    setNewMemberRelationship('');
    setNewMemberEmail('');
    setShowAddMember(false);
    Alert.alert('Success', `${newMember.name} has been added to your family!`);
  };

  const openPeerApprovalModal = (habitId: string) => {
    setSelectedHabitId(habitId);
    setShowPeerApprovalModal(true);
  };

  const handlePeerApprove = async (memberId: string, memberName: string) => {
    if (!selectedHabitId) return;

    try {
      // Check if current user already approved this member for this habit
      const habit = familyHabits.find(h => h.id === selectedHabitId);
      const currentUserId = user?.id || '';
      const existingApproval = habit?.approvals?.find(
        approval => approval.userId === currentUserId && approval.message?.includes(memberName)
      );

      if (existingApproval) {
        Alert.alert('Already Approved', `You have already approved ${memberName} for this activity.`);
        return;
      }

      await addApproval(selectedHabitId, {
        userId: currentUserId,
        userName: user?.name || 'Family Member',
        type: 'support',
        emoji: '👍',
        message: `${user?.name || 'Someone'} approves ${memberName}'s effort!`,
      });

      Alert.alert('👍 Approved!', `You've given approval to ${memberName} for this family activity!`);
      setShowPeerApprovalModal(false);
      setSelectedHabitId('');
    } catch (error) {
      Alert.alert('Error', 'Failed to peer approve activity');
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
      Alert.alert('Success', 'Encouragement sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send encouragement');
    }
  };

  const openApprovalModal = (habitId: string) => {
    setSelectedHabitId(habitId);
    setShowApprovalModal(true);
  };

  const getProgressPercentage = () => {
    return familyHabits.length > 0 ? Math.round((completedCount / familyHabits.length) * 100) : 0;
  };

  const getRelationshipEmoji = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'mother': case 'mom': return '👩';
      case 'father': case 'dad': return '👨';
      case 'parent': return '👪';
      case 'child': case 'son': case 'daughter': return '🧒';
      case 'sibling': case 'sister': case 'brother': return '👫';
      case 'partner': case 'spouse': return '💑';
      case 'grandparent': case 'grandmother': case 'grandfather': return '👴';
      default: return '👤';
    }
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
            <Text style={styles.title}>Family Habits</Text>
            <Text style={styles.subtitle}>Building healthy routines together</Text>
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
            <Text style={globalStyles.statNumber}>{familyHabits.length}</Text>
            <Text style={globalStyles.statLabel}>Family Habits</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{activeMembersCount}</Text>
            <Text style={globalStyles.statLabel}>Active Members</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{getProgressPercentage()}%</Text>
            <Text style={globalStyles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Habits Section */}
        <View style={globalStyles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionTitle}>Family Activities</Text>
            <TouchableOpacity
              style={globalStyles.sectionAction}
              onPress={() => setShowAddHabit(true)}
            >
              <Text style={globalStyles.sectionActionText}>+ Add Habit</Text>
            </TouchableOpacity>
          </View>

          {familyHabits.length === 0 ? (
            <View style={globalStyles.emptyState}>
              <Text style={globalStyles.emptyStateIcon}>🎯</Text>
              <Text style={globalStyles.emptyStateTitle}>Start Family Activities</Text>
              <Text style={globalStyles.emptyStateText}>
                Add your first family habit to build stronger connections together
              </Text>
            </View>
          ) : (
            <View style={globalStyles.habitsList}>
              {familyHabits.map((habit) => (
                <View key={habit.id} style={styles.habitCard}>
                  <View style={styles.habitContent}>
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
                    {habit.completedToday && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✅ Done!</Text>
                      </View>
                    )}
                  </View>

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

                  {/* Social Action Buttons */}
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={styles.cheerButton}
                      onPress={() => openApprovalModal(habit.id)}
                    >
                      <Text style={styles.cheerButtonText}>💚 Cheer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => openPeerApprovalModal(habit.id)}
                    >
                      <Text style={styles.approveButtonText}>👍 Peer Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Family Members Section */}
        <View style={globalStyles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionTitle}>Family Members</Text>
            <TouchableOpacity 
              style={globalStyles.sectionAction}
              onPress={() => setShowAddMember(true)}
            >
              <Text style={globalStyles.sectionActionText}>+ Add Member</Text>
            </TouchableOpacity>
          </View>

          {familyMembers.length === 0 ? (
            <View style={globalStyles.emptyState}>
              <Text style={globalStyles.emptyStateIcon}>👨‍👩‍👧‍👦</Text>
              <Text style={globalStyles.emptyStateTitle}>No family members yet</Text>
              <Text style={globalStyles.emptyStateText}>
                Add your family members to start building habits together
              </Text>
            </View>
          ) : (
            <View style={styles.membersList}>
              {familyMembers.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <Text style={styles.memberEmoji}>
                    {getRelationshipEmoji(member.relationship)}
                  </Text>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRelationship}>{member.relationship}</Text>
                    {member.email && (
                      <Text style={styles.memberEmail}>{member.email}</Text>
                    )}
                  </View>
                  <View style={[styles.statusIndicator, member.isActive && styles.statusActive]}>
                    <Text style={styles.statusText}>
                      {member.isActive ? 'Active' : 'Invited'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Family Member Modal */}
      <Modal
        visible={showAddMember}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddMember(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Add Family Member</Text>
            <TouchableOpacity onPress={handleAddMember}>
              <Text style={styles.saveText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.inputLabel}>Name *</Text>
            <TextInput
              style={globalStyles.input}
              value={newMemberName}
              onChangeText={setNewMemberName}
              placeholder="Enter family member's name"
              placeholderTextColor={COLORS.text.disabled}
            />

            <Text style={globalStyles.inputLabel}>Relationship *</Text>
            <View style={styles.relationshipButtons}>
              {relationshipOptions.map((relationship) => (
                <TouchableOpacity
                  key={relationship}
                  style={[
                    styles.relationshipButton,
                    newMemberRelationship === relationship && styles.relationshipButtonSelected
                  ]}
                  onPress={() => setNewMemberRelationship(relationship)}
                >
                  <Text style={[
                    styles.relationshipButtonText,
                    newMemberRelationship === relationship && styles.relationshipButtonTextSelected
                  ]}>
                    {relationship}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={globalStyles.inputLabel}>Email (Optional)</Text>
            <TextInput
              style={globalStyles.input}
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              placeholder="Enter email to send invitation"
              placeholderTextColor={COLORS.text.disabled}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.noteText}>
              💡 We'll send them an invitation to join your family habits if you provide an email.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

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
            <Text style={globalStyles.modalTitle}>Add Family Habit</Text>
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
              placeholder="e.g., Family dinner together"
              placeholderTextColor={COLORS.text.disabled}
            />

            <Text style={globalStyles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[globalStyles.input, styles.textArea]}
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              placeholder="Describe this family activity..."
              placeholderTextColor={COLORS.text.disabled}
              multiline
              numberOfLines={3}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Approval Modal */}
      <Modal
        visible={showApprovalModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowApprovalModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Send Encouragement</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={globalStyles.modalContent}>
            <Text style={styles.encouragementTitle}>Choose your message:</Text>
            
            <View style={styles.encouragementOptions}>
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

            <Text style={globalStyles.inputLabel}>Custom Message</Text>
            <TextInput
              style={globalStyles.input}
              value={approvalMessage}
              onChangeText={setApprovalMessage}
              placeholder="Write your own encouragement..."
              placeholderTextColor={COLORS.text.disabled}
              multiline
            />
            
            {approvalMessage.trim() && (
              <TouchableOpacity
                style={styles.sendCustomButton}
                onPress={() => handleSendApproval('💚', approvalMessage)}
              >
                <Text style={styles.sendCustomButtonText}>Send Custom Message</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Peer Approval Modal */}
      <Modal
        visible={showPeerApprovalModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPeerApprovalModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Give Approval</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={globalStyles.modalContent}>
            <Text style={styles.peerApprovalTitle}>Who are you approving for their activity?</Text>
            
            <View style={styles.familyMembersList}>
              {familyMembers.filter(member => member.isActive).map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.familyMemberOption}
                  onPress={() => handlePeerApprove(member.id, member.name)}
                >
                  <Text style={styles.memberOptionEmoji}>
                    {getRelationshipEmoji(member.relationship)}
                  </Text>
                  <View style={styles.memberOptionInfo}>
                    <Text style={styles.memberOptionName}>{member.name}</Text>
                    <Text style={styles.memberOptionRelation}>{member.relationship}</Text>
                  </View>
                  <Text style={styles.approveIcon}>👍</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.peerApprovalNote}>
              💡 Select the family member who completed this activity to mark it as approved.
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
  
  // Member styles
  membersList: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    ...globalStyles.cardElevated,
  },
  memberEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  memberRelationship: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 12,
    color: COLORS.text.disabled,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.background.tertiary,
  },
  statusActive: {
    backgroundColor: COLORS.accent.secondary,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: COLORS.text.muted,
  },

  // Habit styles
  habitCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...globalStyles.cardElevated,
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
  sharedIndicator: {
    fontSize: 12,
    color: COLORS.text.disabled,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.accent.primary,
    borderColor: COLORS.accent.primary,
  },
  checkmark: {
    color: COLORS.text.inverse,
    fontSize: 12,
    fontWeight: '600' as const,
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

  // Button styles
  actionButtonsContainer: {
    marginTop: 12,
    flexDirection: 'row' as const,
    gap: 8,
  },
  cheerButton: {
    flex: 1,
    backgroundColor: COLORS.accent.secondary,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center' as const,
  },
  cheerButtonText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: COLORS.accent.primary,
  },
  approveButton: {
    flex: 1,
    backgroundColor: COLORS.accent.primary,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center' as const,
  },
  approveButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
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
  relationshipButtons: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 16,
  },
  relationshipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  relationshipButtonSelected: {
    backgroundColor: COLORS.accent.primary,
    borderColor: COLORS.accent.primary,
  },
  relationshipButtonText: {
    fontSize: 14,
    color: COLORS.text.muted,
  },
  relationshipButtonTextSelected: {
    color: COLORS.text.inverse,
    fontWeight: '500' as const,
  },
  noteText: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    marginTop: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top' as const,
  },

  // Encouragement modal styles
  encouragementTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
    marginBottom: 20,
  },
  encouragementOptions: {
    gap: 12,
    marginBottom: 24,
  },
  encouragementOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  encouragementEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  encouragementMessage: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  sendCustomButton: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center' as const,
    marginTop: 12,
  },
  sendCustomButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },

  // Peer approval modal styles
  peerApprovalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  familyMembersList: {
    gap: 12,
    marginBottom: 24,
  },
  familyMemberOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  memberOptionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  memberOptionInfo: {
    flex: 1,
  },
  memberOptionName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  memberOptionRelation: {
    fontSize: 14,
    color: COLORS.text.muted,
  },
  approveIcon: {
    fontSize: 20,
  },
  peerApprovalNote: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
  },
};

export default FamilyHabitsScreen; 