import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';

const { width } = Dimensions.get('window');

interface CommonMistake {
  id: string;
  title: string;
  description: string;
  correction: string;
  category: string;
  icon: string;
  color: string;
  severity: 'low' | 'medium' | 'high';
}

const commonMistakes: CommonMistake[] = [
  {
    id: '1',
    title: 'Incorrect Wudu Sequence',
    description: 'Washing body parts in wrong order or missing steps',
    correction: 'Follow the correct sequence: hands, mouth, nose, face, arms, head, feet',
    category: 'Wudu',
    icon: 'water-outline',
    color: '#3b82f6',
    severity: 'high',
  },
  {
    id: '2',
    title: 'Rushing Through Prayer',
    description: 'Praying too quickly without proper concentration',
    correction: 'Take time to recite slowly and focus on the meaning of each verse',
    category: 'Prayer',
    icon: 'time-outline',
    color: '#f59e0b',
    severity: 'medium',
  },
  {
    id: '3',
    title: 'Incorrect Qibla Direction',
    description: 'Not facing the correct direction during prayer',
    correction: 'Use a compass or Qibla finder app to ensure correct direction',
    category: 'Prayer',
    icon: 'compass-outline',
    color: '#ef4444',
    severity: 'high',
  },
  {
    id: '4',
    title: 'Missing Takbir',
    description: 'Forgetting to say Allahu Akbar at the beginning',
    correction: 'Always start prayer with Takbir and raise hands to ears',
    category: 'Prayer',
    icon: 'hand-right-outline',
    color: '#8b5cf6',
    severity: 'high',
  },
  {
    id: '5',
    title: 'Incorrect Ruku Position',
    description: 'Not bending properly or placing hands incorrectly',
    correction: 'Bend at waist, place hands on knees, keep back straight',
    category: 'Prayer',
    icon: 'arrow-down-outline',
    color: '#06b6d4',
    severity: 'medium',
  },
  {
    id: '6',
    title: 'Wrong Sujood Position',
    description: 'Incorrect prostration with hands or feet placement',
    correction: 'Place forehead, nose, hands, knees, and toes on ground',
    category: 'Prayer',
    icon: 'arrow-down-circle-outline',
    color: '#84cc16',
    severity: 'high',
  },
  {
    id: '7',
    title: 'Skipping Tashahhud',
    description: 'Forgetting to recite the testimony of faith',
    correction: 'Always recite Tashahhud in the second and last rak\'ah',
    category: 'Prayer',
    icon: 'book-outline',
    color: '#f97316',
    severity: 'high',
  },
  {
    id: '8',
    title: 'Incorrect Salam',
    description: 'Not turning head properly or saying wrong words',
    correction: 'Turn head right saying "As-salamu alaykum wa rahmatullah"',
    category: 'Prayer',
    icon: 'hand-left-outline',
    color: '#ec4899',
    severity: 'medium',
  },
  {
    id: '9',
    title: 'Praying in Impure Clothes',
    description: 'Wearing clothes with impurities during prayer',
    correction: 'Ensure clothes are clean and free from impurities',
    category: 'Cleanliness',
    icon: 'shirt-outline',
    color: '#6366f1',
    severity: 'high',
  },
  {
    id: '10',
    title: 'Not Covering Awrah',
    description: 'Exposing parts of body that should be covered',
    correction: 'Cover from navel to knees for men, entire body except face and hands for women',
    category: 'Cleanliness',
    icon: 'shield-outline',
    color: '#10b981',
    severity: 'high',
  },
  {
    id: '11',
    title: 'Eating During Prayer',
    description: 'Consuming food or drink while praying',
    correction: 'Complete eating before starting prayer or break prayer if necessary',
    category: 'Prayer',
    icon: 'restaurant-outline',
    color: '#f59e0b',
    severity: 'medium',
  },
  {
    id: '12',
    title: 'Talking During Prayer',
    description: 'Speaking unnecessarily during prayer',
    correction: 'Remain silent except for required recitations',
    category: 'Prayer',
    icon: 'chatbubble-outline',
    color: '#ef4444',
    severity: 'medium',
  },
];

const categories = ['All', 'Prayer', 'Wudu', 'Cleanliness'];

