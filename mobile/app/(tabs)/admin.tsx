import { Link } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import i18n from '@/localization';

interface User {
  id: string;
  name: string;
  avatar: string; // Adding avatar for better card design
}

// Dummy data for users
const dummyUsers: User[] = [
  { id: '1', name: 'علياء', avatar: 'face-woman' },
  { id: '2', name: 'محمد', avatar: 'account' },
  { id: '3', name: 'فاطمة', avatar: 'face-woman-outline' },
  { id: '4', name: 'يوسف', avatar: 'account-outline' },
  { id: '5', name: 'أحمد', avatar: 'account-tie' },
];

const AdminScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const tabBarHeight = useBottomTabBarHeight();

  const filteredUsers = useMemo(
    () =>
      dummyUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const renderUser = ({ item }: { item: User }) => (
    <Link href={{ pathname: '/user-details', params: { userId: item.id, userName: item.name } }} asChild>
      <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
        <MaterialCommunityIcons name={item.avatar as any} size={40} color={colors.tint} />
        <View style={styles.cardText}>
          <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.userAction, { color: colors.text + '90' }]}>{i18n.t('viewDetails')}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text + '90'} />
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight }]}
        ListHeaderComponent={
          <>
            <Text style={[styles.header, { color: colors.text }]}>{i18n.t('appUsers')}</Text>
            <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons
                name="magnify"
                size={22}
                color={colors.text + '80'}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={i18n.t('searchUser')}
                placeholderTextColor={colors.text + '80'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    textAlign: 'right',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    flex: 1,
    marginHorizontal: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
  },
  userAction: {
    fontSize: 14,
    marginTop: 2,
    textAlign: 'right',
  },
});

export default AdminScreen; 