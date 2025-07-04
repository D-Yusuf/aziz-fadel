import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface WorkoutSummary {
  day: string;
  exercises: {
    name: string;
    sets: number;
    totalVolume: number;
    heaviestSet: number;
    notes: string;
  }[];
  duration: number;
  improvements: {
    volume: number;
    strength: number;
    endurance: number;
  };
}

export default function WorkoutSummaryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  
  const summary: WorkoutSummary = JSON.parse(params.summary as string);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}س ${mins}د` : `${mins}د`;
  };

  const totalVolume = summary.exercises.reduce((total, ex) => total + ex.totalVolume, 0);
  const totalSets = summary.exercises.reduce((total, ex) => total + ex.sets, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>ملخص التمرين</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Celebration */}
        <View style={styles.celebrationSection}>
          <MaterialCommunityIcons name="trophy" size={60} color="#FFD700" />
          <Text style={[styles.celebrationText, { color: colors.text }]}>أحسنت!</Text>
          <Text style={[styles.workoutName, { color: colors.text }]}>{summary.day}</Text>
        </View>

        {/* Overview Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint }]}>نظرة عامة</Text>
          
          <View style={styles.overviewGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="clock-outline" size={32} color={colors.tint} />
              <Text style={[styles.statValue, { color: colors.text }]}>{formatTime(summary.duration)}</Text>
              <Text style={[styles.statLabel, { color: colors.text + '80' }]}>مدة التمرين</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="format-list-numbered" size={32} color={colors.tint} />
              <Text style={[styles.statValue, { color: colors.text }]}>{totalSets}</Text>
              <Text style={[styles.statLabel, { color: colors.text + '80' }]}>إجمالي المجموعات</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="weight-lifter" size={32} color={colors.tint} />
              <Text style={[styles.statValue, { color: colors.text }]}>{Math.round(totalVolume)}kg</Text>
              <Text style={[styles.statLabel, { color: colors.text + '80' }]}>إجمالي الحجم</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="dumbbell" size={32} color={colors.tint} />
              <Text style={[styles.statValue, { color: colors.text }]}>{summary.exercises.length}</Text>
              <Text style={[styles.statLabel, { color: colors.text + '80' }]}>التمارين</Text>
            </View>
          </View>
        </View>

        {/* Improvements */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint }]}>التحسن من الأسبوع الماضي</Text>
          
          <View style={styles.improvementRow}>
            <View style={[styles.improvementCard, { borderColor: '#4CAF50' }]}>
              <MaterialCommunityIcons name="trending-up" size={24} color="#4CAF50" />
              <Text style={[styles.improvementValue, { color: '#4CAF50' }]}>+{summary.improvements.volume}%</Text>
              <Text style={[styles.improvementLabel, { color: colors.text }]}>الحجم</Text>
            </View>
            
            <View style={[styles.improvementCard, { borderColor: '#2196F3' }]}>
              <MaterialCommunityIcons name="arm-flex" size={24} color="#2196F3" />
              <Text style={[styles.improvementValue, { color: '#2196F3' }]}>+{summary.improvements.strength}%</Text>
              <Text style={[styles.improvementLabel, { color: colors.text }]}>القوة</Text>
            </View>
            
            <View style={[styles.improvementCard, { borderColor: '#FF9800' }]}>
              <MaterialCommunityIcons name="heart-pulse" size={24} color="#FF9800" />
              <Text style={[styles.improvementValue, { color: '#FF9800' }]}>+{summary.improvements.endurance}%</Text>
              <Text style={[styles.improvementLabel, { color: colors.text }]}>التحمل</Text>
            </View>
          </View>
        </View>

        {/* Exercise Details */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint }]}>تفاصيل التمارين</Text>
          
          {summary.exercises.map((exercise, index) => (
            <View key={index} style={[styles.exerciseCard, { borderColor: colors.border }]}>
              <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
              
              <View style={styles.exerciseStats}>
                <View style={styles.exerciseStat}>
                  <Text style={[styles.exerciseStatValue, { color: colors.text }]}>{exercise.sets}</Text>
                  <Text style={[styles.exerciseStatLabel, { color: colors.text + '80' }]}>مجموعات</Text>
                </View>
                
                <View style={styles.exerciseStat}>
                  <Text style={[styles.exerciseStatValue, { color: colors.text }]}>{exercise.heaviestSet}kg</Text>
                  <Text style={[styles.exerciseStatLabel, { color: colors.text + '80' }]}>أثقل وزن</Text>
                </View>
                
                <View style={styles.exerciseStat}>
                  <Text style={[styles.exerciseStatValue, { color: colors.text }]}>{Math.round(exercise.totalVolume)}kg</Text>
                  <Text style={[styles.exerciseStatLabel, { color: colors.text + '80' }]}>الحجم</Text>
                </View>
              </View>
              
              {exercise.notes && (
                <View style={[styles.notesSection, { backgroundColor: colors.background }]}>
                  <MaterialCommunityIcons name="note-text-outline" size={16} color={colors.text} />
                  <Text style={[styles.notesText, { color: colors.text }]}>{exercise.notes}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.tint }]}
            onPress={() => {
              // TODO: Share workout functionality
              console.log('Share workout');
            }}
          >
            <MaterialCommunityIcons name="share-variant" size={20} color={colors.tint} />
            <Text style={[styles.actionButtonText, { color: colors.tint }]}>مشاركة</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/(tabs)/workout')}
          >
            <MaterialCommunityIcons name="home" size={20} color="#fff" />
            <Text style={[styles.actionButtonText, { color: '#fff' }]}>العودة للرئيسية</Text>
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  celebrationSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  celebrationText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  workoutName: {
    fontSize: 18,
    marginTop: 5,
    opacity: 0.8,
  },
  statsContainer: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  improvementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  improvementCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 5,
  },
  improvementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  improvementLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  exerciseCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  exerciseStat: {
    alignItems: 'center',
  },
  exerciseStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  notesSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  notesText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  primaryButton: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 