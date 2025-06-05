import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../../components/UI';

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
    <View style={styles.container}>
      {/* Cosmic Gradient Background */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🤝</Text>
            <Text style={styles.title}>Peer Support</Text>
            <Text style={styles.subtitle}>
              Connect with others on similar journeys for mutual encouragement and accountability.
            </Text>
          </View>

          <View style={styles.optionContainer}>
            <Card variant="glass" style={styles.option}>
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
                trackColor={{ false: '#475569', true: '#8B5CF6' }}
                thumbColor={peerSupportEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </Card>

            <Card variant="gradient" gradientColors={['#06b6d4', '#8b5cf6']} style={styles.benefitsContainer}>
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
            </Card>
          </View>

          <Button
            title={isLoading ? 'Setting up...' : 'Get Started'}
            onPress={handleFinish}
            disabled={isLoading}
            loading={isLoading}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  optionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
  benefitsContainer: {
    marginTop: 8,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    flex: 1,
  },
  button: {
    marginTop: 24,
  },
});

export default PeerSupportScreen; 