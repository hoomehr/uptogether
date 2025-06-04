import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';

type PeerSupportScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'PeerSupport'>;

interface Props {
  navigation: PeerSupportScreenNavigationProp;
}

const PeerSupportScreen: React.FC<Props> = ({ navigation }) => {
  const [peerSupportEnabled, setPeerSupportEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await updateUser({
        peerSupportEnabled,
        onboardingComplete: true,
      });
      // Navigation will be handled automatically by the auth flow
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🤝</Text>
          <Text style={styles.title}>Peer Support</Text>
          <Text style={styles.subtitle}>
            Connect with others on similar journeys for mutual encouragement and accountability.
          </Text>
        </View>

        <View style={styles.optionContainer}>
          <View style={styles.option}>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Enable Peer Support</Text>
              <Text style={styles.optionDescription}>
                Share your progress and receive encouragement from the community. 
                You can change this setting anytime.
              </Text>
            </View>
            <Switch
              value={peerSupportEnabled}
              onValueChange={setPeerSupportEnabled}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={peerSupportEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Benefits of peer support:</Text>
            <View style={styles.benefit}>
              <Text style={styles.benefitIcon}>🌟</Text>
              <Text style={styles.benefitText}>Stay motivated with community encouragement</Text>
            </View>
            <View style={styles.benefit}>
              <Text style={styles.benefitIcon}>📈</Text>
              <Text style={styles.benefitText}>Share progress and celebrate milestones</Text>
            </View>
            <View style={styles.benefit}>
              <Text style={styles.benefitIcon}>🤗</Text>
              <Text style={styles.benefitText}>Connect with like-minded individuals</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleFinish}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Setting up...' : 'Get Started'}
          </Text>
        </TouchableOpacity>
      </View>
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
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  benefitsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#1E40AF',
    flex: 1,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PeerSupportScreen; 