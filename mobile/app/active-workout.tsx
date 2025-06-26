import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  completedSets: SetData[];
}

interface SetData {
  id: string;
  weight: string;
  reps: string;
  completed: boolean;
}

export default function ActiveWorkoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  const dayId = params.dayId as string;
  const dayName = params.dayName as string;

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'ضغط البنش',
      sets: 3,
      reps: '8-12',
      completedSets: [
        { id: '1-1', weight: '', reps: '', completed: false },
        { id: '1-2', weight: '', reps: '', completed: false },
        { id: '1-3', weight: '', reps: '', completed: false },
      ],
    },
    {
      id: '2',
      name: 'الضغط العسكري',
      sets: 3,
      reps: '8-12',
      completedSets: [
        { id: '2-1', weight: '', reps: '', completed: false },
        { id: '2-2', weight: '', reps: '', completed: false },
        { id: '2-3', weight: '', reps: '', completed: false },
      ],
    },
    {
      id: '3',
      name: 'البار المائل',
      sets: 3,
      reps: '8-12',
      completedSets: [
        { id: '3-1', weight: '', reps: '', completed: false },
        { id: '3-2', weight: '', reps: '', completed: false },
        { id: '3-3', weight: '', reps: '', completed: false },
      ],
    },
    {
      id: '4',
      name: 'الترايسبس',
      sets: 3,
      reps: '10-15',
      completedSets: [
        { id: '4-1', weight: '', reps: '', completed: false },
        { id: '4-2', weight: '', reps: '', completed: false },
        { id: '4-3', weight: '', reps: '', completed: false },
      ],
    },
  ]);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const handleSetUpdate = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          completedSets: ex.completedSets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          ),
        };
      }
      return ex;
    }));
  };

  const handleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          completedSets: ex.completedSets.map(set => 
            set.id === setId ? { ...set, completed: !set.completed } : set
          ),
        };
      }
      return ex;
    }));
  };

  const handleFinishWorkout = () => {
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const completedSets = exercises.reduce((acc, ex) => 
      acc + ex.completedSets.filter(set => set.completed).length, 0
    );

    Alert.alert(
      'إنهاء التمرين',
      `أكملت ${completedSets} من أصل ${totalSets} مجموعة\nهل تريد إنهاء التمرين؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'إنهاء', 
          onPress: () => {
            Alert.alert('تم إنهاء التمرين', 'أحسنت! لقد أكملت تمرينك بنجاح', [
              { text: 'حسناً', onPress: () => router.back() }
            ]);
          }
        },
      ]
    );
  };

  const renderExercise = (exercise: Exercise, index: number) => (
    <View key={exercise.id} style={[styles.exerciseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.exerciseHeader}>
        <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
        <Text style={[styles.exerciseTarget, { color: colors.text + '80' }]}>
          الهدف: {exercise.sets} مجموعات × {exercise.reps} تكرار
        </Text>
      </View>

      <View style={styles.setsContainer}>
        {exercise.completedSets.map((set, setIndex) => (
          <View key={set.id} style={styles.setRow}>
            <Text style={[styles.setNumber, { color: colors.text }]}>المجموعة {setIndex + 1}</Text>
            
            <View style={styles.setInputs}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>الوزن (كجم)</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.background, 
                      color: colors.text, 
                      borderColor: colors.border,
                      opacity: set.completed ? 0.6 : 1
                    }
                  ]}
                  value={set.weight}
                  onChangeText={(text) => handleSetUpdate(exercise.id, set.id, 'weight', text)}
                  placeholder="0"
                  placeholderTextColor={colors.text + '80'}
                  keyboardType="numeric"
                  editable={!set.completed}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>التكرارات</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.background, 
                      color: colors.text, 
                      borderColor: colors.border,
                      opacity: set.completed ? 0.6 : 1
                    }
                  ]}
                  value={set.reps}
                  onChangeText={(text) => handleSetUpdate(exercise.id, set.id, 'reps', text)}
                  placeholder="0"
                  placeholderTextColor={colors.text + '80'}
                  keyboardType="numeric"
                  editable={!set.completed}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.completeButton,
                set.completed ? { backgroundColor: colors.tint } : { borderColor: colors.tint, borderWidth: 1 }
              ]}
              onPress={() => handleSetComplete(exercise.id, set.id)}
            >
              <Text style={[
                styles.completeButtonText,
                { color: set.completed ? '#fff' : colors.tint }
              ]}>
                {set.completed ? '✓' : 'إكمال'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.tint }]}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>التمرين النشط</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.dayInfo}>
        <Text style={[styles.dayName, { color: colors.text }]}>{dayName}</Text>
      </View>

      <ScrollView style={styles.content}>
        {exercises.map((exercise, index) => renderExercise(exercise, index))}

        <TouchableOpacity
          style={[styles.finishButton, { backgroundColor: colors.tint }]}
          onPress={handleFinishWorkout}
        >
          <Text style={[styles.finishButtonText, { color: '#fff' }]}>إنهاء التمرين</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  dayInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
  exerciseHeader: {
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseTarget: {
    fontSize: 14,
  },
  setsContainer: {
    gap: 10,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 80,
  },
  setInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
  completeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  finishButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 