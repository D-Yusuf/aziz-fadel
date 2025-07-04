import { useLocalSearchParams, Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import UserProgress from '@/components/admin/UserProgress';
import UserWorkouts from '@/components/admin/UserWorkouts';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type ViewType = 'progress' | 'workouts';

const UserDetailsScreen = () => {
  const { userId, userName } = useLocalSearchParams<{ userId: string; userName: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeView, setActiveView] = useState<ViewType>('progress');

  const SegmentedControl = () => (
    <View style={[styles.segmentedControl, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.segmentButton,
          activeView === 'progress' && { backgroundColor: colors.tint },
        ]}
        onPress={() => setActiveView('progress')}>
        <Text style={[styles.segmentText, activeView === 'progress' && { color: '#fff' }]}>
          التقدم
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.segmentButton,
          activeView === 'workouts' && { backgroundColor: colors.tint },
        ]}
        onPress={() => setActiveView('workouts')}>
        <Text style={[styles.segmentText, activeView === 'workouts' && { color: '#fff' }]}>
          التمارين
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: userName, headerBackTitle: 'رجوع' }} />
      <View style={styles.content}>
        <SegmentedControl />
        {activeView === 'progress' ? (
          <UserProgress />
        ) : (
          <UserWorkouts userId={userId} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  segmentedControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewContainer: {
    flex: 1,
  },
});

export default UserDetailsScreen; 