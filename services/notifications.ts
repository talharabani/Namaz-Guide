import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export interface PrayerReminder {
  id: string;
  prayer: string;
  time: string;
  enabled: boolean;
  reminderMinutes: number;
  sound: boolean;
  vibration: boolean;
}

export interface NotificationSettings {
  prayerReminders: PrayerReminder[];
  generalNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private settings: NotificationSettings | null = null;

  private constructor() {
    this.initializeNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initializeNotifications() {
    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
      return;
    }

    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Load saved settings
    await this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    try {
      const savedSettings = await AsyncStorage.getItem('notification_settings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      } else {
        // Default settings
        this.settings = {
          prayerReminders: [
            {
              id: 'fajr',
              prayer: 'Fajr',
              time: '05:30',
              enabled: true,
              reminderMinutes: 5,
              sound: true,
              vibration: true,
            },
            {
              id: 'dhuhr',
              prayer: 'Dhuhr',
              time: '12:15',
              enabled: true,
              reminderMinutes: 5,
              sound: true,
              vibration: true,
            },
            {
              id: 'asr',
              prayer: 'Asr',
              time: '15:45',
              enabled: true,
              reminderMinutes: 5,
              sound: true,
              vibration: true,
            },
            {
              id: 'maghrib',
              prayer: 'Maghrib',
              time: '18:20',
              enabled: true,
              reminderMinutes: 5,
              sound: true,
              vibration: true,
            },
            {
              id: 'isha',
              prayer: 'Isha',
              time: '19:45',
              enabled: true,
              reminderMinutes: 5,
              sound: true,
              vibration: true,
            },
          ],
          generalNotifications: true,
          soundEnabled: true,
          vibrationEnabled: true,
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '06:00',
          },
        };
        await this.saveSettings();
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      if (this.settings) {
        await AsyncStorage.setItem('notification_settings', JSON.stringify(this.settings));
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  public async getSettings(): Promise<NotificationSettings | null> {
    if (!this.settings) {
      await this.loadSettings();
    }
    return this.settings;
  }

  public async updateSettings(settings: Partial<NotificationSettings>): Promise<void> {
    if (this.settings) {
      this.settings = { ...this.settings, ...settings };
      await this.saveSettings();
    }
  }

  public async updatePrayerReminder(reminder: PrayerReminder): Promise<void> {
    if (!this.settings) return;

    const index = this.settings.prayerReminders.findIndex(r => r.id === reminder.id);
    if (index !== -1) {
      this.settings.prayerReminders[index] = reminder;
      await this.saveSettings();
      await this.schedulePrayerReminder(reminder);
    }
  }

  public async schedulePrayerReminder(reminder: PrayerReminder): Promise<void> {
    if (!reminder.enabled) {
      await this.cancelPrayerReminder(reminder.id);
      return;
    }

    // Cancel existing reminder
    await this.cancelPrayerReminder(reminder.id);

    // Parse prayer time
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes - reminder.reminderMinutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (reminderTime <= new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    // Schedule notification
    await Notifications.scheduleNotificationAsync({
      identifier: `prayer_reminder_${reminder.id}`,
      content: {
        title: `🕌 ${reminder.prayer} Prayer Reminder`,
        body: `It's time for ${reminder.prayer} prayer in ${reminder.reminderMinutes} minutes`,
        sound: reminder.sound,
        data: {
          prayer: reminder.prayer,
          type: 'prayer_reminder',
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderTime,
      },
    });
  }

  public async scheduleAllPrayerReminders(): Promise<void> {
    if (!this.settings) return;

    for (const reminder of this.settings.prayerReminders) {
      await this.schedulePrayerReminder(reminder);
    }
  }

  public async cancelPrayerReminder(reminderId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(`prayer_reminder_${reminderId}`);
  }

  public async cancelAllPrayerReminders(): Promise<void> {
    if (!this.settings) return;

    for (const reminder of this.settings.prayerReminders) {
      await this.cancelPrayerReminder(reminder.id);
    }
  }

  public async sendStreakReminder(streakDays: number): Promise<void> {
    if (!this.settings?.generalNotifications) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Prayer Streak!',
        body: `Amazing! You've maintained your prayer streak for ${streakDays} days. Keep it up!`,
        sound: this.settings.soundEnabled,
        data: {
          type: 'streak_reminder',
          streakDays,
        },
      },
      trigger: null, // Send immediately
    });
  }

  public async sendMotivationalMessage(): Promise<void> {
    if (!this.settings?.generalNotifications) return;

    const messages = [
      "🌟 Start your day with gratitude and prayer",
      "🕌 Remember, every prayer brings you closer to Allah",
      "💫 Your faith is your strength, keep praying",
      "🌙 May Allah bless your day with peace and guidance",
      "✨ Every moment is a chance to connect with Allah",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💚 Daily Reminder',
        body: randomMessage,
        sound: this.settings.soundEnabled,
        data: {
          type: 'motivational',
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3600, // Send in 1 hour
      },
    });
  }

  public async sendAchievementNotification(achievement: string): Promise<void> {
    if (!this.settings?.generalNotifications) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Achievement Unlocked!',
        body: `Congratulations! You've earned: ${achievement}`,
        sound: this.settings.soundEnabled,
        data: {
          type: 'achievement',
          achievement,
        },
      },
      trigger: null, // Send immediately
    });
  }

  public async sendQuizReminder(): Promise<void> {
    if (!this.settings?.generalNotifications) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧠 Quiz Time!',
        body: 'Test your Islamic knowledge with a quick quiz',
        sound: this.settings.soundEnabled,
        data: {
          type: 'quiz_reminder',
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 7200, // Send in 2 hours
      },
    });
  }

  public async sendDuaReminder(): Promise<void> {
    if (!this.settings?.generalNotifications) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 Dua Reminder',
        body: 'Take a moment to read and reflect on Islamic supplications',
        sound: this.settings.soundEnabled,
        data: {
          type: 'dua_reminder',
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10800, // Send in 3 hours
      },
    });
  }

  public async scheduleDailyReminders(): Promise<void> {
    // Schedule motivational message
    await this.sendMotivationalMessage();
    
    // Schedule quiz reminder
    await this.sendQuizReminder();
    
    // Schedule dua reminder
    await this.sendDuaReminder();
  }

  public async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  public async clearAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  public async isInQuietHours(): Promise<boolean> {
    if (!this.settings?.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = this.settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.settings.quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }
}

export const notificationService = NotificationService.getInstance();