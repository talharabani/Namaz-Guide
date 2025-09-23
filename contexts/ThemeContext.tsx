import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, FeatureColors, LightTheme, PrayerColors } from '../constants/DesignSystem';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeVariant = 'default' | 'minimal' | 'colorful';

interface ThemeContextType {
  mode: ThemeMode;
  variant: ThemeVariant;
  isDark: boolean;
  colors: typeof DarkTheme | typeof LightTheme;
  setMode: (mode: ThemeMode) => void;
  setVariant: (variant: ThemeVariant) => void;
  toggleTheme: () => void;
  getFeatureColor: (feature: keyof typeof FeatureColors) => string;
  getPrayerColor: (prayer: keyof typeof PrayerColors) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'namaz_theme_mode';
const VARIANT_STORAGE_KEY = 'namaz_theme_variant';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('auto');
  const [variant, setVariantState] = useState<ThemeVariant>('default');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preferences
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const [savedMode, savedVariant] = await Promise.all([
          AsyncStorage.getItem(THEME_STORAGE_KEY),
          AsyncStorage.getItem(VARIANT_STORAGE_KEY),
        ]);

        if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
          setModeState(savedMode as ThemeMode);
        }

        if (savedVariant && ['default', 'minimal', 'colorful'].includes(savedVariant)) {
          setVariantState(savedVariant as ThemeVariant);
        }
      } catch (error) {
        console.warn('Failed to load theme preferences:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemePreferences();
  }, []);

  // Save theme preferences
  const setMode = async (newMode: ThemeMode) => {
    try {
      setModeState(newMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Failed to save theme mode:', error);
    }
  };

  const setVariant = async (newVariant: ThemeVariant) => {
    try {
      setVariantState(newVariant);
      await AsyncStorage.setItem(VARIANT_STORAGE_KEY, newVariant);
    } catch (error) {
      console.warn('Failed to save theme variant:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  // Determine if dark mode should be used
  const isDark = mode === 'auto' 
    ? systemColorScheme === 'dark' 
    : mode === 'dark';

  // Get current theme colors
  const colors = isDark ? DarkTheme : LightTheme;

  // Get feature-specific colors
  const getFeatureColor = (feature: keyof typeof FeatureColors): string => {
    return FeatureColors[feature];
  };

  // Get prayer-specific colors
  const getPrayerColor = (prayer: keyof typeof PrayerColors): string => {
    return PrayerColors[prayer].primary;
  };

  // Don't render until theme is loaded
  if (!isLoaded) {
    return null;
  }

  const value: ThemeContextType = {
    mode,
    variant,
    isDark,
    colors,
    setMode,
    setVariant,
    toggleTheme,
    getFeatureColor,
    getPrayerColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme-aware color utilities
export const getThemeColors = (isDark: boolean) => {
  return isDark ? DarkTheme : LightTheme;
};

export const getContrastColor = (backgroundColor: string, isDark: boolean) => {
  // Simple contrast calculation - in a real app, you'd use a proper color contrast library
  return isDark ? '#ffffff' : '#000000';
};

export const getAlphaColor = (color: string, alpha: number) => {
  // Convert hex to rgba with alpha
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
