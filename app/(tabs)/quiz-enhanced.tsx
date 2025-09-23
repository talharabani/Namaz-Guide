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

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  date: Date;
  category: string;
  difficulty: string;
}

interface QuizCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

export default function EnhancedQuizScreen() {
  const { colors, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [recentResults, setRecentResults] = useState<QuizResult[]>([]);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });

    // Load recent results
    loadRecentResults();
  }, []);

  const loadRecentResults = async () => {
    // Mock recent results
    setRecentResults([
      {
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        timeSpent: 300,
        date: new Date('2024-01-15'),
        category: 'Prayer',
        difficulty: 'medium',
      },
      {
        score: 70,
        totalQuestions: 15,
        correctAnswers: 10,
        timeSpent: 450,
        date: new Date('2024-01-14'),
        category: 'Quran',
        difficulty: 'hard',
      },
    ]);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const startQuiz = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeSpent(0);
    setQuizCompleted(false);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      const currentQ = getCurrentQuizQuestions()[currentQuestion];
      if (selectedAnswer === currentQ.correctAnswer) {
        setScore(prev => prev + currentQ.points);
      }
    }

    if (currentQuestion < getCurrentQuizQuestions().length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    const finalScore = selectedAnswer !== null ? 
      score + (selectedAnswer === getCurrentQuizQuestions()[currentQuestion].correctAnswer ? 
        getCurrentQuizQuestions()[currentQuestion].points : 0) : score;
    
    const result: QuizResult = {
      score: Math.round((finalScore / (getCurrentQuizQuestions().length * 10)) * 100),
      totalQuestions: getCurrentQuizQuestions().length,
      correctAnswers: Math.round(finalScore / 10),
      timeSpent,
      date: new Date(),
      category: selectedCategory || 'General',
      difficulty: getCurrentQuizQuestions()[0]?.difficulty || 'medium',
    };

    setRecentResults(prev => [result, ...prev.slice(0, 4)]);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setTimeSpent(0);
    setSelectedCategory(null);
  };

  // Quiz categories
  const categories: QuizCategory[] = [
    {
      id: 'prayer',
      name: 'Prayer',
      icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.prayer,
      gradient: ['#10b981', '#059669'],
      questionCount: 15,
      difficulty: 'medium',
      description: 'Test your knowledge about Islamic prayer',
    },
    {
      id: 'quran',
      name: 'Quran',
      icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.duas,
      gradient: ['#f59e0b', '#d97706'],
      questionCount: 20,
      difficulty: 'hard',
      description: 'Questions about the Holy Quran',
    },
    {
      id: 'hadith',
      name: 'Hadith',
      icon: 'library-outline' as keyof typeof Ionicons.glyphMap,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      questionCount: 12,
      difficulty: 'medium',
      description: 'Prophet Muhammad\'s sayings and teachings',
    },
    {
      id: 'islamic-history',
      name: 'Islamic History',
      icon: 'globe-outline' as keyof typeof Ionicons.glyphMap,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      questionCount: 18,
      difficulty: 'hard',
      description: 'Historical events and figures in Islam',
    },
    {
      id: 'duas',
      name: 'Duas & Supplications',
      icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
      color: '#ec4899',
      gradient: ['#ec4899', '#db2777'],
      questionCount: 10,
      difficulty: 'easy',
      description: 'Islamic prayers and supplications',
    },
  ];

  // Sample quiz questions
  const getCurrentQuizQuestions = (): QuizQuestion[] => {
    const allQuestions: QuizQuestion[] = [
      {
        id: '1',
        question: 'How many times a day should a Muslim perform the obligatory prayers?',
        options: ['3 times', '4 times', '5 times', '6 times'],
        correctAnswer: 2,
        explanation: 'Muslims are required to perform 5 daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
        category: 'prayer',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: '2',
        question: 'What is the first Surah of the Quran?',
        options: ['Al-Fatiha', 'Al-Baqarah', 'Al-Imran', 'An-Nisa'],
        correctAnswer: 0,
        explanation: 'Al-Fatiha is the first Surah of the Quran and is recited in every prayer.',
        category: 'quran',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: '3',
        question: 'Which direction do Muslims face when praying?',
        options: ['North', 'South', 'East', 'Kaaba'],
        correctAnswer: 3,
        explanation: 'Muslims face the Kaaba in Mecca when performing their prayers.',
        category: 'prayer',
        difficulty: 'medium',
        points: 15,
      },
      {
        id: '4',
        question: 'What does "Bismillah" mean?',
        options: ['In the name of Allah', 'Praise be to Allah', 'Allah is great', 'There is no god but Allah'],
        correctAnswer: 0,
        explanation: 'Bismillah means "In the name of Allah" and is said before starting any important task.',
        category: 'duas',
        difficulty: 'easy',
        points: 10,
      },
      {
        id: '5',
        question: 'How many pillars of Islam are there?',
        options: ['4', '5', '6', '7'],
        correctAnswer: 1,
        explanation: 'There are 5 pillars of Islam: Shahada, Salah, Zakat, Sawm, and Hajj.',
        category: 'prayer',
        difficulty: 'medium',
        points: 15,
      },
    ];

    return selectedCategory ? 
      allQuestions.filter(q => q.category === selectedCategory) : 
      allQuestions;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return colors.textSecondary;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'star-outline';
      case 'medium': return 'star-half-outline';
      case 'hard': return 'star';
      default: return 'star-outline';
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const renderCategory = (category: QuizCategory) => (
    <Animated.View
      key={category.id}
      entering={FadeInDown.delay(200)}
      style={styles.categoryItem}
    >
      <Card
        variant="gradient"
        gradient={category.gradient}
        onPress={() => startQuiz(category.id)}
        style={styles.categoryCard}
      >
        <CardContent>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name={category.icon} size={28} color="white" />
            </View>
            <View style={styles.categoryInfo}>
              <IslamicText variant="subtitle" style={styles.categoryName}>
                {category.name}
              </IslamicText>
              <IslamicText variant="caption" style={styles.categoryDescription}>
                {category.description}
              </IslamicText>
            </View>
          </View>
          
          <View style={styles.categoryStats}>
            <View style={styles.statItem}>
              <Ionicons name="help-circle-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
              <IslamicText variant="caption" style={styles.statText}>
                {category.questionCount.toString()} questions
              </IslamicText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name={getDifficultyIcon(category.difficulty)} size={16} color="rgba(255, 255, 255, 0.8)" />
              <IslamicText variant="caption" style={styles.statText}>
                {category.difficulty}
              </IslamicText>
            </View>
          </View>
        </CardContent>
      </Card>
    </Animated.View>
  );

  const renderQuestion = () => {
    const questions = getCurrentQuizQuestions();
    const question = questions[currentQuestion];
    
    if (!question) return null;

    return (
      <Animated.View entering={FadeInUp.delay(200)} style={styles.questionContainer}>
        <Card style={styles.questionCard}>
          <CardContent>
            <View style={styles.questionHeader}>
              <IslamicText variant="caption" style={styles.questionNumber}>
                Question {(currentQuestion + 1).toString()} of {questions.length.toString()}
              </IslamicText>
              <View style={styles.questionDifficulty}>
                <Ionicons 
                  name={getDifficultyIcon(question.difficulty)} 
                  size={16} 
                  color={getDifficultyColor(question.difficulty)} 
                />
                <IslamicText 
                  variant="caption" 
                  style={[styles.difficultyText, { color: getDifficultyColor(question.difficulty) }]}
                >
                  {question.difficulty}
                </IslamicText>
              </View>
            </View>

            <IslamicText variant="subtitle" style={styles.questionText}>
              {question.question}
            </IslamicText>

            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectAnswer(index)}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: selectedAnswer === index ? 
                        (index === question.correctAnswer ? '#10b981' : '#ef4444') : 
                        colors.surface,
                      borderColor: selectedAnswer === index ? 
                        (index === question.correctAnswer ? '#10b981' : '#ef4444') : 
                        colors.border,
                    },
                  ]}
                  disabled={showExplanation}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionIndicator,
                      {
                        backgroundColor: selectedAnswer === index ? 
                          (index === question.correctAnswer ? '#10b981' : '#ef4444') : 
                          colors.border,
                      },
                    ]}>
                      <IslamicText 
                        variant="caption" 
                        style={[
                          styles.optionLetter,
                          {
                            color: selectedAnswer === index ? 'white' : colors.text,
                          },
                        ]}
                      >
                        {String.fromCharCode(65 + index)}
                      </IslamicText>
                    </View>
                    <IslamicText 
                      variant="body" 
                      style={[
                        styles.optionText,
                        {
                          color: selectedAnswer === index ? 'white' : colors.text,
                        },
                      ]}
                    >
                      {option}
                    </IslamicText>
                    {showExplanation && selectedAnswer === index && (
                      <Ionicons
                        name={index === question.correctAnswer ? 'checkmark-circle' : 'close-circle'}
                        size={20}
                        color={index === question.correctAnswer ? '#10b981' : '#ef4444'}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {showExplanation && (
              <Animated.View entering={FadeInUp.delay(300)} style={styles.explanationContainer}>
                <Card style={styles.explanationCard}>
                  <CardContent>
                    <IslamicText variant="subtitle" style={styles.explanationTitle}>
                      Explanation
                    </IslamicText>
                    <IslamicText variant="body" style={styles.explanationText}>
                      {question.explanation}
                    </IslamicText>
                  </CardContent>
                </Card>
              </Animated.View>
            )}

            <View style={styles.questionFooter}>
              <TouchableOpacity
                onPress={nextQuestion}
                style={[
                  styles.nextButton,
                  {
                    backgroundColor: showExplanation ? colors.primary : colors.surface,
                    opacity: showExplanation ? 1 : 0.5,
                  },
                ]}
                disabled={!showExplanation}
              >
                <IslamicText 
                  variant="body" 
                  style={[
                    styles.nextButtonText,
                    {
                      color: showExplanation ? 'white' : colors.text,
                    },
                  ]}
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </IslamicText>
                <Ionicons 
                  name="arrow-forward" 
                  size={16} 
                  color={showExplanation ? 'white' : colors.text} 
                />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
      </Animated.View>
    );
  };

  const renderResults = () => {
    const questions = getCurrentQuizQuestions();
    const finalScore = Math.round((score / (questions.length * 10)) * 100);
    const correctAnswers = Math.round(score / 10);

    return (
      <Animated.View entering={FadeInUp.delay(200)} style={styles.resultsContainer}>
        <Card style={styles.resultsCard}>
          <CardContent>
            <View style={styles.resultsHeader}>
              <Ionicons name="trophy" size={48} color="#f59e0b" />
              <IslamicText variant="title" style={styles.resultsTitle}>
                Quiz Completed!
              </IslamicText>
            </View>

            <View style={styles.scoreContainer}>
              <View style={styles.scoreItem}>
                <IslamicText variant="title" style={styles.scoreValue}>
                  {finalScore.toString()}%
                </IslamicText>
                <IslamicText variant="caption" style={styles.scoreLabel}>
                  Final Score
                </IslamicText>
              </View>
              <View style={styles.scoreItem}>
                <IslamicText variant="title" style={styles.scoreValue}>
                  {correctAnswers.toString()}/{questions.length.toString()}
                </IslamicText>
                <IslamicText variant="caption" style={styles.scoreLabel}>
                  Correct Answers
                </IslamicText>
              </View>
              <View style={styles.scoreItem}>
                <IslamicText variant="title" style={styles.scoreValue}>
                  {Math.floor(timeSpent / 60).toString()}m {(timeSpent % 60).toString()}s
                </IslamicText>
                <IslamicText variant="caption" style={styles.scoreLabel}>
                  Time Spent
                </IslamicText>
              </View>
            </View>

            <View style={styles.resultsActions}>
              <TouchableOpacity
                onPress={resetQuiz}
                style={styles.retakeButton}
              >
                <IslamicText variant="body" style={styles.retakeButtonText}>
                  Take Another Quiz
                </IslamicText>
                <Ionicons name="refresh" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
      </Animated.View>
    );
  };

  const renderRecentResults = () => (
    <Animated.View entering={FadeInUp.delay(400)} style={styles.recentResultsContainer}>
      <IslamicText variant="subtitle" style={styles.sectionTitle}>
        Recent Results
      </IslamicText>
      {recentResults.map((result, index) => (
        <Animated.View
          key={index}
          entering={FadeInDown.delay(600 + index * 100)}
          style={styles.resultItem}
        >
          <Card style={styles.resultCard}>
            <CardContent>
              <View style={styles.resultHeader}>
                <View style={styles.resultInfo}>
                  <IslamicText variant="body" style={styles.resultCategory}>
                    {result.category}
                  </IslamicText>
                  <IslamicText variant="caption" style={styles.resultDate}>
                    {result.date.toLocaleDateString()}
                  </IslamicText>
                </View>
                <View style={styles.resultScore}>
                  <IslamicText variant="title" style={styles.resultScoreValue}>
                    {result.score.toString()}%
                  </IslamicText>
                </View>
              </View>
              <View style={styles.resultStats}>
                <View style={styles.resultStat}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <IslamicText variant="caption" style={styles.resultStatText}>
                    {result.correctAnswers.toString()}/{result.totalQuestions.toString()}
                  </IslamicText>
                </View>
                <View style={styles.resultStat}>
                  <Ionicons name="time" size={16} color={colors.textSecondary} />
                  <IslamicText variant="caption" style={styles.resultStatText}>
                    {Math.floor(result.timeSpent / 60).toString()}m
                  </IslamicText>
                </View>
                <View style={styles.resultStat}>
                  <Ionicons name="star" size={16} color="#f59e0b" />
                  <IslamicText variant="caption" style={styles.resultStatText}>
                    {result.difficulty}
                  </IslamicText>
                </View>
              </View>
            </CardContent>
          </Card>
        </Animated.View>
      ))}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader
        title="Islamic Quiz"
        subtitle="Test your knowledge"
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
          {!quizStarted && !quizCompleted && (
            <>
              {/* Categories */}
              <Animated.View entering={FadeInUp.delay(200)} style={styles.categoriesContainer}>
                <IslamicText variant="subtitle" style={styles.sectionTitle}>
                  Choose a Category
                </IslamicText>
                {categories.map(renderCategory)}
              </Animated.View>

              {/* Recent Results */}
              {recentResults.length > 0 && renderRecentResults()}
            </>
          )}

          {quizStarted && !quizCompleted && renderQuestion()}
          {quizCompleted && renderResults()}

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
  categoriesContainer: {
    marginBottom: Spacing[6],
  },
  categoryItem: {
    marginBottom: Spacing[4],
  },
  categoryCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: Spacing[1],
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoryStats: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  questionContainer: {
    marginBottom: Spacing[6],
  },
  questionCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  questionDifficulty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing[6],
    lineHeight: 26,
  },
  optionsContainer: {
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  optionButton: {
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  explanationContainer: {
    marginBottom: Spacing[6],
  },
  explanationCard: {
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: Spacing[2],
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#10b981',
  },
  questionFooter: {
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginBottom: Spacing[6],
  },
  resultsCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing[3],
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing[6],
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
  },
  scoreLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: Spacing[1],
  },
  resultsActions: {
    alignItems: 'center',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    backgroundColor: '#10b981',
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  recentResultsContainer: {
    marginBottom: Spacing[6],
  },
  resultItem: {
    marginBottom: Spacing[3],
  },
  resultCard: {
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  resultInfo: {
    flex: 1,
  },
  resultCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing[1],
  },
  resultDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  resultScore: {
    alignItems: 'center',
  },
  resultScoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
  },
  resultStats: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  resultStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  resultStatText: {
    fontSize: 12,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: Spacing[20],
  },
});
