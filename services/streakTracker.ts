import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StreakData {
  current: number;
  longest: number;
  startDate: Date;
  lastActivity: Date;
  totalDays: number;
  streakHistory: StreakEntry[];
}

export interface StreakEntry {
  date: string;
  activities: ActivityEntry[];
  completed: boolean;
  streakCount: number;
}

export interface ActivityEntry {
  type: 'prayer' | 'dua' | 'quiz' | 'learning' | 'qibla';
  completed: boolean;
  timestamp: Date;
  points: number;
}

export interface StreakMilestone {
  days: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string[];
  unlocked: boolean;
  unlockedDate?: Date;
}

class StreakTrackerService {
  private static instance: StreakTrackerService;
  private streakData: StreakData | null = null;
  private readonly STREAK_STORAGE_KEY = 'streak_data';
  private readonly MILESTONES_STORAGE_KEY = 'streak_milestones';

  private constructor() {
    this.initializeStreakData();
  }

  public static getInstance(): StreakTrackerService {
    if (!StreakTrackerService.instance) {
      StreakTrackerService.instance = new StreakTrackerService();
    }
    return StreakTrackerService.instance;
  }

  private async initializeStreakData(): Promise<void> {
    try {
      const savedData = await AsyncStorage.getItem(this.STREAK_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        this.streakData = {
          ...parsed,
          startDate: new Date(parsed.startDate),
          lastActivity: new Date(parsed.lastActivity),
          streakHistory: parsed.streakHistory.map((entry: any) => ({
            ...entry,
            activities: entry.activities.map((activity: any) => ({
              ...activity,
              timestamp: new Date(activity.timestamp),
            })),
          })),
        };
      } else {
        // Initialize with default data
        this.streakData = {
          current: 0,
          longest: 0,
          startDate: new Date(),
          lastActivity: new Date(),
          totalDays: 0,
          streakHistory: [],
        };
        await this.saveStreakData();
      }
    } catch (error) {
      console.error('Error initializing streak data:', error);
    }
  }

  private async saveStreakData(): Promise<void> {
    try {
      if (this.streakData) {
        await AsyncStorage.setItem(this.STREAK_STORAGE_KEY, JSON.stringify(this.streakData));
      }
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  }

  public async getStreakData(): Promise<StreakData | null> {
    if (!this.streakData) {
      await this.initializeStreakData();
    }
    return this.streakData;
  }

  public async recordActivity(activity: Omit<ActivityEntry, 'timestamp'>): Promise<void> {
    if (!this.streakData) {
      await this.initializeStreakData();
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Check if we need to reset streak (more than 1 day gap)
    const lastActivityDate = new Date(this.streakData!.lastActivity);
    const daysDiff = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 1) {
      // Streak broken, reset
      if (this.streakData) {
        this.streakData.current = 0;
      }
    }

    // Find or create today's entry
    let todayEntry = this.streakData?.streakHistory.find(entry => entry.date === today);
    if (!todayEntry) {
      todayEntry = {
        date: today,
        activities: [],
        completed: false,
        streakCount: this.streakData?.current || 0,
      };
      if (this.streakData) {
        this.streakData.streakHistory.push(todayEntry);
      }
    }

    // Add the activity
    const activityEntry: ActivityEntry = {
      ...activity,
      timestamp: now,
    };
    todayEntry.activities.push(activityEntry);

    // Check if today is completed (all required activities done)
    const requiredActivities = ['prayer', 'dua', 'quiz', 'learning'];
    const completedTypes = new Set(todayEntry.activities
      .filter(a => a.completed)
      .map(a => a.type));
    
    const hasAllRequired = requiredActivities.every(type => completedTypes.has(type as any));
    
    if (hasAllRequired && !todayEntry.completed) {
      todayEntry.completed = true;
      if (this.streakData) {
        this.streakData.current += 1;
        this.streakData.totalDays += 1;
        
        // Update longest streak
        if (this.streakData.current > this.streakData.longest) {
          this.streakData.longest = this.streakData.current;
        }

        // Check for milestones
        await this.checkMilestones();
      }
    }

    if (this.streakData) {
      this.streakData.lastActivity = now;
    }
    await this.saveStreakData();
  }

  public async getTodayProgress(): Promise<{
    completed: number;
    total: number;
    activities: ActivityEntry[];
    streakCount: number;
  }> {
    if (!this.streakData) {
      await this.initializeStreakData();
    }

    const today = new Date().toISOString().split('T')[0];
    const todayEntry = this.streakData!.streakHistory.find(entry => entry.date === today);

    if (!todayEntry) {
      return {
        completed: 0,
        total: 4, // prayer, dua, quiz, learning
        activities: [],
        streakCount: this.streakData!.current,
      };
    }

    const completedActivities = todayEntry.activities.filter(a => a.completed);
    return {
      completed: completedActivities.length,
      total: 4,
      activities: todayEntry.activities,
      streakCount: this.streakData!.current,
    };
  }

  public async getStreakHistory(days: number = 30): Promise<StreakEntry[]> {
    if (!this.streakData) {
      await this.initializeStreakData();
    }

    return this.streakData!.streakHistory
      .slice(-days)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async getStreakMilestones(): Promise<StreakMilestone[]> {
    try {
      const savedMilestones = await AsyncStorage.getItem(this.MILESTONES_STORAGE_KEY);
      if (savedMilestones) {
        return JSON.parse(savedMilestones);
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
    }

    // Default milestones
    const milestones: StreakMilestone[] = [
      {
        days: 1,
        title: 'Getting Started',
        description: 'Complete your first day of activities',
        icon: 'star',
        color: '#10b981',
        gradient: ['#10b981', '#059669'],
        unlocked: this.streakData?.current >= 1,
        unlockedDate: this.streakData?.current >= 1 ? this.streakData.startDate : undefined,
      },
      {
        days: 3,
        title: 'Building Momentum',
        description: 'Maintain your streak for 3 days',
        icon: 'flame',
        color: '#f59e0b',
        gradient: ['#f59e0b', '#d97706'],
        unlocked: this.streakData?.current >= 3,
      },
      {
        days: 7,
        title: 'Week Warrior',
        description: 'Complete a full week of activities',
        icon: 'trophy',
        color: '#8b5cf6',
        gradient: ['#8b5cf6', '#7c3aed'],
        unlocked: this.streakData?.current >= 7,
      },
      {
        days: 14,
        title: 'Two Week Champion',
        description: 'Maintain your streak for 2 weeks',
        icon: 'medal',
        color: '#ef4444',
        gradient: ['#ef4444', '#dc2626'],
        unlocked: this.streakData?.current >= 14,
      },
      {
        days: 30,
        title: 'Monthly Master',
        description: 'Complete a full month of activities',
        icon: 'crown',
        color: '#f97316',
        gradient: ['#f97316', '#ea580c'],
        unlocked: this.streakData?.current >= 30,
      },
      {
        days: 100,
        title: 'Century Streak',
        description: 'Achieve 100 days of continuous activity',
        icon: 'diamond',
        color: '#06b6d4',
        gradient: ['#06b6d4', '#0891b2'],
        unlocked: this.streakData?.current >= 100,
      },
    ];

    return milestones;
  }

  private async checkMilestones(): Promise<void> {
    const milestones = await this.getStreakMilestones();
    const newUnlockedMilestones = milestones.filter(
      milestone => milestone.days <= (this.streakData?.current || 0) && !milestone.unlocked
    );

    if (newUnlockedMilestones.length > 0) {
      // Update milestones
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      unlocked: milestone.days <= (this.streakData?.current || 0),
      unlockedDate: milestone.days <= (this.streakData?.current || 0) && !milestone.unlocked 
        ? new Date() 
        : milestone.unlockedDate,
    }));

      await AsyncStorage.setItem(this.MILESTONES_STORAGE_KEY, JSON.stringify(updatedMilestones));

      // Send notification for new milestones
      for (const milestone of newUnlockedMilestones) {
        // This would integrate with the notification service
        console.log(`Milestone unlocked: ${milestone.title}`);
      }
    }
  }