const severityColors = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
};

export default function CommonMistakesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMistake, setSelectedMistake] = useState<CommonMistake | null>(null);

  const filteredMistakes = selectedCategory === 'All' 
    ? commonMistakes 
    : commonMistakes.filter(mistake => mistake.category === selectedCategory);

  const handleMistakePress = (mistake: CommonMistake) => {
    setSelectedMistake(selectedMistake?.id === mistake.id ? null : mistake);
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
              <Ionicons name="warning" size={28} color="#f59e0b" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Common Mistakes</Text>
              <Text style={styles.appSubtitle}>Learn to avoid prayer errors</Text>
            </View>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introContainer}>
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Avoid These Common Prayer Mistakes</Text>
            <Text style={styles.introText}>
              Learn about common mistakes Muslims make during prayer and how to correct them. 
              This will help you perform your prayers correctly and with proper focus.
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
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

        {/* Mistakes List */}
        <View style={styles.mistakesContainer}>
          {filteredMistakes.map((mistake) => (
            <View key={mistake.id} style={styles.mistakeItem}>
              <TouchableOpacity
                style={[
                  styles.mistakeCard,
                  selectedMistake?.id === mistake.id && styles.selectedMistakeCard
                ]}
                onPress={() => handleMistakePress(mistake)}
                activeOpacity={0.8}
              >
                <View style={styles.mistakeHeader}>
                  <View style={styles.mistakeInfo}>
                    <View style={[styles.mistakeIcon, { backgroundColor: mistake.color }]}>
                      <Ionicons name={mistake.icon as any} size={20} color="white" />
                    </View>
                    <View style={styles.mistakeDetails}>
                      <Text style={styles.mistakeTitle}>{mistake.title}</Text>
                      <View style={styles.mistakeMeta}>
                        <Text style={styles.mistakeCategory}>{mistake.category}</Text>
                        <View style={[
                          styles.severityBadge,
                          { backgroundColor: severityColors[mistake.severity] }
                        ]}>
                          <Text style={styles.severityText}>
                            {mistake.severity.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Ionicons 
                    name={selectedMistake?.id === mistake.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </View>
                
                {selectedMistake?.id === mistake.id && (
                  <View style={styles.mistakeContent}>
                    <View style={styles.mistakeSection}>
                      <Text style={styles.mistakeSectionTitle}>❌ The Mistake:</Text>
                      <Text style={styles.mistakeDescription}>{mistake.description}</Text>
                    </View>
                    
                    <View style={styles.mistakeSection}>
                      <Text style={styles.mistakeSectionTitle}>✅ The Correction:</Text>
                      <Text style={styles.mistakeCorrection}>{mistake.correction}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 General Tips</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Take your time and don't rush through prayers</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Learn the correct pronunciation of Arabic words</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Practice regularly to build good habits</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Seek knowledge from qualified teachers</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Focus on understanding the meaning of what you recite</Text>
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
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
  introContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  introCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  introTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: Spacing.sm,
  },
  introText: {
    fontSize: FontSizes.sm,
    color: 'white',
    lineHeight: 20,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
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
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  categoryButtonText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: '#f59e0b',
  },
  mistakesContainer: {
    paddingHorizontal: Spacing.lg,
  },
  mistakeItem: {
    marginBottom: Spacing.md,
  },
  mistakeCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedMistakeCard: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  mistakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mistakeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mistakeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  mistakeDetails: {
    flex: 1,
  },
  mistakeTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  mistakeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mistakeCategory: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginRight: Spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  severityText: {
    fontSize: FontSizes.xs,
    color: 'white',
    fontWeight: 'bold',
  },
  mistakeContent: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  mistakeSection: {
    marginBottom: Spacing.md,
  },
  mistakeSectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.sm,
  },
  mistakeDescription: {
    fontSize: FontSizes.sm,
    color: '#ef4444',
    lineHeight: 20,
  },
  mistakeCorrection: {
    fontSize: FontSizes.sm,
    color: '#10b981',
    lineHeight: 20,
  },
  tipsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  tipsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tipsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginLeft: Spacing.sm,
    flex: 1,
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 120 : 100, // Account for tab bar height
  },
});
