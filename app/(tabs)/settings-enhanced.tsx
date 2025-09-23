import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import AppHeader from '../../components/navigation/AppHeader';
import Card, { CardContent } from '../../components/ui/Card';
import IslamicText from '../../components/ui/IslamicText';
import { BorderRadius, FeatureColors, Shadows, Spacing } from '../../constants/DesignSystem';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { notificationService, PrayerReminder } from '../../services/notifications';
import { streakTrackerService } from '../../services/streakTracker';

const { width: screenWidth } = Dimensions.get('window');

interface SettingsSection {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'select' | 'action' | 'info';
  value?: boolean | string;
  options?: string[];
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  onSelect?: (value: string) => void;
}

export default function EnhancedSettingsScreen() {
  const { colors, isDark, toggleTheme, mode, variant } = useTheme();
  const { user, updateUser } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });

    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [notifSettings, streak] = await Promise.all([
        notificationService.getSettings(),
        streakTrackerService.getStreakData(),
      ]);
      setNotificationSettings(notifSettings);
      setStreakData(streak);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSettings();
    setRefreshing(false);
  }, []);

  const handlePrayerReminderToggle = async (reminderId: string, enabled: boolean) => {
    if (!notificationSettings) return;

    const updatedReminders = notificationSettings.prayerReminders.map((reminder: PrayerReminder) =>
      reminder.id === reminderId ? { ...reminder, enabled } : reminder
    );

    await notificationService.updateSettings({
      prayerReminders: updatedReminders,
    });

    // Update the specific reminder
    const reminder = updatedReminders.find((r: PrayerReminder) => r.id === reminderId);
    if (reminder) {
      await notificationService.schedulePrayerReminder(reminder);
    }

    setNotificationSettings({ ...notificationSettings, prayerReminders: updatedReminders });
  };

  const handleGeneralNotificationToggle = async (enabled: boolean) => {
    if (!notificationSettings) return;

    await notificationService.updateSettings({
      generalNotifications: enabled,
    });

    setNotificationSettings({ ...notificationSettings, generalNotifications: enabled });
  };

  const handleSoundToggle = async (enabled: boolean) => {
    if (!notificationSettings) return;

    await notificationService.updateSettings({
      soundEnabled: enabled,
    });

    setNotificationSettings({ ...notificationSettings, soundEnabled: enabled });
  };

  const handleVibrationToggle = async (enabled: boolean) => {
    if (!notificationSettings) return;

    await notificationService.updateSettings({
      vibrationEnabled: enabled,
    });

    setNotificationSettings({ ...notificationSettings, vibrationEnabled: enabled });
  };

  const handleQuietHoursToggle = async (enabled: boolean) => {
    if (!notificationSettings) return;

    await notificationService.updateSettings({
      quietHours: { ...notificationSettings.quietHours, enabled },
    });

    setNotificationSettings({
      ...notificationSettings,
      quietHours: { ...notificationSettings.quietHours, enabled },
    });
  };

  const handleResetStreak = () => {
    Alert.alert(
      'Reset Streak',
      'Are you sure you want to reset your prayer streak? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await streakTrackerService.resetStreak();
            await loadSettings();
          },
        },
      ]
    );
  };

  const handleClearNotifications = () => {
    Alert.alert(
      'Clear Notifications',
      'This will clear all scheduled notifications. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await notificationService.clearAllNotifications();
            Alert.alert('Success', 'All notifications have been cleared.');
          },
        },
      ]
    );
  };

  const handleTestNotification = async () => {
    await notificationService.sendMotivationalMessage();
    Alert.alert('Test Notification', 'A test notification has been sent!');
  };

  // Settings sections
  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.progress,
      gradient: ['#3b82f6', '#2563eb'],
      items: [
        {
          id: 'name',
          title: 'Name',
          description: user?.name || 'User',
          type: 'info',
        },
        {
          id: 'email',
          title: 'Email',
          description: user?.email || 'user@example.com',
          type: 'info',
        },
        {
          id: 'joinDate',
          title: 'Member Since',
          description: user?.joinDate?.toLocaleDateString() || 'Unknown',
          type: 'info',
        },
      ],
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: 'color-palette-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.duas,
      gradient: ['#f59e0b', '#d97706'],
      items: [
        {
          id: 'theme',
          title: 'Dark Mode',
          description: isDark ? 'Dark theme enabled' : 'Light theme enabled',
          type: 'toggle',
          value: isDark,
          onToggle: toggleTheme,
        },
        {
          id: 'themeMode',
          title: 'Theme Mode',
          description: `Current: ${mode}`,
          type: 'select',
          value: mode,
          options: ['light', 'dark', 'auto'],
          onSelect: (value) => {
            // This would update the theme mode
            console.log('Theme mode changed to:', value);
          },
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.prayer,
      gradient: ['#10b981', '#059669'],
      items: [
        {
          id: 'general',
          title: 'General Notifications',
          description: 'Receive motivational messages and updates',
          type: 'toggle',
          value: notificationSettings?.generalNotifications || false,
          onToggle: handleGeneralNotificationToggle,
        },
        {
          id: 'sound',
          title: 'Sound',
          description: 'Play sound for notifications',
          type: 'toggle',
          value: notificationSettings?.soundEnabled || false,
          onToggle: handleSoundToggle,
        },
        {
          id: 'vibration',
          title: 'Vibration',
          description: 'Vibrate for notifications',
          type: 'toggle',
          value: notificationSettings?.vibrationEnabled || false,
          onToggle: handleVibrationToggle,
        },
        {
          id: 'quietHours',
          title: 'Quiet Hours',
          description: 'Disable notifications during quiet hours',
          type: 'toggle',
          value: notificationSettings?.quietHours?.enabled || false,
          onToggle: handleQuietHoursToggle,
        },
        {
          id: 'testNotification',
          title: 'Test Notification',
          description: 'Send a test notification',
          type: 'action',
          onPress: handleTestNotification,
        },
        {
          id: 'clearNotifications',
          title: 'Clear All Notifications',
          description: 'Remove all scheduled notifications',
          type: 'action',
          onPress: handleClearNotifications,
        },
      ],
    },
    {
      id: 'prayerReminders',
      title: 'Prayer Reminders',
      icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.qibla,
      gradient: ['#06b6d4', '#0891b2'],
      items: notificationSettings?.prayerReminders?.map((reminder: PrayerReminder) => ({
        id: reminder.id,
        title: `${reminder.prayer} Prayer`,
        description: `Reminder ${reminder.reminderMinutes} minutes before ${reminder.time}`,
        type: 'toggle' as const,
        value: reminder.enabled,
        onToggle: (value: boolean) => handlePrayerReminderToggle(reminder.id, value),
      })) || [],
    },
    {
      id: 'streak',
      title: 'Streak & Progress',
      icon: 'flame-outline' as keyof typeof Ionicons.glyphMap,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      items: [
        {
          id: 'currentStreak',
          title: 'Current Streak',
          description: `${streakData?.current || 0} days`,
          type: 'info',
        },
        {
          id: 'longestStreak',
          title: 'Longest Streak',
          description: `${streakData?.longest || 0} days`,
          type: 'info',
        },
        {
          id: 'totalDays',
          title: 'Total Active Days',
          description: `${streakData?.totalDays || 0} days`,
          type: 'info',
        },
        {
          id: 'resetStreak',
          title: 'Reset Streak',
          description: 'Reset your current prayer streak',
          type: 'action',
          onPress: handleResetStreak,
        },
      ],
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.quiz,
      gradient: ['#ec4899', '#db2777'],
      items: [
        {
          id: 'version',
          title: 'App Version',
          description: '1.0.0',
          type: 'info',
        },
        {
          id: 'build',
          title: 'Build Number',
          description: '100',
          type: 'info',
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          description: 'View our privacy policy',
          type: 'action',
          onPress: () => console.log('Privacy policy'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          description: 'View terms of service',
          type: 'action',
          onPress: () => console.log('Terms of service'),
        },
        {
          id: 'support',
          title: 'Support',
          description: 'Get help and support',
          type: 'action',
          onPress: () => console.log('Support'),
        },
      ],
    },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const renderSettingsItem = (item: SettingsItem, sectionColor: string) => (
    <Animated.View
      key={item.id}
      entering={FadeInDown.delay(200)}
      style={styles.settingsItem}
    >
      <Card style={styles.settingsItemCard}>
        <CardContent>
          <View style={styles.settingsItemContent}>
            <View style={styles.settingsItemInfo}>
              <IslamicText variant="body" style={styles.settingsItemTitle}>
                {item.title || ''}
              </IslamicText>
                  <IslamicText variant="caption" style={styles.settingsItemDescription}>
                    {item.description || ''}
                  </IslamicText>
            </View>
            
            <View style={styles.settingsItemAction}>
              {item.type === 'toggle' && (
                <Switch
                  value={item.value as boolean}
                  onValueChange={item.onToggle}
                  trackColor={{ false: colors.border, true: sectionColor }}
                  thumbColor={item.value ? 'white' : colors.textSecondary}
                />
              )}
              {item.type === 'select' && (
                <TouchableOpacity
                  onPress={() => item.onSelect?.(item.value as string)}
                  style={styles.selectButton}
                >
                  <IslamicText variant="caption" style={styles.selectButtonText}>
                    {item.value}
                  </IslamicText>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
              {item.type === 'action' && (
                <TouchableOpacity
                  onPress={item.onPress}
                  style={styles.actionButton}
                >
                  <Ionicons name="chevron-forward" size={20} color={sectionColor} />
                </TouchableOpacity>
              )}
              {item.type === 'info' && (
                <View style={styles.infoContainer}>
                  <IslamicText variant="caption" style={styles.infoText}>
                    {item.value?.toString() || item.description || ''}
                  </IslamicText>
                </View>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </Animated.View>
  );

  const renderSettingsSection = (section: SettingsSection) => (
    <Animated.View
      key={section.id}
      entering={FadeInUp.delay(300)}
      style={styles.settingsSection}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Ionicons name={section.icon} size={24} color="white" />
        </View>
        <IslamicText variant="subtitle" style={styles.sectionTitle}>
          {section.title}
        </IslamicText>
      </View>
      
      {section.items.map(item => renderSettingsItem(item, section.color))}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader
        title="Settings"
        subtitle="Customize your experience"
        variant="gradient"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {settingsSections.map(renderSettingsSection)}

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
  },
  settingsSection: {
    marginBottom: Spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  settingsItem: {
    marginBottom: Spacing[3],
  },
  settingsItemCard: {
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsItemInfo: {
    flex: 1,
    marginRight: Spacing[3],
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing[1],
  },
  settingsItemDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingsItemAction: {
    alignItems: 'center',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.lg,
    gap: Spacing[1],
  },
  selectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  actionButton: {
    padding: Spacing[2],
  },
  infoContainer: {
    alignItems: 'flex-end',
  },
  infoText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'right',
  },
  bottomSpacing: {
    height: Spacing[20],
  },
});
