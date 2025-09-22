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

interface Dua {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  transliteration: string;
  category: string;
  icon: string;
  color: string;
}

const duas: Dua[] = [
  {
    id: '1',
    title: 'Dua for Starting the Day',
    arabic: 'اللَّهُمَّ أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    translation: 'O Allah, we have entered the morning and the kingdom belongs to Allah, and all praise is due to Allah. There is no god but Allah alone, He has no partner.',
    transliteration: 'Allahumma asbahna wa asbahal mulku lillah, wal hamdu lillah, la ilaha illa Allah wahdahu la sharika lah',
    category: 'Morning',
    icon: 'sunny-outline',
    color: '#f59e0b',
  },
  {
    id: '2',
    title: 'Dua for Evening',
    arabic: 'اللَّهُمَّ أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    translation: 'O Allah, we have entered the evening and the kingdom belongs to Allah, and all praise is due to Allah. There is no god but Allah alone, He has no partner.',
    transliteration: 'Allahumma amsayna wa amsal mulku lillah, wal hamdu lillah, la ilaha illa Allah wahdahu la sharika lah',
    category: 'Evening',
    icon: 'moon-outline',
    color: '#6366f1',
  },
  {
    id: '3',
    title: 'Dua Before Eating',
    arabic: 'بِسْمِ اللَّهِ',
    translation: 'In the name of Allah',
    transliteration: 'Bismillah',
    category: 'Food',
    icon: 'restaurant-outline',
    color: '#10b981',
  },
  {
    id: '4',
    title: 'Dua After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    translation: 'Praise be to Allah who fed us and gave us drink and made us Muslims.',
    transliteration: 'Alhamdulillahil ladhi at\'amana wa saqana wa ja\'alana muslimin',
    category: 'Food',
    icon: 'restaurant-outline',
    color: '#10b981',
  },
  {
    id: '5',
    title: 'Dua for Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    translation: 'Glory to Him who has subjected this to us, and we could not have done it by ourselves. And to our Lord we are returning.',
    transliteration: 'Subhanal ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun',
    category: 'Travel',
    icon: 'airplane-outline',
    color: '#3b82f6',
  },
  {
    id: '6',
    title: 'Dua for Forgiveness',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    translation: 'My Lord, forgive me and accept my repentance, for You are the Accepter of Repentance, the Most Merciful.',
    transliteration: 'Rabbi ighfir li wa tub alayya innaka antat tawwabur raheem',
    category: 'Forgiveness',
    icon: 'heart-outline',
    color: '#ef4444',
  },
  {
    id: '7',
    title: 'Dua for Guidance',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    transliteration: 'Rabana atina fid dunya hasanatan wa fil akhirati hasanatan wa qina adhaban nar',
    category: 'Guidance',
    icon: 'compass-outline',
    color: '#8b5cf6',
  },
  {
    id: '8',
    title: 'Dua for Patience',
    arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    translation: 'Our Lord, pour upon us patience and make firm our feet and give us victory over the disbelieving people.',
    transliteration: 'Rabana afrigh alayna sabran wa thabbit aqdamana wansurna alal qawmil kafirin',
    category: 'Patience',
    icon: 'shield-outline',
    color: '#06b6d4',
  },
];

const categories = ['All', 'Morning', 'Evening', 'Food', 'Travel', 'Forgiveness', 'Guidance', 'Patience'];

export default function DuasScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);

  const filteredDuas = selectedCategory === 'All' 
    ? duas 
    : duas.filter(dua => dua.category === selectedCategory);

  const handleDuaPress = (dua: Dua) => {
    setSelectedDua(selectedDua?.id === dua.id ? null : dua);
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
              <Ionicons name="heart" size={28} color="#10b981" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appName}>Islamic Duas</Text>
              <Text style={styles.appSubtitle}>Supplications and prayers</Text>
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

        {/* Duas List */}
        <View style={styles.duasContainer}>
          {filteredDuas.map((dua) => (
            <View key={dua.id} style={styles.duaItem}>
              <TouchableOpacity
                style={[
                  styles.duaCard,
                  selectedDua?.id === dua.id && styles.selectedDuaCard
                ]}
                onPress={() => handleDuaPress(dua)}
                activeOpacity={0.8}
              >
                <View style={styles.duaHeader}>
                  <View style={styles.duaInfo}>
                    <View style={[styles.duaIcon, { backgroundColor: dua.color }]}>
                      <Ionicons name={dua.icon as any} size={20} color="white" />
                    </View>
                    <View style={styles.duaDetails}>
                      <Text style={styles.duaTitle}>{dua.title}</Text>
                      <Text style={styles.duaCategory}>{dua.category}</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={selectedDua?.id === dua.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </View>
                
                {selectedDua?.id === dua.id && (
                  <View style={styles.duaContent}>
                    <View style={styles.arabicContainer}>
                      <Text style={styles.arabicText}>{dua.arabic}</Text>
                    </View>
                    <View style={styles.translationContainer}>
                      <Text style={styles.translationText}>{dua.translation}</Text>
                    </View>
                    <View style={styles.transliterationContainer}>
                      <Text style={styles.transliterationText}>{dua.transliteration}</Text>
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
  duasContainer: {
    paddingHorizontal: Spacing.lg,
  },
  duaItem: {
    marginBottom: Spacing.md,
  },
  duaCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedDuaCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  duaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  duaDetails: {
    flex: 1,
  },
  duaTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  duaCategory: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
  },
  duaContent: {
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
    lineHeight: 22,
  },
  transliterationContainer: {
    marginBottom: Spacing.sm,
  },
  transliterationText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});