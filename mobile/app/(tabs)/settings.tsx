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

  const handleExportData = () => {
    Alert.alert('تصدير البيانات', 'سيتم تصدير جميع بياناتك قريباً');
  };

  const handleBackupData = () => {
    Alert.alert('نسخ احتياطي', 'سيتم إنشاء نسخة احتياطية من بياناتك');
  };

  const handleClearData = () => {
    Alert.alert(
      'مسح البيانات',
      'هل أنت متأكد من أنك تريد مسح جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'مسح', style: 'destructive', onPress: () => Alert.alert('تم المسح', 'تم مسح جميع البيانات') },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert('حول التطبيق', 'تطبيق اللياقة البدنية\nالإصدار 1.0.0\nتم التطوير بواسطة فريق التطوير');
  };

  const settingsData: SettingItem[] = [
    {
      id: 'notifications',
      title: 'الإشعارات',
      subtitle: 'استقبال إشعارات التذكير بالتمارين',
      type: 'toggle',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: 'darkMode',
      title: 'الوضع المظلم',
      subtitle: 'تفعيل المظهر المظلم للتطبيق',
      type: 'toggle',
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      id: 'sound',
      title: 'الأصوات',
      subtitle: 'تفعيل الأصوات أثناء التمرين',
      type: 'toggle',
      value: soundEnabled,
      onToggle: setSoundEnabled,
    },
    {
      id: 'autoSave',
      title: 'الحفظ التلقائي',
      subtitle: 'حفظ البيانات تلقائياً',
      type: 'toggle',
      value: autoSave,
      onToggle: setAutoSave,
    },
    {
      id: 'export',
      title: 'تصدير البيانات',
      subtitle: 'تصدير جميع بياناتك إلى ملف',
      type: 'button',
      onPress: handleExportData,
    },
    {
      id: 'backup',
      title: 'نسخ احتياطي',
      subtitle: 'إنشاء نسخة احتياطية من البيانات',
      type: 'button',
      onPress: handleBackupData,
    },
    {
      id: 'clear',
      title: 'مسح البيانات',
      subtitle: 'حذف جميع البيانات المحفوظة',
      type: 'button',
      onPress: handleClearData,
    },
    {
      id: 'about',
      title: 'حول التطبيق',
      subtitle: 'معلومات عن التطبيق والمطورين',
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
          <Text style={[styles.buttonText, { color: colors.tint }]}>فتح</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>الإعدادات</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>التفضيلات العامة</Text>
          {settingsData.slice(0, 4).map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>إدارة البيانات</Text>
          {settingsData.slice(4, 7).map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>معلومات التطبيق</Text>
          {settingsData.slice(7).map(renderSettingItem)}
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
    flex: 1,
    padding: 20,
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