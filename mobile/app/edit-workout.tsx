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
import { Exercise, workoutData } from '@/constants/workoutData';

/*
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
}
*/

const exerciseDatabase = [
  'ضغط البنش',
  'الضغط العسكري',
  'البار المائل',
  'الترايسبس',
  'البايسبس',
  'الكتف',
  'الظهر',
  'الساقين',
  'البطن',
  'الجلوس',
  'البار المائل',
  'الضغط العادي',
];

export default function EditWorkoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  const dayId = params.dayId as string;
  const dayName = params.dayName as string;
  const currentExercise: Exercise = JSON.parse(params.exercise as string);

  const allExercises = workoutData
    .flatMap(week => week.days)
    .flatMap(day => day.exercises)
    .filter((value, index, self) => self.findIndex(t => t.id === value.id) === index)
    .filter(ex => ex.id !== currentExercise.id);
  
  const [searchText, setSearchText] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(allExercises);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = allExercises.filter(ex => 
        ex.name.toLowerCase().includes(text.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(allExercises);
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    // Here you would typically update the state in your main workout screen
    // For now, we just go back
    console.log('Selected new exercise:', exercise);
    router.back();
  };

  const handleAddExercise = () => {
    // This is a placeholder for adding a new exercise from a list
    // For now, it adds a pre-defined exercise
    const newExercise: Exercise = {
      id: `new-${Date.now()}`,
      name: 'New Custom Exercise',
      muscle: 'Custom',
      sets: 3,
      reps: '10',
      rest: '60s'
    };
    setFilteredExercises([...filteredExercises, newExercise]);
  };

  const handleRemoveExercise = (id: string) => {
    Alert.alert(
      'حذف التمرين',
      'هل أنت متأكد من أنك تريد حذف هذا التمرين؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => setFilteredExercises(filteredExercises.filter(ex => ex.id !== id)),
        },
      ]
    );
  };

  const handleUpdateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setFilteredExercises(filteredExercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSave = () => {
    // Here you would save the updated exercises to your backend
    Alert.alert('تم الحفظ', 'تم حفظ التمارين بنجاح', [
      { text: 'حسناً', onPress: () => router.back() }
    ]);
  };

  const renderExerciseCard = (exercise: Exercise) => (
    <TouchableOpacity key={exercise.id} style={[styles.exerciseCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => handleSelectExercise(exercise)}>
      <MaterialCommunityIcons name="dumbbell" size={30} color={colors.text} style={styles.exerciseIcon} />
      <View style={styles.exerciseDetails}>
        <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
        <Text style={[styles.exerciseMuscle, { color: colors.text + '90' }]}>{exercise.muscle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={colors.tint} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Change Exercise</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Search for an exercise"
          placeholderTextColor={colors.text + '80'}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      
      <ScrollView contentContainerStyle={styles.listContainer}>
        <Text style={[styles.subHeader, { color: colors.text }]}>Alternatives for {currentExercise.name}</Text>
        {filteredExercises.map(renderExerciseCard)}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.tint }]}
        onPress={handleAddExercise}
      >
        <Text style={[styles.addButtonText, { color: '#fff' }]}>إضافة تمرين جديد</Text>
      </TouchableOpacity>

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
  searchContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
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
  addButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 