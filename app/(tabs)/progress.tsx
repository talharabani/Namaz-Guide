import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
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
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';

const { width } = Dimensions.get('window');

interface PrayerRecord {
  id: string;
  prayerName: string;
  date: string;
  completed: boolean;
  time: string;
}

interface ProgressStats {
  totalPrayers: number;
  completedPrayers: number;
  streak: number;
  weeklyGoal: number;
  monthlyGoal: number;
  totalQuizPoints: number;
  quizzesCompleted: number;
  averageQuizScore: number;
}

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalPrayers: 35,
    completedPrayers: 28,
    streak: 7,
    weeklyGoal: 35,
    monthlyGoal: 140,
    totalQuizPoints: 450,
    quizzesCompleted: 8,
    averageQuizScore: 85,
  });

  const [recentPrayers, setRecentPrayers] = useState<PrayerRecord[]>([
    { id: '1', prayerName: 'Fajr', date: '2025-09-22', completed: true, time: '05:30' },
    { id: '2', prayerName: 'Dhuhr', date: '2025-09-22', completed: true, time: '12:15' },
    { id: '3', prayerName: 'Asr', date: '2025-09-22', completed: true, time: '15:45' },
    { id: '4', prayerName: 'Maghrib', date: '2025-09-22', completed: true, time: '18:20' },
    { id: '5', prayerName: 'Isha', date: '2025-09-22', completed: false, time: '19:45' },
    { id: '6', prayerName: 'Fajr', date: '2025-09-21', completed: true, time: '05:32' },
    { id: '7', prayerName: 'Dhuhr', date: '2025-09-21', completed: true, time: '12:17' },
    { id: '8', prayerName: 'Asr', date: '2025-09-21', completed: true, time: '15:47' },
    { id: '9', prayerName: 'Maghrib', date: '2025-09-21', completed: true, time: '18:18' },
    { id: '10', prayerName: 'Isha', date: '2025-09-21', completed: true, time: '19:43' },
  ]);

  const completionRate = progressStats.totalPrayers > 0 
    ? Math.round((progressStats.completedPrayers / progressStats.totalPrayers) * 100) 
    : 0;

  const handleMarkPrayer = (prayerId: string) => {
    setRecentPrayers(prev => 
      prev.map(prayer => 
        prayer.id === prayerId 
          ? { ...prayer, completed: !prayer.completed }
          : prayer
      )
    );
    
    // Update stats
    setProgressStats(prev => ({
      ...prev,
      completedPrayers: prev.completedPrayers + 1,
    }));
  };

  const handleSetGoal = () => {
    Alert.alert(
      'Set Goal',
      'Choose your weekly prayer goal:',
      [
        { text: '30 prayers (6/day)', onPress: () => setProgressStats(prev => ({ ...prev, weeklyGoal: 30 })) },
        { text: '35 prayers (7/day)', onPress: () => setProgressStats(prev => ({ ...prev, weeklyGoal: 35 })) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="trending-up" size={28} color="#10b981" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Prayer Progress</Text>
              <Text style={styles.appSubtitle}>Track your spiritual journey</Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodScroll}
          >
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.selectedPeriodButton
                ]}
                onPress={() => setSelectedPeriod(period)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.selectedPeriodButtonText
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>{getPeriodText()}</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <Text style={styles.statNumber}>{progressStats.completedPrayers}</Text>
              <Text style={styles.statLabel}>Prayers</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="flame" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statNumber}>{progressStats.streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="trophy" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.statNumber}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* Quiz Stats */}
        <View style={styles.quizStatsContainer}>
          <Text style={styles.sectionTitle}>Quiz Performance</Text>
          
          <View style={styles.quizStatsGrid}>
            <View style={styles.quizStatCard}>
              <View style={styles.quizStatIcon}>
                <Ionicons name="school" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.quizStatNumber}>{progressStats.quizzesCompleted}</Text>
              <Text style={styles.quizStatLabel}>Quizzes</Text>
            </View>
            
            <View style={styles.quizStatCard}>
              <View style={styles.quizStatIcon}>
                <Ionicons name="star" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.quizStatNumber}>{progressStats.totalQuizPoints}</Text>
              <Text style={styles.quizStatLabel}>Points</Text>
            </View>
            
            <View style={styles.quizStatCard}>
              <View style={styles.quizStatIcon}>
                <Ionicons name="trending-up" size={24} color="#10b981" />
              </View>
              <Text style={styles.quizStatNumber}>{progressStats.averageQuizScore}%</Text>
              <Text style={styles.quizStatLabel}>Average</Text>
            </View>
          </View>
        </View>

        {/* Progress Chart */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Weekly Progress</Text>
              <TouchableOpacity onPress={handleSetGoal}>
                <Ionicons name="settings-outline" size={20} color="#10b981" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((progressStats.completedPrayers / progressStats.weeklyGoal) * 100, 100)}%` }
                ]} 
              />
            </View>
            
            <View style={styles.progressText}>
              <Text style={styles.progressCurrent}>
                {progressStats.completedPrayers} / {progressStats.weeklyGoal} prayers
              </Text>
              <Text style={styles.progressGoal}>
                {progressStats.weeklyGoal - progressStats.completedPrayers} remaining
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Prayers */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Prayers</Text>
          
          {recentPrayers.slice(0, 10).map((prayer) => (
            <View key={prayer.id} style={styles.prayerItem}>
              <View style={styles.prayerInfo}>
                <View style={[
                  styles.prayerIcon,
                  { backgroundColor: prayer.completed ? '#10b981' : '#6b7280' }
                ]}>
                  <Ionicons 
                    name={prayer.completed ? 'checkmark' : 'time'} 
                    size={16} 
                    color="white" 
                  />
                </View>
                <View style={styles.prayerDetails}>
                  <Text style={styles.prayerName}>{prayer.prayerName}</Text>
                  <Text style={styles.prayerDate}>{prayer.date} at {prayer.time}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.prayerButton,
                  prayer.completed && styles.prayerButtonCompleted
                ]}
                onPress={() => handleMarkPrayer(prayer.id)}
              >
                <Text style={[
                  styles.prayerButtonText,
                  prayer.completed && styles.prayerButtonTextCompleted
                ]}>
                  {prayer.completed ? 'Done' : 'Mark'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementsGrid}>
            <View style={[styles.achievementCard, progressStats.streak >= 7 && styles.achievementUnlocked]}>
              <Ionicons 
                name="flame" 
                size={32} 
                color={progressStats.streak >= 7 ? '#f59e0b' : '#6b7280'} 
              />
              <Text style={styles.achievementTitle}>7 Day Streak</Text>
              <Text style={styles.achievementDesc}>Pray for 7 consecutive days</Text>
            </View>
            
            <View style={[styles.achievementCard, completionRate >= 80 && styles.achievementUnlocked]}>
              <Ionicons 
                name="trophy" 
                size={32} 
                color={completionRate >= 80 ? '#8b5cf6' : '#6b7280'} 
              />
              <Text style={styles.achievementTitle}>Consistent</Text>
              <Text style={styles.achievementDesc}>80% completion rate</Text>
            </View>
            
            <View style={[styles.achievementCard, progressStats.completedPrayers >= 100 && styles.achievementUnlocked]}>
              <Ionicons 
                name="star" 
                size={32} 
                color={progressStats.completedPrayers >= 100 ? '#f59e0b' : '#6b7280'} 
              />
              <Text style={styles.achievementTitle}>Century</Text>
              <Text style={styles.achievementDesc}>100 prayers completed</Text>
            </View>
            
            <View style={[styles.achievementCard, progressStats.quizzesCompleted >= 5 && styles.achievementUnlocked]}>
              <Ionicons 
                name="school" 
                size={32} 
                color={progressStats.quizzesCompleted >= 5 ? '#8b5cf6' : '#6b7280'} 
              />
              <Text style={styles.achievementTitle}>Scholar</Text>
              <Text style={styles.achievementDesc}>Complete 5 quizzes</Text>
            </View>
            
            <View style={[styles.achievementCard, progressStats.totalQuizPoints >= 500 && styles.achievementUnlocked]}>
              <Ionicons 
                name="medal" 
                size={32} 
                color={progressStats.totalQuizPoints >= 500 ? '#f59e0b' : '#6b7280'} 
              />
              <Text style={styles.achievementTitle}>Expert</Text>
              <Text style={styles.achievementDesc}>Earn 500 quiz points</Text>
            </View>
            
            <View style={[styles.achievementCard, progressStats.averageQuizScore >= 90 && styles.achievementUnlocked]}>
              <Ionicons 
                name="diamond" 
                size={32} 
                color={progressStats.averageQuizScore >= 90 ? '#10b981' : '#6b7280'} 
              />
              <Text style={styles.achievementTitle}>Master</Text>
              <Text style={styles.achievementDesc}>90% average score</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  periodContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  periodScroll: {
    paddingRight: Spacing.lg,
  },
  periodButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: Spacing.sm,
  },
  selectedPeriodButton: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  periodButtonText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    fontWeight: '600',
  },
  selectedPeriodButtonText: {
    color: '#10b981',
  },
  statsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIcon: {
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  quizStatsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quizStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizStatCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  quizStatIcon: {
    marginBottom: Spacing.sm,
  },
  quizStatNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  quizStatLabel: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCurrent: {
    fontSize: FontSizes.sm,
    color: '#10b981',
    fontWeight: '600',
  },
  progressGoal: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  recentContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prayerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  prayerDetails: {
    flex: 1,
  },
  prayerName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  prayerDate: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  prayerButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#10b981',
    backgroundColor: 'transparent',
  },
  prayerButtonCompleted: {
    backgroundColor: '#10b981',
  },
  prayerButtonText: {
    fontSize: FontSizes.sm,
    color: '#10b981',
    fontWeight: '600',
  },
  prayerButtonTextCompleted: {
    color: 'white',
  },
  achievementsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 3,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementUnlocked: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  achievementTitle: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: 'white',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: FontSizes.xs,
    color: '#94a3b8',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});
