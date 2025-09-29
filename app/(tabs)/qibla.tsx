import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SimpleSwipeWrapper from '../../components/SimpleSwipeWrapper';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';
import { useSettings } from '../../contexts/SettingsContext';

const { width, height } = Dimensions.get('window');

export default function QiblaScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [magnetometer, setMagnetometer] = useState({ x: 0, y: 0, z: 0 });
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { settings, updateLocation } = useSettings();

  useEffect(() => {
    initializeLocation();
    initializeMagnetometer();
  }, []);

  useEffect(() => {
    if (location) {
      calculateQiblaDirection();
    }
  }, [location, magnetometer]);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        
        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          updateLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            city: address.city || '',
            country: address.country || '',
          });
        }
      } else {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to find Qibla direction.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location. Using default coordinates.');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMagnetometer = () => {
    Sensors.Magnetometer.setUpdateInterval(100);
    const subscription = Sensors.Magnetometer.addListener((data) => {
      setMagnetometer(data);
    });

    return () => subscription.remove();
  };

  const calculateQiblaDirection = () => {
    if (!location) return;

    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    const userLat = location.coords.latitude;
    const userLng = location.coords.longitude;

    // Calculate bearing to Kaaba
    const dLng = (kaabaLng - userLng) * Math.PI / 180;
    const lat1 = userLat * Math.PI / 180;
    const lat2 = kaabaLat * Math.PI / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;

    setQiblaDirection(bearing);
  };

  const getCompassDirection = (heading: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  const getMagneticHeading = () => {
    const heading = Math.atan2(magnetometer.y, magnetometer.x) * 180 / Math.PI;
    return (heading + 360) % 360;
  };

  const getQiblaAngle = () => {
    const magneticHeading = getMagneticHeading();
    const angle = qiblaDirection - magneticHeading;
    return (angle + 360) % 360;
  };

  const handleSwipeUp = () => {
    // Show compass calibration or settings
    console.log('Swipe up detected');
  };

  const handleSwipeDown = () => {
    // Refresh location and recalculate Qibla
    console.log('Swipe down detected');
    initializeLocation();
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
            currentTab="qibla"
            onSwipeUp={handleSwipeUp}
            onSwipeDown={handleSwipeDown}
          >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="compass" size={28} color="#10b981" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Qibla Direction</Text>
              <Text style={styles.appSubtitle}>Find the direction to Kaaba</Text>
            </View>
          </View>
        </View>

        {/* Compass */}
        <View style={styles.compassContainer}>
          <View style={styles.compassCard}>
            <View style={styles.compass}>
              <View 
                style={[
                  styles.compassNeedle,
                  { transform: [{ rotate: `${getQiblaAngle()}deg` }] }
                ]}
              >
                <View style={styles.needlePoint} />
                <View style={styles.needleTail} />
              </View>
              <View style={styles.compassCenter} />
              <View style={styles.compassDirections}>
                <Text style={[styles.directionText, styles.north]}>N</Text>
                <Text style={[styles.directionText, styles.east]}>E</Text>
                <Text style={[styles.directionText, styles.south]}>S</Text>
                <Text style={[styles.directionText, styles.west]}>W</Text>
              </View>
            </View>
            <Text style={styles.qiblaText}>Qibla Direction</Text>
            <Text style={styles.qiblaAngle}>{Math.round(getQiblaAngle())}°</Text>
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.locationContainer}>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location-outline" size={20} color="#10b981" />
              <Text style={styles.locationText}>Current Location</Text>
            </View>
            <Text style={styles.locationName}>
              {settings.location.city && settings.location.country 
                ? `${settings.location.city}, ${settings.location.country}`
                : 'Location not available'
              }
            </Text>
            <Text style={styles.locationCoords}>
              {location ? 
                `${location.coords.latitude.toFixed(4)}° N, ${location.coords.longitude.toFixed(4)}° E` :
                'Coordinates not available'
              }
            </Text>
          </View>
        </View>

        {/* Compass Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="compass-outline" size={20} color="#10b981" />
              <Text style={styles.infoText}>
                Magnetic Heading: {Math.round(getMagneticHeading())}° {getCompassDirection(getMagneticHeading())}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#10b981" />
              <Text style={styles.infoText}>
                Qibla Bearing: {Math.round(qiblaDirection)}° {getCompassDirection(qiblaDirection)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="information-circle-outline" size={20} color="#10b981" />
              <Text style={styles.infoText}>
                Point your device towards the green arrow
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How to Use</Text>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>Hold your device flat in your hand</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>Rotate until the green arrow points up</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>You are now facing the Qibla direction</Text>
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
  compassContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  compassCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    width: width - Spacing.lg * 2,
  },
  compass: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  compassNeedle: {
    position: 'absolute',
    width: 2,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  needlePoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#10b981',
    position: 'absolute',
    top: -20,
  },
  needleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#6b7280',
    position: 'absolute',
    bottom: -20,
  },
  compassCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  compassDirections: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  directionText: {
    position: 'absolute',
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  north: {
    top: 10,
    left: '50%',
    marginLeft: -8,
  },
  east: {
    right: 10,
    top: '50%',
    marginTop: -8,
  },
  south: {
    bottom: 10,
    left: '50%',
    marginLeft: -8,
  },
  west: {
    left: 10,
    top: '50%',
    marginTop: -8,
  },
  qiblaText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.sm,
  },
  qiblaAngle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: '#10b981',
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
  instructionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  instructionsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  instructionsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: Spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    color: 'white',
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: Spacing.md,
  },
  instructionText: {
    fontSize: FontSizes.sm,
    color: 'white',
    flex: 1,
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 120 : 100, // Account for tab bar height
  },
});