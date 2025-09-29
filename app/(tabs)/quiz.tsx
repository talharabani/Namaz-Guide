import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';

const { width } = Dimensions.get('window');

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
  category: string;
  difficulty: string;
  pointsEarned: number;
}

const quizQuestions: QuizQuestion[] = [
  // Easy Questions
  {
    id: '1',
    question: 'How many daily prayers are obligatory in Islam?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
    explanation: 'There are 5 daily obligatory prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
    category: 'Prayer Basics',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '2',
    question: 'What is the first prayer of the day?',
    options: ['Dhuhr', 'Fajr', 'Asr', 'Maghrib'],
    correctAnswer: 1,
    explanation: 'Fajr is the first prayer of the day, performed before sunrise.',
    category: 'Prayer Times',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '3',
    question: 'Which direction do Muslims face during prayer?',
    options: ['North', 'South', 'East', 'Qibla (Kaaba)'],
    correctAnswer: 3,
    explanation: 'Muslims face the Qibla (direction of the Kaaba in Mecca) during prayer.',
    category: 'Prayer Basics',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '4',
    question: 'What is the minimum number of rak\'ahs in Maghrib prayer?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    explanation: 'Maghrib prayer consists of 3 rak\'ahs.',
    category: 'Prayer Structure',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '5',
    question: 'What should you say before starting prayer?',
    options: ['Bismillah', 'Allahu Akbar', 'Alhamdulillah', 'Subhanallah'],
    correctAnswer: 1,
    explanation: 'Takbir (Allahu Akbar) is said at the beginning of each prayer.',
    category: 'Prayer Basics',
    difficulty: 'easy',
    points: 10,
  },

  // Medium Questions
  {
    id: '6',
    question: 'What is the recommended time to perform Tahajjud prayer?',
    options: ['Before Fajr', 'After Maghrib', 'After Isha', 'Late night/early morning'],
    correctAnswer: 3,
    explanation: 'Tahajjud is performed in the late night or early morning hours, after sleeping.',
    category: 'Optional Prayers',
    difficulty: 'medium',
    points: 20,
  },
  {
    id: '7',
    question: 'How many rak\'ahs are in the Friday (Jummah) prayer?',
    options: ['2', '3', '4', '6'],
    correctAnswer: 0,
    explanation: 'Jummah prayer consists of 2 rak\'ahs, replacing Dhuhr prayer on Fridays.',
    category: 'Special Prayers',
    difficulty: 'medium',
    points: 20,
  },
  {
    id: '8',
    question: 'What is the name of the prayer performed during Ramadan nights?',
    options: ['Tahajjud', 'Taraweeh', 'Witr', 'Duha'],
    correctAnswer: 1,
    explanation: 'Taraweeh is the special prayer performed during Ramadan nights.',
    category: 'Special Prayers',
    difficulty: 'medium',
    points: 20,
  },
  {
    id: '9',
    question: 'Which prayer is performed immediately after sunset?',
    options: ['Fajr', 'Dhuhr', 'Maghrib', 'Isha'],
    correctAnswer: 2,
    explanation: 'Maghrib prayer is performed immediately after sunset.',
    category: 'Prayer Times',
    difficulty: 'medium',
    points: 20,
  },
  {
    id: '10',
    question: 'What is the minimum number of people required for congregational prayer?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'A minimum of 2 people (including the imam) is required for congregational prayer.',
    category: 'Prayer Basics',
    difficulty: 'medium',
    points: 20,
  },

  // Hard Questions
  {
    id: '11',
    question: 'What is the ruling on combining prayers during travel?',
    options: ['Not allowed', 'Only for Maghrib and Isha', 'Allowed for all prayers', 'Only for Dhuhr and Asr'],
    correctAnswer: 2,
    explanation: 'During travel, it is permissible to combine prayers (Jam\' al-Taqdim or Jam\' al-Ta\'khir).',
    category: 'Prayer Rules',
    difficulty: 'hard',
    points: 30,
  },
  {
    id: '12',
    question: 'What is the minimum distance required to shorten prayers during travel?',
    options: ['50 km', '80 km', '100 km', 'Varies by school of thought'],
    correctAnswer: 3,
    explanation: 'The distance varies by school of thought, generally ranging from 80-120 km.',
    category: 'Prayer Rules',
    difficulty: 'hard',
    points: 30,
  },
  {
    id: '13',
    question: 'What is the ruling on praying while sitting if one cannot stand?',
    options: ['Not valid', 'Valid but disliked', 'Valid and acceptable', 'Only for elderly'],
    correctAnswer: 2,
    explanation: 'Praying while sitting is valid and acceptable if one cannot stand due to illness or disability.',
    category: 'Prayer Rules',
    difficulty: 'hard',
    points: 30,
  },
  {
    id: '14',
    question: 'What is the maximum time one can delay Isha prayer?',
    options: ['Until midnight', 'Until 1 AM', 'Until Fajr time', 'No specific limit'],
    correctAnswer: 0,
    explanation: 'Isha prayer should be performed before midnight, though it can be delayed until Fajr time in extreme circumstances.',
    category: 'Prayer Times',
    difficulty: 'hard',
    points: 30,
  },
  {
    id: '15',
    question: 'What is the ruling on making up missed prayers?',
    options: ['Not required', 'Only for recent prayers', 'Required for all missed prayers', 'Only for Fajr and Maghrib'],
    correctAnswer: 2,
    explanation: 'It is obligatory to make up all missed prayers as soon as possible.',
    category: 'Prayer Rules',
    difficulty: 'hard',
    points: 30,
  },
];

