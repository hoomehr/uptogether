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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { globalStyles, COLORS, GRADIENTS } from '../styles/globalStyles';
import { RootStackParamList } from '../types/navigation';

type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;
type HabitDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HabitDetail'>;

const HabitDetailScreen: React.FC = () => {
  const navigation = useNavigation<HabitDetailScreenNavigationProp>();
  const route = useRoute<HabitDetailScreenRouteProp>();
  const { habitId } = route.params;
  
  const { user } = useAuth();
  const { getHabitById, toggleHabit, addApproval } = useApp();
  const [showEncouragementModal, setShowEncouragementModal] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');

  const habit = getHabitById(habitId);

  if (!habit) {
    return (
      <View style={globalStyles.container}>
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <View style={globalStyles.emptyState}>
          <Text style={globalStyles.emptyStateIcon}>❓</Text>
          <Text style={globalStyles.emptyStateTitle}>Habit Not Found</Text>
          <Text style={globalStyles.emptyStateText}>
            This habit may have been deleted or doesn't exist.
          </Text>
        </View>
      </View>
    );
  }

  const handleToggleHabit = async () => {
    try {
      await toggleHabit(habitId);
      Alert.alert('Success', 
        habit.completedToday 
          ? 'Habit marked as incomplete' 
          : 'Great job! Habit completed for today!'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleSendEncouragement = async () => {
    if (!encouragementMessage.trim()) {
      Alert.alert('Error', 'Please enter an encouragement message');
      return;
    }

    try {
      await addApproval(habitId, {
        userId: user?.id || '',
        userName: user?.name || 'Someone',
        type: 'encouragement',
        emoji: '💪',
        message: encouragementMessage.trim(),
      });
      
      setEncouragementMessage('');
      setShowEncouragementModal(false);
      Alert.alert('Sent!', 'Your encouragement has been sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send encouragement');
    }
  };

  const getCategoryColor = () => {
    switch (habit.category) {
      case 'personal': return COLORS.accent.primary;
      case 'family': return COLORS.primary[500];
      case 'friends': return COLORS.accent.secondary;
      default: return COLORS.accent.primary;
    }
  };

  const getCategoryIcon = () => {
    switch (habit.category) {
      case 'personal': return '🔒';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'friends': return '👥';
      default: return '✨';
    }
  };

  const getStreakEmoji = () => {
    if (habit.streakCount >= 30) return '🏆';
    if (habit.streakCount >= 14) return '⭐';
    if (habit.streakCount >= 7) return '🔥';
    return '💪';
  };

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <LinearGradient
        colors={GRADIENTS.primary as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={globalStyles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Habit Details</Text>
            <View style={{ width: 60 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
        {/* Habit Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: getCategoryColor() }]}>
              <Text style={styles.habitIconLarge}>{habit.icon}</Text>
            </View>
            <View style={styles.habitMainInfo}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitDescription}>{habit.description}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryIcon}>{getCategoryIcon()}</Text>
                <Text style={styles.categoryText}>{habit.category} habit</Text>
              </View>
            </View>
          </View>

          {/* Status */}
          <View style={styles.statusSection}>
            <View style={[styles.statusBadge, habit.completedToday && styles.statusBadgeCompleted]}>
              <Text style={[styles.statusText, habit.completedToday && styles.statusTextCompleted]}>
                {habit.completedToday ? '✅ Completed Today' : '⏳ Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Progress Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>{getStreakEmoji()}</Text>
              <Text style={styles.statNumber}>{habit.streakCount}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👏</Text>
              <Text style={styles.statNumber}>{habit.approvals?.length || 0}</Text>
              <Text style={styles.statLabel}>Approvals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>📅</Text>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Days This Week</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        {habit.approvals && habit.approvals.length > 0 && (
          <View style={styles.activityCard}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.approvalsList}>
              {habit.approvals.slice(-5).reverse().map((approval, index) => (
                <View key={index} style={styles.approvalItem}>
                  <Text style={styles.approvalEmoji}>{approval.emoji}</Text>
                  <View style={styles.approvalContent}>
                    <Text style={styles.approvalUser}>{approval.userName}</Text>
                    <Text style={styles.approvalMessage}>{approval.message}</Text>
                  </View>
                  <Text style={styles.approvalType}>{approval.type}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          {habit.category === 'personal' ? (
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={[styles.actionButton, habit.completedToday && styles.actionButtonSecondary]}
                onPress={handleToggleHabit}
              >
                <Text style={styles.actionButtonText}>
                  {habit.completedToday ? '↩️ Mark Incomplete' : '✅ Mark Complete'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => setShowEncouragementModal(true)}
              >
                <Text style={styles.actionButtonText}>💪 Self-Motivate</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => setShowEncouragementModal(true)}
              >
                <Text style={styles.actionButtonText}>💚 Send Encouragement</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => Alert.alert('Peer Approval', 'Navigate back to approve someone specific')}
              >
                <Text style={styles.actionButtonText}>👍 Peer Approve</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Encouragement Modal */}
      <Modal
        visible={showEncouragementModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEncouragementModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>
              {habit.category === 'personal' ? 'Self-Motivate' : 'Send Encouragement'}
            </Text>
            <TouchableOpacity onPress={handleSendEncouragement}>
              <Text style={styles.saveText}>Send</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.inputLabel}>Your Message</Text>
            <TextInput
              style={[globalStyles.input, styles.messageInput]}
              value={encouragementMessage}
              onChangeText={setEncouragementMessage}
              placeholder={
                habit.category === 'personal' 
                  ? "Great job on staying committed!" 
                  : "You're doing amazing, keep it up!"
              }
              placeholderTextColor={COLORS.text.disabled}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.tipText}>
              💡 {habit.category === 'personal' 
                ? 'Motivate yourself with positive affirmations'
                : 'Send positive energy to support this habit!'}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.text.inverse,
    fontWeight: '500' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },

  // Overview Card
  overviewCard: {
    ...globalStyles.cardElevated,
    marginBottom: 16,
  },
  habitHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  habitIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  habitIconLarge: {
    fontSize: 28,
  },
  habitMainInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: COLORS.text.secondary,
    textTransform: 'capitalize' as const,
  },

  // Status Section
  statusSection: {
    alignItems: 'center' as const,
  },
  statusBadge: {
    backgroundColor: COLORS.background.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusBadgeCompleted: {
    backgroundColor: COLORS.accent.secondary,
    borderColor: COLORS.accent.primary,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text.muted,
  },
  statusTextCompleted: {
    color: COLORS.accent.primary,
  },

  // Stats Card
  statsCard: {
    ...globalStyles.cardElevated,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  statItem: {
    alignItems: 'center' as const,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.muted,
    textAlign: 'center' as const,
  },

  // Activity Card
  activityCard: {
    ...globalStyles.cardElevated,
    marginBottom: 16,
  },
  approvalsList: {
    gap: 12,
  },
  approvalItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.background.tertiary,
    padding: 12,
    borderRadius: 12,
  },
  approvalEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  approvalContent: {
    flex: 1,
  },
  approvalUser: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  approvalMessage: {
    fontSize: 13,
    color: COLORS.text.muted,
    lineHeight: 18,
  },
  approvalType: {
    fontSize: 11,
    color: COLORS.text.disabled,
    textTransform: 'capitalize' as const,
  },

  // Actions Card
  actionsCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    ...globalStyles.cardElevated,
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: COLORS.accent.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.background.tertiary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },

  // Modal styles
  cancelText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  saveText: {
    fontSize: 16,
    color: COLORS.accent.primary,
    fontWeight: '600' as const,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top' as const,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text.muted,
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    marginTop: 16,
  },
};

export default HabitDetailScreen; 