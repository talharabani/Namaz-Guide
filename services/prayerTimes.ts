import { CalculationMethod, CalculationParameters, Coordinates, PrayerTimes } from 'adhan';
import { cacheService } from './cache';

export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  color: string;
  isNext: boolean;
  timestamp: number;
}

export interface PrayerTimesData {
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  currentPrayer: string;
  timeUntilNext: string;
  hijriDate: string;
  gregorianDate: string;
}

export class PrayerTimesService {
  private static instance: PrayerTimesService;
  private coordinates: Coordinates;
  private calculationParams: CalculationParameters;

  constructor() {
    // Default to New York coordinates
    this.coordinates = new Coordinates(40.7128, -74.0060);
    this.calculationParams = CalculationMethod.NorthAmerica();
    this.calculationParams.fajrAngle = 15;
    this.calculationParams.ishaAngle = 15;
  }

  static getInstance(): PrayerTimesService {
    if (!PrayerTimesService.instance) {
      PrayerTimesService.instance = new PrayerTimesService();
    }
    return PrayerTimesService.instance;
  }

  setLocation(latitude: number, longitude: number): void {
    this.coordinates = new Coordinates(latitude, longitude);
  }

  setCalculationMethod(method: keyof typeof CalculationMethod): void {
    this.calculationParams = CalculationMethod[method]();
  }

  async getPrayerTimes(date: Date = new Date()): Promise<PrayerTimesData> {
    // Check cache first
    const locationKey = `${this.coordinates.latitude},${this.coordinates.longitude}`;
    const dateKey = date.toDateString();
    const cacheKey = `${locationKey}_${dateKey}`;
    
    const cachedData = await cacheService.getCachedPrayerTimes(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const prayerTimes = new PrayerTimes(this.coordinates, date, this.calculationParams);
    
    const prayers: PrayerTime[] = [
      {
        name: 'Fajr',
        time: this.formatTime(prayerTimes.fajr),
        icon: 'sunny-outline',
        color: '#f59e0b',
        isNext: false,
        timestamp: prayerTimes.fajr.getTime(),
      },
      {
        name: 'Dhuhr',
        time: this.formatTime(prayerTimes.dhuhr),
        icon: 'sunny-outline',
        color: '#f59e0b',
        isNext: false,
        timestamp: prayerTimes.dhuhr.getTime(),
      },
      {
        name: 'Asr',
        time: this.formatTime(prayerTimes.asr),
        icon: 'partly-sunny-outline',
        color: '#f59e0b',
        isNext: false,
        timestamp: prayerTimes.asr.getTime(),
      },
      {
        name: 'Maghrib',
        time: this.formatTime(prayerTimes.maghrib),
        icon: 'moon-outline',
        color: '#8b5cf6',
        isNext: false,
        timestamp: prayerTimes.maghrib.getTime(),
      },
      {
        name: 'Isha',
        time: this.formatTime(prayerTimes.isha),
        icon: 'moon-outline',
        color: '#6366f1',
        isNext: false,
        timestamp: prayerTimes.isha.getTime(),
      },
    ];

    const now = new Date();
    const nextPrayer = this.getNextPrayer(prayers, now);
    
    // Mark the next prayer
    if (nextPrayer) {
      nextPrayer.isNext = true;
    }

    const result: PrayerTimesData = {
      prayers,
      nextPrayer,
      currentPrayer: this.getCurrentPrayer(prayers, now),
      timeUntilNext: this.getTimeUntilNext(nextPrayer, now),
      hijriDate: this.getHijriDate(date),
      gregorianDate: this.formatDate(date),
    };

    // Cache the result
    await cacheService.cachePrayerTimes(cacheKey, result);

    return result;
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private getNextPrayer(prayers: PrayerTime[], now: Date): PrayerTime | null {
    const currentTime = now.getTime();
    
    // Find the next prayer after current time
    const upcomingPrayers = prayers.filter(prayer => prayer.timestamp > currentTime);
    
    if (upcomingPrayers.length === 0) {
      // If no prayers left today, return the first prayer of tomorrow
      // For now, return null to avoid async issues
      return null;
    }
    
    return upcomingPrayers.reduce((earliest, current) => 
      current.timestamp < earliest.timestamp ? current : earliest
    );
  }

  private getCurrentPrayer(prayers: PrayerTime[], now: Date): string {
    const currentTime = now.getTime();
    
    // Find the most recent prayer
    const pastPrayers = prayers.filter(prayer => prayer.timestamp <= currentTime);
    
    if (pastPrayers.length === 0) {
      return 'Isha'; // If it's before Fajr, show Isha from yesterday
    }
    
    const currentPrayer = pastPrayers.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    );
    
    return currentPrayer.name;
  }

  private getTimeUntilNext(nextPrayer: PrayerTime | null, now: Date): string {
    if (!nextPrayer) return '';
    
    const timeDiff = nextPrayer.timestamp - now.getTime();
    
    if (timeDiff <= 0) return 'Now';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  private getHijriDate(date: Date): string {
    // Simple Hijri date calculation (this is a simplified version)
    // In a real app, you would use a proper Hijri calendar library
    const hijriEpoch = new Date(622, 6, 16); // July 16, 622 CE
    const timeDiff = date.getTime() - hijriEpoch.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hijriYear = Math.floor(daysDiff / 354.37) + 1;
    const hijriMonth = Math.floor((daysDiff % 354.37) / 29.5) + 1;
    const hijriDay = Math.floor((daysDiff % 354.37) % 29.5) + 1;
    
    const monthNames = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhul Qa\'dah', 'Dhul Hijjah'
    ];
    
    return `${hijriDay} ${monthNames[hijriMonth - 1]} ${hijriYear}`;
  }
}

export const prayerTimesService = PrayerTimesService.getInstance();
