import UserProgress from '@/components/admin/UserProgress';
import React from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function ProgressScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  return <UserProgress bottomPadding={tabBarHeight} />;
}