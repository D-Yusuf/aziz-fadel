import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import i18n from '@/localization';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'button' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const tabBarHeight = useBottomTabBarHeight();

  const handleLanguageChange = async (lang: 'en' | 'ar') => {
    i18n.locale = lang;
    const isRTL = lang === 'ar';
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);
    await Updates.reloadAsync();
  };

  const handleExportData = () => {
    Alert.alert(i18n.t('exportDataAlert'), i18n.t('exportDataMessage'));
  };

  const handleBackupData = () => {
    Alert.alert(i18n.t('backupAlert'), i18n.t('backupMessage'));
  };

  const handleClearData = () => {
    Alert.alert(
      i18n.t('clearDataAlert'),
      i18n.t('clearDataMessage'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('clear'), style: 'destructive', onPress: () => Alert.alert(i18n.t('dataCleared'), i18n.t('dataClearedMessage')) },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(i18n.t('aboutAlert'), i18n.t('aboutMessage'));
  };

  const settingsData: SettingItem[] = [
    {
      id: 'notifications',
      title: i18n.t('notifications'),
      subtitle: i18n.t('notificationsSubtitle'),
      type: 'toggle',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: 'darkMode',
      title: i18n.t('darkMode'),
      subtitle: i18n.t('darkModeSubtitle'),
      type: 'toggle',
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      id: 'sound',
      title: i18n.t('sounds'),
      subtitle: i18n.t('soundsSubtitle'),
      type: 'toggle',
      value: soundEnabled,
      onToggle: setSoundEnabled,
    },
    {
      id: 'autoSave',
      title: i18n.t('autoSave'),
      subtitle: i18n.t('autoSaveSubtitle'),
      type: 'toggle',
      value: autoSave,
      onToggle: setAutoSave,
    },
    {
      id: 'language',
      title: i18n.t('language'),
      type: 'button',
      onPress: () => {
        Alert.alert(
          i18n.t('language'),
          '',
          [
            { text: i18n.t('english'), onPress: () => handleLanguageChange('en') },
            { text: i18n.t('arabic'), onPress: () => handleLanguageChange('ar') },
            { text: i18n.t('cancel'), style: 'cancel' },
          ],
          { cancelable: true }
        );
      },
    },
    {
      id: 'export',
      title: i18n.t('exportData'),
      subtitle: i18n.t('exportDataSubtitle'),
      type: 'button',
      onPress: handleExportData,
    },
    {
      id: 'backup',
      title: i18n.t('backup'),
      subtitle: i18n.t('backupSubtitle'),
      type: 'button',
      onPress: handleBackupData,
    },
    {
      id: 'clear',
      title: i18n.t('clearData'),
      subtitle: i18n.t('clearDataSubtitle'),
      type: 'button',
      onPress: handleClearData,
    },
    {
      id: 'about',
      title: i18n.t('about'),
      subtitle: i18n.t('aboutSubtitle'),
      type: 'button',
      onPress: handleAbout,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <View key={item.id} style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
        {item.subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.text + '80' }]}>{item.subtitle}</Text>
        )}
      </View>
      
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: colors.border, true: colors.tint + '40' }}
          thumbColor={item.value ? colors.tint : colors.text + '40'}
        />
      )}
      
      {item.type === 'button' && (
        <TouchableOpacity
          style={[styles.button, { borderColor: colors.tint }]}
          onPress={item.onPress}
        >
          <Text style={[styles.buttonText, { color: colors.tint }]}>{i18n.t('open')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{i18n.t('settingsTitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{i18n.t('generalPreferences')}</Text>
          {settingsData.slice(0, 5).map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{i18n.t('dataManagement')}</Text>
          {settingsData.slice(5, 8).map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{i18n.t('appInfo')}</Text>
          {settingsData.slice(8).map(renderSettingItem)}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text + '60' }]}>
            تطبيق اللياقة البدنية © 2024
          </Text>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingContent: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 