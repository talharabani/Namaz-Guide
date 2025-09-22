import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ur';
  notifications: {
    enabled: boolean;
    prayerTimes: boolean;
    reminders: boolean;
    advanceMinutes: number;
  };
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  dataUsage: {
    offlineMode: boolean;
    cacheImages: boolean;
    syncFrequency: 'low' | 'medium' | 'high';
  };
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  updateNotificationSetting: (key: keyof Settings['notifications'], value: any) => Promise<void>;
  updateLocation: (location: Partial<Settings['location']>) => Promise<void>;
  updateTheme: (theme: Settings['theme']) => Promise<void>;
  updateAccessibility: (accessibility: Partial<Settings['accessibility']>) => Promise<void>;
  updateDataUsage: (dataUsage: Partial<Settings['dataUsage']>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const defaultSettings: Settings = {
  theme: 'auto',
  language: 'en',
  notifications: {
    enabled: true,
    prayerTimes: true,
    reminders: true,
    advanceMinutes: 5,
  },
  location: {
    latitude: 0,
    longitude: 0,
    city: '',
    country: '',
  },
  accessibility: {
    largeText: false,
    highContrast: false,
    reducedMotion: false,
  },
  dataUsage: {
    offlineMode: false,
    cacheImages: true,
    syncFrequency: 'medium',
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('namaz_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('namaz_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await saveSettings(updatedSettings);
  };

  const updateNotificationSetting = async (key: keyof Settings['notifications'], value: any) => {
    const updatedNotifications = { ...settings.notifications, [key]: value };
    await updateSettings({ notifications: updatedNotifications });
  };

  const updateLocation = async (location: Partial<Settings['location']>) => {
    const updatedLocation = { ...settings.location, ...location };
    await updateSettings({ location: updatedLocation });
  };

  const updateTheme = async (theme: Settings['theme']) => {
    await updateSettings({ theme });
  };

  const updateAccessibility = async (accessibility: Partial<Settings['accessibility']>) => {
    const updatedAccessibility = { ...settings.accessibility, ...accessibility };
    await updateSettings({ accessibility: updatedAccessibility });
  };

  const updateDataUsage = async (dataUsage: Partial<Settings['dataUsage']>) => {
    const updatedDataUsage = { ...settings.dataUsage, ...dataUsage };
    await updateSettings({ dataUsage: updatedDataUsage });
  };

  const resetToDefaults = async () => {
    await saveSettings(defaultSettings);
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    updateNotificationSetting,
    updateLocation,
    updateTheme,
    updateAccessibility,
    updateDataUsage,
    resetToDefaults,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
