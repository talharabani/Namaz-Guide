import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../contexts/AuthContext';
import { SettingsProvider } from '../contexts/SettingsContext';
import { notificationService } from '../services/notifications';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Initialize notifications when app loads
  React.useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Only initialize notifications if not in Expo Go (to avoid warnings)
        if (process.env.EXPO_OS !== 'web') {
          await notificationService.registerForPushNotificationsAsync();
          await notificationService.schedulePrayerTimeNotifications();
          await notificationService.scheduleReminderNotifications();
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        // Don't crash the app if notifications fail
      }
    };

    if (loaded) {
      initializeNotifications();
    }
  }, [loaded]);

  // Debug: Log app layout state
  React.useEffect(() => {
    console.log('App Layout - Fonts loaded:', loaded);
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SettingsProvider>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="duas" options={{ title: 'Duas', headerShown: false }} />
              <Stack.Screen name="hadith" options={{ title: 'Hadith', headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" backgroundColor="#0f172a" />
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
