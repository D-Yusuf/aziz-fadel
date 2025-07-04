import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Workout {
  id: string;
  day: string;
  name: string;
  isCompleted: boolean;
}

const dummyWorkouts: Workout[] = [
  { id: '1', day: 'الأحد', name: 'تمارين القوة (صدر، كتف، تريسيبس)', isCompleted: true },
  { id: '2', day: 'الإثنين', name: 'كارديو ومقاومة', isCompleted: true },
  { id: '3', day: 'الثلاثاء', name: 'تمارين القوة (ظهر، بايسبس)', isCompleted: false },
  { id: '4', day: 'الأربعاء', name: 'راحة', isCompleted: false },
  { id: '5', day: 'الخميس', name: 'تمارين القوة (أرجل)', isCompleted: false },
  { id: '6', day: 'الجمعة', name: 'كارديو ومقاومة', isCompleted: false },
  { id: '7', day: 'السبت', name: 'راحة', isCompleted: false },
];

export default function UserWorkouts({ userId }: { userId: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderWorkout = ({ item }: { item: Workout }) => (
    <View style={[styles.workoutContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.workoutInfo}>
        <Text style={[styles.dayText, { color: colors.text }]}>{item.day}</Text>
        <Text style={[styles.workoutName, { color: colors.text }]}>{item.name}</Text>
      </View>
      <View style={styles.workoutActions}>
        {item.isCompleted && (
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.tint} />
        )}
        <Link href={{ pathname: '/edit-workout', params: { userId, workoutId: item.id } }} asChild>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="pencil-circle" size={28} color={colors.tint} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );

  return (
    <FlatList
      data={dummyWorkouts}
      renderItem={renderWorkout}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={<Text style={[styles.header, { color: colors.text }]}>خطة التمارين</Text>}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  workoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  workoutInfo: {
    flex: 1,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutName: {
    fontSize: 16,
    marginTop: 5,
  },
  workoutActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  editButton: {
    // Style for the edit button if needed
  },
}); 