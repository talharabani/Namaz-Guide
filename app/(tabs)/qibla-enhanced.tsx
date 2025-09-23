import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import AppHeader from '../../components/navigation/AppHeader';
import Card, { CardContent } from '../../components/ui/Card';
import IslamicText, { Ayat } from '../../components/ui/IslamicText';
import { BorderRadius, Shadows, Spacing } from '../../constants/DesignSystem';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface QiblaData {
  direction: number;
  distance: number;
  bearing: number;
  accuracy: number;
}

interface CompassData {
  heading: number;
  accuracy: number;
}

export default function EnhancedQiblaScreen() {
  const { colors, isDark } = useTheme();
  const { settings, updateLocation } = useSettings();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [compassData, setCompassData] = useState<CompassData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const compassRotation = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });

    // Start pulse animation
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );

    initializeLocation();
    startCompass();
  }, []);

  useEffect(() => {
    if (location) {
      calculateQibla();
    }
  }, [location]);

  useEffect(() => {
    if (compassData && qiblaData) {
      updateCompassRotation();
    }
  }, [compassData, qiblaData]);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to find Qibla direction.',
          [{ text: 'OK' }]
        );
        return;
      }

      setPermissionGranted(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
      updateLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startCompass = () => {
    // In a real app, you would use a compass library like react-native-sensors
    // For now, we'll simulate compass data
    const interval = setInterval(() => {
      setCompassData({
        heading: Math.random() * 360,
        accuracy: 5,
      });
    }, 100);

    return () => clearInterval(interval);
  };

  const calculateQibla = () => {
    if (!location) return;

    const lat1 = (location.coords.latitude * Math.PI) / 180;
    const lng1 = (location.coords.longitude * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const lng2 = (KAABA_LNG * Math.PI) / 180;

    const dLng = lng2 - lng1;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360;

    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      KAABA_LAT,
      KAABA_LNG
    );

    setQiblaData({
      direction: bearing,
      distance,
      bearing,
      accuracy: location.coords.accuracy || 0,
    });
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const updateCompassRotation = () => {
    if (!compassData || !qiblaData) return;

    const targetRotation = qiblaData.direction - compassData.heading;
    compassRotation.value = withSpring(targetRotation, { damping: 15, stiffness: 100 });
  };

  const handleRefreshLocation = useCallback(async () => {
    setIsLoading(true);
    await initializeLocation();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const compassStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${compassRotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader
        title="Qibla Direction"
        subtitle="Find the direction of Kaaba"
        variant="gradient"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Compass */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.compassContainer}>
            <Card variant="gradient" gradient={['#06b6d4', '#0891b2']} style={styles.compassCard}>
              <CardContent>
                <View style={styles.compassWrapper}>
                  <Animated.View style={[styles.compass, compassStyle]}>
                    <View style={styles.compassInner}>
                      <View style={styles.compassNeedle}>
                        <View style={styles.needleBase} />
                        <View style={styles.needlePoint} />
                      </View>
                      <View style={styles.compassMarkers}>
                        <View style={[styles.marker, styles.markerNorth]}>
                          <Text style={styles.markerText}>N</Text>
                        </View>
                        <View style={[styles.marker, styles.markerEast]}>
                          <Text style={styles.markerText}>E</Text>
                        </View>
                        <View style={[styles.marker, styles.markerSouth]}>
                          <Text style={styles.markerText}>S</Text>
                        </View>
                        <View style={[styles.marker, styles.markerWest]}>
                          <Text style={styles.markerText}>W</Text>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                  
                  <Animated.View style={[styles.qiblaIndicator, pulseStyle]}>
                    <Ionicons name="location" size={24} color="#f59e0b" />
                  </Animated.View>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Qibla Information */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.infoContainer}>
            <Card style={styles.infoCard}>
              <CardContent>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="compass" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoText}>
                      <IslamicText variant="caption" style={styles.infoLabel}>
                        Qibla Direction
                      </IslamicText>
                      <IslamicText variant="body" style={styles.infoValue}>
                        {qiblaData ? `${Math.round(qiblaData.direction)}°` : 'Calculating...'}
                      </IslamicText>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="location" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoText}>
                      <IslamicText variant="caption" style={styles.infoLabel}>
                        Distance to Kaaba
                      </IslamicText>
                      <IslamicText variant="body" style={styles.infoValue}>
                        {qiblaData ? `${Math.round(qiblaData.distance)} km` : 'Calculating...'}
                      </IslamicText>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="navigate" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoText}>
                      <IslamicText variant="caption" style={styles.infoLabel}>
                        Compass Heading
                      </IslamicText>
                      <IslamicText variant="body" style={styles.infoValue}>
                        {compassData ? `${Math.round(compassData.heading)}°` : 'Calibrating...'}
                      </IslamicText>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoText}>
                      <IslamicText variant="caption" style={styles.infoLabel}>
                        Accuracy
                      </IslamicText>
                      <IslamicText variant="body" style={styles.infoValue}>
                        {qiblaData ? `±${Math.round(qiblaData.accuracy)}m` : 'Unknown'}
                      </IslamicText>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Location Details */}
          {location && (
            <Animated.View entering={FadeInUp.delay(600)} style={styles.locationContainer}>
              <Card style={styles.locationCard}>
                <CardContent>
                  <View style={styles.locationHeader}>
                    <View style={styles.locationIcon}>
                      <Ionicons name="location" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.locationText}>
                      <IslamicText variant="body" style={styles.locationTitle}>
                        Your Location
                      </IslamicText>
                      <IslamicText variant="caption" style={styles.locationDetails}>
                        {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                      </IslamicText>
                    </View>
                    <TouchableOpacity
                      style={styles.refreshButton}
                      onPress={handleRefreshLocation}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name="refresh"
                        size={20}
                        color={isLoading ? colors.textSecondary : colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </CardContent>
              </Card>
            </Animated.View>
          )}

          {/* Kaaba Information */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.kaabaContainer}>
            <Card variant="gradient" gradient={['#f59e0b', '#d97706']} style={styles.kaabaCard}>
              <CardContent>
                <View style={styles.kaabaContent}>
                  <View style={styles.kaabaIcon}>
                    <Ionicons name="home" size={32} color="white" />
                  </View>
                  <View style={styles.kaabaText}>
                    <IslamicText variant="title" style={styles.kaabaTitle}>
                      Kaaba, Makkah
                    </IslamicText>
                    <IslamicText variant="caption" style={styles.kaabaDescription}>
                      The Sacred House of Allah
                    </IslamicText>
                    <IslamicText variant="caption" style={styles.kaabaCoordinates}>
                      21.4225°N, 39.8262°E
                    </IslamicText>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Islamic Ayat */}
          <Animated.View entering={FadeInUp.delay(1000)} style={styles.ayatContainer}>
            <Card style={styles.ayatCard}>
              <CardContent>
                <Ayat
                  style={styles.ayatText}
                  translation="And from wherever you go out [for prayer], turn your face toward al-Masjid al-Haram. And indeed, it is the truth from your Lord. And Allah is not unaware of what you do."
                >
                  وَمِنْ حَيْثُ خَرَجْتَ فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ۚ وَإِنَّهُ لَلْحَقُّ مِنْ رَبِّكَ ۗ وَمَا اللَّهُ بِغَافِلٍ عَمَّا تَعْمَلُونَ
                </Ayat>
                <IslamicText variant="caption" style={styles.ayatReference}>
                  — Quran 2:149
                </IslamicText>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Instructions */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.instructionsContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              How to Use
            </IslamicText>
            <Card style={styles.instructionsCard}>
              <CardContent>
                <View style={styles.instructionsList}>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <IslamicText variant="body" style={styles.instructionNumberText}>
                        1
                      </IslamicText>
                    </View>
                    <IslamicText variant="body" style={styles.instructionText}>
                      Hold your device flat and level
                    </IslamicText>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <IslamicText variant="body" style={styles.instructionNumberText}>
                        2
                      </IslamicText>
                    </View>
                    <IslamicText variant="body" style={styles.instructionText}>
                      Rotate your device to align the compass
                    </IslamicText>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <IslamicText variant="body" style={styles.instructionNumberText}>
                        3
                      </IslamicText>
                    </View>
                    <IslamicText variant="body" style={styles.instructionText}>
                      Face the direction indicated by the arrow
                    </IslamicText>
                  </View>
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
  compassContainer: {
    marginBottom: Spacing[6],
  },
  compassCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  compassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    position: 'relative',
  },
  compass: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  compassInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassNeedle: {
    position: 'absolute',
    width: 4,
    height: 80,
    backgroundColor: '#f59e0b',
    borderRadius: 2,
    zIndex: 2,
  },
  needleBase: {
    position: 'absolute',
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f59e0b',
    alignSelf: 'center',
  },
  needlePoint: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f59e0b',
    alignSelf: 'center',
  },
  compassMarkers: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  marker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  markerNorth: {
    top: 0,
    left: 85,
  },
  markerEast: {
    right: 0,
    top: 85,
  },
  markerSouth: {
    bottom: 0,
    left: 85,
  },
  markerWest: {
    left: 0,
    top: 85,
  },
  qiblaIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginBottom: Spacing[6],
  },
  infoCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: (screenWidth - Spacing[4] * 2 - Spacing[3]) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[2],
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    marginBottom: Spacing[6],
  },
  locationCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  locationText: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationDetails: {
    marginTop: Spacing[1],
    fontSize: 12,
    opacity: 0.7,
  },
  refreshButton: {
    padding: Spacing[2],
  },
  kaabaContainer: {
    marginBottom: Spacing[6],
  },
  kaabaCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  kaabaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kaabaIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[4],
  },
  kaabaText: {
    flex: 1,
  },
  kaabaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  kaabaDescription: {
    marginTop: Spacing[1],
    color: 'rgba(255, 255, 255, 0.8)',
  },
  kaabaCoordinates: {
    marginTop: Spacing[1],
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  ayatContainer: {
    marginBottom: Spacing[6],
  },
  ayatCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  ayatText: {
    textAlign: 'center',
    marginBottom: Spacing[3],
  },
  ayatReference: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing[4],
  },
  instructionsContainer: {
    marginBottom: Spacing[6],
  },
  instructionsCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  instructionsList: {
    gap: Spacing[4],
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  instructionNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: Spacing[20],
  },
});
