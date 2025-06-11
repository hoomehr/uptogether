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
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { globalStyles, COLORS, GRADIENTS, SHADOWS } from '../../styles/globalStyles';
import { RootStackParamList, Friend, EncouragementOption } from '../../types';
import { getPadding, getFontSize, getSpacing, verticalScale, screenData } from '../../utils/responsive';
import Icon from '../../components/Icon';

type FriendsHabitsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const FriendsHabitsScreen: React.FC = () => {
  const navigation = useNavigation<FriendsHabitsScreenNavigationProp>();
  const { user } = useAuth();
  const { getHabitsByCategory, toggleHabit, addHabit, addApproval, refreshHabits } = useApp();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPeerApprovalModal, setShowPeerApprovalModal] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [approvalMessage, setApprovalMessage] = useState('');
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Sample friends habits
  const friendsHabitSamples = [
    {
      name: 'Workout Together',
      description: 'Exercise with friends for motivation',
      icon: '🏃‍♀️'
    },
    {
      name: 'Book Club',
      description: 'Read and discuss books together',
      icon: '📚'
    },
    {
      name: 'Cooking Challenge',
      description: 'Try new recipes and share photos',
      icon: '👨‍🍳'
    },
    {
      name: 'Study Group',
      description: 'Learn new skills together',
      icon: '🎓'
    },
    {
      name: 'Photo Challenge',
      description: 'Daily photo themes and sharing',
      icon: '📸'
    },
    {
      name: 'Accountability Check',
      description: 'Daily check-ins on personal goals',
      icon: '✅'
    }
  ];

  // Mock friends data - in real app this would come from API
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      userId: 'friend-user-1',
      name: 'Alex Chen',
      email: 'alex@example.com',
      username: '@alexc',
      addedAt: new Date('2024-01-10'),
      isActive: true,
    },
    {
      id: '2',
      userId: 'friend-user-2',
      name: 'Maria Rodriguez',
      email: 'maria@example.com',
      username: '@mrodriguez',
      addedAt: new Date('2024-01-25'),
      isActive: true,
    },
    {
      id: '3',
      userId: 'friend-user-3',
      name: 'David Kim',
      email: 'david@example.com',
      username: '@dkim',
      addedAt: new Date('2024-02-05'),
      isActive: false,
    },
    {
      id: '4',
      userId: 'friend-user-4',
      name: 'Sophie Wilson',
      email: 'sophie@example.com',
      username: '@sophiew',
      addedAt: new Date('2024-02-12'),
      isActive: true,
    },
  ]);

  const friendsHabits = getHabitsByCategory('friends');
  const completedCount = friendsHabits.filter(h => h.completedToday).length;
  const activeFriendsCount = friends.filter(f => f.isActive).length;

  const encouragementOptions = [
    { emoji: '🎉', message: 'Awesome work!' },
    { emoji: '💪', message: 'You\'re crushing it!' },
    { emoji: '⭐', message: 'Keep shining!' },
    { emoji: '🔥', message: 'On fire today!' },
    { emoji: '👏', message: 'Amazing progress!' },
    { emoji: '🚀', message: 'To the moon!' },
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
        icon: '👥',
        color: COLORS.accent.primary,
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
      Alert.alert('Success', 'Friends habit added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add friends habit');
    }
  };

  const handleAddFriend = () => {
    if (!newFriendName.trim()) {
      Alert.alert('Error', 'Please enter your friend\'s name');
      return;
    }

    if (!newFriendEmail.trim() && !newFriendUsername.trim()) {
      Alert.alert('Error', 'Please provide either an email or username');
      return;
    }

    const newFriend: Friend = {
      id: Date.now().toString(),
      userId: `friend-user-${Date.now()}`,
      name: newFriendName.trim(),
      email: newFriendEmail.trim() || undefined,
      username: newFriendUsername.trim() || undefined,
      addedAt: new Date(),
      isActive: true,
    };

    setFriends([...friends, newFriend]);
    setNewFriendName('');
    setNewFriendEmail('');
    setNewFriendUsername('');
    setShowAddFriend(false);
    Alert.alert('Success', `${newFriend.name} has been added to your friends!`);
  };

  const openPeerApprovalModal = (habitId: string) => {
    setSelectedHabitId(habitId);
    setShowPeerApprovalModal(true);
  };

  const handlePeerApprove = async (friendId: string, friendName: string) => {
    if (!selectedHabitId) return;

    try {
      // Check if current user already approved this friend for this habit
      const habit = friendsHabits.find(h => h.id === selectedHabitId);
      const currentUserId = user?.id || '';
      const existingApproval = habit?.approvals?.find(
        approval => approval.userId === currentUserId && approval.message?.includes(friendName)
      );

      if (existingApproval) {
        Alert.alert('Already Approved', `You have already approved ${friendName} for this goal.`);
        return;
      }

      await addApproval(selectedHabitId, {
        userId: currentUserId,
        userName: user?.name || 'Friend',
        type: 'support',
        emoji: '👍',
        message: `${user?.name || 'Someone'} approves ${friendName}'s effort!`,
      });

      Alert.alert('✅ Approved!', `You've given approval to ${friendName} for this friend goal!`);
      setShowPeerApprovalModal(false);
      setSelectedHabitId('');
    } catch (error) {
      Alert.alert('Error', 'Failed to peer approve goal');
    }
  };

  const handleSendApproval = async (emoji: string, message: string) => {
    if (!selectedHabitId) return;

    try {
      await addApproval(selectedHabitId, {
        userId: user?.id || '',
        userName: user?.name || 'Friend',
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
    return friendsHabits.length > 0 ? Math.round((completedCount / friendsHabits.length) * 100) : 0;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <View style={globalStyles.container}>
      {/* Sub-header for Friends */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Friends Habits</Text>
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
            <Text style={globalStyles.statNumber}>{friendsHabits.length}</Text>
            <Text style={globalStyles.statLabel}>Total</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{activeFriendsCount}</Text>
            <Text style={globalStyles.statLabel}>Active Friends</Text>
          </View>
          <View style={globalStyles.statCard}>
            <Text style={globalStyles.statNumber}>{getProgressPercentage()}%</Text>
            <Text style={globalStyles.statLabel}>Progress</Text>
          </View>
        </View>

        {/* Habits Section */}
        <View style={globalStyles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionTitle}>Friend Activities</Text>
          </View>

          {friendsHabits.length === 0 ? (
            <View style={globalStyles.emptyState}>
              <Text style={globalStyles.emptyStateIcon}>🎯</Text>
              <Text style={globalStyles.emptyStateTitle}>No friend habits yet</Text>
              <Text style={globalStyles.emptyStateText}>
                Add your first friend habit to motivate each other
              </Text>
              <TouchableOpacity style={globalStyles.button} onPress={() => setShowAddHabit(true)}>
                <Text style={globalStyles.buttonText}>Add Your First Friend Habit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {friendsHabits.map((habit) => (
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
                      <Text style={styles.friendsIndicator}>🤝 Shared with friends</Text>
                    </View>
                    {habit.completedToday ? (
                      <View style={[styles.completedBadge, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Icon name="check" size={14} color={COLORS.text.inverse} />
                        <Text style={[styles.completedText, { marginLeft: 4 }]}>Done</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Show approvals if any */}
                  {habit.approvals && habit.approvals.length > 0 && (
                    <View style={styles.approvalsContainer}>
                      <Text style={styles.approvalsTitle}>Friend Support:</Text>
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
                    <TouchableOpacity 
                      style={styles.cheerButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        openApprovalModal(habit.id);
                      }}
                    >
                      <Text style={styles.cheerButtonText}>Cheer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.approveButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        openPeerApprovalModal(habit.id);
                      }}
                    >
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Friends Section */}
        <View style={globalStyles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.sectionTitle}>My Friends</Text>
            <TouchableOpacity 
              style={globalStyles.sectionAction}
              onPress={() => setShowAddFriend(true)}
            >
              <Text style={globalStyles.sectionActionText}>+ Add Friend</Text>
            </TouchableOpacity>
          </View>

          {friends.length === 0 ? (
            <View style={globalStyles.emptyState}>
              <Text style={globalStyles.emptyStateIcon}>👥</Text>
              <Text style={globalStyles.emptyStateTitle}>No friends yet</Text>
              <Text style={globalStyles.emptyStateText}>
                Add your friends to start building habits together
              </Text>
            </View>
          ) : (
            <View style={styles.friendsList}>
              {friends.map((friend) => (
                <View key={friend.id} style={globalStyles.friendCard}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {getInitials(friend.name)}
                    </Text>
                  </View>
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    {friend.username && (
                      <Text style={styles.friendUsername}>{friend.username}</Text>
                    )}
                    {friend.email && (
                      <Text style={styles.friendEmail}>{friend.email}</Text>
                    )}
                  </View>
                  <View style={[styles.statusIndicator, friend.isActive && styles.statusActive]}>
                    <Text style={styles.statusText}>
                      {friend.isActive ? 'Active' : 'Invited'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Friend Modal */}
      <Modal
        visible={showAddFriend}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddFriend(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Add Friend</Text>
            <TouchableOpacity onPress={handleAddFriend}>
              <Text style={styles.saveText}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={globalStyles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={globalStyles.inputLabel}>Name *</Text>
            <TextInput
              style={globalStyles.input}
              value={newFriendName}
              onChangeText={setNewFriendName}
              placeholder="Enter your friend's name"
              placeholderTextColor={COLORS.text.disabled}
            />

            <Text style={globalStyles.inputLabel}>Email</Text>
            <TextInput
              style={globalStyles.input}
              value={newFriendEmail}
              onChangeText={setNewFriendEmail}
              placeholder="Enter email address"
              placeholderTextColor={COLORS.text.disabled}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={globalStyles.inputLabel}>Username</Text>
            <TextInput
              style={globalStyles.input}
              value={newFriendUsername}
              onChangeText={setNewFriendUsername}
              placeholder="@username (optional)"
              placeholderTextColor={COLORS.text.disabled}
              autoCapitalize="none"
            />

            <Text style={styles.noteText}>
              💡 Provide either an email or username to send them an invitation.
            </Text>
          </ScrollView>
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
            <Text style={globalStyles.modalTitle}>Add Friend Habit</Text>
            <TouchableOpacity onPress={handleAddHabit}>
              <Text style={styles.saveText}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={globalStyles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Choose a Friend Habit</Text>
            
            {/* Sample Habit Cards */}
            <View style={styles.habitSamples}>
              {friendsHabitSamples.map((sample, index) => (
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
              placeholder="e.g., Daily workout challenge"
              placeholderTextColor={COLORS.text.disabled}
            />

            <Text style={globalStyles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[globalStyles.input, styles.textArea]}
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              placeholder="Describe this friend activity..."
              placeholderTextColor={COLORS.text.disabled}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.noteText}>
              🤝 Friend habits are shared with your friends for motivation.
            </Text>
          </ScrollView>
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
            <Text style={globalStyles.modalTitle}>Cheer On Your Friend</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={globalStyles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.encouragementTitle}>Send some motivation:</Text>
            
            <View style={styles.encouragementOptions}>
              {encouragementOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={globalStyles.suggestionCard}
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
              placeholder="Write your own motivational message..."
              placeholderTextColor={COLORS.text.disabled}
              multiline
            />
            
            {approvalMessage.trim() && (
              <TouchableOpacity
                style={styles.sendCustomButton}
                onPress={() => handleSendApproval('🎉', approvalMessage)}
              >
                <Text style={styles.sendCustomButtonText}>Send Custom Message</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
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

          <ScrollView style={globalStyles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.peerApprovalTitle}>Who are you approving for their goal?</Text>
            
            <View style={styles.friendsList}>
              {friends.filter(friend => friend.isActive).map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={styles.friendOption}
                  onPress={() => handlePeerApprove(friend.id, friend.name)}
                >
                  <View style={styles.friendOptionAvatar}>
                    <Text style={styles.friendOptionInitials}>
                      {getInitials(friend.name)}
                    </Text>
                  </View>
                  <View style={styles.friendOptionInfo}>
                    <Text style={styles.friendOptionName}>{friend.name}</Text>
                    {friend.username && (
                      <Text style={styles.friendOptionUsername}>{friend.username}</Text>
                    )}
                  </View>
                  <Text style={styles.approveIcon}>👍</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.peerApprovalNote}>
              💡 Select the friend who completed this goal to mark it as approved.
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
  
  // Friend styles
  friendsList: {
    gap: 12,
  },
  friendCard: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent.secondary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  friendUsername: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
  friendEmail: {
    fontSize: 12,
    color: COLORS.text.disabled,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.background.quaternary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusActive: {
    backgroundColor: COLORS.accent.secondary,
    borderColor: COLORS.accent.primary,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: COLORS.text.muted,
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
  friendsIndicator: {
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
    color: COLORS.text.primary,
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
    flexDirection: 'row' as const,
    gap: 8,
  },
  cheerButton: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: 'center' as const,
  },
  cheerButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },
  approveButton: {
    backgroundColor: COLORS.background.quaternary,
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: COLORS.accent.secondary,
  },
  approveButtonText: {
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

  // Encouragement options
  encouragementOptions: {
    marginBottom: 20,
  },
  encouragementOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  encouragementEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  encouragementMessage: {
    fontSize: 14,
    color: COLORS.text.primary,
    flex: 1,
  },
  encouragementTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  sendCustomButton: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center' as const,
    marginTop: 12,
  },
  sendCustomButtonText: {
    fontSize: 14,
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
  friendOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  friendOptionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  friendOptionInitials: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },
  friendOptionInfo: {
    flex: 1,
  },
  friendOptionName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  friendOptionUsername: {
    fontSize: 14,
    color: COLORS.accent.primary,
  },
  approveIcon: {
    fontSize: 20,
  },
  peerApprovalNote: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    marginTop: 20,
  },

  // Sample habit cards
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

export default FriendsHabitsScreen; 