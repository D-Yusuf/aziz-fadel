import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Exercise } from '@/constants/workoutData';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onEdit }: ExerciseCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.exerciseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <MaterialCommunityIcons name="dumbbell" size={30} color={colors.text} style={styles.exerciseIcon} />
      <View style={styles.exerciseDetails}>
        <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
        <Text style={[styles.exerciseMuscle, { color: colors.text + '90' }]}>
          {exercise.muscle} • {exercise.sets}x{exercise.reps}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onEdit(exercise)}>
        <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
}); 