import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { workoutData, Exercise } from '@/constants/workoutData';
import i18n from '@/localization';

export default function AlternativeExercisesScreen() {
  const { currentExerciseId, muscle } = useLocalSearchParams<{
    currentExerciseId: string;
    muscle: string;
  }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const alternativeExercises = useMemo(
    () =>
      workoutData
        .flatMap((week) => week.days.flatMap((day) => day.exercises))
        .filter((ex) => ex.muscle === muscle && ex.id !== currentExerciseId)
        .filter((ex, index, self) => index === self.findIndex((e) => e.id === ex.id)), // Unique exercises
    [muscle, currentExerciseId]
  );

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [playing, setPlaying] = useState(false);

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleChangeExercise = () => {
    if (selectedExercise) {
        if (router.canGoBack()) {
            router.back();
          }
    }
  };

  if (!selectedExercise) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: i18n.t('workout.select_alternative') }} />
        <FlatList
          data={alternativeExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.exerciseItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleSelectExercise(item)}>
              <Text style={[styles.exerciseName, { color: colors.text }]}>{item.name}</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <Text style={[styles.title, { color: colors.text }]}>
              {i18n.t('workout.alternatives')}
            </Text>
          }
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: selectedExercise.name, headerBackTitle: 'Back' }} />
      <View style={styles.videoContainer}>
        <YoutubePlayer height={220} play={playing} videoId={selectedExercise.videoId} onChangeState={() => {}} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{selectedExercise.name}</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          Muscle: {selectedExercise.muscle} | Sets: {selectedExercise.sets} | Reps: {selectedExercise.reps}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.changeButton, { backgroundColor: colors.tint }]}
        onPress={handleChangeExercise}>
        <Text style={[styles.changeButtonText, { color: '#fff' }]}>
          {i18n.t('workout.change_exercise')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  videoContainer: {
    // Styles for video container
  },
  detailsContainer: {
    padding: 20,
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  changeButton: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 