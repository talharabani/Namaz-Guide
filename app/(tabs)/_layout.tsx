import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import ProfessionalTabBar from '@/components/ProfessionalTabBar';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return null;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

      return (
        <Tabs
          tabBar={(props) => <ProfessionalTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' }, // Hide default tab bar
          }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="prayer-times"
        options={{
          title: 'Prayer Times',
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          title: 'Qibla',
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: 'Duas',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
        }}
      />
      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: 'AI Help',
        }}
      />
      <Tabs.Screen
        name="mistakes"
        options={{
          title: 'Mistakes',
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
