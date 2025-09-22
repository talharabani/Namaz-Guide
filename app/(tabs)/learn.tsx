import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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

interface LearningStep {
  id: string;
  title: string;
  description: string;
  arabic: string;
  translation: string;
  transliteration: string;
  icon: string;
  color: string;
}

const learningSteps: LearningStep[] = [
  {
    id: '1',
    title: 'Niyyah (Intention)',
    description: 'Make the intention to perform the prayer',
    arabic: 'نِيَّة',
    translation: 'Intention',
    transliteration: 'Niyyah',
    icon: 'heart-outline',
    color: '#10b981',
  },
  {
    id: '2',
    title: 'Takbir',
    description: 'Raise hands and say Allahu Akbar',
    arabic: 'اللهُ أَكْبَر',
    translation: 'Allah is the Greatest',
    transliteration: 'Allahu Akbar',
    icon: 'hand-right-outline',
    color: '#3b82f6',
  },
  {
    id: '3',
    title: 'Qiyam (Standing)',
    description: 'Stand and recite Al-Fatiha',
    arabic: 'بِسْمِ اللهِ الرّحمن الرّحيم',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    transliteration: 'Bismillah ir-Rahman ir-Raheem',
    icon: 'person-outline',
    color: '#8b5cf6',
  },
  {
    id: '4',
    title: 'Ruku (Bowing)',
    description: 'Bow down and say Subhana Rabbi al-Azeem',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيم',
    translation: 'Glory to my Lord, the Great',
    transliteration: 'Subhana Rabbi al-Azeem',
    icon: 'arrow-down-outline',
    color: '#f59e0b',
  },
  {
    id: '5',
    title: 'Sujood (Prostration)',
    description: 'Prostrate and say Subhana Rabbi al-A\'la',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    translation: 'Glory to my Lord, the Most High',
    transliteration: 'Subhana Rabbi al-A\'la',
    icon: 'arrow-down-circle-outline',
    color: '#ef4444',
  },
  {
    id: '6',
    title: 'Tashahhud',
    description: 'Sit and recite the testimony of faith',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا الله',
    translation: 'I bear witness that there is no god but Allah',
    transliteration: 'Ashhadu an la ilaha illa Allah',
    icon: 'book-outline',
    color: '#06b6d4',
  },
  {
    id: '7',
    title: 'Salam',
    description: 'Turn head right and left saying peace',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ الله',
    translation: 'Peace be upon you and the mercy of Allah',
    transliteration: 'As-salamu alaykum wa rahmatullah',
    icon: 'hand-left-outline',
    color: '#84cc16',
  },
];

export default function LearnScreen() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const handleStepPress = (stepId: string) => {
    setSelectedStep(selectedStep === stepId ? null : stepId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="book" size={28} color="#10b981" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Learn Namaz</Text>
              <Text style={styles.appSubtitle}>Step-by-step prayer guide</Text>
            </View>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introContainer}>
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>How to Perform Namaz</Text>
            <Text style={styles.introText}>
              Follow these steps to learn the proper way to perform Islamic prayer. 
              Each step includes the Arabic text, translation, and transliteration.
            </Text>
          </View>
        </View>

        {/* Learning Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.sectionTitle}>Prayer Steps</Text>
          {learningSteps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              <TouchableOpacity
                style={[
                  styles.stepCard,
                  selectedStep === step.id && styles.selectedStepCard
                ]}
                onPress={() => handleStepPress(step.id)}
                activeOpacity={0.8}
              >
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                  <View style={[styles.stepIcon, { backgroundColor: step.color }]}>
                    <Ionicons name={step.icon as any} size={20} color="white" />
                  </View>
                </View>
                
                {selectedStep === step.id && (
                  <View style={styles.stepDetails}>
                    <View style={styles.arabicContainer}>
                      <Text style={styles.arabicText}>{step.arabic}</Text>
                    </View>
                    <View style={styles.translationContainer}>
                      <Text style={styles.translationText}>{step.translation}</Text>
                    </View>
                    <View style={styles.transliterationContainer}>
                      <Text style={styles.transliterationText}>{step.transliteration}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Prayer Tips</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Find a clean and quiet place for prayer</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Face the Qibla direction (towards Kaaba)</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Wear clean and modest clothing</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Perform Wudu (ablution) before prayer</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
              <Text style={styles.tipText}>Take your time and focus on the meaning</Text>
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
  introContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  introCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  introTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: Spacing.sm,
  },
  introText: {
    fontSize: FontSizes.sm,
    color: 'white',
    lineHeight: 20,
  },
  stepsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.lg,
  },
  stepItem: {
    marginBottom: Spacing.md,
  },
  stepCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedStepCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: 'white',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  stepDescription: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDetails: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  arabicContainer: {
    marginBottom: Spacing.md,
  },
  arabicText: {
    fontSize: FontSizes.xl,
    color: '#10b981',
    textAlign: 'center',
    lineHeight: 32,
  },
  translationContainer: {
    marginBottom: Spacing.sm,
  },
  translationText: {
    fontSize: FontSizes.md,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
  transliterationContainer: {
    marginBottom: Spacing.sm,
  },
  transliterationText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
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
    height: Spacing.xxl,
  },
});