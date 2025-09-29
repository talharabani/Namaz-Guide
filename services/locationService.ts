import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export class LocationService {
  private static instance: LocationService;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to provide accurate prayer times and Qibla direction. Please enable location permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.openSettingsAsync() }
          ]
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });

      if (!location || !location.coords) {
        throw new Error('Invalid location data received');
      }

      // Try to get reverse geocoding for city/country info
      let city = 'Current Location';
      let country = 'Unknown';

      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          city = address.city || address.region || 'Current Location';
          country = address.country || 'Unknown';
        }
      } catch (geocodeError) {
        console.warn('Geocoding failed, using default location info:', geocodeError);
      }

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        city,
        country,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      
      // Show user-friendly error message
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your device settings and try again. You can also manually set your location in the app settings.',
        [{ text: 'OK' }]
      );
      
      return null;
    }
  }

  async getLocationWithFallback(defaultLocation?: LocationData): Promise<LocationData> {
    const currentLocation = await this.getCurrentLocation();
    
    if (currentLocation) {
      return currentLocation;
    }

    // Use default location if provided, otherwise use a fallback
    if (defaultLocation) {
      return defaultLocation;
    }

    // Fallback to a major city (New York)
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
      country: 'United States',
    };
  }

  async checkLocationServices(): Promise<boolean> {
    try {
      const isEnabled = await Location.hasServicesEnabledAsync();
      return isEnabled;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }
}

export const locationService = LocationService.getInstance();
