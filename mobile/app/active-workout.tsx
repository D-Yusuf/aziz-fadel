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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WorkoutDay, Exercise } from '@/constants/workoutData';

interface SetData {
  id: string;
  weight: string;
  reps: string;
  completed: boolean;
}

interface ActiveExercise extends Exercise {
  setsData: SetData[];
}

export default function ActiveWorkoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  const day: WorkoutDay = JSON.parse(params.day as string);

  const [exercises, setExercises] = useState<ActiveExercise[]>(() => 
    day.exercises.map(ex => ({
      ...ex,
      setsData: Array.from({ length: ex.sets }, (_, i) => ({
        id: `${ex.id}-set-${i}`,
        weight: '',
        reps: '',
        completed: false,
      })),
    }))
  );
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const handleSetUpdate = (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const newExercises = [...exercises];
    newExercises[exIndex].setsData[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleSetComplete = (exIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    const currentStatus = newExercises[exIndex].setsData[setIndex].completed;
    newExercises[exIndex].setsData[setIndex].completed = !currentStatus;
    setExercises(newExercises);
  };

  const handleFinishWorkout = () => {
    Alert.alert(
      'إنهاء التمرين',
      'هل أنت متأكد من أنك تريد إنهاء هذا التمرين؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'إنهاء', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('أحسنت!', 'لقد أكملت تمرينك بنجاح.', [
              { text: 'حسناً', onPress: () => router.back() }
            ]);
          }
        },
      ]
    );
  };
  
  const currentExercise = exercises[currentExerciseIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="window-close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{currentExercise.name}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {currentExercise.setsData.map((set, setIndex) => (
          <View key={set.id} style={styles.setContainer}>
            <View style={styles.setRow}>
              <Text style={[styles.setTitle, { color: set.completed ? colors.tint : colors.text }]}>
                Set {setIndex + 1}
              </Text>
              <TouchableOpacity onPress={() => handleSetComplete(currentExerciseIndex, setIndex)}>
                <MaterialCommunityIcons 
                  name={set.completed ? "check-circle" : "checkbox-blank-circle-outline"}
                  size={28} 
                  color={set.completed ? colors.tint : colors.border} 
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Weight"
                placeholderTextColor={colors.text + '80'}
                keyboardType="numeric"
                value={set.weight}
                onChangeText={(text) => handleSetUpdate(currentExerciseIndex, setIndex, 'weight', text)}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Reps"
                placeholderTextColor={colors.text + '80'}
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(text) => handleSetUpdate(currentExerciseIndex, setIndex, 'reps', text)}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navButton, { opacity: currentExerciseIndex === 0 ? 0.5 : 1 }]}
          disabled={currentExerciseIndex === 0}
          onPress={() => setCurrentExerciseIndex(currentExerciseIndex - 1)}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          <Text style={[styles.navButtonText, { color: colors.text }]}>السابق</Text>
        </TouchableOpacity>
        
        {currentExerciseIndex < exercises.length - 1 ? (
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
          >
            <Text style={[styles.navButtonText, { color: colors.text }]}>التالي</Text>
            <MaterialCommunityIcons name="arrow-right" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.finishButton, { backgroundColor: colors.tint }]}
            onPress={handleFinishWorkout}
          >
            <Text style={[styles.finishButtonText, { color: '#fff' }]}>إنهاء</Text>
          </TouchableOpacity>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  setContainer: {
    marginBottom: 30,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  setTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    padding: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 