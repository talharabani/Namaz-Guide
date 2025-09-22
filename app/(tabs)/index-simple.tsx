import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/Theme';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const menuItems = [
    {
      id: 'prayer-times',
      title: 'Prayer Times',
      subtitle: 'Daily prayer schedule',
      icon: 'time-outline',
      color: '#10b981',
      route: '/prayer-times',
    },
    {
      id: 'qibla',
      title: 'Qibla Direction',
      subtitle: 'Find Kaaba direction',
      icon: 'compass-outline',
      color: '#3b82f6',
      route: '/qibla',
    },
    {
      id: 'learn',
      title: 'Learn Namaz',
      subtitle: 'Step-by-step guide',
      icon: 'book-outline',
      color: '#8b5cf6',
      route: '/learn',
    },
    {
      id: 'duas',
      title: 'Duas',
      subtitle: 'Islamic supplications',
      icon: 'heart-outline',
      color: '#f59e0b',
      route: '/duas',
    },
    {
      id: 'hadith',
      title: 'Hadith',
      subtitle: 'Prophet\'s sayings',
      icon: 'library-outline',
      color: '#ef4444',
      route: '/hadith',
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: 'settings-outline',
      color: '#6b7280',
      route: '/settings',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="home" size={32} color="#10b981" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Namaz Mobile</Text>
              <Text style={styles.appSubtitle}>Islamic Prayer Companion</Text>
            </View>
          </View>
        </View>

        {/* Bismillah Section */}
        <View style={styles.bismillahContainer}>
          <View style={styles.bismillahCard}>
            <Text style={styles.bismillahArabic}>
              بِسْمِ اللهِ الرّحمن الرّحيم
            </Text>
            <Text style={styles.bismillahEnglish}>
              In the name of Allah, the Most Gracious, the Most Merciful
            </Text>
          </View>
        </View>

        {/* Time Section */}
        <View style={styles.timeContainer}>
          <View style={styles.timeCard}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Quick Actions</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { marginBottom: index < menuItems.length - 2 ? 16 : 0 }]}
                activeOpacity={0.8}
              >
                <View style={[styles.menuItemCard, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={24} color="white" />
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  bismillahContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  bismillahCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  bismillahArabic: {
    fontSize: FontSizes.xxl,
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 40,
  },
  bismillahEnglish: {
    fontSize: FontSizes.md,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
  timeContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  timeCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  timeText: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontSize: FontSizes.md,
    color: '#94a3b8',
  },
  menuContainer: {
    paddingHorizontal: Spacing.lg,
  },
  menuTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.lg,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    marginBottom: Spacing.md,
  },
  menuItemCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    ...Shadows.md,
  },
  menuItemTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: 'white',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  menuItemSubtitle: {
    fontSize: FontSizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});
