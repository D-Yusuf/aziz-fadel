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
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface DailyMetrics {
  water: string;
  weight: string;
  sleepQuality: string;
  calories: string;
  steps: string;
}

interface BodyMeasurements {
  chest: string;
  legs: string;
  hips: string;
}

const generateWeekData = () => {
  const weeks = [];
  for (let week = 1; week <= 12; week++) {
    const weekData = {
      weekNumber: week,
      days: [
        { id: `week${week}-day1`, name: 'اليوم الأول' },
        { id: `week${week}-day2`, name: 'اليوم الثاني' },
        { id: `week${week}-day3`, name: 'اليوم الثالث' },
        { id: `week${week}-day4`, name: 'اليوم الرابع' },
        { id: `week${week}-day5`, name: 'اليوم الخامس' },
        { id: `week${week}-day6`, name: 'اليوم السادس' },
        { id: `week${week}-day7`, name: 'اليوم السابع' },
      ],
    };
    weeks.push(weekData);
  }
  return weeks;
};

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics>({
    water: '',
    weight: '',
    sleepQuality: '',
    calories: '',
    steps: '',
  });
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements>({
    chest: '',
    legs: '',
    hips: '',
  });
  const weekData = generateWeekData();

  const handleWeekChange = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
    setSelectedDay(null);
  };

  const handleDaySelect = (dayId: string) => {
    setSelectedDay(dayId);
  };

  const handleSaveDailyMetrics = () => {
    // Here you would save the data to your backend
    Alert.alert('تم الحفظ', 'تم حفظ البيانات اليومية بنجاح');
  };

  const handleSaveBodyMeasurements = () => {
    // Here you would save the data to your backend
    Alert.alert('تم الحفظ', 'تم حفظ قياسات الجسم بنجاح');
  };

  const renderDailyMetricsForm = () => (
    <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.formTitle, { color: colors.text }]}>إدخال البيانات اليومية</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>الماء (لتر)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={dailyMetrics.water}
          onChangeText={(text) => setDailyMetrics({ ...dailyMetrics, water: text })}
          placeholder="أدخل كمية الماء"
          placeholderTextColor={colors.text + '80'}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>الوزن (كجم)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={dailyMetrics.weight}
          onChangeText={(text) => setDailyMetrics({ ...dailyMetrics, weight: text })}
          placeholder="أدخل الوزن"
          placeholderTextColor={colors.text + '80'}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>جودة النوم (1-10)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={dailyMetrics.sleepQuality}
          onChangeText={(text) => setDailyMetrics({ ...dailyMetrics, sleepQuality: text })}
          placeholder="أدخل جودة النوم"
          placeholderTextColor={colors.text + '80'}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>السعرات الحرارية</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={dailyMetrics.calories}
          onChangeText={(text) => setDailyMetrics({ ...dailyMetrics, calories: text })}
          placeholder="أدخل السعرات الحرارية"
          placeholderTextColor={colors.text + '80'}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>الخطوات</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={dailyMetrics.steps}
          onChangeText={(text) => setDailyMetrics({ ...dailyMetrics, steps: text })}
          placeholder="أدخل عدد الخطوات"
          placeholderTextColor={colors.text + '80'}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.tint }]}
        onPress={handleSaveDailyMetrics}
      >
        <Text style={[styles.saveButtonText, { color: '#fff' }]}>حفظ البيانات</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBodyMeasurementsForm = () => (
    <View style={[styles.formContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.formTitle, { color: colors.text }]}>قياسات الجسم الأسبوعية</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>الصدر (سم)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={bodyMeasurements.chest}
          onChangeText={(text) => setBodyMeasurements({ ...bodyMeasurements, chest: text })}
          placeholder="أدخل قياس الصدر"
          placeholderTextColor={colors.text + '80'}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>الأرجل (سم)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={bodyMeasurements.legs}
          onChangeText={(text) => setBodyMeasurements({ ...bodyMeasurements, legs: text })}
          placeholder="أدخل قياس الأرجل"
          placeholderTextColor={colors.text + '80'}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>الأرداف (سم)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={bodyMeasurements.hips}
          onChangeText={(text) => setBodyMeasurements({ ...bodyMeasurements, hips: text })}
          placeholder="أدخل قياس الأرداف"
          placeholderTextColor={colors.text + '80'}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.tint }]}
        onPress={handleSaveBodyMeasurements}
      >
        <Text style={[styles.saveButtonText, { color: '#fff' }]}>حفظ القياسات</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>تتبع التقدم</Text>
      </View>

      {/* Week Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.weekSelector}
        contentContainerStyle={styles.weekSelectorContent}
      >
        {weekData.map((week) => (
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

      <ScrollView style={styles.content}>
        {/* Day Selector */}
        <View style={styles.daysContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>اختر اليوم:</Text>
          <View style={styles.daysGrid}>
            {weekData[selectedWeek - 1]?.days.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedDay === day.id && { backgroundColor: colors.tint }
                ]}
                onPress={() => handleDaySelect(day.id)}
              >
                <Text style={[
                  styles.dayButtonText,
                  { color: selectedDay === day.id ? '#fff' : colors.text }
                ]}>
                  {day.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Forms */}
        {selectedDay && renderDailyMetricsForm()}
        
        {/* Body Measurements Form - Always visible for end of week */}
        <View style={styles.bodyMeasurementsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>قياسات الجسم (نهاية الأسبوع)</Text>
          {renderBodyMeasurementsForm()}
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
  content: {
    flex: 1,
    padding: 20,
  },
  daysContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  dayButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    padding: 20,
    borderRadius: 15,
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
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bodyMeasurementsSection: {
    marginTop: 20,
  },
}); 