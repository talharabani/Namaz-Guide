import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
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
import IslamicText, { Dua } from '../../components/ui/IslamicText';
import { BorderRadius, FeatureColors, Shadows, Spacing } from '../../constants/DesignSystem';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface DuaItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  reference?: string;
  isBookmarked: boolean;
  timesRead: number;
  lastRead?: Date;
}

interface DuaCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
  count: number;
}

export default function EnhancedDuasScreen() {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bookmarkedDuas, setBookmarkedDuas] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Initialize animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 20, stiffness: 100 });

    // Load bookmarked duas
    loadBookmarkedDuas();
  }, []);

  const loadBookmarkedDuas = async () => {
    // In a real app, this would load from AsyncStorage
    setBookmarkedDuas(['1', '3', '7']);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const toggleBookmark = useCallback((duaId: string) => {
    setBookmarkedDuas(prev => {
      const isBookmarked = prev.includes(duaId);
      const newBookmarks = isBookmarked 
        ? prev.filter(id => id !== duaId)
        : [...prev, duaId];
      
      // In a real app, save to AsyncStorage
      return newBookmarks;
    });
  }, []);

  // Categories data
  const categories: DuaCategory[] = [
    {
      id: 'all',
      name: 'All Duas',
      icon: 'library-outline' as keyof typeof Ionicons.glyphMap,
      color: FeatureColors.duas,
      gradient: ['#f59e0b', '#d97706'],
      count: 50,
    },
    {
      id: 'morning',
      name: 'Morning',
      icon: 'sunny-outline' as keyof typeof Ionicons.glyphMap,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      count: 12,
    },
    {
      id: 'evening',
      name: 'Evening',
      icon: 'moon-outline' as keyof typeof Ionicons.glyphMap,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      count: 15,
    },
    {
      id: 'prayer',
      name: 'Prayer',
      icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      count: 8,
    },
    {
      id: 'protection',
      name: 'Protection',
      icon: 'shield-outline' as keyof typeof Ionicons.glyphMap,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      count: 10,
    },
    {
      id: 'gratitude',
      name: 'Gratitude',
      icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
      color: '#ec4899',
      gradient: ['#ec4899', '#db2777'],
      count: 5,
    },
  ];

  // Sample duas data
  const duas: DuaItem[] = [
    {
      id: '1',
      title: 'Morning Dua',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
      transliteration: 'Asbahna wa asbahal mulku lillah',
      translation: 'We have reached the morning and the kingdom belongs to Allah',
      category: 'morning',
      reference: 'Bukhari',
      isBookmarked: bookmarkedDuas.includes('1'),
      timesRead: 15,
      lastRead: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Evening Dua',
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
      transliteration: 'Amsayna wa amsal mulku lillah',
      translation: 'We have reached the evening and the kingdom belongs to Allah',
      category: 'evening',
      reference: 'Bukhari',
      isBookmarked: bookmarkedDuas.includes('2'),
      timesRead: 8,
      lastRead: new Date('2024-01-14'),
    },
    {
      id: '3',
      title: 'Before Eating',
      arabic: 'بِسْمِ اللَّهِ',
      transliteration: 'Bismillah',
      translation: 'In the name of Allah',
      category: 'prayer',
      reference: 'Muslim',
      isBookmarked: bookmarkedDuas.includes('3'),
      timesRead: 25,
      lastRead: new Date('2024-01-16'),
    },
    {
      id: '4',
      title: 'After Eating',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
      transliteration: 'Alhamdulillahil ladhi at\'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwatin',
      translation: 'Praise be to Allah who fed me this and provided it for me without any effort or power on my part',
      category: 'prayer',
      reference: 'Abu Dawud',
      isBookmarked: bookmarkedDuas.includes('4'),
      timesRead: 12,
      lastRead: new Date('2024-01-15'),
    },
    {
      id: '5',
      title: 'Protection from Evil',
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: 'A\'udhu billahi minash shaytanir rajeem',
      translation: 'I seek refuge in Allah from Satan, the accursed',
      category: 'protection',
      reference: 'Quran 16:98',
      isBookmarked: bookmarkedDuas.includes('5'),
      timesRead: 30,
      lastRead: new Date('2024-01-16'),
    },
    {
      id: '6',
      title: 'Gratitude Dua',
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Alhamdulillahi rabbil alameen',
      translation: 'Praise be to Allah, Lord of the worlds',
      category: 'gratitude',
      reference: 'Quran 1:2',
      isBookmarked: bookmarkedDuas.includes('6'),
      timesRead: 45,
      lastRead: new Date('2024-01-16'),
    },
    {
      id: '7',
      title: 'Seeking Forgiveness',
      arabic: 'أَسْتَغْفِرُ اللَّهَ',
      transliteration: 'Astaghfirullah',
      translation: 'I seek forgiveness from Allah',
      category: 'prayer',
      reference: 'General',
      isBookmarked: bookmarkedDuas.includes('7'),
      timesRead: 20,
      lastRead: new Date('2024-01-15'),
    },
  ];

  // Filter duas based on search and category
  const filteredDuas = duas.filter(dua => {
    const matchesSearch = searchQuery === '' || 
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.arabic.includes(searchQuery) ||
      dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || dua.category === selectedCategory;
    const matchesBookmarkFilter = !showBookmarksOnly || bookmarkedDuas.includes(dua.id);
    
    return matchesSearch && matchesCategory && matchesBookmarkFilter;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const renderCategory = (category: DuaCategory) => (
    <Animated.View
      key={category.id}
      entering={FadeInDown.delay(200)}
      style={styles.categoryItem}
    >
      <TouchableOpacity
        onPress={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
        style={[
          styles.categoryButton,
          {
            backgroundColor: selectedCategory === category.id || 
              (category.id === 'all' && !selectedCategory) ? category.color : colors.surface,
          },
        ]}
      >
        <Ionicons
          name={category.icon}
          size={24}
          color={selectedCategory === category.id || 
            (category.id === 'all' && !selectedCategory) ? 'white' : category.color}
        />
        <IslamicText
          variant="caption"
          style={[
            styles.categoryText,
            {
              color: selectedCategory === category.id || 
                (category.id === 'all' && !selectedCategory) ? 'white' : colors.text,
            },
          ]}
        >
          {category.name}
        </IslamicText>
        <View style={styles.categoryCount}>
          <IslamicText
            variant="caption"
            style={[
              styles.categoryCountText,
              {
                color: selectedCategory === category.id || 
                  (category.id === 'all' && !selectedCategory) ? 'white' : colors.textSecondary,
              },
            ]}
          >
            {category.count}
          </IslamicText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDua = (dua: DuaItem, index: number) => (
    <Animated.View
      key={dua.id}
      entering={FadeInUp.delay(300 + index * 100)}
      style={styles.duaItem}
    >
      <Card style={styles.duaCard}>
        <CardContent>
          <View style={styles.duaHeader}>
            <View style={styles.duaTitleContainer}>
              <IslamicText variant="subtitle" style={styles.duaTitle}>
                {dua.title}
              </IslamicText>
              {dua.reference && (
                <IslamicText variant="caption" style={styles.duaReference}>
                  {dua.reference}
                </IslamicText>
              )}
            </View>
            <TouchableOpacity
              onPress={() => toggleBookmark(dua.id)}
              style={styles.bookmarkButton}
            >
              <Ionicons
                name={dua.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={dua.isBookmarked ? '#f59e0b' : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.duaContent}>
            <Dua style={styles.duaArabic}>
              {dua.arabic}
            </Dua>
            
            <IslamicText variant="translation" style={styles.duaTransliteration}>
              {dua.transliteration}
            </IslamicText>
            
            <IslamicText variant="body" style={styles.duaTranslation}>
              {dua.translation}
            </IslamicText>
          </View>

          <View style={styles.duaFooter}>
            <View style={styles.duaStats}>
              <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={16} color={colors.textSecondary} />
                <IslamicText variant="caption" style={styles.statText}>
                  {dua.timesRead} reads
                </IslamicText>
              </View>
              {dua.lastRead && (
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <IslamicText variant="caption" style={styles.statText}>
                    {dua.lastRead.toLocaleDateString()}
                  </IslamicText>
                </View>
              )}
            </View>
            
            <TouchableOpacity style={styles.readButton}>
              <IslamicText variant="caption" style={styles.readButtonText}>
                Mark as Read
              </IslamicText>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader
        title="Duas & Supplications"
        subtitle="Islamic prayers and supplications"
        variant="gradient"
        showSearch
        onSearch={setSearchQuery}
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
          {/* Search and Filter Bar */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.searchContainer}>
            <Card style={styles.searchCard}>
              <CardContent>
                <View style={styles.searchBar}>
                  <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search duas..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    onPress={() => setShowBookmarksOnly(!showBookmarksOnly)}
                    style={[
                      styles.filterButton,
                      {
                        backgroundColor: showBookmarksOnly ? colors.primary : colors.surface,
                      },
                    ]}
                  >
                    <Ionicons
                      name="bookmark"
                      size={16}
                      color={showBookmarksOnly ? 'white' : colors.textSecondary}
                    />
                    <IslamicText
                      variant="caption"
                      style={[
                        styles.filterButtonText,
                        {
                          color: showBookmarksOnly ? 'white' : colors.text,
                        },
                      ]}
                    >
                      Bookmarks
                    </IslamicText>
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          {/* Categories */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.categoriesContainer}>
            <IslamicText variant="subtitle" style={styles.sectionTitle}>
              Categories
            </IslamicText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {categories.map(renderCategory)}
            </ScrollView>
          </Animated.View>

          {/* Duas List */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.duasContainer}>
            <View style={styles.duasHeader}>
              <IslamicText variant="subtitle" style={styles.sectionTitle}>
                {selectedCategory ? 
                  categories.find(c => c.id === selectedCategory)?.name + ' Duas' : 
                  'All Duas'
                }
              </IslamicText>
              <IslamicText variant="caption" style={styles.duasCount}>
                {filteredDuas.length} duas
              </IslamicText>
            </View>

            {filteredDuas.length === 0 ? (
              <Card style={styles.emptyCard}>
                <CardContent>
                  <View style={styles.emptyContent}>
                    <Ionicons name="book-outline" size={48} color={colors.textSecondary} />
                    <IslamicText variant="subtitle" style={styles.emptyTitle}>
                      No duas found
                    </IslamicText>
                    <IslamicText variant="body" style={styles.emptyDescription}>
                      Try adjusting your search or filter criteria
                    </IslamicText>
                  </View>
                </CardContent>
              </Card>
            ) : (
              filteredDuas.map(renderDua)
            )}
          </Animated.View>

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
  searchContainer: {
    marginBottom: Spacing[6],
  },
  searchCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[3],
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing[2],
    fontSize: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.lg,
    gap: Spacing[1],
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing[4],
  },
  categoriesScroll: {
    marginHorizontal: -Spacing[4],
    paddingHorizontal: Spacing[4],
  },
  categoryItem: {
    marginRight: Spacing[3],
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    minWidth: 80,
    ...Shadows.sm,
  },
  categoryText: {
    marginTop: Spacing[1],
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryCount: {
    marginTop: Spacing[1],
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.sm,
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: '600',
  },
  duasContainer: {
    marginBottom: Spacing[6],
  },
  duasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  duasCount: {
    opacity: 0.7,
  },
  duaItem: {
    marginBottom: Spacing[4],
  },
  duaCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[4],
  },
  duaTitleContainer: {
    flex: 1,
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  duaReference: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  bookmarkButton: {
    padding: Spacing[2],
  },
  duaContent: {
    marginBottom: Spacing[4],
  },
  duaArabic: {
    fontSize: 20,
    textAlign: 'right',
    lineHeight: 32,
    marginBottom: Spacing[3],
  },
  duaTransliteration: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: Spacing[2],
    opacity: 0.8,
  },
  duaTranslation: {
    fontSize: 16,
    lineHeight: 24,
  },
  duaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duaStats: {
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
    opacity: 0.7,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.lg,
    gap: Spacing[1],
  },
  readButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  emptyCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: Spacing[8],
  },
  emptyTitle: {
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  bottomSpacing: {
    height: Spacing[20],
  },
});
