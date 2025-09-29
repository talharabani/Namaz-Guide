import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface Settings {
  location: LocationData | null;
  prayerMethod: 'Umm al-Qura' | 'Muslim World League' | 'Islamic Society of North America' | 'Egyptian General Authority of Survey';
  asrMethod: 'Standard' | 'Hanafi';
  highLatitudeMethod: 'None' | 'Angle Based' | 'One Seventh' | 'Night Interval';
  notifications: {
    enabled: boolean;
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
    reminderMinutes: number;
  };
  language: string;
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  updateLocation: (location: Location.LocationObject | LocationData) => void;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location.LocationObject | null>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'namaz_settings';

const defaultSettings: Settings = {
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
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateLocation = (location: Location.LocationObject | LocationData) => {
    let locationData: LocationData;
    
    if ('coords' in location) {
      // It's a Location.LocationObject
      locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        city: 'Current Location', // You might want to reverse geocode this
        country: 'Unknown',
      };
    } else {
      // It's already a LocationData object
      locationData = location;
    }

    const newSettings = { ...settings, location: locationData };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({});
      updateLocation(location);
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  };

  const value: SettingsContextType = {
    settings,
    isLoading,
    updateLocation,
    updateSettings,
    requestLocationPermission,
    getCurrentLocation,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}