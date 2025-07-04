import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Exercise } from '@/constants/workoutData';
import i18n from '@/localization';

interface ExerciseInsights {
  highestWeight: number;
  highestReps: number;
  averageWeight: number;
  averageReps: number;
  totalSessions: number;
  lastPerformed: string;
  bestSet: { weight: number; reps: number };
}

interface ExerciseCardProps {
  exercise: Exercise;
  onChange: (exercise: Exercise) => void;
  showInsights?: boolean;
}

export default function ExerciseCard({ exercise, onChange, showInsights = false }: ExerciseCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [insightsVisible, setInsightsVisible] = useState(false);

  // Generate dummy insights data for the exercise
  const generateInsights = (): ExerciseInsights => {
    const baseWeight = Math.floor(Math.random() * 50) + 20; // 20-70kg
    const baseReps = Math.floor(Math.random() * 8) + 8; // 8-15 reps
    
    return {
      highestWeight: baseWeight + Math.floor(Math.random() * 20),
      highestReps: baseReps + Math.floor(Math.random() * 5),
      averageWeight: baseWeight,
      averageReps: baseReps,
      totalSessions: Math.floor(Math.random() * 15) + 5, // 5-20 sessions
      lastPerformed: ['2024-01-15', '2024-01-12', '2024-01-10', '2024-01-08'][Math.floor(Math.random() * 4)],
      bestSet: { weight: baseWeight + 10, reps: baseReps + 2 }
    };
  };

  const insights = generateInsights();

  const handleCardPress = () => {
    if (showInsights) {
      setInsightsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.exerciseCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={handleCardPress}
        activeOpacity={showInsights ? 0.7 : 1}
      >
        <MaterialCommunityIcons name="dumbbell" size={30} color={colors.text} style={styles.exerciseIcon} />
        <View style={styles.exerciseDetails}>
          <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
          <Text style={[styles.exerciseMuscle, { color: colors.text + '90' }]}>
            {exercise.muscle} • {exercise.sets}x{exercise.reps}
          </Text>
        </View>
        <View style={styles.actions}>
          {showInsights && (
            <TouchableOpacity onPress={() => setInsightsVisible(true)}>
              <MaterialCommunityIcons name="chart-line" size={24} color={colors.tint} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onChange(exercise)}>
            <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Insights Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={insightsVisible}
        onRequestClose={() => setInsightsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {i18n.t('exerciseInsights')}
              </Text>
              <TouchableOpacity onPress={() => setInsightsVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.exerciseNameModal, { color: colors.text }]}>{exercise.name}</Text>
              
              {/* Performance Stats */}
              <View style={styles.statsContainer}>
                <Text style={[styles.sectionTitle, { color: colors.tint }]}>
                  {i18n.t('performanceStats')}
                </Text>
                
                <View style={styles.statRow}>
                  <View style={[styles.statCard, { backgroundColor: colors.background }]}>
                    <MaterialCommunityIcons name="weight-lifter" size={24} color={colors.tint} />
                    <Text style={[styles.statValue, { color: colors.text }]}>{insights.highestWeight}kg</Text>
                    <Text style={[styles.statLabel, { color: colors.text + '80' }]}>{i18n.t('highestWeight')}</Text>
                  </View>
                  
                  <View style={[styles.statCard, { backgroundColor: colors.background }]}>
                    <MaterialCommunityIcons name="repeat" size={24} color={colors.tint} />
                    <Text style={[styles.statValue, { color: colors.text }]}>{insights.highestReps}</Text>
                    <Text style={[styles.statLabel, { color: colors.text + '80' }]}>{i18n.t('highestReps')}</Text>
                  </View>
                </View>

                <View style={styles.statRow}>
                  <View style={[styles.statCard, { backgroundColor: colors.background }]}>
                    <MaterialCommunityIcons name="chart-line" size={24} color={colors.tint} />
                    <Text style={[styles.statValue, { color: colors.text }]}>{insights.averageWeight}kg</Text>
                    <Text style={[styles.statLabel, { color: colors.text + '80' }]}>{i18n.t('averageWeight')}</Text>
                  </View>
                  
                  <View style={[styles.statCard, { backgroundColor: colors.background }]}>
                    <MaterialCommunityIcons name="counter" size={24} color={colors.tint} />
                    <Text style={[styles.statValue, { color: colors.text }]}>{insights.totalSessions}</Text>
                    <Text style={[styles.statLabel, { color: colors.text + '80' }]}>{i18n.t('totalSessions')}</Text>
                  </View>
                </View>
              </View>

              {/* Best Performance */}
              <View style={styles.statsContainer}>
                <Text style={[styles.sectionTitle, { color: colors.tint }]}>
                  {i18n.t('bestPerformance')}
                </Text>
                <View style={[styles.bestSetCard, { backgroundColor: colors.background }]}>
                  <MaterialCommunityIcons name="trophy" size={32} color="#FFD700" />
                  <Text style={[styles.bestSetText, { color: colors.text }]}>
                    {insights.bestSet.weight}kg × {insights.bestSet.reps} {i18n.t('reps')}
                  </Text>
                  <Text style={[styles.bestSetLabel, { color: colors.text + '80' }]}>
                    {i18n.t('personalRecord')}
                  </Text>
                </View>
              </View>

              {/* Recent Activity */}
              <View style={styles.statsContainer}>
                <Text style={[styles.sectionTitle, { color: colors.tint }]}>
                  {i18n.t('recentActivity')}
                </Text>
                <View style={[styles.activityCard, { backgroundColor: colors.background }]}>
                  <MaterialCommunityIcons name="calendar-clock" size={24} color={colors.tint} />
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityText, { color: colors.text }]}>
                      {i18n.t('lastPerformed')}
                    </Text>
                    <Text style={[styles.activityDate, { color: colors.text + '80' }]}>
                      {insights.lastPerformed}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  exerciseIcon: {
    marginRight: 15,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseMuscle: {
    fontSize: 14,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  exerciseNameModal: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    flex: 0.48,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  bestSetCard: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  bestSetText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bestSetLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  activityInfo: {
    marginLeft: 15,
  },
  activityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 14,
    marginTop: 2,
  },
}); 