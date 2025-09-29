import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageModal from '../components/ImageModal';
import VideoPlayer from '../components/VideoPlayer';
import { BorderRadius, FontSizes, Spacing } from '../constants/Theme';
import { PrayerStep } from '../data/prayerData';

const { width: screenWidth } = Dimensions.get('window');

export default function PrayerDetailScreen() {
  const { prayerStep } = useLocalSearchParams();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  // Parse the prayer step data
  const step: PrayerStep = prayerStep ? JSON.parse(prayerStep as string) : null;

  if (!step) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Prayer step not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleImagePress = () => {
    setImageModalVisible(true);
  };

  const handleVideoPress = () => {
    if (step.videoUrl) {
      setVideoModalVisible(true);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prayer Step</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Large Image */}
        <TouchableOpacity style={styles.imageContainer} onPress={handleImagePress}>
          <Image
            source={{ uri: step.image }}
            style={styles.largeImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Ionicons name="expand" size={24} color="white" />
            <Text style={styles.imageOverlayText}>Tap to view fullscreen</Text>
          </View>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.arabic}>{step.arabic}</Text>
        </View>

        {/* Step Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step Details</Text>
          <Text style={styles.detailsText}>{step.details}</Text>
        </View>

        {/* Arabic Text with Translation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recitation</Text>
          <View style={styles.recitationContainer}>
            <Text style={styles.arabicText}>{step.arabic}</Text>
            <Text style={styles.translationText}>{step.translation}</Text>
            <Text style={styles.transliterationText}>{step.transliteration}</Text>
          </View>
        </View>

        {/* Hadith Section */}
        {step.hadith && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Hadith</Text>
            <View style={styles.hadithContainer}>
              <Text style={styles.hadithText}>"{step.hadith.text}"</Text>
              <Text style={styles.hadithReference}>- {step.hadith.reference}</Text>
            </View>
          </View>
        )}

        {/* Quranic Ayah Section */}
        {step.quranAyah && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quranic Reference</Text>
            <View style={styles.ayahContainer}>
              <Text style={styles.ayahText}>"{step.quranAyah.text}"</Text>
              <Text style={styles.ayahReference}>- {step.quranAyah.reference}</Text>
            </View>
          </View>
        )}

        {/* Video Button */}
        {step.videoUrl && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.videoButton} onPress={handleVideoPress}>
              <Ionicons name="play-circle" size={24} color="white" />
              <Text style={styles.videoButtonText}>Watch Video Tutorial</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      <ImageModal
        visible={imageModalVisible}
        imageUrl={step.image}
        onClose={() => setImageModalVisible(false)}
      />

      <VideoPlayer
        visible={videoModalVisible}
        videoUrl={step.videoUrl || ''}
        onClose={() => setVideoModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  largeImage: {
    width: '100%',
    height: 250,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  imageOverlayText: {
    color: 'white',
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  titleContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  arabic: {
    fontSize: FontSizes.lg,
    color: '#10b981',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.md,
  },
  detailsText: {
    fontSize: FontSizes.md,
    color: 'white',
    lineHeight: 24,
    textAlign: 'left',
  },
  recitationContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  arabicText: {
    fontSize: FontSizes.xl,
    color: '#10b981',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Spacing.md,
    lineHeight: 32,
  },
  translationText: {
    fontSize: FontSizes.md,
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  transliterationText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  hadithContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  hadithText: {
    fontSize: FontSizes.md,
    color: 'white',
    lineHeight: 24,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  hadithReference: {
    fontSize: FontSizes.sm,
    color: '#3b82f6',
    textAlign: 'right',
    fontWeight: '500',
  },
  ayahContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  ayahText: {
    fontSize: FontSizes.md,
    color: 'white',
    lineHeight: 24,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  ayahReference: {
    fontSize: FontSizes.sm,
    color: '#8b5cf6',
    textAlign: 'right',
    fontWeight: '500',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: Spacing.sm,
  },
  videoButtonText: {
    fontSize: FontSizes.md,
    color: 'white',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    color: '#10b981',
    fontWeight: '600',
  },
});
