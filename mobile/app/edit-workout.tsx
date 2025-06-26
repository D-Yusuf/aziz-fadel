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
}

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

  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'ضغط البنش', sets: 3, reps: '8-12' },
    { id: '2', name: 'الضغط العسكري', sets: 3, reps: '8-12' },
    { id: '3', name: 'البار المائل', sets: 3, reps: '8-12' },
    { id: '4', name: 'الترايسبس', sets: 3, reps: '10-15' },
  ]);

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: 'تمرين جديد',
      sets: 3,
      reps: '8-12',
    };
    setExercises([...exercises, newExercise]);
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
          onPress: () => setExercises(exercises.filter(ex => ex.id !== id)),
        },
      ]
    );
  };

  const handleUpdateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSave = () => {
    // Here you would save the updated exercises to your backend
    Alert.alert('تم الحفظ', 'تم حفظ التمارين بنجاح', [
      { text: 'حسناً', onPress: () => router.back() }
    ]);
  };

  const renderExerciseItem = (exercise: Exercise) => (
    <View key={exercise.id} style={[styles.exerciseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.exerciseHeader}>
        <Text style={[styles.exerciseTitle, { color: colors.text }]}>التمرين {exercise.id}</Text>
        <TouchableOpacity
          style={[styles.removeButton, { backgroundColor: '#ff4444' }]}
          onPress={() => handleRemoveExercise(exercise.id)}
        >
          <Text style={[styles.removeButtonText, { color: '#fff' }]}>حذف</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>اسم التمرين</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={exercise.name}
          onChangeText={(text) => handleUpdateExercise(exercise.id, 'name', text)}
          placeholder="أدخل اسم التمرين"
          placeholderTextColor={colors.text + '80'}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>عدد المجموعات</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            value={exercise.sets.toString()}
            onChangeText={(text) => handleUpdateExercise(exercise.id, 'sets', parseInt(text) || 0)}
            placeholder="3"
            placeholderTextColor={colors.text + '80'}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>عدد التكرارات</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            value={exercise.reps}
            onChangeText={(text) => handleUpdateExercise(exercise.id, 'reps', text)}
            placeholder="8-12"
            placeholderTextColor={colors.text + '80'}
          />
        </View>
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
        <Text style={[styles.title, { color: colors.text }]}>تعديل التمارين</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.dayInfo}>
        <Text style={[styles.dayName, { color: colors.text }]}>{dayName}</Text>
      </View>

      <ScrollView style={styles.content}>
        {exercises.map(renderExerciseItem)}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddExercise}
        >
          <Text style={[styles.addButtonText, { color: '#fff' }]}>+ إضافة تمرين جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: '#fff' }]}>حفظ التغييرات</Text>
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
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  addButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 