  public async getStreakStats(): Promise<{
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    averagePerWeek: number;
    consistency: number;
  }> {
    if (!this.streakData) {
      await this.initializeStreakData();
    }

    const history = await this.getStreakHistory(30);
    const completedDays = history.filter(entry => entry.completed).length;
    const consistency = history.length > 0 ? (completedDays / history.length) * 100 : 0;
    const averagePerWeek = (completedDays / 4.3); // Approximate weeks in 30 days

    return {
      currentStreak: this.streakData?.current || 0,
      longestStreak: this.streakData?.longest || 0,
      totalDays: this.streakData?.totalDays || 0,
      averagePerWeek: Math.round(averagePerWeek * 10) / 10,
      consistency: Math.round(consistency * 10) / 10,
    };
  }

  public async resetStreak(): Promise<void> {
    if (!this.streakData) {
      await this.initializeStreakData();
    }

    if (this.streakData) {
      this.streakData.current = 0;
      this.streakData.startDate = new Date();
      this.streakData.lastActivity = new Date();
    }
    await this.saveStreakData();
  }

  public async getActivitySummary(activityType: string, days: number = 7): Promise<{
    total: number;
    completed: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    const history = await this.getStreakHistory(days);
    const activities = history.flatMap(entry => entry.activities);
    const typeActivities = activities.filter(a => a.type === activityType);
    
    const completed = typeActivities.filter(a => a.completed).length;
    const total = typeActivities.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    // Calculate trend (simplified)
    const firstHalf = history.slice(0, Math.floor(history.length / 2));
    const secondHalf = history.slice(Math.floor(history.length / 2));
    
    const firstHalfCompleted = firstHalf.flatMap(e => e.activities)
      .filter(a => a.type === activityType && a.completed).length;
    const secondHalfCompleted = secondHalf.flatMap(e => e.activities)
      .filter(a => a.type === activityType && a.completed).length;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (secondHalfCompleted > firstHalfCompleted) trend = 'up';
    else if (secondHalfCompleted < firstHalfCompleted) trend = 'down';

    return {
      total,
      completed,
      percentage: Math.round(percentage * 10) / 10,
      trend,
    };
  }
}

export const streakTrackerService = StreakTrackerService.getInstance();
