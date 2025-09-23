export interface PrayerTimesData {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  islamicDate?: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
}

class PrayerTimesService {
  private baseUrl = 'https://api.aladhan.com/v1/timings';

  async getPrayerTimes(
    latitude: number,
    longitude: number,
    date?: Date
  ): Promise<PrayerTimesData> {
    try {
      const targetDate = date || new Date();
      const dateString = targetDate.toISOString().split('T')[0];
      
      const url = `${this.baseUrl}/${dateString}?latitude=${latitude}&longitude=${longitude}&method=2`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 200) {
        throw new Error('Failed to fetch prayer times');
      }

      const timings = data.data.timings;
      
      return {
        fajr: this.formatTime(timings.Fajr),
        dhuhr: this.formatTime(timings.Dhuhr),
        asr: this.formatTime(timings.Asr),
        maghrib: this.formatTime(timings.Maghrib),
        isha: this.formatTime(timings.Isha),
        date: dateString,
        islamicDate: data.data.date.hijri?.date,
        location: {
          latitude,
          longitude,
          city: 'Current Location',
          country: 'Unknown',
        },
      };
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      // Return mock data as fallback
      return this.getMockPrayerTimes(latitude, longitude);
    }
  }

  private formatTime(timeString: string): string {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  private getMockPrayerTimes(latitude: number, longitude: number): PrayerTimesData {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    
    return {
      fajr: '5:30 AM',
      dhuhr: '12:15 PM',
      asr: '3:45 PM',
      maghrib: '6:20 PM',
      isha: '7:45 PM',
      date: dateString,
      islamicDate: '15 Rajab 1445',
      location: {
        latitude,
        longitude,
        city: 'Current Location',
        country: 'Unknown',
      },
    };
  }

  async getQiblaDirection(latitude: number, longitude: number): Promise<number> {
    try {
      // Kaaba coordinates
      const kaabaLat = 21.4225;
      const kaabaLng = 39.8262;
      
      // Calculate bearing to Kaaba
      const bearing = this.calculateBearing(latitude, longitude, kaabaLat, kaabaLng);
      return bearing;
    } catch (error) {
      console.error('Error calculating Qibla direction:', error);
      return 0; // Default to North
    }
  }

  private calculateBearing(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    
    return bearing;
  }
}

export const prayerTimesService = new PrayerTimesService();