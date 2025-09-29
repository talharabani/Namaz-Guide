import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Theme';
import { PrayerStep, prayerSteps } from '../../data/prayerData';

const { width } = Dimensions.get('window');

// Using enhanced prayer data from data/prayerData.ts

export default function LearnScreen() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const handleStepPress = (step: PrayerStep) => {
    // Navigate to detail screen instead of expanding
    router.push({
      pathname: '/prayer-detail',
      params: { prayerStep: JSON.stringify(step) }
    });
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
          {prayerSteps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              <TouchableOpacity
                style={styles.stepCard}
                onPress={() => handleStepPress(step)}
                activeOpacity={0.8}
              >
                {/* Image at the top */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: step.image }}
                    style={styles.stepImage}
                    resizeMode="cover"
                  />
                  {/* Play overlay if video exists */}
                  {step.videoUrl && (
                    <View style={styles.playOverlay}>
                      <Ionicons name="play-circle" size={32} color="rgba(255, 255, 255, 0.9)" />
                    </View>
                  )}
                </View>

                {/* Step info below image */}
                <View style={styles.stepContent}>
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
                </View>
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    padding: Spacing.lg,
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