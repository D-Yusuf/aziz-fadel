import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
}

const generateWorkoutData = () => {
  const weeks = [];
  for (let week = 1; week <= 12; week++) {
    const weekData = {
      weekNumber: week,
      days: [
        {
          id: `week${week}-day1`,
          name: 'اليوم الأول',
          exercises: [
            { id: '1', name: 'ضغط البنش', sets: 3, reps: '8-12' },
            { id: '2', name: 'الضغط العسكري', sets: 3, reps: '8-12' },
            { id: '3', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '4', name: 'الترايسبس', sets: 3, reps: '10-15' },
          ],
        },
        {
          id: `week${week}-day2`,
          name: 'اليوم الثاني',
          exercises: [
            { id: '1', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '2', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '3', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '4', name: 'البار المائل', sets: 3, reps: '10-15' },
          ],
        },
        {
          id: `week${week}-day3`,
          name: 'اليوم الثالث',
          exercises: [
            { id: '1', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '2', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '3', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '4', name: 'البار المائل', sets: 3, reps: '10-15' },
          ],
        },
        {
          id: `week${week}-day4`,
          name: 'اليوم الرابع',
          exercises: [
            { id: '1', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '2', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '3', name: 'البار المائل', sets: 3, reps: '8-12' },
            { id: '4', name: 'البار المائل', sets: 3, reps: '10-15' },
          ],
        },
      ],
    };
    weeks.push(weekData);
  }
  return weeks;
};

export default function WorkoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedWeek, setSelectedWeek] = useState(1);
  const workoutData = generateWorkoutData();

  const handleWeekChange = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
  };

  const handleEditWorkout = (day: WorkoutDay) => {
    router.push({
      pathname: '/edit-workout',
      params: { dayId: day.id, dayName: day.name }
    });
  };

  const handleStartWorkout = (day: WorkoutDay) => {
    router.push({
      pathname: '/active-workout',
      params: { dayId: day.id, dayName: day.name }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>برنامج التمارين</Text>
      </View>

      {/* Week Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.weekSelector}
        contentContainerStyle={styles.weekSelectorContent}
      >
        {workoutData.map((week) => (
          <TouchableOpacity
            key={week.weekNumber}
            style={[
              styles.weekButton,
              selectedWeek === week.weekNumber && { backgroundColor: colors.tint }
            ]}
            onPress={() => handleWeekChange(week.weekNumber)}
          >
            <Text style={[
              styles.weekButtonText,
              { color: selectedWeek === week.weekNumber ? '#fff' : colors.text }
            ]}>
              الأسبوع {week.weekNumber}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Workout Days */}
      <ScrollView style={styles.daysContainer}>
        {workoutData[selectedWeek - 1]?.days.map((day) => (
          <View key={day.id} style={[styles.dayCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.dayTitle, { color: colors.text }]}>{day.name}</Text>
            
            <View style={styles.exercisesPreview}>
              {day.exercises.slice(0, 2).map((exercise) => (
                <Text key={exercise.id} style={[styles.exerciseText, { color: colors.text }]}>
                  • {exercise.name} ({exercise.sets} مجموعات)
                </Text>
              ))}
              {day.exercises.length > 2 && (
                <Text style={[styles.moreExercises, { color: colors.text }]}>
                  + {day.exercises.length - 2} تمارين أخرى
                </Text>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton, { borderColor: colors.tint }]}
                onPress={() => handleEditWorkout(day)}
              >
                <Text style={[styles.actionButtonText, { color: colors.tint }]}>تعديل</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.startButton, { backgroundColor: colors.tint }]}
                onPress={() => handleStartWorkout(day)}
              >
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>ابدأ التمرين</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weekSelector: {
    maxHeight: 60,
    paddingHorizontal: 20,
  },
  weekSelectorContent: {
    paddingVertical: 10,
    gap: 10,
  },
  weekButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  weekButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysContainer: {
    flex: 1,
    padding: 20,
  },
  dayCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  exercisesPreview: {
    marginBottom: 20,
  },
  exerciseText: {
    fontSize: 16,
    marginBottom: 5,
  },
  moreExercises: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButton: {
    borderWidth: 1,
  },
  startButton: {
    // backgroundColor is set dynamically
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 