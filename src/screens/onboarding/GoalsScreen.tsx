import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types';
import { MOCK_GOALS } from '../../utils/mockData';
import { Button, Card } from '../../components/UI';
import { globalStyles, GRADIENTS, COLORS } from '../../styles/globalStyles';

type GoalsScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Goals'>;

interface Props {
  navigation: GoalsScreenNavigationProp;
}

const GoalsScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    // Here you could save the selected goals to the user's profile
    navigation.navigate('PeerSupport');
  };

  return (
    <View style={globalStyles.container}>
      {/* Cosmic Gradient Background */}
      <LinearGradient
        colors={GRADIENTS.cosmicReverse as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={{ ...globalStyles.center, paddingTop: 60, paddingHorizontal: 24 }}>
          <Text style={{ ...globalStyles.title, fontSize: 28 }}>What are your goals?</Text>
          <Text style={globalStyles.subtitle}>
            Select the areas you'd like to focus on. You can change these later.
          </Text>
        </View>

        <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
          <View style={globalStyles.grid}>
            {MOCK_GOALS.map((goal) => (
              <Card
                key={goal.id}
                variant={selectedGoals.includes(goal.id) ? "gradient" : "glass"}
                gradientColors={selectedGoals.includes(goal.id) ? GRADIENTS.card as any : undefined}
                style={{ ...globalStyles.gridItem, position: 'relative' }}
              >
                <Button
                  title=""
                  onPress={() => toggleGoal(goal.id)}
                  variant="ghost"
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }}
                />
                <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>{goal.icon}</Text>
                <Text style={{ ...globalStyles.sectionTitle, fontSize: 16, textAlign: 'center', marginBottom: 4 }}>{goal.title}</Text>
                <Text style={{ ...globalStyles.caption, fontSize: 12, textAlign: 'center', lineHeight: 16 }}>{goal.description}</Text>
                {selectedGoals.includes(goal.id) && (
                  <View style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: COLORS.text.primary,
                    borderRadius: 12,
                    width: 24,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{ color: COLORS.accent.purple, fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                  </View>
                )}
              </Card>
            ))}
          </View>
        </ScrollView>

        <View style={globalStyles.p_lg}>
          <Button
            title={`Continue (${selectedGoals.length} selected)`}
            onPress={handleContinue}
            disabled={selectedGoals.length === 0}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default GoalsScreen; 