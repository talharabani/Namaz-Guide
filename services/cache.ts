import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

export interface CacheItem {
  data: any;
  timestamp: number;
  expiry?: number;
}

export interface CacheOptions {
  expiry?: number; // in milliseconds
  compress?: boolean;
}

export class CacheService {
  private static instance: CacheService;
  private cachePrefix = 'namaz_cache_';
  private maxCacheSize = 50 * 1024 * 1024; // 50MB

  constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async set(key: string, data: any, options: CacheOptions = {}): Promise<void> {
    try {
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
        expiry: options.expiry ? Date.now() + options.expiry : undefined,
      };

      const cacheKey = `${this.cachePrefix}${key}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error(`Error caching data for key ${key}:`, error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = `${this.cachePrefix}${key}`;
      const cachedItem = await AsyncStorage.getItem(cacheKey);
      
      if (!cachedItem) {
        return null;
      }

      const cacheItem: CacheItem = JSON.parse(cachedItem);
      
      // Check if item has expired
      if (cacheItem.expiry && Date.now() > cacheItem.expiry) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error(`Error retrieving cached data for key ${key}:`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const cacheKey = `${this.cachePrefix}${key}`;
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error(`Error removing cached data for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      
      let totalSize = 0;
      for (const key of cacheKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          totalSize += item.length * 2; // Rough estimate (UTF-16)
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }

  async getCacheInfo(): Promise<Array<{key: string, size: string}>> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      
      const cacheInfo = [];
      for (const key of cacheKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const size = (item.length * 2 / 1024).toFixed(2); // Convert to KB
          cacheInfo.push({
            key: key.replace(this.cachePrefix, ''),
            size: `${size} KB`
          });
        }
      }
      
      return cacheInfo;
    } catch (error) {
      console.error('Error getting cache info:', error);
      return [];
    }
  }

  async cleanup(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      
      for (const key of cacheKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const cacheItem: CacheItem = JSON.parse(item);
          
          // Remove expired items
          if (cacheItem.expiry && Date.now() > cacheItem.expiry) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  }

  // Specific cache methods for app data
  async cachePrayerTimes(location: string, data: any): Promise<void> {
    await this.set(`prayer_times_${location}`, data, { expiry: 24 * 60 * 60 * 1000 }); // 24 hours
  }

  async getCachedPrayerTimes(location: string): Promise<any> {
    return await this.get(`prayer_times_${location}`);
  }

  async cacheDuas(data: any): Promise<void> {
    await this.set('duas', data, { expiry: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  }

  async getCachedDuas(): Promise<any> {
    return await this.get('duas');
  }

  async cacheHadith(data: any): Promise<void> {
    await this.set('hadith', data, { expiry: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  }

  async getCachedHadith(): Promise<any> {
    return await this.get('hadith');
  }

  async cacheLocationData(location: string, data: any): Promise<void> {
    await this.set(`location_${location}`, data, { expiry: 30 * 24 * 60 * 60 * 1000 }); // 30 days
  }

  async getCachedLocationData(location: string): Promise<any> {
    return await this.get(`location_${location}`);
  }

  async isOfflineMode(): Promise<boolean> {
    try {
      const settings = await AsyncStorage.getItem('namaz_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.dataUsage?.offlineMode || false;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async setOfflineMode(enabled: boolean): Promise<void> {
    try {
      const settings = await AsyncStorage.getItem('namaz_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        parsed.dataUsage = parsed.dataUsage || {};
        parsed.dataUsage.offlineMode = enabled;
        await AsyncStorage.setItem('namaz_settings', JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Error setting offline mode:', error);
    }
  }

  async downloadAndCacheImage(url: string, filename: string): Promise<string | null> {
    try {
      const cacheDir = FileSystem.documentDirectory + 'images/';
      
      // Ensure cache directory exists
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      }

      const localUri = cacheDir + filename;
      
      // Check if image is already cached
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (fileInfo.exists) {
        return localUri;
      }

      // Download and cache the image
      const downloadResult = await FileSystem.downloadAsync(url, localUri);
      if (downloadResult.status === 200) {
        return downloadResult.uri;
      }
      
      return null;
    } catch (error) {
      console.error(`Error downloading and caching image ${url}:`, error);
      return null;
    }
  }

  async getCachedImage(filename: string): Promise<string | null> {
    try {
      const localUri = FileSystem.documentDirectory + 'images/' + filename;
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      
      if (fileInfo.exists) {
        return localUri;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting cached image ${filename}:`, error);
      return null;
    }
  }

  async clearImageCache(): Promise<void> {
    try {
      const cacheDir = FileSystem.documentDirectory + 'images/';
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(cacheDir);
      }
    } catch (error) {
      console.error('Error clearing image cache:', error);
    }
  }
}

export const cacheService = CacheService.getInstance();
