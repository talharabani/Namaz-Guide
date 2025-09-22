import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import { BorderRadius, FontSizes, Spacing } from '../constants/Theme';

const { width } = Dimensions.get('window');

interface Hadith {
  id: string;
  text: string;
  narrator: string;
  source: string;
  category: string;
  icon: string;
  color: string;
}

const hadiths: Hadith[] = [
  {
    id: '1',
    text: 'The best of people are those who are most beneficial to others.',
    narrator: 'Prophet Muhammad (PBUH)',
    source: 'Sahih Bukhari',
    category: 'Good Deeds',
    icon: 'heart-outline',
    color: '#10b981',
  },
  {
    id: '2',
    text: 'The believer is not one who eats his fill while his neighbor goes hungry.',
    narrator: 'Prophet Muhammad (PBUH)',
    source: 'Sahih Bukhari',
    category: 'Compassion',
    icon: 'people-outline',
    color: '#3b82f6',
  },
  {
    id: '3',
    text: 'The best of people are those who are most beneficial to others.',
    narrator: 'Prophet Muhammad (PBUH)',
    source: 'Sahih Muslim',
    category: 'Good Deeds',
    icon: 'heart-outline',
    color: '#10b981',
  },
  {
    id: '4',
    text: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    narrator: 'Prophet Muhammad (PBUH)',
    source: 'Sahih Bukhari',
    category: 'Speech',
    icon: 'chatbubble-outline',
    color: '#8b5cf6',
  },
  {
    id: '5',
    text: 'The best of people are those who are most beneficial to others.',
    narrator: 'Prophet Muhammad (PBUH)',
    source: 'Sahih Muslim',
    category: 'Good Deeds',
    icon: 'heart-outline',
    color: '#10b981',
  },
  {
    id: '6',
    text: 'The believer is not one who eats his fill while his neighbor goes hungry.',
    narrator: 'Prophet Muhammad (PBUH)',
    source: 'Sahih Bukhari',
    category: 'Compassion',
    icon: 'people-outline',
    color: '#3b82f6',
  },
  {
    id: '7',
    text: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    narrator: 'Prophet Muhammad (PBUH)',
    source: 'Sahih Bukhari',
    category: 'Speech',
    icon: 'chatbubble-outline',
    color: '#8b5cf6',
  },
  {
    id: '8',
    text: 'The best of people are those who are most beneficial to others.',
    narrator: 'Prophet Muhammad (PBUH)',
    source: 'Sahih Muslim',
    category: 'Good Deeds',
    icon: 'heart-outline',
    color: '#10b981',
  },
];

const categories = ['All', 'Good Deeds', 'Compassion', 'Speech', 'Prayer', 'Knowledge', 'Patience', 'Forgiveness'];

export default function HadithScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);

  const filteredHadiths = selectedCategory === 'All' 
    ? hadiths 
    : hadiths.filter(hadith => hadith.category === selectedCategory);

  const handleHadithPress = (hadith: Hadith) => {
    setSelectedHadith(selectedHadith?.id === hadith.id ? null : hadith);
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
              <Ionicons name="library" size={28} color="#10b981" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Hadith Collection</Text>
              <Text style={styles.appSubtitle}>Sayings of Prophet Muhammad (PBUH)</Text>
            </View>
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

        {/* Hadiths List */}
        <View style={styles.hadithsContainer}>
          {filteredHadiths.map((hadith) => (
            <View key={hadith.id} style={styles.hadithItem}>
              <TouchableOpacity
                style={[
                  styles.hadithCard,
                  selectedHadith?.id === hadith.id && styles.selectedHadithCard
                ]}
                onPress={() => handleHadithPress(hadith)}
                activeOpacity={0.8}
              >
                <View style={styles.hadithHeader}>
                  <View style={styles.hadithInfo}>
                    <View style={[styles.hadithIcon, { backgroundColor: hadith.color }]}>
                      <Ionicons name={hadith.icon as any} size={20} color="white" />
                    </View>
                    <View style={styles.hadithDetails}>
                      <Text style={styles.hadithCategory}>{hadith.category}</Text>
                      <Text style={styles.hadithSource}>{hadith.source}</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={selectedHadith?.id === hadith.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </View>
                
                <View style={styles.hadithTextContainer}>
                  <Text style={styles.hadithText} numberOfLines={selectedHadith?.id === hadith.id ? undefined : 2}>
                    "{hadith.text}"
                  </Text>
                </View>
                
                {selectedHadith?.id === hadith.id && (
                  <View style={styles.hadithContent}>
                    <View style={styles.narratorContainer}>
                      <Text style={styles.narratorLabel}>Narrated by:</Text>
                      <Text style={styles.narratorText}>{hadith.narrator}</Text>
                    </View>
                    <View style={styles.sourceContainer}>
                      <Text style={styles.sourceLabel}>Source:</Text>
                      <Text style={styles.sourceText}>{hadith.source}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
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
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  categoryButtonText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: '#10b981',
  },
  hadithsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  hadithItem: {
    marginBottom: Spacing.md,
  },
  hadithCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedHadithCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  hadithHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  hadithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hadithIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  hadithDetails: {
    flex: 1,
  },
  hadithCategory: {
    fontSize: FontSizes.sm,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  hadithSource: {
    fontSize: FontSizes.xs,
    color: '#94a3b8',
  },
  hadithTextContainer: {
    marginBottom: Spacing.sm,
  },
  hadithText: {
    fontSize: FontSizes.md,
    color: 'white',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  hadithContent: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  narratorContainer: {
    marginBottom: Spacing.sm,
  },
  narratorLabel: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginBottom: Spacing.xs,
  },
  narratorText: {
    fontSize: FontSizes.sm,
    color: '#10b981',
    fontWeight: '600',
  },
  sourceContainer: {
    marginBottom: Spacing.sm,
  },
  sourceLabel: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginBottom: Spacing.xs,
  },
  sourceText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});