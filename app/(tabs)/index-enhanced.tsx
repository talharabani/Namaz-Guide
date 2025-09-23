import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import AppHeader from '../../components/navigation/AppHeader';
import Card, { CardContent } from '../../components/ui/Card';
import IslamicText, { Bismillah } from '../../components/ui/IslamicText';
import { BorderRadius, FeatureColors, PrayerColors, Shadows, Spacing } from '../../constants/DesignSystem';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface QuickStat {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface RecentActivity {
  id: string;
  title: string;
  time: string;
  status: 'completed' | 'pending' | 'in-progress';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
  color: string;
  gradient: string[];
}

export default function EnhancedHomeScreen() {
  const { colors, isDark, getFeatureColor } = useTheme();
  const { user } = useAuth();
  const { settings } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

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

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCardPress = useCallback((route: string) => {
    router.push(`/(tabs)/${route}` as any);
  }, []);

  // Quick stats data
  const quickStats: QuickStat[] = [
    {
      id: 'prayers',
      label: 'Prayers Today',
      value: '5',
      icon: 'time',
      color: FeatureColors.prayer,
      gradient: PrayerColors.dhuhr.gradient,
      trend: 'up',
      trendValue: '+1',
    },
    {
      id: 'streak',
      label: 'Prayer Streak',
      value: '12 days',
      icon: 'flame',
      color: FeatureColors.duas,
      gradient: ['#f59e0b', '#d97706'],
      trend: 'up',
      trendValue: '+2',
    },
    {
      id: 'duas',
      label: 'Duas Read',
      value: '24',
      icon: 'book',
      color: FeatureColors.duas,
      gradient: ['#f59e0b', '#d97706'],
      trend: 'up',
      trendValue: '+3',
    },
    {
      id: 'progress',
      label: 'Learning Progress',
      value: '85%',
      icon: 'trending-up',
      color: FeatureColors.progress,
      gradient: ['#3b82f6', '#2563eb'],
      trend: 'up',
      trendValue: '+5%',
    },
  ];

  // Prayer times data
  const prayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '5:30 AM', isNext: false, color: PrayerColors.fajr.primary, gradient: PrayerColors.fajr.gradient },
    { name: 'Dhuhr', time: '12:15 PM', isNext: true, color: PrayerColors.dhuhr.primary, gradient: PrayerColors.dhuhr.gradient },
    { name: 'Asr', time: '3:45 PM', isNext: false, color: PrayerColors.asr.primary, gradient: PrayerColors.asr.gradient },
    { name: 'Maghrib', time: '6:20 PM', isNext: false, color: PrayerColors.maghrib.primary, gradient: PrayerColors.maghrib.gradient },
    { name: 'Isha', time: '7:45 PM', isNext: false, color: PrayerColors.isha.primary, gradient: PrayerColors.isha.gradient },
  ];

  // Recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      title: 'Fajr Prayer',
      time: '5:30 AM',
      status: 'completed',
      icon: 'checkmark-circle',
      color: '#10b981',
    },
    {
      id: '2',
      title: 'Dua Reading',
      time: '6:15 AM',
      status: 'completed',
      icon: 'book',
      color: '#f59e0b',
    },
    {
      id: '3',
      title: 'Quran Study',
      time: '7:00 AM',
      status: 'in-progress',
      icon: 'library',
      color: '#8b5cf6',
    },
  ];

  // Feature cards
  const featureCards = [
    {
      id: 'qibla',
      title: 'Qibla Direction',
      description: 'Find the direction of Kaaba',
      icon: 'compass-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.qibla,
      gradient: ['#06b6d4', '#0891b2'],
      route: 'qibla',
    },
    {
      id: 'duas',
      title: 'Duas & Supplications',
      description: 'Islamic prayers and supplications',
      icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.duas,
      gradient: ['#f59e0b', '#d97706'],
      route: 'duas',
    },
    {
      id: 'learn',
      title: 'Learn Namaz',
      description: 'Step-by-step prayer guide',
      icon: 'school-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.learn,
      gradient: ['#22c55e', '#16a34a'],
      route: 'learn',
    },
    {
      id: 'quiz',
      title: 'Islamic Quiz',
      description: 'Test your knowledge',
      icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.quiz,
      gradient: ['#ec4899', '#db2777'],
      route: 'quiz',
    },
    {
      id: 'progress',
      title: 'Progress Tracker',
      description: 'Track your learning',
      icon: 'stats-chart-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.progress,
      gradient: ['#3b82f6', '#2563eb'],
      route: 'progress',
    },
    {
      id: 'mistakes',
      title: 'Common Mistakes',
      description: 'Learn from errors',
      icon: 'alert-circle-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.mistakes,
      gradient: ['#f97316', '#ea580c'],
      route: 'mistakes',
    },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader
        title="Namaz Mobile"
        subtitle="Your Islamic Companion"
        variant="gradient"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Bismillah Section */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.bismillahContainer}>
            <Card variant="gradient" gradient={['#fcd34d', '#f59e0b']} style={styles.bismillahCard}>
              <CardContent>
                <Bismillah style={styles.bismillahText} />
                <IslamicText variant="translation" style={styles.bismillahTranslation}>
                  In the name of Allah, the Most Gracious, the Most Merciful
                </IslamicText>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Greeting and Time */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.greetingContainer}>
            <Card style={styles.greetingCard}>
              <CardContent>
                <View style={styles.greetingContent}>
                  <View style={styles.greetingText}>
                    <IslamicText variant="title" style={styles.greeting}>
                      {greeting}, {user?.name || 'User'}!
                    </IslamicText>
                    <IslamicText variant="caption" style={styles.date}>
                      {formatDate(currentTime)}
                    </IslamicText>
                  </View>
                  <View style={styles.timeContainer}>
                    <IslamicText variant="title" style={styles.time}>
                      {formatTime(currentTime)}
                    </IslamicText>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.statsContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Today's Progress
            </IslamicText>
            <View style={styles.statsGrid}>
              {quickStats.map((stat, index) => (
                <Animated.View
                  key={stat.id}
                  entering={FadeInDown.delay(800 + index * 100)}
                  style={styles.statCard}
                >
                  <Card variant="gradient" gradient={stat.gradient} style={styles.statCardContent}>
                    <CardContent>
                      <View style={styles.statHeader}>
                        <View style={styles.statIconContainer}>
                          <Ionicons name={stat.icon} size={20} color="white" />
                        </View>
                        {stat.trend && (
                          <View style={styles.trendContainer}>
                            <Ionicons
                              name={stat.trend === 'up' ? 'trending-up' : 'trending-down'}
                              size={12}
                              color="rgba(255, 255, 255, 0.8)"
                            />
                            <IslamicText variant="caption" style={styles.trendText}>
                              {stat.trendValue || ''}
                            </IslamicText>
                          </View>
                        )}
                      </View>
                      <IslamicText variant="title" style={styles.statValue}>
                        {stat.value}
                      </IslamicText>
                      <IslamicText variant="caption" style={styles.statLabel}>
                        {stat.label}
                      </IslamicText>
                    </CardContent>
                  </Card>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Prayer Times */}
          <Animated.View entering={FadeInUp.delay(1000)} style={styles.prayerContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Prayer Times
            </IslamicText>
            <Card style={styles.prayerCard}>
              <CardContent>
                <View style={styles.prayerTimesList}>
                  {prayerTimes.map((prayer, index) => (
                    <Animated.View
                      key={prayer.name}
                      entering={FadeInDown.delay(1200 + index * 100)}
                      style={styles.prayerTimeItem}
                    >
                      <View style={styles.prayerTimeContent}>
                        <View style={styles.prayerTimeInfo}>
                          <IslamicText variant="body" style={styles.prayerName}>
                            {prayer.name}
                          </IslamicText>
                          <IslamicText variant="caption" style={styles.prayerTime}>
                            {prayer.time}
                          </IslamicText>
                        </View>
                        {prayer.isNext && (
                          <View style={[styles.nextPrayerBadge, { backgroundColor: prayer.color }]}>
                            <IslamicText variant="caption" style={styles.nextPrayerText}>
                              Next
                            </IslamicText>
                          </View>
                        )}
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Feature Cards */}
          <Animated.View entering={FadeInUp.delay(1400)} style={styles.featuresContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Features
            </IslamicText>
            <View style={styles.featuresGrid}>
              {featureCards.map((card, index) => (
                <Animated.View
                  key={card.id}
                  entering={FadeInDown.delay(1600 + index * 100)}
                  style={styles.featureCard}
                >
                  <Card
                    variant="gradient"
                    gradient={card.gradient}
                    onPress={() => handleCardPress(card.route)}
                    style={styles.featureCardContent}
                  >
                    <CardContent>
                      <View style={styles.featureIconContainer}>
                        <Ionicons name={card.icon} size={28} color="white" />
                      </View>
                      <IslamicText variant="body" style={styles.featureTitle}>
                        {card.title}
                      </IslamicText>
                      <IslamicText variant="caption" style={styles.featureDescription}>
                        {card.description}
                      </IslamicText>
                    </CardContent>
                  </Card>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Recent Activities */}
          <Animated.View entering={FadeInUp.delay(1800)} style={styles.activitiesContainer}>
            <View style={styles.activitiesHeader}>
              <IslamicText variant="subtitle" style={styles.sectionTitle}>
                Recent Activities
              </IslamicText>
              <TouchableOpacity style={styles.viewAllButton}>
                <IslamicText variant="caption" style={styles.viewAllText}>
                  View All
                </IslamicText>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Card style={styles.activitiesCard}>
              <CardContent>
                <View style={styles.activitiesList}>
                  {recentActivities.map((activity, index) => (
                    <Animated.View
                      key={activity.id}
                      entering={FadeInDown.delay(2000 + index * 100)}
                      style={styles.activityItem}
                    >
                      <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                        <Ionicons name={activity.icon} size={18} color="white" />
                      </View>
                      <View style={styles.activityContent}>
                        <IslamicText variant="body" style={styles.activityTitle}>
                          {activity.title}
                        </IslamicText>
                        <IslamicText variant="caption" style={styles.activityTime}>
                          {activity.time}
                        </IslamicText>
                      </View>
                      <View style={[
                        styles.activityStatus,
                        { backgroundColor: activity.status === 'completed' ? '#10b981' : '#f59e0b' }
                      ]}>
                        <IslamicText variant="caption" style={styles.activityStatusText}>
                          {activity.status === 'completed' ? 'Done' : 'In Progress'}
                        </IslamicText>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
  },
  bismillahContainer: {
    marginBottom: Spacing[6],
  },
  bismillahCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  bismillahText: {
    textAlign: 'center',
    marginBottom: Spacing[3],
  },
  bismillahTranslation: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
  },
  greetingContainer: {
    marginBottom: Spacing[6],
  },
  greetingCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
  },
  date: {
    marginTop: Spacing[1],
    opacity: 0.7,
  },
  timeContainer: {
    alignItems: 'center',
  },
  time: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing[4],
  },
  statsContainer: {
    marginBottom: Spacing[6],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (screenWidth - Spacing[4] * 2 - Spacing[3]) / 2,
    marginBottom: Spacing[3],
  },
  statCardContent: {
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    marginLeft: Spacing[1],
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: Spacing[1],
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  prayerContainer: {
    marginBottom: Spacing[6],
  },
  prayerCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  prayerTimesList: {
    gap: Spacing[2],
  },
  prayerTimeItem: {
    paddingVertical: Spacing[2],
  },
  prayerTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prayerTimeInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  prayerTime: {
    marginTop: Spacing[1],
    opacity: 0.7,
  },
  nextPrayerBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.sm,
  },
  nextPrayerText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
  },
  featuresContainer: {
    marginBottom: Spacing[6],
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (screenWidth - Spacing[4] * 2 - Spacing[3]) / 2,
    marginBottom: Spacing[3],
  },
  featureCardContent: {
    borderRadius: BorderRadius.lg,
    minHeight: 140,
    ...Shadows.md,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: Spacing[1],
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  activitiesContainer: {
    marginBottom: Spacing[6],
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.lg,
  },
  viewAllText: {
    marginRight: Spacing[1],
    color: '#10b981',
    fontWeight: '600',
  },
  activitiesCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  activitiesList: {
    gap: Spacing[3],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing[1],
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  activityStatus: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.sm,
  },
  activityStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: Spacing[20],
  },
});
