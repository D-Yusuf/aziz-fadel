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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { workoutData, WorkoutDay } from '@/constants/workoutData';

export default function WorkoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedWeek, setSelectedWeek] = useState(1);

  const handleWeekChange = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
  };

  const handleDayPress = (day: WorkoutDay) => {
    router.push({
      pathname: '/day-details',
      params: { 
        weekNumber: selectedWeek,
        dayId: day.id,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Week Selector */}
      <View style={styles.weekSelectorContainer}>
        <Text style={[styles.title, { color: colors.text }]}>برنامج التمارين</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorContent}>
          {workoutData.map((week) => (
            <TouchableOpacity
              key={week.weekNumber}
              style={[
                styles.selectorButton,
                selectedWeek === week.weekNumber && { backgroundColor: colors.tint }
              ]}
              onPress={() => handleWeekChange(week.weekNumber)}
            >
              <Text style={[
                styles.selectorButtonText,
                { color: selectedWeek === week.weekNumber ? '#fff' : colors.text }
              ]}>
                الأسبوع {week.weekNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView contentContainerStyle={styles.daysListContainer}>
        {workoutData[selectedWeek - 1].days.map((day) => (
          <TouchableOpacity 
            key={day.id} 
            style={[styles.dayCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleDayPress(day)}
          >
            <View style={styles.dayCardContent}>
                <View style={styles.dayInfo}>
                    <Text style={[styles.dayTitle, { color: colors.text }]}>{day.name}</Text>
                    <Text style={[styles.daySubtitle, { color: colors.text + '90' }]}>
                        {day.exercises.length} تمارين
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  weekSelectorContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectorContent: {
    paddingHorizontal: 10,
    gap: 10,
  },
  selectorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  daysListContainer: {
    padding: 20,
    gap: 15,
  },
  dayCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 20,
  },
  dayCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayInfo: {
    // No specific styles needed here
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  daySubtitle: {
    fontSize: 14,
    opacity: 0.8,
  }
}); 