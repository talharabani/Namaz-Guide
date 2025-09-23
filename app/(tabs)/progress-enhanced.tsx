import { Ionicons } from '@expo/vector-icons';
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
import { BorderRadius, FeatureColors, Shadows, Spacing } from '../../constants/DesignSystem';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface ProgressData {
  prayersCompleted: number;
  prayersStreak: number;
  duasRead: number;
  quizScore: number;
  learningHours: number;
  goalsAchieved: number;
  totalGoals: number;
}

interface StreakData {
  current: number;
  longest: number;
  startDate: Date;
  lastActivity: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  category: string;
  isCompleted: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
  unlockedDate: Date;
  points: number;
}

interface WeeklyData {
  week: string;
  prayers: number;
  duas: number;
  quiz: number;
  learning: number;
}

export default function EnhancedProgressScreen() {
  const { colors, isDark } = useTheme();
  const [progressData, setProgressData] = useState<ProgressData>({
    prayersCompleted: 25,
    prayersStreak: 12,
    duasRead: 45,
    quizScore: 85,
    learningHours: 8.5,
    goalsAchieved: 3,
    totalGoals: 5,
  });
  const [streakData, setStreakData] = useState<StreakData>({
    current: 12,
    longest: 25,
    startDate: new Date('2024-01-04'),
    lastActivity: new Date('2024-01-16'),
  });
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Goals data
  const goals: Goal[] = [
    {
      id: '1',
      title: 'Daily Prayer Streak',
      description: 'Pray 5 times daily for 30 days',
      target: 30,
      current: 12,
      unit: 'days',
      deadline: new Date('2024-02-15'),
      category: 'prayer',
      isCompleted: false,
      icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.prayer,
      gradient: ['#10b981', '#059669'],
    },
    {
      id: '2',
      title: 'Read 100 Duas',
      description: 'Read and memorize 100 different duas',
      target: 100,
      current: 45,
      unit: 'duas',
      deadline: new Date('2024-03-01'),
      category: 'duas',
      isCompleted: false,
      icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.duas,
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      id: '3',
      title: 'Quiz Master',
      description: 'Achieve 90% average in 10 quizzes',
      target: 10,
      current: 7,
      unit: 'quizzes',
      deadline: new Date('2024-02-28'),
      category: 'quiz',
      isCompleted: false,
      icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.quiz,
      gradient: ['#ec4899', '#db2777'],
    },
    {
      id: '4',
      title: 'Learning Hours',
      description: 'Study Islamic knowledge for 50 hours',
      target: 50,
      current: 8.5,
      unit: 'hours',
      deadline: new Date('2024-04-01'),
      category: 'learning',
      isCompleted: false,
      icon: 'school-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.learn,
      gradient: ['#22c55e', '#16a34a'],
    },
    {
      id: '5',
      title: 'Perfect Week',
      description: 'Complete all daily activities for 7 days',
      target: 7,
      current: 3,
      unit: 'days',
      deadline: new Date('2024-01-23'),
      category: 'general',
      isCompleted: false,
      icon: 'trophy-outline' as keyof typeof Ionicons.glyphMap,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
  ];

  // Achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first prayer',
      icon: 'footsteps-outline' as keyof typeof Ionicons.glyphMap,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      unlockedDate: new Date('2024-01-01'),
      points: 10,
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Maintained prayer streak for 7 days',
      icon: 'flame-outline' as keyof typeof Ionicons.glyphMap,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      unlockedDate: new Date('2024-01-10'),
      points: 25,
    },
    {
      id: '3',
      title: 'Knowledge Seeker',
      description: 'Completed 5 quizzes with 80%+ score',
      icon: 'library-outline' as keyof typeof Ionicons.glyphMap,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      unlockedDate: new Date('2024-01-15'),
      points: 50,
    },
  ];

  // Weekly data for charts
  const weeklyData: WeeklyData[] = [
    { week: 'Week 1', prayers: 35, duas: 12, quiz: 85, learning: 2.5 },
    { week: 'Week 2', prayers: 30, duas: 18, quiz: 78, learning: 3.0 },
    { week: 'Week 3', prayers: 32, duas: 15, quiz: 92, learning: 2.8 },
    { week: 'Week 4', prayers: 28, duas: 20, quiz: 88, learning: 3.5 },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return '#10b981';
    if (streak >= 14) return '#f59e0b';
    if (streak >= 7) return '#8b5cf6';
    return '#ef4444';
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const renderProgressCard = (title: string, value: string, icon: keyof typeof Ionicons.glyphMap, color: string, gradient: string[]) => (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.progressCard}>
      <Card variant="gradient" gradient={gradient} style={styles.progressCardContent}>
        <CardContent>
          <View style={styles.progressCardHeader}>
            <View style={styles.progressIconContainer}>
              <Ionicons name={icon} size={24} color="white" />
            </View>
            <IslamicText variant="caption" style={styles.progressCardTitle}>
              {title}
            </IslamicText>
          </View>
          <IslamicText variant="title" style={styles.progressCardValue}>
            {value}
          </IslamicText>
        </CardContent>
      </Card>
    </Animated.View>
  );

  const renderGoal = (goal: Goal, index: number) => {
    const progress = getProgressPercentage(goal.current, goal.target);
    
    return (
      <Animated.View
        key={goal.id}
        entering={FadeInUp.delay(300 + index * 100)}
        style={styles.goalItem}
      >
        <Card style={styles.goalCard}>
          <CardContent>
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <Ionicons name={goal.icon} size={24} color={goal.color} />
              </View>
              <View style={styles.goalInfo}>
                <IslamicText variant="subtitle" style={styles.goalTitle}>
                  {goal.title}
                </IslamicText>
                <IslamicText variant="caption" style={styles.goalDescription}>
                  {goal.description}
                </IslamicText>
              </View>
              {goal.isCompleted && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                </View>
              )}
            </View>

            <View style={styles.goalProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: goal.color,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressText}>
                <IslamicText variant="caption" style={styles.progressLabel}>
                  {goal.current}/{goal.target} {goal.unit}
                </IslamicText>
                <IslamicText variant="caption" style={styles.progressPercentage}>
                  {Math.round(progress)}%
                </IslamicText>
              </View>
            </View>

            <View style={styles.goalFooter}>
              <IslamicText variant="caption" style={styles.goalDeadline}>
                Due: {goal.deadline.toLocaleDateString()}
              </IslamicText>
              <View style={styles.goalCategory}>
                <IslamicText variant="caption" style={styles.goalCategoryText}>
                  {goal.category}
                </IslamicText>
              </View>
            </View>
          </CardContent>
        </Card>
      </Animated.View>
    );
  };

  const renderAchievement = (achievement: Achievement, index: number) => (
    <Animated.View
      key={achievement.id}
      entering={FadeInDown.delay(400 + index * 100)}
      style={styles.achievementItem}
    >
      <Card variant="gradient" gradient={achievement.gradient} style={styles.achievementCard}>
        <CardContent>
          <View style={styles.achievementHeader}>
            <View style={styles.achievementIconContainer}>
              <Ionicons name={achievement.icon} size={28} color="white" />
            </View>
            <View style={styles.achievementInfo}>
              <IslamicText variant="subtitle" style={styles.achievementTitle}>
                {achievement.title}
              </IslamicText>
              <IslamicText variant="caption" style={styles.achievementDescription}>
                {achievement.description}
              </IslamicText>
            </View>
            <View style={styles.achievementPoints}>
              <IslamicText variant="title" style={styles.achievementPointsValue}>
                +{achievement.points}
              </IslamicText>
              <IslamicText variant="caption" style={styles.achievementPointsLabel}>
                points
              </IslamicText>
            </View>
          </View>
          <IslamicText variant="caption" style={styles.achievementDate}>
            Unlocked: {achievement.unlockedDate.toLocaleDateString()}
          </IslamicText>
        </CardContent>
      </Card>
    </Animated.View>
  );

  const renderWeeklyChart = () => (
    <Animated.View entering={FadeInUp.delay(600)} style={styles.chartContainer}>
      <Card style={styles.chartCard}>
        <CardContent>
          <View style={styles.chartHeader}>
            <IslamicText variant="subtitle" style={styles.chartTitle}>
              Weekly Progress
            </IslamicText>
            <View style={styles.periodSelector}>
              {(['week', 'month', 'year'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  style={[
                    styles.periodButton,
                    {
                      backgroundColor: selectedPeriod === period ? colors.primary : colors.surface,
                    },
                  ]}
                >
                  <IslamicText
                    variant="caption"
                    style={[
                      styles.periodButtonText,
                      {
                        color: selectedPeriod === period ? 'white' : colors.text,
                      },
                    ]}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </IslamicText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chartContent}>
            {weeklyData.map((week, index) => (
              <View key={week.week} style={styles.chartBar}>
                <View style={styles.chartBarContainer}>
                  <View style={styles.chartBarItem}>
                    <View 
                      style={[
                        styles.chartBarFill,
                        {
                          height: (week.prayers / 35) * 100,
                          backgroundColor: '#10b981',
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.chartBarItem}>
                    <View 
                      style={[
                        styles.chartBarFill,
                        {
                          height: (week.duas / 20) * 100,
                          backgroundColor: '#f59e0b',
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.chartBarItem}>
                    <View 
                      style={[
                        styles.chartBarFill,
                        {
                          height: (week.quiz / 100) * 100,
                          backgroundColor: '#8b5cf6',
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.chartBarItem}>
                    <View 
                      style={[
                        styles.chartBarFill,
                        {
                          height: (week.learning / 4) * 100,
                          backgroundColor: '#ef4444',
                        },
                      ]}
                    />
                  </View>
                </View>
                <IslamicText variant="caption" style={styles.chartBarLabel}>
                  {week.week}
                </IslamicText>
              </View>
            ))}
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
              <IslamicText variant="caption" style={styles.legendText}>
                Prayers
              </IslamicText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
              <IslamicText variant="caption" style={styles.legendText}>
                Duas
              </IslamicText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#8b5cf6' }]} />
              <IslamicText variant="caption" style={styles.legendText}>
                Quiz
              </IslamicText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
              <IslamicText variant="caption" style={styles.legendText}>
                Learning
              </IslamicText>
            </View>
          </View>
        </CardContent>
      </Card>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader
        title="Progress Tracker"
        subtitle="Track your Islamic journey"
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
          {/* Progress Overview */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.progressContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Your Progress
            </IslamicText>
            <View style={styles.progressGrid}>
              {renderProgressCard(
                'Prayers Completed',
                progressData.prayersCompleted.toString(),
                'time-outline' as keyof typeof Ionicons.glyphMap,
                FeatureColors.prayer,
                ['#10b981', '#059669']
              )}
              {renderProgressCard(
                'Current Streak',
                `${streakData.current} days`,
                'flame-outline' as keyof typeof Ionicons.glyphMap,
                getStreakColor(streakData.current),
                [getStreakColor(streakData.current), getStreakColor(streakData.current)]
              )}
              {renderProgressCard(
                'Duas Read',
                progressData.duasRead.toString(),
                'book-outline' as keyof typeof Ionicons.glyphMap,
                FeatureColors.duas,
                ['#f59e0b', '#d97706']
              )}
              {renderProgressCard(
                'Quiz Score',
                `${progressData.quizScore}%`,
                'help-circle-outline' as keyof typeof Ionicons.glyphMap,
                FeatureColors.quiz,
                ['#ec4899', '#db2777']
              )}
            </View>
          </Animated.View>

          {/* Goals */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.goalsContainer}>
            <View style={styles.goalsHeader}>
              <IslamicText variant="subtitle" style={styles.sectionTitle}>
                Goals
              </IslamicText>
              <IslamicText variant="caption" style={styles.goalsCount}>
                {progressData.goalsAchieved}/{progressData.totalGoals} completed
              </IslamicText>
            </View>
            {goals.map(renderGoal)}
          </Animated.View>

          {/* Achievements */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.achievementsContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Recent Achievements
            </IslamicText>
            {achievements.map(renderAchievement)}
          </Animated.View>

          {/* Weekly Chart */}
          {renderWeeklyChart()}

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing[4],
  },
  progressContainer: {
    marginBottom: Spacing[6],
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressCard: {
    width: (screenWidth - Spacing[4] * 2 - Spacing[3]) / 2,
    marginBottom: Spacing[3],
  },
  progressCardContent: {
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  progressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  progressIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[2],
  },
  progressCardTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  progressCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  goalsContainer: {
    marginBottom: Spacing[6],
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  goalsCount: {
    opacity: 0.7,
  },
  goalItem: {
    marginBottom: Spacing[4],
  },
  goalCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing[4],
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  goalDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  completedBadge: {
    marginLeft: Spacing[2],
  },
  goalProgress: {
    marginBottom: Spacing[4],
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing[2],
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDeadline: {
    fontSize: 12,
    opacity: 0.7,
  },
  goalCategory: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.sm,
  },
  goalCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
  },
  achievementsContainer: {
    marginBottom: Spacing[6],
  },
  achievementItem: {
    marginBottom: Spacing[3],
  },
  achievementCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: Spacing[1],
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  achievementPoints: {
    alignItems: 'center',
  },
  achievementPointsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  achievementPointsLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  achievementDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  chartContainer: {
    marginBottom: Spacing[6],
  },
  chartCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  periodButton: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.lg,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: Spacing[4],
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing[1],
  },
  chartBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 2,
  },
  chartBarItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    borderRadius: 2,
    minHeight: 4,
  },
  chartBarLabel: {
    fontSize: 10,
    marginTop: Spacing[2],
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: Spacing[20],
  },
});
