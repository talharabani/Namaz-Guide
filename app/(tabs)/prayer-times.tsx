import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import SimpleSwipeWrapper from '../../components/SimpleSwipeWrapper';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';
import { useSettings } from '../../contexts/SettingsContext';
import { PrayerTimesData, prayerTimesService } from '../../services/prayerTimes';

const { width } = Dimensions.get('window');

export default function PrayerTimesScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimesData, setPrayerTimesData] = useState<PrayerTimesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const { settings, updateLocation } = useSettings();

  useEffect(() => {
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
      // Try to get current location first
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation && currentLocation.coords) {
          setLocation(currentLocation);
          
          // Update settings with current location
          try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            });
            
            if (reverseGeocode && reverseGeocode.length > 0) {
              const address = reverseGeocode[0];
              updateLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                city: address?.city || 'Unknown City',
                country: address?.country || 'Unknown Country',
              });
            }
          } catch (geocodeError) {
            console.warn('Geocoding failed:', geocodeError);
            // Set default location info if geocoding fails
            updateLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              city: 'Current Location',
              country: 'Unknown',
            });
          }
        } else {
          throw new Error('Invalid location data received');
        }
      } else {
        // Use default location from settings or fallback to New York
        const defaultLocation = {
          latitude: settings?.location?.latitude || 40.7128,
          longitude: settings?.location?.longitude || -74.0060,
        };
        setLocation({
          coords: {
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as Location.LocationObject);
        
        // Update location info with default values
        updateLocation({
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          city: settings?.location?.city || 'New York',
          country: settings?.location?.country || 'USA',
        });
      }
    } catch (error) {
      console.warn('Error getting location:', error);
      // Fallback to default location
      const defaultLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
      };
      setLocation({
        coords: {
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as Location.LocationObject);
      
      // Update location info with fallback values
      updateLocation({
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
        city: 'New York',
        country: 'USA',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrayerTimes = async () => {
    if (location && location.coords) {
      try {
        const data = await prayerTimesService.getPrayerTimes(
          location.coords.latitude,
          location.coords.longitude,
          currentTime
        );
        setPrayerTimesData(data);
      } catch (error) {
        console.warn('Error fetching prayer times:', error);
      }
    }
  };

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

  const handleSwipeUp = () => {
    // Show settings or additional options
    console.log('Swipe up detected');
  };

  const handleSwipeDown = () => {
    // Refresh prayer times
    console.log('Swipe down detected');
    updatePrayerTimes();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.appName}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
          <SimpleSwipeWrapper
            currentTab="prayer-times"
            onSwipeUp={handleSwipeUp}
            onSwipeDown={handleSwipeDown}
          >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="time" size={28} color="#10b981" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Prayer Times</Text>
              <Text style={styles.appSubtitle}>Daily prayer schedule</Text>
            </View>
          </View>
        </View>

        {/* Current Time */}
        <View style={styles.timeContainer}>
          <View style={styles.timeCard}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
            {prayerTimesData?.nextPrayer && (
              <View style={styles.nextPrayerInfo}>
                <Text style={styles.nextPrayerLabel}>Next Prayer:</Text>
                <Text style={styles.nextPrayerName}>{prayerTimesData.nextPrayer.name}</Text>
                <Text style={styles.nextPrayerTime}>{prayerTimesData.timeUntilNext}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Today's Prayer Times Quick View */}
        {prayerTimesData && (
          <View style={styles.quickPrayerTimesContainer}>
            <Text style={styles.sectionTitle}>Today's Prayer Times</Text>
            <View style={styles.quickPrayerTimesGrid}>
              {[
                { name: 'Fajr', time: prayerTimesData?.fajr, icon: 'sunny' },
                { name: 'Dhuhr', time: prayerTimesData?.dhuhr, icon: 'sunny' },
                { name: 'Asr', time: prayerTimesData?.asr, icon: 'partly-sunny' },
                { name: 'Maghrib', time: prayerTimesData?.maghrib, icon: 'moon' },
                { name: 'Isha', time: prayerTimesData?.isha, icon: 'moon' },
              ].map((prayer, index) => (
                <View key={index} style={styles.quickPrayerTimeItem}>
                  <Ionicons name={prayer.icon as any} size={20} color="#10b981" />
                  <Text style={styles.quickPrayerTimeName}>{prayer.name}</Text>
                  <Text style={styles.quickPrayerTimeValue}>{prayer.time}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Location Info */}
        <View style={styles.locationContainer}>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location-outline" size={20} color="#10b981" />
              <Text style={styles.locationText}>Current Location</Text>
            </View>
            <Text style={styles.locationName}>
              {settings?.location?.city && settings?.location?.country 
                ? `${settings.location.city}, ${settings.location.country}`
                : 'Location not available'
              }
            </Text>
            <Text style={styles.locationCoords}>
              {location?.coords?.latitude && location?.coords?.longitude ? 
                `${location.coords.latitude.toFixed(4)}° N, ${location.coords.longitude.toFixed(4)}° W` :
                'Coordinates not available'
              }
            </Text>
          </View>
        </View>

        {/* Prayer Times List */}
        <View style={styles.prayerContainer}>
          <Text style={styles.sectionTitle}>Today's Prayer Times</Text>
          {prayerTimesData && [
            { name: 'Fajr', time: prayerTimesData?.fajr, icon: 'sunny' },
            { name: 'Dhuhr', time: prayerTimesData?.dhuhr, icon: 'sunny' },
            { name: 'Asr', time: prayerTimesData?.asr, icon: 'partly-sunny' },
            { name: 'Maghrib', time: prayerTimesData?.maghrib, icon: 'moon' },
            { name: 'Isha', time: prayerTimesData?.isha, icon: 'moon' },
          ].map((prayer, index) => (
            <View key={prayer.name} style={styles.prayerItem}>
              <View style={styles.prayerCard}>
                <View style={styles.prayerContent}>
                  <View style={styles.prayerInfo}>
                    <View style={styles.prayerIconContainer}>
                      <Ionicons 
                        name={prayer.icon as any} 
                        size={24} 
                        color="#94a3b8" 
                      />
                    </View>
                    <View style={styles.prayerDetails}>
                      <Text style={styles.prayerName}>
                        {prayer.name}
                      </Text>
                      <Text style={styles.prayerTime}>{prayer.time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#10b981" />
              <Text style={styles.infoText}>Islamic Date: {prayerTimesData?.hijriDate || 'Loading...'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calculator-outline" size={20} color="#10b981" />
              <Text style={styles.infoText}>Calculation Method: North America</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="refresh-outline" size={20} color="#10b981" />
              <Text style={styles.infoText}>Auto-updated in real-time</Text>
            </View>
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
    marginBottom: Spacing.sm,
  },
  nextPrayerInfo: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  nextPrayerLabel: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginBottom: Spacing.xs,
  },
  nextPrayerName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: Spacing.xs,
  },
  nextPrayerTime: {
    fontSize: FontSizes.md,
    color: '#10b981',
    fontWeight: '600',
  },
  quickPrayerTimesContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quickPrayerTimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickPrayerTimeItem: {
    width: (width - Spacing.lg * 2 - 8) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  quickPrayerTimeName: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 2,
  },
  quickPrayerTimeValue: {
    fontSize: FontSizes.md,
    color: 'white',
    fontWeight: '600',
  },
  locationContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  locationCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationText: {
    fontSize: FontSizes.sm,
    color: '#10b981',
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
  locationName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  locationCoords: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  prayerContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.lg,
  },
  prayerItem: {
    marginBottom: Spacing.md,
  },
  prayerCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  nextPrayerCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  prayerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prayerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  prayerDetails: {
    flex: 1,
  },
  prayerName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  nextPrayerNameText: {
    color: '#10b981',
  },
  prayerTime: {
    fontSize: FontSizes.md,
    color: '#94a3b8',
  },
  nextBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  nextBadgeText: {
    fontSize: FontSizes.xs,
    color: 'white',
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginLeft: Spacing.sm,
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 120 : 100, // Account for tab bar height
  },
});