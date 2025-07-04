import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { workoutData, WorkoutDay, Exercise } from '@/constants/workoutData';
import ExerciseCard from '@/components/ExerciseCard';
import i18n from '@/localization';

export default function DayDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  
  const weekNumber = parseInt(params.weekNumber as string);
  const dayId = params.dayId as string;
  
  const day: WorkoutDay | undefined = workoutData
    .find(w => w.weekNumber === weekNumber)
    ?.days.find(d => d.id === dayId);

  if (!day) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>{i18n.t('workoutNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const handleChangeExercise = (exercise: Exercise) => {
    router.push({
      pathname: '/edit-workout',
      params: { exercise: JSON.stringify(exercise) }
    });
  };

  const handleStartWorkout = () => {
    Alert.alert(
      i18n.t('startWorkoutTitle'),
      i18n.t('warningMessage'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('understand'),
          onPress: () => {
            router.push({
              pathname: '/active-workout',
              params: { day: JSON.stringify(day) },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
       <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={colors.tint} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{day.name}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {day.exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onChange={handleChangeExercise}
            showInsights={true}
          />
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.tint, borderWidth: 1 }]}>
          <Text style={[styles.actionButtonText, { color: colors.tint }]}>{i18n.t('addExercise')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.tint }]} onPress={handleStartWorkout}>
          <Text style={[styles.actionButtonText, { color: '#fff' }]}>{i18n.t('startWorkout')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 