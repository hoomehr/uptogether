import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { getFontSize } from '../utils/responsive';

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, continueAsGuest } = useAuth();

  const handleAuth = async () => {
    if (isSignUp && !name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name.trim());
        Alert.alert('Success', 'Account created successfully!');
      } else {
        await signIn(email, password);
        Alert.alert('Success', 'Signed in successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestContinue = async () => {
    setIsLoading(true);
    try {
      await continueAsGuest();
    } catch (error) {
      console.error('Guest continue error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>UpTogether</Text>
            <Text style={styles.tagline}>
              Build better habits, together
            </Text>
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, !isSignUp && styles.activeTab]}
                onPress={() => setIsSignUp(false)}
              >
                <Text style={[styles.tabText, !isSignUp && styles.activeTabText]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, isSignUp && styles.activeTab]}
                onPress={() => setIsSignUp(true)}
              >
                <Text style={[styles.tabText, isSignUp && styles.activeTabText]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.text.disabled}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.text.disabled}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.text.disabled}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.disabledButton]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading 
                    ? 'Loading...' 
                    : isSignUp 
                      ? 'Create Account' 
                      : 'Sign In'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Guest Option */}
          <View style={styles.guestContainer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGuestContinue}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>
                Continue as Guest
              </Text>
            </TouchableOpacity>

            <Text style={styles.guestNote}>
              You can create an account later to save your progress
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between' as const,
  },
  header: {
    alignItems: 'center' as const,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    fontSize: getFontSize(28),
    fontWeight: '700' as const,
    color: COLORS.accent.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: getFontSize(14),
    color: COLORS.text.muted,
    textAlign: 'center' as const,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    maxHeight: 500,
  },
  tabContainer: {
    flexDirection: 'row' as const,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center' as const,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.accent.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text.muted,
  },
  activeTabText: {
    color: COLORS.text.inverse,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: getFontSize(12),
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
  },
  input: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: getFontSize(14),
    color: COLORS.text.primary,
  },
  primaryButton: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: getFontSize(14),
    fontWeight: '600' as const,
    color: COLORS.text.inverse,
  },
  guestContainer: {
    paddingBottom: 20,
  },
  divider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.text.muted,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: getFontSize(12),
    fontWeight: '600' as const,
    color: COLORS.accent.primary,
  },
  guestNote: {
    fontSize: 12,
    color: COLORS.text.disabled,
    textAlign: 'center' as const,
    lineHeight: 16,
  },
};

export default AuthScreen; 