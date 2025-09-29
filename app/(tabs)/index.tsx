import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import SimpleSwipeWrapper from '../../components/SimpleSwipeWrapper';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { PrayerTimesData, prayerTimesService } from '../../services/prayerTimes';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimesData, setPrayerTimesData] = useState<PrayerTimesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string, timeLeft: string} | null>(null);
  const [completedPrayers, setCompletedPrayers] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  // Animated styles - must be defined at component level
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }]
  }));

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });

    initializeLocation();
    loadInitialData();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (prayerTimesData) {
        updateNextPrayer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimesData]);

  useEffect(() => {
    if (location) {
      updatePrayerTimes();
    }
  }, [location]);


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

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        setIsLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      setIsLoading(false);
    }
  };

  const updatePrayerTimes = async () => {
    if (!location) return;

    try {
      setIsLoading(true);
      const times = await prayerTimesService.getPrayerTimes(
        location.coords.latitude,
        location.coords.longitude
      );
      setPrayerTimesData(times);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNextPrayer = () => {
    if (!prayerTimesData) return;

    const now = new Date();
    const prayers = [
      { name: 'Fajr', time: prayerTimesData.fajr },
      { name: 'Dhuhr', time: prayerTimesData.dhuhr },
      { name: 'Asr', time: prayerTimesData.asr },
      { name: 'Maghrib', time: prayerTimesData.maghrib },
      { name: 'Isha', time: prayerTimesData.isha },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      if (prayerTime > now) {
        const timeLeft = prayerTime.getTime() - now.getTime();
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        setNextPrayer({
          name: prayer.name,
          time: prayer.time,
          timeLeft: `${hoursLeft}h ${minutesLeft}m`
        });
        break;
      }
    }
  };


  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await updatePrayerTimes();
    setRefreshing(false);
  }, [location]);

  const handleSwipeUp = () => {
    router.push('/(tabs)/prayer-times');
  };

  const handleSwipeDown = () => {
    router.push('/(tabs)/settings');
  };

  const handleCardPress = (route: string) => {
    router.push(`/(tabs)/${route}` as any);
  };

  const markPrayerCompleted = (prayerName: string) => {
    setCompletedPrayers(prev => {
      if (prev.includes(prayerName)) {
        return prev.filter(p => p !== prayerName);
      } else {
        return [...prev, prayerName];
      }
    });
  };

  // Function to mark prayer as completed from anywhere in the app
  const markPrayerAsCompleted = (prayerName: string) => {
    if (!completedPrayers.includes(prayerName)) {
      setCompletedPrayers(prev => [...prev, prayerName]);
    }
  };

  const markActivityCompleted = (activityName: string) => {
    setCompletedActivities(prev => {
      if (prev.includes(activityName)) {
        return prev.filter(a => a !== activityName);
      } else {
        return [...prev, activityName];
      }
    });
  };

  const loadInitialData = () => {
    // Load from AsyncStorage or set default values
    // For now, we'll start with empty arrays (no completed activities)
    setCompletedPrayers([]);
    setCompletedActivities([]);
  };


  // Recent activities - now dynamic and includes all prayers
  const recentActivities = useMemo(() => {
    const activities = [];
    
    // Add all 5 daily prayers if prayer times are available
    if (prayerTimesData) {
      const prayers = [
        { name: 'Fajr', time: prayerTimesData.fajr, icon: 'sunny' },
        { name: 'Dhuhr', time: prayerTimesData.dhuhr, icon: 'sunny' },
        { name: 'Asr', time: prayerTimesData.asr, icon: 'partly-sunny' },
        { name: 'Maghrib', time: prayerTimesData.maghrib, icon: 'moon' },
        { name: 'Isha', time: prayerTimesData.isha, icon: 'moon' },
      ];
      
      prayers.forEach(prayer => {
        activities.push({
          title: `${prayer.name} Prayer`,
          time: prayer.time,
          status: completedPrayers.includes(prayer.name) ? 'Completed' : 'Pending',
          icon: completedPrayers.includes(prayer.name) ? 'checkmark-circle' : prayer.icon as any,
          color: completedPrayers.includes(prayer.name) ? '#10b981' : '#6b7280',
          onPress: () => markPrayerCompleted(prayer.name)
        });
      });
    }
    
    // Add other activities
    const otherActivities = [
      { 
        title: 'Dua Reading', 
        time: '6:15 AM', 
        status: completedActivities.includes('Dua Reading') ? 'Completed' : 'Pending', 
        icon: completedActivities.includes('Dua Reading') ? 'checkmark-circle' : 'book' as any, 
        color: completedActivities.includes('Dua Reading') ? '#f59e0b' : '#6b7280',
        onPress: () => markActivityCompleted('Dua Reading')
      },
      { 
        title: 'Quran Study', 
        time: '7:00 AM', 
        status: completedActivities.includes('Quran Study') ? 'Completed' : 'Pending', 
        icon: completedActivities.includes('Quran Study') ? 'checkmark-circle' : 'library' as any, 
        color: completedActivities.includes('Quran Study') ? '#8b5cf6' : '#6b7280',
        onPress: () => markActivityCompleted('Quran Study')
      },
    ];
    
    activities.push(...otherActivities);
    
    // Return only the most recent 5 activities
    return activities.slice(0, 5);
  }, [prayerTimesData, completedPrayers, completedActivities]);
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
      />
      
      <SimpleSwipeWrapper
        currentTab="index"
        onSwipeUp={handleSwipeUp}
        onSwipeDown={handleSwipeDown}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#10b981"
              colors={['#10b981']}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Ionicons name="home" size={28} color="#10b981" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.appName}>Namaz Mobile</Text>
                <Text style={styles.appSubtitle}>Your Islamic Companion</Text>
              </View>
            </View>
            
            {isAuthenticated && (
              <TouchableOpacity style={styles.profileButton} onPress={logout}>
                <Ionicons name="person-circle-outline" size={32} color="#10b981" />
              </TouchableOpacity>
            )}
          </View>

          {/* Bismillah Section */}
          <View style={styles.bismillahContainer}>
            <View style={styles.bismillahCard}>
              <Text style={styles.arabicText}>بِسْمِ اللهِ الرّحمن الرّحيم</Text>
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

          {/* Next Prayer Section */}
          {nextPrayer && (
            <Animated.View style={[styles.nextPrayerContainer, animatedStyle]}>
              <View style={styles.nextPrayerCard}>
                <View style={styles.nextPrayerHeader}>
                  <Ionicons name="time" size={24} color="#10b981" />
                  <Text style={styles.nextPrayerTitle}>Next Prayer</Text>
                </View>
                <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
                <Text style={styles.nextPrayerCountdown}>in {nextPrayer.timeLeft}</Text>
              </View>
            </Animated.View>
          )}



          {/* Quick Actions */}
          <Animated.View style={[styles.quickActionsContainer, animatedStyle]}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/(tabs)/qibla')}
              >
                <Ionicons name="compass" size={24} color="#06b6d4" />
                <Text style={styles.quickActionText}>Qibla</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/(tabs)/duas')}
              >
                <Ionicons name="book" size={24} color="#f59e0b" />
                <Text style={styles.quickActionText}>Duas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/(tabs)/learn')}
              >
                <Ionicons name="school" size={24} color="#22c55e" />
                <Text style={styles.quickActionText}>Learn</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/(tabs)/quiz')}
              >
                <Ionicons name="help-circle" size={24} color="#ec4899" />
                <Text style={styles.quickActionText}>Quiz</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/(tabs)/progress')}
              >
                <Ionicons name="trending-up" size={24} color="#8b5cf6" />
                <Text style={styles.quickActionText}>Progress</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/(tabs)/mistakes')}
              >
                <Ionicons name="warning" size={24} color="#ef4444" />
                <Text style={styles.quickActionText}>Mistakes</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Notification Status */}
          <Animated.View style={[styles.notificationStatusContainer, animatedStyle]}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.notificationStatusCard}>
              <View style={styles.notificationStatusItem}>
                <Ionicons name="notifications" size={20} color="#10b981" />
                <Text style={styles.notificationStatusText}>Prayer Reminders</Text>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              </View>
              <View style={styles.notificationStatusItem}>
                <Ionicons name="volume-high" size={20} color="#f59e0b" />
                <Text style={styles.notificationStatusText}>Sound Enabled</Text>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              </View>
              <TouchableOpacity 
                style={styles.notificationSettingsButton}
                onPress={() => router.push('/(tabs)/settings')}
              >
                <Text style={styles.notificationSettingsText}>Manage Settings</Text>
                <Ionicons name="arrow-forward" size={16} color="#10b981" />
              </TouchableOpacity>
            </View>
          </Animated.View>


          {/* Recent Activities */}
          <View style={styles.activitiesContainer}>
            <View style={styles.activitiesHeader}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="arrow-forward" size={16} color="#10b981" />
              </TouchableOpacity>
            </View>
            <View style={styles.activitiesList}>
              {recentActivities.map((activity, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.activityItem}
                  onPress={activity.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                    <Ionicons name={activity.icon} size={18} color="white" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <View style={[
                    styles.activityStatus, 
                    { backgroundColor: activity.status === 'Completed' ? '#10b981' : '#6b7280' }
                  ]}>
                    <Text style={styles.activityStatusText}>{activity.status}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SimpleSwipeWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  profileButton: {
    padding: Spacing.sm,
  },
  bismillahContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  bismillahCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  arabicText: {
    fontSize: FontSizes.xl,
    color: '#fcd34d',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  bismillahEnglish: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
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
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  // Activities Section
  activitiesContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginRight: 4,
  },
  activitiesList: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 120 : 100, // Account for tab bar height
  },
  // Next Prayer Section
  nextPrayerContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  nextPrayerCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  nextPrayerTitle: {
    fontSize: FontSizes.md,
    color: '#10b981',
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  nextPrayerName: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  nextPrayerTime: {
    fontSize: FontSizes.xl,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  nextPrayerCountdown: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  // Quick Actions Section
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickActionButton: {
    width: (width - Spacing.lg * 2 - 16) / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: FontSizes.sm,
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
  },
  // Notification Status Section
  notificationStatusContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  notificationStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  notificationStatusText: {
    fontSize: FontSizes.md,
    color: 'white',
    marginLeft: Spacing.sm,
    flex: 1,
  },
  notificationSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  notificationSettingsText: {
    fontSize: FontSizes.sm,
    color: '#10b981',
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
});