import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../../components/UI';
import { globalStyles, GRADIENTS, COLORS } from '../../styles/globalStyles';

type WelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, continueAsGuest } = useAuth();

  const handleContinue = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name.trim());
      navigation.navigate('Goals');
    } catch (error) {
      console.error('Sign up error:', error);
      // Handle error - you might want to show an alert here
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestContinue = async () => {
    setIsLoading(true);
    try {
      await continueAsGuest(name.trim() || undefined);
      navigation.navigate('Goals');
    } catch (error) {
      console.error('Guest continue error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Cosmic Gradient Background */}
      <LinearGradient
        colors={GRADIENTS.primary as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={globalStyles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ ...globalStyles.content, justifyContent: 'space-between' }}
        >
          <View style={{ ...globalStyles.center, paddingTop: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🌟</Text>
            <Text style={{ ...globalStyles.title, fontSize: 28 }}>Welcome to UpTogether</Text>
            <Text style={globalStyles.subtitle}>
              Your journey to better self-care starts here
            </Text>
          </View>

          <Card variant="glass" style={globalStyles.my_lg}>
            <Text style={globalStyles.inputLabel}>What's your name? (Optional)</Text>
            <TextInput
              style={globalStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.text.disabled}
              autoCapitalize="words"
            />

            <Text style={globalStyles.inputLabel}>Email</Text>
            <TextInput
              style={globalStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.text.disabled}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={globalStyles.inputLabel}>Password</Text>
            <TextInput
              style={globalStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={COLORS.text.disabled}
              secureTextEntry
            />
          </Card>

        <View style={globalStyles.buttonContainer}>
          <Button
            title={isLoading ? 'Creating Account...' : 'Create Account & Continue'}
            onPress={handleContinue}
            disabled={!name.trim() || !email.trim() || !password.trim() || isLoading}
            loading={isLoading}
            variant="primary"
            size="large"
            style={globalStyles.mb_md}
          />

          <View style={globalStyles.divider}>
            <View style={globalStyles.dividerLine} />
            <Text style={globalStyles.dividerText}>or</Text>
            <View style={globalStyles.dividerLine} />
          </View>

          <Button
            title={isLoading ? 'Loading...' : '👋 Continue as Guest'}
            onPress={handleGuestContinue}
            disabled={isLoading}
            loading={isLoading}
            variant="outline"
            size="large"
            style={globalStyles.mb_sm}
          />

          <Text style={{ ...globalStyles.caption, fontSize: 12, textAlign: 'center', lineHeight: 16 }}>
            You can create an account later to sync your progress across devices
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </View>
  );
};



export default WelcomeScreen; 