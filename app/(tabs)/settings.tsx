import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { cacheService } from '../../services/cache';
import { notificationService } from '../../services/notifications';

export default function SettingsScreen() {
  const { user, isAuthenticated, logout } = useAuth();
  const { 
    settings, 
    updateNotificationSetting, 
    updateTheme, 
    updateAccessibility,
    updateDataUsage,
    resetToDefaults 
  } = useSettings();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetToDefaults },
      ]
    );
  };

  const handleNotificationSettingChange = async (key: string, value: any) => {
    updateNotificationSetting(key as any, value);
    
    // Update notification service
    await notificationService.updateNotificationSettings({
      [key]: value,
    });
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.testNotification();
      Alert.alert('Test Notification', 'A test notification has been sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data including prayer times, duas, and hadith. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await cacheService.clear();
              await cacheService.clearImageCache();
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          }
        },
      ]
    );
  };

  const handleCacheInfo = async () => {
    try {
      const cacheSize = await cacheService.getCacheSize();
      const sizeInMB = (cacheSize / (1024 * 1024)).toFixed(2);
      Alert.alert('Cache Information', `Current cache size: ${sizeInMB} MB`);
    } catch (error) {
      Alert.alert('Error', 'Failed to get cache information');
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <BlurView intensity={20} style={styles.settingCard}>
        <View style={styles.settingContent}>
          <View style={styles.settingIcon}>
            <Ionicons name={icon as any} size={20} color="#10b981" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
          {rightComponent || (
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="settings" size={28} color="#10b981" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Settings</Text>
              <Text style={styles.appSubtitle}>App preferences</Text>
            </View>
          </View>
        </View>

        {/* User Profile */}
        {isAuthenticated && user && (
          <View style={styles.profileContainer}>
            <BlurView intensity={20} style={styles.profileCard}>
              <View style={styles.profileContent}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user.name}</Text>
                  <Text style={styles.profileEmail}>{user.email}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        )}

        {/* Notifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            icon="notifications-outline"
            title="Enable Notifications"
            subtitle="Receive prayer time reminders"
            rightComponent={
              <Switch
                value={settings.notifications.enabled}
                onValueChange={(value) => handleNotificationSettingChange('enabled', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.enabled ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="time-outline"
            title="Prayer Time Alerts"
            subtitle="Get notified before prayer times"
            rightComponent={
              <Switch
                value={settings.notifications.prayerTimes}
                onValueChange={(value) => handleNotificationSettingChange('prayerTimes', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.prayerTimes ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="alarm-outline"
            title="Reminder Alerts"
            subtitle="Daily Islamic reminders"
            rightComponent={
              <Switch
                value={settings.notifications.reminders}
                onValueChange={(value) => handleNotificationSettingChange('reminders', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.reminders ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="notifications-circle-outline"
            title="Test Notification"
            subtitle="Send a test notification"
            onPress={handleTestNotification}
          />
        </View>

        {/* Appearance */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <SettingItem
            icon="moon-outline"
            title="Theme"
            subtitle={settings.theme === 'auto' ? 'Auto' : settings.theme === 'dark' ? 'Dark' : 'Light'}
            onPress={() => {
              const themes = ['auto', 'light', 'dark'];
              const currentIndex = themes.indexOf(settings.theme);
              const nextTheme = themes[(currentIndex + 1) % themes.length];
              updateTheme(nextTheme as any);
            }}
          />

          <SettingItem
            icon="text-outline"
            title="Large Text"
            subtitle="Increase text size for better readability"
            rightComponent={
              <Switch
                value={settings.accessibility.largeText}
                onValueChange={(value) => updateAccessibility({ largeText: value })}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.accessibility.largeText ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="contrast-outline"
            title="High Contrast"
            subtitle="Enhanced contrast for better visibility"
            rightComponent={
              <Switch
                value={settings.accessibility.highContrast}
                onValueChange={(value) => updateAccessibility({ highContrast: value })}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.accessibility.highContrast ? '#ffffff' : '#9ca3af'}
              />
            }
          />
        </View>

        {/* Data & Storage */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          
          <SettingItem
            icon="wifi-outline"
            title="Offline Mode"
            subtitle="Use app without internet connection"
            rightComponent={
              <Switch
                value={settings.dataUsage.offlineMode}
                onValueChange={(value) => updateDataUsage({ offlineMode: value })}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.dataUsage.offlineMode ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="image-outline"
            title="Cache Images"
            subtitle="Store images locally for faster loading"
            rightComponent={
              <Switch
                value={settings.dataUsage.cacheImages}
                onValueChange={(value) => updateDataUsage({ cacheImages: value })}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.dataUsage.cacheImages ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="sync-outline"
            title="Sync Frequency"
            subtitle={settings.dataUsage.syncFrequency === 'low' ? 'Low' : 
                     settings.dataUsage.syncFrequency === 'medium' ? 'Medium' : 'High'}
            onPress={() => {
              const frequencies = ['low', 'medium', 'high'];
              const currentIndex = frequencies.indexOf(settings.dataUsage.syncFrequency);
              const nextFreq = frequencies[(currentIndex + 1) % frequencies.length];
              updateDataUsage({ syncFrequency: nextFreq as any });
            }}
          />

          <SettingItem
            icon="information-circle-outline"
            title="Cache Information"
            subtitle="View cache size and usage"
            onPress={handleCacheInfo}
          />

          <SettingItem
            icon="trash-outline"
            title="Clear Cache"
            subtitle="Clear all cached data"
            onPress={handleClearCache}
          />
        </View>

        {/* About */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <SettingItem
            icon="information-circle-outline"
            title="App Version"
            subtitle="1.0.0"
          />

          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => Alert.alert('Help', 'Help and support coming soon!')}
          />

          <SettingItem
            icon="document-text-outline"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon!')}
          />

          <SettingItem
            icon="shield-checkmark-outline"
            title="Terms of Service"
            subtitle="Read our terms of service"
            onPress={() => Alert.alert('Terms of Service', 'Terms of service coming soon!')}
          />
        </View>

        {/* Reset Settings */}
        <View style={styles.sectionContainer}>
          <SettingItem
            icon="refresh-outline"
            title="Reset Settings"
            subtitle="Reset all settings to default"
            onPress={handleResetSettings}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  appName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
  },
  appSubtitle: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginTop: 2,
  },
  profileContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileAvatarText: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  logoutButton: {
    padding: Spacing.sm,
  },
  sectionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.md,
  },
  settingItem: {
    marginBottom: Spacing.sm,
  },
  settingCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});
