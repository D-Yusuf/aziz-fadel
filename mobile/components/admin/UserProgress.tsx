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
  TextInputProps,
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
    { key: 'steps', label: 'الخطوات', icon: 'walk' },
    { key: 'sleep', label: 'النوم (ساعة)', icon: 'sleep' },
    { key: 'water', label: 'المياه (لتر)', icon: 'cup-water' },
];

const bodyMeasurementLabels: { key: keyof BodyMeasurements; label: string }[] = [
    { key: 'chest', label: 'الصدر' },
    { key: 'waist', label: 'الخصر' },
    { key: 'hips', label: 'المؤخرة' },
    { key: 'thighs', label: 'الأفخاذ' },
];

const CustomInput = (props: TextInputProps) => (
  <TextInput
    {...props}
    style={[styles.input, props.style]}
    placeholderTextColor={props.placeholderTextColor || '#999'}
  />
);

const MeasurementInput = ({
  label,
  value,
  onChangeText,
  color,
  borderColor,
  backgroundColor,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  color: string;
  borderColor: string;
  backgroundColor: string;
}) => (
  <View style={styles.measurementInputContainer}>
    <Text style={[styles.measurementLabel, { color }]}>{label}</Text>
    <CustomInput
      style={{ color, borderColor, backgroundColor }}
      value={value}
      onChangeText={onChangeText}
      placeholder="0.0"
      keyboardType="numeric"
    />
  </View>
);

export default function UserProgress({ bottomPadding = 0 }: { bottomPadding?: number }) {
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
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPadding }}>
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
                      <MaterialCommunityIcons name={icon} size={20} color={colors.text} style={styles.icon} />
                      <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
                      <CustomInput
                        style={{ color: colors.text, borderColor: colors.border, backgroundColor: colors.background }}
                        value={currentWeekData.dailyMetrics[dayIndex][key]}
                        onChangeText={(text) => handleMetricChange(dayIndex, key, text)}
                        placeholder="0"
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
              <MeasurementInput
                key={key}
                label={label}
                value={currentWeekData.bodyMeasurements[key]}
                onChangeText={(text) => handleBodyMeasurementChange(key, text)}
                color={colors.text}
                borderColor={colors.border}
                backgroundColor={colors.background}
              />
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>هل حدث أي شيء غير معتاد في أسبوعك؟</Text>
          <CustomInput
            style={[styles.notesInput, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
            value={currentWeekData.notes}
            onChangeText={handleNotesChange}
            placeholder="اكتب ملاحظاتك هنا..."
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
    marginVertical: 15,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  dayCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 1,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  dayDetails: {
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  inputLabel: {
    flex: 1,
    fontSize: 14,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  measurementInputContainer: {
    width: '48%',
    marginBottom: 15,
  },
  measurementLabel: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  saveButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 