import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { HabitDetailScreenNavigationProp, HabitDetailScreenRouteProp } from '../types/navigation';
import { HabitStats, HabitCompletion } from '../types';
import { habitService, habitCompletionService } from '../services/firestore';

const HabitDetailScreen: React.FC = () => {
  const navigation = useNavigation<HabitDetailScreenNavigationProp>();
  const route = useRoute<HabitDetailScreenRouteProp>();
  const { habitId } = route.params;
  
  const { user } = useAuth();
  const { getHabitById, toggleHabit, addApproval, updateHabit, addHabitCompletion } = useApp();
  const [showEncouragementModal, setShowEncouragementModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [completionNote, setCompletionNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'okay' | 'difficult'>('good');
  const [selectedEffort, setSelectedEffort] = useState<number>(3);
  const [habitStats, setHabitStats] = useState<HabitStats | null>(null);
  const [recentCompletions, setRecentCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(false);

  const habit = getHabitById(habitId);

  useEffect(() => {
    if (habit) {
      loadHabitStats();
      loadRecentCompletions();
    }
  }, [habit]);

  const loadHabitStats = async () => {
    try {
      const stats = await habitService.getStats(habitId);
      setHabitStats(stats);
    } catch (error) {
      console.error('Error loading habit stats:', error);
    }
  };

  const loadRecentCompletions = async () => {
    try {
      const completions = await habitCompletionService.getByHabitId(habitId, 10);
      setRecentCompletions(completions);
    } catch (error) {
      console.error('Error loading recent completions:', error);
    }
  };

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
    if (habit.category === 'personal' && !habit.completedToday) {
      // For personal habits, show completion modal for mood/effort tracking
      setShowCompletionModal(true);
    } else {
      // For shared habits or uncompleting, just toggle
      try {
        setLoading(true);
        await toggleHabit(habitId);
        Alert.alert('Success', 
          habit.completedToday 
            ? 'Habit marked as incomplete' 
            : 'Great job! Habit completed for today!'
        );
        await loadHabitStats();
        await loadRecentCompletions();
      } catch (error) {
        Alert.alert('Error', 'Failed to update habit');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCompleteWithDetails = async () => {
    try {
      setLoading(true);
      
      // Add completion with details
      await addHabitCompletion(habitId, {
        note: completionNote.trim() || undefined,
        mood: selectedMood,
        effort: selectedEffort,
      });
      
      // Toggle the habit
      await toggleHabit(habitId);
      
      setShowCompletionModal(false);
      setCompletionNote('');
      setSelectedMood('good');
      setSelectedEffort(3);
      
      Alert.alert('Excellent!', 'Habit completed with details saved!');
      await loadHabitStats();
      await loadRecentCompletions();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete habit');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEncouragement = async () => {
    if (!encouragementMessage.trim()) {
      Alert.alert('Error', 'Please enter an encouragement message');
      return;
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleQuickEncouragement = async (emoji: string, message: string) => {
    try {
      setLoading(true);
      await addApproval(habitId, {
        userId: user?.id || '',
        userName: user?.name || 'Someone',
        type: 'encouragement',
        emoji,
        message,
      });
      
      Alert.alert('Sent!', 'Quick encouragement sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send encouragement');
    } finally {
      setLoading(false);
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

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'difficult': return '😓';
      default: return '😊';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickEncouragements = [
    { emoji: '🎉', message: 'Amazing work!' },
    { emoji: '💪', message: 'Keep it up!' },
    { emoji: '🌟', message: 'You\'re doing great!' },
    { emoji: '👏', message: 'Well done!' },
    { emoji: '🔥', message: 'On fire!' },
    { emoji: '💚', message: 'Love your dedication!' },
  ];

  return (
    <View style={globalStyles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Habit Details</Text>
        <TouchableOpacity onPress={() => setShowStatsModal(true)}>
          <Text style={styles.statsButton}>📊</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Habit Header */}
        <View style={styles.habitHeader}>
          <View style={styles.habitIconContainer}>
            <Text style={styles.habitIcon}>{habit.icon}</Text>
            <Text style={styles.categoryIcon}>{getCategoryIcon()}</Text>
          </View>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.habitDescription}>{habit.description}</Text>
            <View style={styles.habitMeta}>
              <Text style={styles.categoryText}>{habit.category}</Text>
              {habit.estimatedTime && (
                <Text style={styles.timeText}>⏱️ {habit.estimatedTime}min</Text>
              )}
              {habit.difficulty && (
                <Text style={styles.difficultyText}>
                  {habit.difficulty === 'easy' ? '🟢' : habit.difficulty === 'medium' ? '🟡' : '🔴'} {habit.difficulty}
                </Text>
              )}
            </View>
            {habit.tags && habit.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {habit.tags.map((tag, index) => (
                  <Text key={index} style={styles.tag}>#{tag}</Text>
                ))}
              </View>
            )}
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
              <Text style={styles.statNumber}>{habitStats?.totalCompletions || 0}</Text>
              <Text style={styles.statLabel}>Total Completions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>📈</Text>
              <Text style={styles.statNumber}>{habitStats?.completionRate || 0}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
          </View>
        </View>

        {/* Recent Completions */}
        {recentCompletions.length > 0 && (
          <View style={styles.completionsCard}>
            <Text style={styles.sectionTitle}>Recent Completions</Text>
            <View style={styles.completionsList}>
              {recentCompletions.slice(0, 5).map((completion, index) => (
                <View key={completion.id} style={styles.completionItem}>
                  <View style={styles.completionHeader}>
                    <Text style={styles.completionDate}>{formatDate(completion.completedAt)}</Text>
                    {completion.mood && (
                      <Text style={styles.completionMood}>{getMoodEmoji(completion.mood)}</Text>
                    )}
                    {completion.effort && (
                      <Text style={styles.completionEffort}>{'⭐'.repeat(completion.effort)}</Text>
                    )}
                  </View>
                  {completion.note && (
                    <Text style={styles.completionNote}>{completion.note}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

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
                    <Text style={styles.approvalTime}>{formatDate(approval.createdAt)}</Text>
                  </View>
                  <Text style={styles.approvalType}>{approval.type}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Encouragements */}
        {habit.category !== 'personal' && (
          <View style={styles.quickEncouragementCard}>
            <Text style={styles.sectionTitle}>Quick Encouragement</Text>
            <View style={styles.quickEncouragementGrid}>
              {quickEncouragements.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickEncouragementButton}
                  onPress={() => handleQuickEncouragement(item.emoji, item.message)}
                  disabled={loading}
                >
                  <Text style={styles.quickEncouragementEmoji}>{item.emoji}</Text>
                  <Text style={styles.quickEncouragementText}>{item.message}</Text>
                </TouchableOpacity>
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
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.text.inverse} />
                ) : (
                  <Text style={styles.actionButtonText}>
                    {habit.completedToday ? '↩️ Mark Incomplete' : '✅ Mark Complete'}
                  </Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => setShowEncouragementModal(true)}
                disabled={loading}
              >
                <Text style={styles.actionButtonSecondaryText}>💪 Self-Motivate</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => setShowEncouragementModal(true)}
                disabled={loading}
              >
                <Text style={styles.actionButtonSecondaryText}>💚 Send Encouragement</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.actionButtonSecondaryText}>👍 Peer Approve</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCompletionModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Complete Habit</Text>
            <TouchableOpacity onPress={handleCompleteWithDetails} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.accent.primary} />
              ) : (
                <Text style={styles.saveText}>Complete</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={globalStyles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={globalStyles.inputLabel}>How did it go?</Text>
            <View style={styles.moodSelector}>
              {(['great', 'good', 'okay', 'difficult'] as const).map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodButton,
                    selectedMood === mood && styles.moodButtonSelected
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                  <Text style={[
                    styles.moodText,
                    selectedMood === mood && styles.moodTextSelected
                  ]}>
                    {mood}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={globalStyles.inputLabel}>Effort Level (1-5)</Text>
            <View style={styles.effortSelector}>
              {[1, 2, 3, 4, 5].map((effort) => (
                <TouchableOpacity
                  key={effort}
                  style={[
                    styles.effortButton,
                    selectedEffort === effort && styles.effortButtonSelected
                  ]}
                  onPress={() => setSelectedEffort(effort)}
                >
                  <Text style={styles.effortText}>{'⭐'.repeat(effort)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={globalStyles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[globalStyles.input, styles.messageInput]}
              value={completionNote}
              onChangeText={setCompletionNote}
              placeholder="How did this habit go today?"
              placeholderTextColor={COLORS.text.disabled}
              multiline
              numberOfLines={3}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

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
            <TouchableOpacity onPress={handleSendEncouragement} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.accent.primary} />
              ) : (
                <Text style={styles.saveText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={globalStyles.modalContent} showsVerticalScrollIndicator={false}>
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
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Stats Modal */}
      <Modal
        visible={showStatsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowStatsModal(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Detailed Stats</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={globalStyles.modalContent}>
            {habitStats && (
              <>
                <View style={styles.detailedStatsGrid}>
                  <View style={styles.detailedStatItem}>
                    <Text style={styles.detailedStatNumber}>{habitStats.totalCompletions}</Text>
                    <Text style={styles.detailedStatLabel}>Total Completions</Text>
                  </View>
                  <View style={styles.detailedStatItem}>
                    <Text style={styles.detailedStatNumber}>{habitStats.currentStreak}</Text>
                    <Text style={styles.detailedStatLabel}>Current Streak</Text>
                  </View>
                  <View style={styles.detailedStatItem}>
                    <Text style={styles.detailedStatNumber}>{habitStats.longestStreak}</Text>
                    <Text style={styles.detailedStatLabel}>Longest Streak</Text>
                  </View>
                  <View style={styles.detailedStatItem}>
                    <Text style={styles.detailedStatNumber}>{habitStats.completionRate}%</Text>
                    <Text style={styles.detailedStatLabel}>30-Day Rate</Text>
                  </View>
                </View>

                {habitStats.averageMood && (
                  <View style={styles.averageSection}>
                    <Text style={styles.averageTitle}>Average Mood</Text>
                    <Text style={styles.averageValue}>{habitStats.averageMood.toFixed(1)}/5</Text>
                  </View>
                )}

                {habitStats.averageEffort && (
                  <View style={styles.averageSection}>
                    <Text style={styles.averageTitle}>Average Effort</Text>
                    <Text style={styles.averageValue}>{habitStats.averageEffort.toFixed(1)}/5</Text>
                  </View>
                )}

                <View style={styles.progressSection}>
                  <Text style={styles.progressTitle}>Weekly Progress</Text>
                  <View style={styles.progressBar}>
                    {habitStats.weeklyProgress.map((count, index) => (
                      <View
                        key={index}
                        style={[
                          styles.progressBarItem,
                          { height: Math.max(4, (count / Math.max(...habitStats.weeklyProgress)) * 40) }
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </>
            )}
          </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.accent.primary,
    fontWeight: '500' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  statsButton: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  habitHeader: {
    flexDirection: 'row' as const,
    marginBottom: 24,
    padding: 20,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  habitIconContainer: {
    position: 'relative' as const,
    marginRight: 16,
  },
  habitIcon: {
    fontSize: 48,
  },
  categoryIcon: {
    position: 'absolute' as const,
    bottom: -4,
    right: -4,
    fontSize: 16,
    backgroundColor: COLORS.background.primary,
    borderRadius: 12,
    padding: 2,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  habitMeta: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.accent.primary,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.text.muted,
  },
  difficultyText: {
    fontSize: 14,
    color: COLORS.text.muted,
    textTransform: 'capitalize' as const,
  },
  tagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
  },
  tag: {
    fontSize: 12,
    color: COLORS.accent.secondary,
    backgroundColor: COLORS.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statsCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center' as const,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.muted,
    textAlign: 'center' as const,
  },
  completionsCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  completionsList: {
    gap: 12,
  },
  completionItem: {
    padding: 12,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 12,
  },
  completionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  completionDate: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500' as const,
  },
  completionMood: {
    fontSize: 16,
  },
  completionEffort: {
    fontSize: 12,
  },
  completionNote: {
    fontSize: 14,
    color: COLORS.text.muted,
    fontStyle: 'italic' as const,
  },
  activityCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  approvalsList: {
    gap: 12,
  },
  approvalItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    padding: 12,
    backgroundColor: COLORS.background.tertiary,
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
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  approvalTime: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
  approvalType: {
    fontSize: 12,
    color: COLORS.accent.primary,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  quickEncouragementCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickEncouragementGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  quickEncouragementButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.background.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickEncouragementEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  quickEncouragementText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500' as const,
  },
  actionsCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 50,
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },
  actionButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.text.muted,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.accent.primary,
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
  moodSelector: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginBottom: 20,
  },
  moodButton: {
    alignItems: 'center' as const,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: COLORS.background.tertiary,
  },
  moodButtonSelected: {
    borderColor: COLORS.accent.primary,
    backgroundColor: COLORS.accent.secondary,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodText: {
    fontSize: 12,
    color: COLORS.text.muted,
    textTransform: 'capitalize' as const,
  },
  moodTextSelected: {
    color: COLORS.accent.primary,
    fontWeight: '600' as const,
  },
  effortSelector: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginBottom: 20,
  },
  effortButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: COLORS.background.tertiary,
  },
  effortButtonSelected: {
    borderColor: COLORS.accent.primary,
    backgroundColor: COLORS.accent.secondary,
  },
  effortText: {
    fontSize: 16,
  },
  detailedStatsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
    marginBottom: 24,
  },
  detailedStatItem: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 12,
  },
  detailedStatNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.accent.primary,
    marginBottom: 4,
  },
  detailedStatLabel: {
    fontSize: 12,
    color: COLORS.text.muted,
    textAlign: 'center' as const,
  },
  averageSection: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 12,
    marginBottom: 16,
  },
  averageTitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500' as const,
  },
  averageValue: {
    fontSize: 18,
    color: COLORS.accent.primary,
    fontWeight: '600' as const,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500' as const,
    marginBottom: 12,
  },
  progressBar: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    justifyContent: 'space-between' as const,
    height: 50,
    paddingHorizontal: 8,
  },
  progressBarItem: {
    width: 20,
    backgroundColor: COLORS.accent.primary,
    borderRadius: 2,
    minHeight: 4,
  },
};

export default HabitDetailScreen; 