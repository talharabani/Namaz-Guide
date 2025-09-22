import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { BorderRadius, Spacing } from '../constants/Theme';

const { width } = Dimensions.get('window');

const mainTabs = [
  { name: 'Home', icon: 'home' as any, route: 'index', color: '#10b981' },
  { name: 'Prayer', icon: 'time' as any, route: 'prayer-times', color: '#8b5cf6' },
  { name: 'Qibla', icon: 'compass' as any, route: 'qibla', color: '#f59e0b' },
  { name: 'More', icon: 'ellipsis-horizontal' as any, route: 'more', color: '#64748b' },
];

const secondaryTabs = [
  { name: 'Duas', icon: 'book', route: 'duas', color: '#ef4444' },
  { name: 'Progress', icon: 'stats-chart', route: 'progress', color: '#3b82f6' },
  { name: 'Quiz', icon: 'help-circle', route: 'quiz', color: '#ec4899' },
  { name: 'AI Help', icon: 'chatbox', route: 'ai-assistant', color: '#a855f7' },
  { name: 'Mistakes', icon: 'alert-circle', route: 'mistakes', color: '#f97316' },
  { name: 'Learn', icon: 'school', route: 'learn', color: '#22c55e' },
  { name: 'Settings', icon: 'settings', route: 'settings', color: '#6b7280' },
];

export default function SimpleTabBar({ state }: BottomTabBarProps) {
  const handleTabPress = (tab: any) => {
    router.push(`/(tabs)/${tab.route}` as any);
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* Main Tabs */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.95)', 'rgba(15, 23, 42, 0.9)']}
        style={styles.mainTabBar}
      >
        {mainTabs.map((tab, index) => {
          const isFocused = state.index === index;
          const selectedTab = state.routes[state.index].name;

          if (tab.route === 'more') {
            return (
              <Pressable
                key={tab.route}
                style={styles.mainTabButton}
                onPress={() => {
                  // Show secondary tabs or navigate to a more screen
                  router.push('/(tabs)/settings' as any);
                }}
              >
                <View style={[
                  styles.mainTabContent,
                  { backgroundColor: isFocused ? tab.color : 'transparent' }
                ]}>
                  <Ionicons 
                    name={tab.icon} 
                    size={24} 
                    color={isFocused ? 'white' : '#94a3b8'} 
                  />
                  <Text style={[
                    styles.mainTabText,
                    { color: isFocused ? 'white' : '#94a3b8' }
                  ]}>
                    {tab.name}
                  </Text>
                </View>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.route}
              style={styles.mainTabButton}
              onPress={() => handleTabPress(tab)}
            >
              <View style={[
                styles.mainTabContent,
                { backgroundColor: selectedTab === tab.route ? tab.color : 'transparent' }
              ]}>
                <Ionicons 
                  name={tab.icon} 
                  size={24} 
                  color={selectedTab === tab.route ? 'white' : '#94a3b8'} 
                />
                <Text style={[
                  styles.mainTabText,
                  { color: selectedTab === tab.route ? 'white' : '#94a3b8' }
                ]}>
                  {tab.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainTabBar: {
    flexDirection: 'row',
    width: width - Spacing.lg * 2,
    margin: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainTabButton: {
    flex: 1,
    alignItems: 'center',
  },
  mainTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    minWidth: 60,
    justifyContent: 'center',
  },
  mainTabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});
