import AnimatedBackground from '@/components/AnimatedBackground';
import AppLogo from '@/components/AppLogo';
import { ArabicText, BeautifulText, CalligraphyText } from '@/components/BeautifulTypography';
import { FloatingCard, GlassCard, GradientCard } from '@/components/SimpleCards';
import SimpleSwipeWrapper from '@/components/SimpleSwipeWrapper';
import { FontSizes, Spacing } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
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

  const handleSwipeUp = () => {
    router.push('/(tabs)/prayer-times');
  };

  const handleSwipeDown = () => {
    router.push('/(tabs)/settings');
  };

  const quickActions = [
    {
      title: 'Prayer Times',
      subtitle: 'View today\'s prayers',
      icon: 'time' as any,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      onPress: () => router.push('/(tabs)/prayer-times'),
    },
    {
      title: 'Qibla Direction',
      subtitle: 'Find the Kaaba',
      icon: 'compass' as any,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      onPress: () => router.push('/(tabs)/qibla'),
    },
    {
      title: 'Duas & Supplications',
      subtitle: 'Daily prayers',
      icon: 'book' as any,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      onPress: () => router.push('/(tabs)/duas'),
    },
    {
      title: 'Learn Namaz',
      subtitle: 'Step by step guide',
      icon: 'school' as any,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      onPress: () => router.push('/(tabs)/learn'),
    },
  ];

  return (
    <AnimatedBackground variant="default">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <SimpleSwipeWrapper
        currentTab="index"
        onSwipeUp={handleSwipeUp}
        onSwipeDown={handleSwipeDown}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <GlassCard style={styles.header} glow glowColor="#10b981">
            <View style={styles.headerContent}>
              <FloatingCard style={styles.logoContainer} glow glowColor="#10b981">
                <AppLogo size={60} variant="icon" />
              </FloatingCard>
              <View style={styles.headerText}>
                <CalligraphyText 
                  gradient={['#10b981', '#059669', '#047857']}
                  glow
                >
                  Namaz Mobile
                </CalligraphyText>
                <BeautifulText 
                  variant="subtitle" 
                  color="#94a3b8"
                  italic
                >
                  Your Islamic Companion
                </BeautifulText>
              </View>
            </View>
            
            {isAuthenticated && (
              <TouchableOpacity style={styles.profileButton} onPress={logout}>
                <Ionicons name="person-circle-outline" size={32} color="#10b981" />
              </TouchableOpacity>
            )}
          </GlassCard>

          {/* Bismillah Section */}
          <GradientCard 
            gradient={['rgba(252, 211, 77, 0.2)', 'rgba(245, 158, 11, 0.1)']}
            style={styles.bismillahContainer}
            glow
          >
            <GlassCard style={styles.bismillahCard} glow glowColor="#fcd34d">
              <ArabicText 
                size={28}
                color="#fcd34d"
                glow
              >
                بِسْمِ اللهِ الرّحمن الرّحيم
              </ArabicText>
              <BeautifulText 
                variant="body" 
                color="#e2e8f0"
                style={styles.bismillahEnglish}
              >
                In the name of Allah, the Most Gracious, the Most Merciful
              </BeautifulText>
            </GlassCard>
          </GradientCard>

          {/* Time Section */}
          <FloatingCard style={styles.timeContainer} glow glowColor="#8b5cf6">
            <GradientCard 
              gradient={['rgba(139, 92, 246, 0.3)', 'rgba(124, 58, 237, 0.2)']}
              style={styles.timeCard}
              glow
            >
              <BeautifulText 
                variant="title" 
                color="#ffffff"
                glow
                style={styles.timeText}
              >
                {formatTime(currentTime)}
              </BeautifulText>
              <BeautifulText 
                variant="subtitle" 
                color="#c4b5fd"
                style={styles.dateText}
              >
                {formatDate(currentTime)}
              </BeautifulText>
            </GradientCard>
          </FloatingCard>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <BeautifulText 
              variant="title" 
              color="#ffffff"
              style={styles.sectionTitle}
            >
              Quick Actions
            </BeautifulText>
            
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionItem}
                  onPress={action.onPress}
                >
                  <GradientCard
                    gradient={action.gradient}
                    style={styles.actionCard}
                    glow
                    hoverable
                  >
                    <View style={styles.actionContent}>
                      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                        <Ionicons name={action.icon} size={24} color="white" />
                      </View>
                      <View style={styles.actionText}>
                        <BeautifulText 
                          variant="body" 
                          color="#ffffff"
                          style={styles.actionTitle}
                        >
                          {action.title}
                        </BeautifulText>
                        <BeautifulText 
                          variant="caption" 
                          color="#e2e8f0"
                          style={styles.actionSubtitle}
                        >
                          {action.subtitle}
                        </BeautifulText>
                      </View>
                    </View>
                  </GradientCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <BeautifulText 
              variant="title" 
              color="#ffffff"
              style={styles.sectionTitle}
            >
              Features
            </BeautifulText>
            
            <View style={styles.featuresList}>
              <GlassCard style={styles.featureItem} glow glowColor="#10b981">
                <View style={styles.featureContent}>
                  <Ionicons name="notifications" size={24} color="#10b981" />
                  <View style={styles.featureText}>
                    <BeautifulText variant="body" color="#ffffff">
                      Prayer Time Notifications
                    </BeautifulText>
                    <BeautifulText variant="caption" color="#94a3b8">
                      Get reminded 5 minutes before each prayer
                    </BeautifulText>
                  </View>
                </View>
              </GlassCard>

              <GlassCard style={styles.featureItem} glow glowColor="#8b5cf6">
                <View style={styles.featureContent}>
                  <Ionicons name="compass" size={24} color="#8b5cf6" />
                  <View style={styles.featureText}>
                    <BeautifulText variant="body" color="#ffffff">
                      Accurate Qibla Direction
                    </BeautifulText>
                    <BeautifulText variant="caption" color="#94a3b8">
                      Find the direction of the Kaaba from anywhere
                    </BeautifulText>
                  </View>
                </View>
              </GlassCard>

              <GlassCard style={styles.featureItem} glow glowColor="#f59e0b">
                <View style={styles.featureContent}>
                  <Ionicons name="book" size={24} color="#f59e0b" />
                  <View style={styles.featureText}>
                    <BeautifulText variant="body" color="#ffffff">
                      Comprehensive Duas
                    </BeautifulText>
                    <BeautifulText variant="caption" color="#94a3b8">
                      Daily supplications and prayers
                    </BeautifulText>
                  </View>
                </View>
              </GlassCard>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SimpleSwipeWrapper>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  profileButton: {
    padding: Spacing.sm,
  },
  bismillahContainer: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bismillahCard: {
    alignItems: 'center',
  },
  bismillahEnglish: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  timeContainer: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
  },
  timeCard: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
  },
  dateText: {
    marginTop: Spacing.xs,
  },
  quickActionsContainer: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    marginBottom: Spacing.md,
  },
  actionCard: {
    padding: Spacing.md,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionText: {
    alignItems: 'center',
  },
  actionTitle: {
    textAlign: 'center',
    fontWeight: '600',
  },
  actionSubtitle: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  featuresContainer: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
  },
  featuresList: {
    gap: Spacing.md,
  },
  featureItem: {
    padding: Spacing.md,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  bottomSpacing: {
    height: 100,
  },
});