import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { prayerTimesService } from './prayerTimes';

// Motivational messages and Quranic quotes for each prayer
const prayerMessages = {
  Fajr: {
    motivational: [
      "Start your day with the remembrance of Allah 🌅",
      "The early morning prayer brings peace to your heart",
      "Begin your day with gratitude and prayer",
      "Fajr prayer is a gift from Allah - embrace it",
      "Morning prayer sets the tone for your entire day"
    ],
    quranic: [
      "And establish prayer at the two ends of the day and at the approach of the night. Indeed, good deeds do away with misdeeds. That is a reminder for those who remember. (Quran 11:114)",
      "And it is He who made the night and the day in succession for whoever desires to remember or desires gratitude. (Quran 25:62)",
      "So be patient, [O Muhammad], with what they say and exalt [Allah] with praise of your Lord before the rising of the sun and before its setting. (Quran 50:39)"
    ],
    hadith: [
      "The Prophet (peace be upon him) said: 'The two Rak'ahs before Fajr are better than this world and all that is in it.' (Muslim)",
      "The Prophet (peace be upon him) said: 'Whoever prays the dawn prayer in congregation, it is as if he had prayed the whole night long.' (Muslim)"
    ]
  },
  Dhuhr: {
    motivational: [
      "Take a moment to connect with Allah in the middle of your day ☀️",
      "Dhuhr prayer brings balance to your busy day",
      "Pause and remember Allah in the midst of your activities",
      "The midday prayer is a spiritual break for your soul",
      "Connect with Allah when the sun is at its peak"
    ],
    quranic: [
      "And establish prayer for My remembrance. (Quran 20:14)",
      "Indeed, prayer has been decreed upon the believers a decree of specified times. (Quran 4:103)",
      "And when you have completed the prayer, remember Allah standing, sitting, or [lying] on your sides. (Quran 4:103)"
    ],
    hadith: [
      "The Prophet (peace be upon him) said: 'The five daily prayers are like a river flowing by the door of any of you in which he washes five times daily.' (Muslim)",
      "The Prophet (peace be upon him) said: 'The first thing for which a person will be brought to account on the Day of Resurrection will be his prayer.' (Tirmidhi)"
    ]
  },
  Asr: {
    motivational: [
      "Afternoon prayer brings tranquility to your heart 🌤️",
      "Take a peaceful moment with Allah in the afternoon",
      "Asr prayer is a beautiful pause in your day",
      "Connect with Allah as the day begins to wind down",
      "The afternoon prayer brings inner peace"
    ],
    quranic: [
      "And establish prayer at the two ends of the day and at the approach of the night. Indeed, good deeds do away with misdeeds. (Quran 11:114)",
      "And it is He who made the night and the day in succession for whoever desires to remember or desires gratitude. (Quran 25:62)",
      "So be patient, [O Muhammad], with what they say and exalt [Allah] with praise of your Lord before the rising of the sun and before its setting. (Quran 50:39)"
    ],
    hadith: [
      "The Prophet (peace be upon him) said: 'Whoever misses the Asr prayer, it is as if he has lost his family and property.' (Bukhari)",
      "The Prophet (peace be upon him) said: 'The time for Asr prayer continues until the sun turns yellow.' (Muslim)"
    ]
  },
  Maghrib: {
    motivational: [
      "Evening prayer brings gratitude for the day's blessings 🌅",
      "Thank Allah for another day as the sun sets",
      "Maghrib prayer marks the beautiful transition to evening",
      "Express gratitude to Allah as the day ends",
      "The evening prayer brings peace and reflection"
    ],
    quranic: [
      "And it is He who made the night and the day in succession for whoever desires to remember or desires gratitude. (Quran 25:62)",
      "So be patient, [O Muhammad], with what they say and exalt [Allah] with praise of your Lord before the rising of the sun and before its setting. (Quran 50:39)",
      "And establish prayer at the two ends of the day and at the approach of the night. Indeed, good deeds do away with misdeeds. (Quran 11:114)"
    ],
    hadith: [
      "The Prophet (peace be upon him) said: 'The time for Maghrib prayer continues until the twilight has disappeared.' (Muslim)",
      "The Prophet (peace be upon him) said: 'Whoever prays Maghrib and then prays two Rak'ahs before sitting down, his prayer will be accepted.' (Abu Dawud)"
    ]
  },
  Isha: {
    motivational: [
      "Night prayer brings peace before you rest 🌙",
      "End your day with the remembrance of Allah",
      "Isha prayer is a beautiful way to conclude your day",
      "Connect with Allah before you sleep",
      "The night prayer brings tranquility to your heart"
    ],
    quranic: [
      "And establish prayer at the two ends of the day and at the approach of the night. Indeed, good deeds do away with misdeeds. (Quran 11:114)",
      "And it is He who made the night and the day in succession for whoever desires to remember or desires gratitude. (Quran 25:62)",
      "And when you have completed the prayer, remember Allah standing, sitting, or [lying] on your sides. (Quran 4:103)"
    ],
    hadith: [
      "The Prophet (peace be upon him) said: 'The time for Isha prayer continues until midnight.' (Muslim)",
      "The Prophet (peace be upon him) said: 'Whoever prays Isha in congregation, it is as if he had prayed half the night.' (Muslim)"
    ]
  }
};

