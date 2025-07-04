import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  LayoutAnimation,
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WorkoutDay, Exercise } from '@/constants/workoutData';
import YoutubePlayer from 'react-native-youtube-iframe';
import i18n from '@/localization';

interface SetData {
  id: string;
  weight: string;
  reps: string;
  completed: boolean;
}

interface ActiveExercise extends Exercise {
  setsData: SetData[];
  notes?: string;
}

const Stopwatch = ({ isRunning, color }: { isRunning: boolean; color: string }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return <Text style={[styles.stopwatchText, { color }]}>{formatTime(time)}</Text>;
};

export default function ActiveWorkoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  const day: WorkoutDay = JSON.parse(params.day as string);

  const [exercises, setExercises] = useState<ActiveExercise[]>(() =>
    day.exercises.map((ex) => ({
      ...ex,
      setsData: Array.from({ length: ex.sets }, (_, i) => ({
        id: `${ex.id}-set-${i}`,
        weight: '',
        reps: '',
        completed: false,
      })),
    }))
  );

  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  const [stopwatchRunning, setStopwatchRunning] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const toggleExercise = (exerciseId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const isExpanded = expandedExercises.includes(exerciseId);
    if (isExpanded) {
        setExpandedExercises(expandedExercises.filter(id => id !== exerciseId));
    } else {
        setExpandedExercises([...expandedExercises, exerciseId]);
    }
  };

  const openVideoModal = (videoId: string) => {
    setCurrentVideoId(videoId);
    setVideoModalVisible(true);
  };

  const handleAddSet = (exIndex: number) => {
    const newExercises = [...exercises];
    const newSet: SetData = {
      id: `${newExercises[exIndex].id}-set-${newExercises[exIndex].setsData.length}`,
      weight: '',
      reps: '',
      completed: false,
    };
    newExercises[exIndex].setsData.push(newSet);
    setExercises(newExercises);
  };

  const handleSetUpdate = (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const newExercises = [...exercises];
    newExercises[exIndex].setsData[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleNotesChange = (exIndex: number, text: string) => {
    const newExercises = [...exercises];
    newExercises[exIndex].notes = text;
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
            // Calculate workout summary data
            const workoutSummary = {
              day: day.name,
              exercises: exercises.map(ex => ({
                name: ex.name,
                sets: ex.setsData.filter(set => set.weight && set.reps).length,
                totalVolume: ex.setsData.reduce((total, set) => {
                  if (set.weight && set.reps) {
                    return total + (parseFloat(set.weight) * parseFloat(set.reps));
                  }
                  return total;
                }, 0),
                heaviestSet: ex.setsData.reduce((heaviest, set) => {
                  const weight = parseFloat(set.weight) || 0;
                  return weight > heaviest ? weight : heaviest;
                }, 0),
                notes: ex.notes || ''
              })),
              // Calculate total workout time (dummy for now)
              duration: Math.floor(Math.random() * 30) + 45, // 45-75 minutes
              // Dummy improvement percentages
              improvements: {
                volume: Math.floor(Math.random() * 20) + 5, // 5-25% improvement
                strength: Math.floor(Math.random() * 15) + 3, // 3-18% improvement
                endurance: Math.floor(Math.random() * 12) + 2, // 2-14% improvement
              }
            };

            router.push({
              pathname: '/workout-summary',
              params: { summary: JSON.stringify(workoutSummary) },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="window-close" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.stopwatchContainer}>
          <Stopwatch isRunning={stopwatchRunning} color={colors.text} />
          <TouchableOpacity onPress={() => setStopwatchRunning(!stopwatchRunning)}>
            <MaterialCommunityIcons name={stopwatchRunning ? 'pause-circle' : 'play-circle'} size={32} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={handleFinishWorkout}>
           <Text style={[styles.finishButtonText, { color: colors.tint }]}>{i18n.t('finish')}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={videoModalVisible}
        onRequestClose={() => {
          setVideoModalVisible(!videoModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setVideoModalVisible(false)}>
                <MaterialCommunityIcons name="close-circle" size={30} color={colors.text} />
            </TouchableOpacity>
            {currentVideoId && (
              <YoutubePlayer
                height={220}
                play={true}
                videoId={currentVideoId}
              />
            )}
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        {exercises.map((exercise, exIndex) => (
          <View key={exercise.id} style={[styles.exerciseContainer, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.exerciseHeader} onPress={() => toggleExercise(exercise.id)}>
              <Text style={[styles.exerciseTitle, { color: colors.text }]}>{exercise.name}</Text>
              <MaterialCommunityIcons name={expandedExercises.includes(exercise.id) ? 'chevron-up' : 'chevron-down'} size={24} color={colors.text} />
            </TouchableOpacity>

            {expandedExercises.includes(exercise.id) && (
              <View style={styles.setsContainer}>
                {/* Notes Section */}
                <View style={[styles.notesContainer, { 
                  backgroundColor: colorScheme === 'dark' ? '#3a3a00' : '#fff9c4',
                  borderColor: colorScheme === 'dark' ? '#555500' : '#f0d000'
                }]}>
                  <MaterialCommunityIcons 
                    name="note-text-outline" 
                    size={16} 
                    color={colors.text} 
                    style={styles.noteIcon} 
                  />
                  <TextInput
                    style={[styles.notesInput, { color: colors.text }]}
                    placeholder={i18n.t('addNote')}
                    placeholderTextColor={colorScheme === 'dark' ? '#cccc88' : '#8b8000'}
                    value={exercise.notes || ''}
                    onChangeText={(text) => handleNotesChange(exIndex, text)}
                    multiline={true}
                    textAlignVertical="top"
                    numberOfLines={2}
                  />
                </View>

                {exercise.setsData.map((set, setIndex) => (
                  <View key={set.id} style={styles.setRow}>
                    <Text style={[styles.setTitle, { color: colors.text }]}>{i18n.t('set')} {setIndex + 1}</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                      placeholder={i18n.t('weight')}
                      placeholderTextColor={colors.text + '80'}
                      keyboardType="numeric"
                      value={set.weight}
                      onChangeText={(text) => handleSetUpdate(exIndex, setIndex, 'weight', text)}
                    />
                    <TextInput
                      style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                      placeholder={i18n.t('repetitions')}
                      placeholderTextColor={colors.text + '80'}
                      keyboardType="numeric"
                      value={set.reps}
                      onChangeText={(text) => handleSetUpdate(exIndex, setIndex, 'reps', text)}
                    />
                  </View>
                ))}
                <TouchableOpacity style={styles.addSetButton} onPress={() => handleAddSet(exIndex)}>
                  <Text style={[styles.addSetButtonText, { color: colors.tint }]}>{i18n.t('addSet')}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.watchVideoButton, { backgroundColor: colors.card, borderColor: colors.tint }]} 
                  onPress={() => exercise.videoId && openVideoModal(exercise.videoId)}
                >
                  <MaterialCommunityIcons name="play-circle-outline" size={22} color={colors.tint} />
                  <Text style={[styles.watchVideoButtonText, { color: colors.tint }]}>{i18n.t('watchVideo')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    padding: 5,
  },
  stopwatchContainer: {
    alignItems: 'center',
  },
  stopwatchText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    padding: 15,
  },
  exerciseContainer: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  videoContainer: {
    marginBottom: 15,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  segmentButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: '#555',
    borderRadius: 8,
  },
  segmentText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  setsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  setTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    width: '35%',
    textAlign: 'center',
  },
  addSetButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  addSetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeButton: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  watchVideoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
  },
  watchVideoButtonText: {
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  notesInput: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
    minHeight: 24,
  },
}); 