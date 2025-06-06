import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { seedDatabaseForCurrentUser, checkUserHasData } from '../utils/seedDatabase';
import { globalStyles, COLORS } from '../styles/globalStyles';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { refreshHabits } = useApp();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  if (!user || user.id.startsWith('guest_')) {
    return null; // Don't show admin panel for guest users
  }

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      
      // Check if user already has data
      const hasData = await checkUserHasData();
      if (hasData) {
        Alert.alert(
          'Data Already Exists',
          'Your account already has habit data. Seeding will add more sample data. Continue?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Add Sample Data', 
              onPress: async () => {
                await seedDatabaseForCurrentUser();
                await refreshHabits();
                Alert.alert('Success', '🌱 Sample data added to your account!');
              }
            },
          ]
        );
      } else {
        await seedDatabaseForCurrentUser();
        await refreshHabits();
        Alert.alert('Success', '🌱 Database seeded with sample data!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to seed database: ' + (error as Error).message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCheckData = async () => {
    try {
      setIsChecking(true);
      const hasData = await checkUserHasData();
      Alert.alert(
        'Data Status', 
        hasData 
          ? '✅ Your account has habit data in Firestore' 
          : '❌ No habit data found in Firestore'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to check data: ' + (error as Error).message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Development Tools</Text>
        <Text style={styles.subtitle}>
          Connected User: {user.email}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleSeedData}
          disabled={isSeeding}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            {isSeeding ? '🌱 Seeding...' : '🌱 Seed Sample Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleCheckData}
          disabled={isChecking}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            {isChecking ? 'Checking...' : '📊 Check Data Status'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={refreshHabits}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            🔄 Refresh Data
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Tip: Use these tools to populate your Firestore database with sample habits, family members, and friends for testing.
        </Text>
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 2,
    borderColor: COLORS.accent.tertiary,
    borderStyle: 'dashed' as const,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.muted,
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  primaryButton: {
    backgroundColor: COLORS.accent.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  primaryButtonText: {
    color: COLORS.text.inverse,
  },
  secondaryButtonText: {
    color: COLORS.text.primary,
  },
  info: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.text.muted,
    lineHeight: 18,
  },
};

export default AdminPanel; 