// Function to get random message
function getRandomMessage(prayerName: string, messageType: 'motivational' | 'quranic' | 'hadith') {
  const messages = prayerMessages[prayerName as keyof typeof prayerMessages];
  if (!messages) return '';
  
  const messageArray = messages[messageType];
  if (!messageArray || messageArray.length === 0) return '';
  
  return messageArray[Math.floor(Math.random() * messageArray.length)];
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  prayerTimes: boolean;
  reminders: boolean;
  advanceMinutes: number;
}

export class NotificationService {
  private static instance: NotificationService;
  private notificationTimeouts: NodeJS.Timeout[] = [];

  constructor() {
    this.registerForPushNotificationsAsync();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      try {
        // Only try to get push token if we have a project ID
        const projectId = process.env.EXPO_PROJECT_ID || process.env.EAS_PROJECT_ID;
        if (projectId) {
          token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        } else {
          console.log('No project ID found, skipping push token generation');
        }
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  async schedulePrayerTimeNotifications(): Promise<void> {
    try {
      // Clear existing notifications
      await this.cancelAllNotifications();

      const settings = await this.getNotificationSettings();
      if (!settings.enabled || !settings.prayerTimes) {
        console.log('Notifications disabled or prayer times disabled');
        return;
      }

      let prayerTimesData;
      try {
        prayerTimesData = await prayerTimesService.getPrayerTimes();
      } catch (error) {
        console.error('Error getting prayer times:', error);
        return;
      }
      
      if (!prayerTimesData || !prayerTimesData.prayers) {
        console.log('No prayer times data available');
        return;
      }
      
      const now = new Date();
      let scheduledCount = 0;
      
      for (const prayer of prayerTimesData.prayers) {
        const prayerTime = new Date(prayer.timestamp);
        const notificationTime = new Date(prayerTime.getTime() - (settings.advanceMinutes * 60 * 1000));
        
        // Only schedule if the notification time is in the future
        if (notificationTime > now) {
          const timeUntilNotification = Math.round((notificationTime.getTime() - now.getTime()) / (1000 * 60));
          
          // Get random motivational message
          const motivationalMessage = getRandomMessage(prayer.name, 'motivational');
          const quranicQuote = getRandomMessage(prayer.name, 'quranic');
          const hadithQuote = getRandomMessage(prayer.name, 'hadith');
          
          // Create rich notification content
          const notificationBody = `${motivationalMessage}\n\n${quranicQuote}\n\n${hadithQuote}`;
          
          await this.scheduleNotification(
            `🕌 ${prayer.name} Prayer Reminder`,
            notificationBody,
            notificationTime,
            {
              prayerName: prayer.name,
              prayerTime: prayerTime.toISOString(),
              type: 'prayer_time',
              advanceMinutes: settings.advanceMinutes,
              motivationalMessage,
              quranicQuote,
              hadithQuote,
            }
          );
          
          scheduledCount++;
          console.log(`Scheduled ${prayer.name} notification for ${notificationTime.toLocaleString()} (in ${timeUntilNotification} minutes)`);
        } else {
          console.log(`Skipped ${prayer.name} notification - time has passed`);
        }
      }
      
      console.log(`Successfully scheduled ${scheduledCount} prayer time notifications`);
    } catch (error) {
      console.error('Error scheduling prayer time notifications:', error);
    }
  }

  async scheduleNotification(
    title: string,
    body: string,
    triggerDate: Date,
    data?: any
  ): Promise<void> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          categoryIdentifier: 'prayer_reminder',
          // Add app icon and styling
          ...(Platform.OS === 'android' && {
            color: '#10b981',
            smallIcon: 'ic_notification',
            largeIcon: 'ic_launcher',
          }),
        },
        trigger: { date: triggerDate } as any,
      });

      console.log(`Scheduled notification: ${title} at ${triggerDate.toISOString()}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async scheduleReminderNotifications(): Promise<void> {
    const settings = await this.getNotificationSettings();
    if (!settings.enabled || !settings.reminders) {
      return;
    }

    // Schedule daily motivational reminders with Quranic quotes
    const reminders = [
      {
        title: '🕌 Morning Spiritual Reminder',
        body: 'Start your day with gratitude and remembrance of Allah\n\n"And it is He who made the night and the day in succession for whoever desires to remember or desires gratitude." (Quran 25:62)\n\nThe Prophet (peace be upon him) said: "The best of people are those who are most beneficial to people." (Tabarani)',
        hour: 8,
        minute: 0,
      },
      {
        title: '🕌 Evening Reflection Reminder',
        body: 'Take a moment to reflect and thank Allah for today\n\n"And when you have completed the prayer, remember Allah standing, sitting, or [lying] on your sides." (Quran 4:103)\n\nThe Prophet (peace be upon him) said: "Whoever is not grateful to people is not grateful to Allah." (Tirmidhi)',
        hour: 20,
        minute: 0,
      },
    ];

    for (const reminder of reminders) {
      const triggerDate = new Date();
      triggerDate.setHours(reminder.hour, reminder.minute, 0, 0);
      
      // If the time has passed today, schedule for tomorrow
      if (triggerDate <= new Date()) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      await this.scheduleNotification(
        reminder.title,
        reminder.body,
        triggerDate,
        {
          type: 'daily_reminder',
        }
      );
    }
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
    this.notificationTimeouts = [];
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem('notification_settings');
      if (settings) {
        return JSON.parse(settings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }

    // Return default settings
    return {
      enabled: true,
      prayerTimes: true,
      reminders: true,
      advanceMinutes: 5,
    };
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const currentSettings = await this.getNotificationSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem('notification_settings', JSON.stringify(updatedSettings));
      
      // Reschedule notifications with new settings
      if (settings.enabled !== undefined || settings.prayerTimes !== undefined) {
        await this.schedulePrayerTimeNotifications();
      }
      if (settings.enabled !== undefined || settings.reminders !== undefined) {
        await this.scheduleReminderNotifications();
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  async testNotification(): Promise<void> {
    await this.scheduleNotification(
      'Test Notification',
      'This is a test notification from Namaz Mobile',
      new Date(Date.now() + 2000), // 2 seconds from now
      {
        type: 'test',
      }
    );
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }
}

export const notificationService = NotificationService.getInstance();
