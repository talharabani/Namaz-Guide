import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Alert,
  Platform,
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
    updateSettings
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
        { text: 'Reset', style: 'destructive', onPress: () => updateSettings({
          location: null,
          prayerMethod: 'Umm al-Qura',
          asrMethod: 'Standard',
          highLatitudeMethod: 'None',
          notifications: {
            enabled: true,
            fajr: true,
            dhuhr: true,
            asr: true,
            maghrib: true,
            isha: true,
            reminderMinutes: 5,
          },
          language: 'en',
          theme: 'auto',
          soundEnabled: true,
          vibrationEnabled: true,
        }) },
      ]
    );
  };

  const handleNotificationSettingChange = async (key: string, value: any) => {
    await updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
    
    // Update notification service
    await notificationService.updateSettings({
      generalNotifications: key === 'enabled' ? value : settings.notifications.enabled,
      soundEnabled: key === 'sound' ? value : settings.soundEnabled,
      vibrationEnabled: key === 'vibration' ? value : settings.vibrationEnabled,
    });
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.sendMotivationalMessage();
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
      const cacheInfo = await cacheService.getCacheInfo();
      const sizeInMB = (cacheSize / (1024 * 1024)).toFixed(2);
      
      const cacheDetails = cacheInfo.length > 0 
        ? '\n\nCached Items:\n' + cacheInfo.map(item => `• ${item.key}: ${item.size}`).join('\n')
        : '\n\nNo cached items found.';
      
      Alert.alert(
        'Cache Information', 
        `Total Cache Size: ${sizeInMB} MB${cacheDetails}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get cache information');
    }
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'Welcome to Namaz Mobile!\n\n📱 Features:\n• Prayer times with notifications\n• Qibla direction finder\n• Islamic learning content\n• Progress tracking\n• Duas and Hadith\n\n📞 Contact Support:\nEmail: support@namazmobile.com\nPhone: +1-800-NAMZ-APP\n\n💡 Tips:\n• Enable location for accurate prayer times\n• Set up notifications for prayer reminders\n• Use the Qibla finder for accurate direction',
      [
        { text: 'FAQ', onPress: () => Alert.alert('FAQ', 'Frequently Asked Questions:\n\nQ: How accurate are prayer times?\nA: Very accurate! We use your location and trusted Islamic calculation methods.\n\nQ: Can I change the prayer calculation method?\nA: Yes! Go to Settings > Prayer Method to choose your preferred method.\n\nQ: How do I enable notifications?\nA: Go to Settings > Notifications and toggle the switches for each prayer.') },
        { text: 'Contact Us', onPress: () => Alert.alert('Contact Us', 'We\'re here to help!\n\n📧 Email: support@namazmobile.com\n📱 Phone: +1-800-NAMZ-APP\n💬 Live Chat: Available 24/7\n\nResponse time: Usually within 2 hours') },
        { text: 'Close' }
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Last Updated: December 2024\n\n🔒 Your Privacy Matters\n\nWe collect minimal data to provide you with the best Islamic app experience:\n\n📍 Location Data:\n• Used only for accurate prayer times and Qibla direction\n• Stored locally on your device\n• Never shared with third parties\n\n📱 App Usage:\n• Prayer completion tracking (local only)\n• Settings preferences (local only)\n• No personal data collection\n\n🛡️ Data Protection:\n• All data encrypted and stored locally\n• No cloud storage of personal information\n• No tracking or analytics\n\n📞 Questions? Contact us at privacy@namazmobile.com',
      [{ text: 'I Understand' }]
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'Last Updated: December 2024\n\n📋 Terms of Use\n\nBy using Namaz Mobile, you agree to:\n\n✅ Proper Use:\n• Use the app for Islamic purposes only\n• Respect prayer times and Islamic guidelines\n• Not misuse the app or its features\n\n📱 App Features:\n• Prayer times are for guidance only\n• Always verify with local Islamic authorities\n• Qibla direction is approximate\n\n🔧 Technical:\n• App may require location permissions\n• Internet connection needed for some features\n• Regular updates may be required\n\n📞 Support: support@namazmobile.com',
      [{ text: 'I Agree' }]
    );
  };

  const handleAppVersion = () => {
    Alert.alert(
      'App Information',
      '📱 Namaz Mobile v1.0.0\n\n✨ Features:\n• Accurate prayer times\n• Qibla direction finder\n• Islamic learning content\n• Progress tracking\n• Beautiful UI/UX\n\n🔄 Updates:\n• Automatic prayer time updates\n• New Islamic content added regularly\n• Bug fixes and improvements\n\n📧 Feedback: feedback@namazmobile.com\n⭐ Rate us on the App Store!',
      [
        { text: 'Check Updates', onPress: () => Alert.alert('Updates', 'You have the latest version!\n\nNext update coming soon with:\n• New prayer calculation methods\n• Enhanced notifications\n• More Islamic content') },
        { text: 'Close' }
      ]
    );
  };

  const handleLocationSettings = () => {
    Alert.alert(
      'Location Settings',
      '📍 Location is required for:\n• Accurate prayer times\n• Qibla direction\n• Local Islamic content\n\n🔧 Current Status:\n• Location: ' + (settings.location ? `${settings.location.city}` : 'Not set') + '\n• Method: ' + settings.prayerMethod + '\n• ASR Method: ' + settings.asrMethod,
      [
        { text: 'Update Location', onPress: async () => {
          try {
            const location = await useSettings().getCurrentLocation();
            if (location) {
              Alert.alert('Success', 'Location updated successfully!');
            } else {
              Alert.alert('Error', 'Failed to get current location. Please check permissions.');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to update location.');
          }
        }},
        { text: 'Change Method', onPress: () => {
          const methods = ['Umm al-Qura', 'Muslim World League', 'Islamic Society of North America', 'Egyptian General Authority of Survey'];
          Alert.alert(
            'Prayer Calculation Method',
            'Select your preferred method:',
            methods.map(method => ({
              text: method,
              onPress: () => updateSettings({ prayerMethod: method as any })
            })).concat([{ text: 'Cancel', onPress: async () => {} }])
          );
        }},
        { text: 'Close' }
      ]
    );
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

        {/* Location & Prayer Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Location & Prayer</Text>
          
          <SettingItem
            icon="location-outline"
            title="Location Settings"
            subtitle={settings.location ? settings.location.city : "Set your location"}
            onPress={handleLocationSettings}
          />

          <SettingItem
            icon="compass-outline"
            title="Prayer Method"
            subtitle={settings.prayerMethod}
            onPress={() => {
              const methods = ['Umm al-Qura', 'Muslim World League', 'Islamic Society of North America', 'Egyptian General Authority of Survey'];
              Alert.alert(
                'Prayer Calculation Method',
                'Select your preferred method:',
                methods.map(method => ({
                  text: method,
                  onPress: () => updateSettings({ prayerMethod: method as any })
                })).concat([{ text: 'Cancel', onPress: async () => {} }])
              );
            }}
          />

          <SettingItem
            icon="time-outline"
            title="ASR Method"
            subtitle={settings.asrMethod}
            onPress={() => {
              const asrMethods = ['Standard', 'Hanafi'];
              Alert.alert(
                'ASR Calculation Method',
                'Select your preferred ASR method:',
                asrMethods.map(method => ({
                  text: method,
                  onPress: () => updateSettings({ asrMethod: method as any })
                })).concat([{ text: 'Cancel', onPress: async () => {} }])
              );
            }}
          />
        </View>

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
                value={settings.notifications.fajr}
                onValueChange={(value) => handleNotificationSettingChange('fajr', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.fajr ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="sunrise-outline"
            title="Fajr Notifications"
            subtitle="Dawn prayer reminders"
            rightComponent={
              <Switch
                value={settings.notifications.fajr}
                onValueChange={(value) => handleNotificationSettingChange('fajr', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.fajr ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="sunny-outline"
            title="Dhuhr Notifications"
            subtitle="Midday prayer reminders"
            rightComponent={
              <Switch
                value={settings.notifications.dhuhr}
                onValueChange={(value) => handleNotificationSettingChange('dhuhr', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.dhuhr ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="partly-sunny-outline"
            title="Asr Notifications"
            subtitle="Afternoon prayer reminders"
            rightComponent={
              <Switch
                value={settings.notifications.asr}
                onValueChange={(value) => handleNotificationSettingChange('asr', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.asr ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="sunset-outline"
            title="Maghrib Notifications"
            subtitle="Sunset prayer reminders"
            rightComponent={
              <Switch
                value={settings.notifications.maghrib}
                onValueChange={(value) => handleNotificationSettingChange('maghrib', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.maghrib ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="moon-outline"
            title="Isha Notifications"
            subtitle="Night prayer reminders"
            rightComponent={
              <Switch
                value={settings.notifications.isha}
                onValueChange={(value) => handleNotificationSettingChange('isha', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.notifications.isha ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="time-outline"
            title="Reminder Time"
            subtitle={`${settings.notifications.reminderMinutes} minutes before prayer`}
            onPress={() => {
              const times = [5, 10, 15, 30, 60];
              Alert.alert(
                'Reminder Time',
                'How many minutes before prayer time?',
                times.map(time => ({
                  text: `${time} minutes`,
                  onPress: () => updateSettings({
                    notifications: {
                      ...settings.notifications,
                      reminderMinutes: time
                    }
                  })
                })).concat([{ text: 'Cancel', onPress: async () => {} }])
              );
            }}
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
              updateSettings({ theme: nextTheme as any });
            }}
          />

          <SettingItem
            icon="volume-high-outline"
            title="Sound"
            subtitle="Enable sound notifications"
            rightComponent={
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => updateSettings({ soundEnabled: value })}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.soundEnabled ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="phone-portrait-outline"
            title="Vibration"
            subtitle="Enable vibration for notifications"
            rightComponent={
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={settings.vibrationEnabled ? '#ffffff' : '#9ca3af'}
              />
            }
          />
        </View>

        {/* Language & Region */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Language & Region</Text>
          
          <SettingItem
            icon="language-outline"
            title="Language"
            subtitle={settings.language === 'en' ? 'English' : settings.language === 'ar' ? 'العربية' : settings.language === 'ur' ? 'اردو' : 'English'}
            onPress={() => {
              const languages = [
                { code: 'en', name: 'English' },
                { code: 'ar', name: 'العربية' },
                { code: 'ur', name: 'اردو' },
                { code: 'fr', name: 'Français' },
                { code: 'es', name: 'Español' }
              ];
              Alert.alert(
                'Select Language',
                'Choose your preferred language:',
                languages.map(lang => ({
                  text: lang.name,
                  onPress: () => updateSettings({ language: lang.code })
                })).concat([{ text: 'Cancel', onPress: async () => {} }])
              );
            }}
          />

          <SettingItem
            icon="globe-outline"
            title="Region"
            subtitle="Set your region for better accuracy"
            onPress={() => {
              Alert.alert(
                'Region Settings',
                'Your region helps us provide more accurate prayer times and Islamic content.\n\nCurrent region: ' + (settings.location ? settings.location.country : 'Not set'),
                [
                  { text: 'Update Location', onPress: handleLocationSettings },
                  { text: 'Close' }
                ]
              );
            }}
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
                value={false}
                onValueChange={(value) => console.log('Offline mode:', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={false ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="image-outline"
            title="Cache Images"
            subtitle="Store images locally for faster loading"
            rightComponent={
              <Switch
                value={false}
                onValueChange={(value) => console.log('Cache images:', value)}
                trackColor={{ false: '#374151', true: '#10b981' }}
                thumbColor={false ? '#ffffff' : '#9ca3af'}
              />
            }
          />

          <SettingItem
            icon="sync-outline"
            title="Sync Frequency"
            subtitle="Medium"
            onPress={() => {
              console.log('Sync frequency changed');
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
            onPress={handleAppVersion}
          />

          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={handleHelpSupport}
          />

          <SettingItem
            icon="document-text-outline"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={handlePrivacyPolicy}
          />

          <SettingItem
            icon="shield-checkmark-outline"
            title="Terms of Service"
            subtitle="Read our terms of service"
            onPress={handleTermsOfService}
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
    height: Platform.OS === 'ios' ? 120 : 100, // Account for tab bar height
  },
});
