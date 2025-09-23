import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
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
import IslamicText from '../../components/ui/IslamicText';
import { BorderRadius, PrayerColors, Shadows, Spacing } from '../../constants/DesignSystem';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PrayerTimesData, prayerTimesService } from '../../services/prayerTimes';

const { width: screenWidth } = Dimensions.get('window');

interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
  isCurrent: boolean;
  color: string;
  gradient: string[];
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

interface PrayerReminder {
  id: string;
  prayer: string;
  time: string;
  enabled: boolean;
}

export default function EnhancedPrayerTimesScreen() {
  const { colors, isDark } = useTheme();
  const { settings, updateLocation } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimesData, setPrayerTimesData] = useState<PrayerTimesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });

    initializeLocation();
  }, []);

  useEffect(() => {
    if (location) {
      updatePrayerTimes();
    }
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (location) {
        updatePrayerTimes();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [location]);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      updateLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
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

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await updatePrayerTimes();
    setRefreshing(false);
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

  const getPrayerTimes = (): PrayerTime[] => {
    if (!prayerTimesData) return [];

    const prayers = [
      {
        name: 'Fajr',
        time: prayerTimesData.fajr,
        icon: 'sunrise' as keyof typeof Ionicons.glyphMap,
        description: 'Dawn Prayer',
        color: PrayerColors.fajr.primary,
        gradient: PrayerColors.fajr.gradient,
      },
      {
        name: 'Dhuhr',
        time: prayerTimesData.dhuhr,
        icon: 'sunny' as keyof typeof Ionicons.glyphMap,
        description: 'Midday Prayer',
        color: PrayerColors.dhuhr.primary,
        gradient: PrayerColors.dhuhr.gradient,
      },
      {
        name: 'Asr',
        time: prayerTimesData.asr,
        icon: 'partly-sunny' as keyof typeof Ionicons.glyphMap,
        description: 'Afternoon Prayer',
        color: PrayerColors.asr.primary,
        gradient: PrayerColors.asr.gradient,
      },
      {
        name: 'Maghrib',
        time: prayerTimesData.maghrib,
        icon: 'sunset' as keyof typeof Ionicons.glyphMap,
        description: 'Sunset Prayer',
        color: PrayerColors.maghrib.primary,
        gradient: PrayerColors.maghrib.gradient,
      },
      {
        name: 'Isha',
        time: prayerTimesData.isha,
        icon: 'moon' as keyof typeof Ionicons.glyphMap,
        description: 'Night Prayer',
        color: PrayerColors.isha.primary,
        gradient: PrayerColors.isha.gradient,
      },
    ];

    // Determine which prayer is next
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    return prayers.map((prayer, index) => {
      const [time, period] = prayer.time.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const prayerTimeMinutes = period === 'PM' && hours !== 12 ? (hours + 12) * 60 + minutes : hours * 60 + minutes;
      
      const isNext = prayerTimeMinutes > currentTimeMinutes && 
        (index === prayers.length - 1 || prayers[index + 1].time.split(' ')[0].split(':').map(Number)[0] * 60 + prayers[index + 1].time.split(' ')[0].split(':').map(Number)[1] <= currentTimeMinutes);
      
      const isCurrent = Math.abs(prayerTimeMinutes - currentTimeMinutes) <= 30;

      return {
        ...prayer,
        isNext,
        isCurrent,
      };
    });
  };

  const prayerTimes = getPrayerTimes();
  const currentNextPrayer = prayerTimes.find(prayer => prayer.isNext);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader
        title="Prayer Times"
        subtitle="Daily Prayer Schedule"
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
          {/* Current Time and Date */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.timeContainer}>
            <Card variant="gradient" gradient={['#10b981', '#059669']} style={styles.timeCard}>
              <CardContent>
                <View style={styles.timeContent}>
                  <View style={styles.timeTextContainer}>
                    <IslamicText variant="title" style={styles.currentTime}>
                      {formatTime(currentTime)}
                    </IslamicText>
                    <IslamicText variant="caption" style={styles.currentDate}>
                      {formatDate(currentTime)}
                    </IslamicText>
                  </View>
                  <View style={styles.timeIconContainer}>
                    <Ionicons name="time" size={32} color="white" />
                  </View>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Next Prayer */}
          {nextPrayer && (
            <Animated.View entering={FadeInUp.delay(400)} style={styles.nextPrayerContainer}>
              <Card variant="gradient" gradient={nextPrayer.gradient} style={styles.nextPrayerCard}>
                <CardContent>
                  <View style={styles.nextPrayerHeader}>
                    <View style={styles.nextPrayerIcon}>
                      <Ionicons name={nextPrayer.icon} size={24} color="white" />
                    </View>
                    <View style={styles.nextPrayerText}>
                      <IslamicText variant="title" style={styles.nextPrayerTitle}>
                        Next: {nextPrayer.name}
                      </IslamicText>
                      <IslamicText variant="caption" style={styles.nextPrayerTime}>
                        {nextPrayer.time}
                      </IslamicText>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Animated.View>
          )}

          {/* Prayer Times List */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.prayerTimesContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Today's Prayer Times
            </IslamicText>
            <Card style={styles.prayerTimesCard}>
              <CardContent>
                <View style={styles.prayerTimesList}>
                  {prayerTimes.map((prayer, index) => (
                    <Animated.View
                      key={prayer.name}
                      entering={FadeInDown.delay(800 + index * 100)}
                      style={[
                        styles.prayerTimeItem,
                        prayer.isCurrent && styles.currentPrayerItem,
                      ]}
                    >
                      <Card
                        variant={prayer.isCurrent ? 'gradient' : 'default'}
                        gradient={prayer.isCurrent ? prayer.gradient : undefined}
                        style={prayer.isCurrent ? 
                          {
                            ...styles.prayerTimeCard,
                            ...styles.currentPrayerCard,
                          } : 
                          styles.prayerTimeCard
                        }
                      >
                        <CardContent>
                          <View style={styles.prayerTimeContent}>
                            <View style={styles.prayerTimeInfo}>
                              <View style={styles.prayerTimeHeader}>
                                <View style={styles.prayerIconContainer}>
                                  <Ionicons
                                    name={prayer.icon}
                                    size={20}
                                    color={prayer.isCurrent ? 'white' : prayer.color}
                                  />
                                </View>
                                <View style={styles.prayerTextContainer}>
                                  <IslamicText
                                    variant="body"
                                    style={[
                                      styles.prayerName,
                                      prayer.isCurrent && styles.currentPrayerText,
                                    ]}
                                  >
                                    {prayer.name}
                                  </IslamicText>
                                  <IslamicText
                                    variant="caption"
                                    style={[
                                      styles.prayerDescription,
                                      prayer.isCurrent && styles.currentPrayerText,
                                    ]}
                                  >
                                    {prayer.description}
                                  </IslamicText>
                                </View>
                              </View>
                              <IslamicText
                                variant="title"
                                style={[
                                  styles.prayerTime,
                                  prayer.isCurrent && styles.currentPrayerText,
                                ]}
                              >
                                {prayer.time}
                              </IslamicText>
                            </View>
                            {prayer.isNext && (
                              <View style={styles.nextPrayerBadge}>
                                <IslamicText variant="caption" style={styles.nextPrayerBadgeText}>
                                  Next
                                </IslamicText>
                              </View>
                            )}
                            {prayer.isCurrent && (
                              <View style={styles.currentPrayerBadge}>
                                <IslamicText variant="caption" style={styles.currentPrayerBadgeText}>
                                  Now
                                </IslamicText>
                              </View>
                            )}
                          </View>
                        </CardContent>
                      </Card>
                    </Animated.View>
                  ))}
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Islamic Date */}
          <Animated.View entering={FadeInUp.delay(1000)} style={styles.islamicDateContainer}>
            <Card style={styles.islamicDateCard}>
              <CardContent>
                <View style={styles.islamicDateContent}>
                  <View style={styles.islamicDateIcon}>
                    <Ionicons name="calendar" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.islamicDateText}>
                    <IslamicText variant="body" style={styles.islamicDateTitle}>
                      Islamic Date
                    </IslamicText>
                    <IslamicText variant="caption" style={styles.islamicDateValue}>
                      {prayerTimesData?.islamicDate || 'Loading...'}
                    </IslamicText>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Prayer Reminders */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.remindersContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Prayer Reminders
            </IslamicText>
            <Card style={styles.remindersCard}>
              <CardContent>
                <View style={styles.remindersList}>
                  {prayerTimes.map((prayer, index) => (
                    <Animated.View
                      key={prayer.name}
                      entering={FadeInDown.delay(1400 + index * 100)}
                      style={styles.reminderItem}
                    >
                      <View style={styles.reminderContent}>
                        <View style={styles.reminderInfo}>
                          <IslamicText variant="body" style={styles.reminderName}>
                            {prayer.name} Reminder
                          </IslamicText>
                          <IslamicText variant="caption" style={styles.reminderTime}>
                            {prayer.time}
                          </IslamicText>
                        </View>
                        <TouchableOpacity style={styles.reminderToggle}>
                          <View style={[styles.toggle, { backgroundColor: colors.primary }]}>
                            <View style={styles.toggleThumb} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Location Info */}
          {location && (
            <Animated.View entering={FadeInUp.delay(1600)} style={styles.locationContainer}>
              <Card style={styles.locationCard}>
                <CardContent>
                  <View style={styles.locationContent}>
                    <View style={styles.locationIcon}>
                      <Ionicons name="location" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.locationText}>
                      <IslamicText variant="body" style={styles.locationTitle}>
                        Current Location
                      </IslamicText>
                      <IslamicText variant="caption" style={styles.locationDetails}>
                        {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                      </IslamicText>
                    </View>
                    <TouchableOpacity style={styles.refreshLocationButton}>
                      <Ionicons name="refresh" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </CardContent>
              </Card>
            </Animated.View>
          )}

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
  timeContainer: {
    marginBottom: Spacing[6],
  },
  timeCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  timeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeTextContainer: {
    flex: 1,
  },
  currentTime: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  currentDate: {
    marginTop: Spacing[1],
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextPrayerContainer: {
    marginBottom: Spacing[6],
  },
  nextPrayerCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPrayerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  nextPrayerText: {
    flex: 1,
  },
  nextPrayerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  nextPrayerTime: {
    marginTop: Spacing[1],
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing[4],
  },
  prayerTimesContainer: {
    marginBottom: Spacing[6],
  },
  prayerTimesCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  prayerTimesList: {
    gap: Spacing[2],
  },
  prayerTimeItem: {
    marginBottom: Spacing[2],
  },
  currentPrayerItem: {
    transform: [{ scale: 1.02 }],
  },
  prayerTimeCard: {
    borderRadius: BorderRadius.lg,
  },
  currentPrayerCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  prayerTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prayerTimeInfo: {
    flex: 1,
  },
  prayerTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[1],
  },
  prayerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[2],
  },
  prayerTextContainer: {
    flex: 1,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  prayerDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: '700',
  },
  currentPrayerText: {
    color: 'white',
  },
  nextPrayerBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.sm,
  },
  nextPrayerBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
  },
  currentPrayerBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.sm,
  },
  currentPrayerBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
  },
  islamicDateContainer: {
    marginBottom: Spacing[6],
  },
  islamicDateCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  islamicDateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  islamicDateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  islamicDateText: {
    flex: 1,
  },
  islamicDateTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  islamicDateValue: {
    marginTop: Spacing[1],
    opacity: 0.7,
  },
  remindersContainer: {
    marginBottom: Spacing[6],
  },
  remindersCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  remindersList: {
    gap: Spacing[3],
  },
  reminderItem: {
    paddingVertical: Spacing[2],
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  reminderTime: {
    marginTop: Spacing[1],
    fontSize: 12,
    opacity: 0.7,
  },
  reminderToggle: {
    padding: Spacing[1],
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  locationContainer: {
    marginBottom: Spacing[6],
  },
  locationCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  locationText: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationDetails: {
    marginTop: Spacing[1],
    fontSize: 12,
    opacity: 0.7,
  },
  refreshLocationButton: {
    padding: Spacing[2],
  },
  bottomSpacing: {
    height: Spacing[20],
  },
});