const categories = ['All', 'Prayer Basics', 'Prayer Times', 'Prayer Structure', 'Optional Prayers', 'Special Prayers', 'Prayer Rules'];

export default function QuizScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (quizStarted && !quizCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted]);

  // Generate random questions
  const generateQuiz = () => {
    const filteredQuestions = selectedCategory === 'All' 
      ? quizQuestions 
      : quizQuestions.filter(q => q.category === selectedCategory);
    
    // Shuffle and select 10 random questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(10, shuffled.length));
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeSpent(0);
    setQuizCompleted(false);
    setQuizStarted(true);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + questions[currentQuestionIndex].points);
    }

    // Animate transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      const result: QuizResult = {
        score,
        totalQuestions: questions.length,
        correctAnswers: questions.filter((_, index) => 
          index <= currentQuestionIndex && selectedAnswer === questions[index].correctAnswer
        ).length + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0),
        timeSpent,
        category: selectedCategory,
        difficulty: questions[0]?.difficulty || 'medium',
        pointsEarned: score,
      };
      
      setQuizResults(prev => [result, ...prev]);
      setQuizCompleted(true);
      setQuizStarted(false);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeSpent(0);
    setQuestions([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (!quizStarted && !quizCompleted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155']}
          style={styles.background}
        />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Ionicons name="school" size={28} color="#8b5cf6" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.appName}>Islamic Quiz</Text>
                <Text style={styles.appSubtitle}>Test your knowledge</Text>
              </View>
            </View>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Choose Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryButtonText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quiz Info */}
          <View style={styles.quizInfoContainer}>
            <View style={styles.quizInfoCard}>
              <Text style={styles.quizInfoTitle}>Quiz Information</Text>
              <View style={styles.quizInfoItem}>
                <Ionicons name="help-circle-outline" size={20} color="#8b5cf6" />
                <Text style={styles.quizInfoText}>10 random questions</Text>
              </View>
              <View style={styles.quizInfoItem}>
                <Ionicons name="time-outline" size={20} color="#8b5cf6" />
                <Text style={styles.quizInfoText}>No time limit per question</Text>
              </View>
              <View style={styles.quizInfoItem}>
                <Ionicons name="trophy-outline" size={20} color="#8b5cf6" />
                <Text style={styles.quizInfoText}>Points: Easy (10), Medium (20), Hard (30)</Text>
              </View>
              <View style={styles.quizInfoItem}>
                <Ionicons name="refresh-outline" size={20} color="#8b5cf6" />
                <Text style={styles.quizInfoText}>Questions change every time</Text>
              </View>
            </View>
          </View>

          {/* Recent Results */}
          {quizResults.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.sectionTitle}>Recent Results</Text>
              {quizResults.slice(0, 3).map((result, index) => (
                <View key={index} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultCategory}>{result.category}</Text>
                    <Text style={[styles.resultScore, { color: getScoreColor((result.correctAnswers / result.totalQuestions) * 100) }]}>
                      {result.correctAnswers}/{result.totalQuestions}
                    </Text>
                  </View>
                  <View style={styles.resultDetails}>
                    <Text style={styles.resultPoints}>+{result.pointsEarned} points</Text>
                    <Text style={styles.resultTime}>{formatTime(result.timeSpent)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Start Button */}
          <View style={styles.startContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={generateQuiz}
              activeOpacity={0.8}
            >
              <Ionicons name="play" size={24} color="white" />
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    );
  }

  if (quizCompleted) {
    const percentage = (quizResults[0]?.correctAnswers / quizResults[0]?.totalQuestions) * 100;
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155']}
          style={styles.background}
        />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Ionicons name="trophy" size={28} color="#f59e0b" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.appName}>Quiz Complete!</Text>
                <Text style={styles.appSubtitle}>Great job!</Text>
              </View>
            </View>
          </View>

          {/* Results */}
          <View style={styles.resultsContainer}>
            <View style={styles.resultSummaryCard}>
              <View style={styles.resultSummaryHeader}>
                <Text style={styles.resultSummaryTitle}>Your Score</Text>
                <Text style={[styles.resultSummaryScore, { color: getScoreColor(percentage) }]}>
                  {Math.round(percentage)}%
                </Text>
              </View>
              
              <View style={styles.resultSummaryStats}>
                <View style={styles.resultSummaryStat}>
                  <Text style={styles.resultSummaryStatNumber}>{quizResults[0]?.correctAnswers}</Text>
                  <Text style={styles.resultSummaryStatLabel}>Correct</Text>
                </View>
                <View style={styles.resultSummaryStat}>
                  <Text style={styles.resultSummaryStatNumber}>{quizResults[0]?.totalQuestions}</Text>
                  <Text style={styles.resultSummaryStatLabel}>Total</Text>
                </View>
                <View style={styles.resultSummaryStat}>
                  <Text style={styles.resultSummaryStatNumber}>{quizResults[0]?.pointsEarned}</Text>
                  <Text style={styles.resultSummaryStatLabel}>Points</Text>
                </View>
                <View style={styles.resultSummaryStat}>
                  <Text style={styles.resultSummaryStatNumber}>{formatTime(quizResults[0]?.timeSpent || 0)}</Text>
                  <Text style={styles.resultSummaryStatLabel}>Time</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Performance Message */}
          <View style={styles.performanceContainer}>
            <View style={styles.performanceCard}>
              <Ionicons 
                name={percentage >= 80 ? "trophy" : percentage >= 60 ? "medal" : "school"} 
                size={48} 
                color={getScoreColor(percentage)} 
              />
              <Text style={styles.performanceTitle}>
                {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
              </Text>
              <Text style={styles.performanceMessage}>
                {percentage >= 80 
                  ? "Outstanding performance! You have excellent knowledge of Islamic prayer practices."
                  : percentage >= 60 
                  ? "Well done! You have good knowledge with room for improvement."
                  : "Don't worry! Keep studying and practicing to improve your knowledge."
                }
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={generateQuiz}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.actionButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={resetQuiz}
              activeOpacity={0.8}
            >
              <Ionicons name="home" size={20} color="#8b5cf6" />
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Home</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
      />

      <View style={styles.quizContainer}>
        {/* Header */}
        <View style={styles.quizHeader}>
          <View style={styles.quizHeaderTop}>
            <TouchableOpacity onPress={resetQuiz}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.quizTitle}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
            <Text style={styles.quizScore}>{score} pts</Text>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Question */}
        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
          <View style={styles.questionHeader}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(currentQuestion.difficulty) }]}>
              <Text style={styles.difficultyText}>{currentQuestion.difficulty.toUpperCase()}</Text>
            </View>
            <Text style={styles.categoryText}>{currentQuestion.category}</Text>
          </View>
          
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showResult && index === currentQuestion.correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResult}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText,
                  showResult && index === currentQuestion.correctAnswer && styles.correctOptionText,
                  showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && styles.incorrectOptionText,
                ]}>
                  {option}
                </Text>
                {showResult && index === currentQuestion.correctAnswer && (
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                )}
                {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {showResult && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </View>
          )}
        </Animated.View>

        {/* Next Button */}
        {showResult && (
          <View style={styles.nextContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.md,
  },
  categoriesScroll: {
    paddingRight: Spacing.lg,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: Spacing.sm,
  },
  selectedCategoryButton: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  categoryButtonText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: '#8b5cf6',
  },
  quizInfoContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quizInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quizInfoTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.md,
  },
  quizInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quizInfoText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginLeft: Spacing.sm,
  },
  resultsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  resultCategory: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: 'white',
  },
  resultScore: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultPoints: {
    fontSize: FontSizes.sm,
    color: '#8b5cf6',
  },
  resultTime: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  startContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: Spacing.sm,
  },
  quizContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  quizHeader: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  quizHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quizTitle: {
    fontSize: FontSizes.md,
    color: 'white',
    fontWeight: '600',
  },
  quizScore: {
    fontSize: FontSizes.md,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  difficultyText: {
    fontSize: FontSizes.xs,
    color: 'white',
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  questionText: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 32,
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    marginBottom: Spacing.lg,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  correctOption: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  incorrectOption: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  optionText: {
    fontSize: FontSizes.md,
    color: 'white',
    flex: 1,
  },
  selectedOptionText: {
    color: '#8b5cf6',
  },
  correctOptionText: {
    color: '#10b981',
  },
  incorrectOptionText: {
    color: '#ef4444',
  },
  explanationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  explanationTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.sm,
  },
  explanationText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    lineHeight: 20,
  },
  nextContainer: {
    paddingBottom: Spacing.xl,
  },
  nextButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginRight: Spacing.sm,
  },
  resultSummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  resultSummaryHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resultSummaryTitle: {
    fontSize: FontSizes.lg,
    color: 'white',
    marginBottom: Spacing.sm,
  },
  resultSummaryScore: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
  },
  resultSummaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  resultSummaryStat: {
    alignItems: 'center',
  },
  resultSummaryStatNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  resultSummaryStatLabel: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  performanceContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  performanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  performanceTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  performanceMessage: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.xs,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: Spacing.sm,
  },
  secondaryButtonText: {
    color: '#8b5cf6',
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 120 : 100, // Account for tab bar height
  },
});
