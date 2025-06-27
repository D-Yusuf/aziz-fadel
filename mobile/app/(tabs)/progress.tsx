import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Data structures based on the Google Sheet
interface DailyMetrics {
  weight: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  steps: string;
  cardio: string;
  sleep: string;
  water: string;
}

interface BodyMeasurements {
  chest: string;
  waist: string;
  hips: string;
  thighs: string;
}

interface WeeklyProgress {
  weekNumber: number;
  dailyMetrics: DailyMetrics[];
  bodyMeasurements: BodyMeasurements;
  notes: string;
}

// Initial empty data for 12 weeks
const generateInitialProgressData = (): WeeklyProgress[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    weekNumber: i + 1,
    dailyMetrics: Array(7).fill({
      weight: '', calories: '', protein: '', carbs: '',
      fat: '', steps: '', cardio: '', sleep: '', water: '',
    }),
    bodyMeasurements: { chest: '', waist: '', hips: '', thighs: '' },
    notes: '',
  }));
};

const metricLabels: { key: keyof DailyMetrics; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { key: 'weight', label: 'الوزن (كجم)', icon: 'weight-kilogram' },
    { key: 'calories', label: 'السعرات', icon: 'fire' },
    { key: 'protein', label: 'البروتين (جم)', icon: 'food-drumstick' },
    { key: 'carbs', label: 'الكارب (جم)', icon: 'barley' },
    { key: 'fat', label: 'الدهون (جم)', icon: 'oil' },
    { key: 'steps', label: 'الخطوات', icon: 'walk' },
    { key: 'cardio', label: 'الكارديو (دقيقة)', icon: 'heart-pulse' },
    { key: 'sleep', label: 'النوم (ساعة)', icon: 'sleep' },
    { key: 'water', label: 'المياه (لتر)', icon: 'cup-water' },
];

const bodyMeasurementLabels: { key: keyof BodyMeasurements; label: string }[] = [
    { key: 'chest', label: 'الصدر' },
    { key: 'waist', label: 'الخصر' },
    { key: 'hips', label: 'المؤخرة' },
    { key: 'thighs', label: 'الأفخاذ' },
];


export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [progressData, setProgressData] = useState(generateInitialProgressData());
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const handleWeekChange = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
    setExpandedDay(null); // Collapse days when week changes
  };

  const toggleDayExpansion = (dayIndex: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };
  
  const handleMetricChange = (dayIndex: number, key: keyof DailyMetrics, value: string) => {
    const newData = [...progressData];
    const newMetrics = [...newData[selectedWeek-1].dailyMetrics];
    newMetrics[dayIndex] = { ...newMetrics[dayIndex], [key]: value };
    newData[selectedWeek-1].dailyMetrics = newMetrics;
    setProgressData(newData);
  };

  const handleBodyMeasurementChange = (key: keyof BodyMeasurements, value: string) => {
    const newData = [...progressData];
    newData[selectedWeek-1].bodyMeasurements[key] = value;
    setProgressData(newData);
  };
  
  const handleNotesChange = (value: string) => {
    const newData = [...progressData];
    newData[selectedWeek-1].notes = value;
    setProgressData(newData);
  };

  const currentWeekData = progressData[selectedWeek - 1];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        {/* Week Selector */}
        <View style={styles.weekSelectorContainer}>
          <Text style={[styles.title, { color: colors.text }]}>متابعة التقدم</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorContent}>
            {progressData.map((week) => (
              <TouchableOpacity
                key={week.weekNumber}
                style={[styles.selectorButton, selectedWeek === week.weekNumber && { backgroundColor: colors.tint }]}
                onPress={() => handleWeekChange(week.weekNumber)}
              >
                <Text style={[styles.selectorButtonText, { color: selectedWeek === week.weekNumber ? '#fff' : colors.text }]}>
                  الأسبوع {week.weekNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Daily Metrics */}
        <View style={styles.section}>
          {currentWeekData.dailyMetrics.map((day, dayIndex) => (
            <View key={dayIndex}>
              <TouchableOpacity
                style={[styles.dayCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => toggleDayExpansion(dayIndex)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayTitle, { color: colors.text }]}>يوم {dayIndex + 1}</Text>
                <MaterialCommunityIcons 
                  name={expandedDay === dayIndex ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={colors.text} 
                />
              </TouchableOpacity>
              {expandedDay === dayIndex && (
                <View style={[styles.dayDetails, { backgroundColor: colors.card + '80' }]}>
                  {metricLabels.map(({ key, label, icon }) => (
                    <View key={key} style={styles.inputRow}>
                       <MaterialCommunityIcons name={icon} size={20} color={colors.text} style={styles.icon}/>
                       <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
                       <TextInput
                         style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                         value={currentWeekData.dailyMetrics[dayIndex][key]}
                         onChangeText={(text) => handleMetricChange(dayIndex, key, text)}
                         placeholder="0"
                         placeholderTextColor={colors.text + '80'}
                         keyboardType="numeric"
                       />
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Body Measurements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>قياسات الجسم (سم)</Text>
          <View style={[styles.grid, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {bodyMeasurementLabels.map(({ key, label }) => (
              <View key={key} style={styles.gridItem}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  value={currentWeekData.bodyMeasurements[key]}
                  onChangeText={(text) => handleBodyMeasurementChange(key, text)}
                  placeholder="0.0"
                  placeholderTextColor={colors.text + '80'}
                  keyboardType="numeric"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>هل حدث أي شيء غير معتاد في أسبوعك؟</Text>
          <TextInput
            style={[styles.notesInput, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
            value={currentWeekData.notes}
            onChangeText={handleNotesChange}
            placeholder="اكتب ملاحظاتك هنا..."
            placeholderTextColor={colors.text + '80'}
            multiline
          />
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.tint }]}>
          <Text style={styles.saveButtonText}>حفظ التقدم</Text>
        </TouchableOpacity>
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
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'right',
  },
  dayCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayDetails: {
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  inputLabel: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right'
  },
  input: {
    width: 80,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  grid: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  notesInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    textAlign: 'right',
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
}); 