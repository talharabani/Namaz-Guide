import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced home screen cards configuration
const homeScreenCards = [
  { 
    name: 'Qibla', 
    icon: 'compass' as any, 
    route: 'qibla', 
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2'],
    description: 'Find the direction of Kaaba',
    accessibilityLabel: 'Qibla Direction',
    accessibilityHint: 'Find the direction of the Kaaba'
  },
  { 
    name: 'Duas', 
    icon: 'book' as any, 
    route: 'duas', 
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
    description: 'Islamic prayers and supplications',
    accessibilityLabel: 'Duas and Supplications',
    accessibilityHint: 'Browse Islamic supplications'
  },
  { 
    name: 'Learn', 
    icon: 'school' as any, 
    route: 'learn', 
    color: '#22c55e',
    gradient: ['#22c55e', '#16a34a'],
    description: 'Learn how to perform prayers',
    accessibilityLabel: 'Learn Namaz',
    accessibilityHint: 'Learn Namaz step by step'
  },
  { 
    name: 'Quiz', 
    icon: 'help-circle' as any, 
    route: 'quiz', 
    color: '#ec4899',
    gradient: ['#ec4899', '#db2777'],
    description: 'Test your Islamic knowledge',
    accessibilityLabel: 'Islamic Quiz',
    accessibilityHint: 'Take Islamic knowledge quizzes'
  },
  { 
    name: 'Progress', 
    icon: 'stats-chart' as any, 
    route: 'progress', 
    color: '#3b82f6',
    gradient: ['#3b82f6', '#2563eb'],
    description: 'Track your learning progress',
    accessibilityLabel: 'Progress Tracking',
    accessibilityHint: 'View your learning progress'
  },
  { 
    name: 'Mistakes', 
    icon: 'alert-circle' as any, 
    route: 'mistakes', 
    color: '#f97316',
    gradient: ['#f97316', '#ea580c'],
    description: 'Learn about common prayer mistakes',
    accessibilityLabel: 'Common Mistakes',
    accessibilityHint: 'Track and learn from mistakes'
  },
];

interface HomeScreenCardsProps {
  onCardPress?: (route: string) => void;
}

export default function HomeScreenCards({ onCardPress }: HomeScreenCardsProps) {
  const handleCardPress = useCallback((card: any) => {
    if (onCardPress) {
      onCardPress(card.route);
    } else {
      router.push(`/(tabs)/${card.route}` as any);
    }
  }, [onCardPress]);

  const renderCard = useCallback((card: any, index: number) => {
    const scale = useSharedValue(1);
    
    const handlePressIn = () => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    };
    
    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          animatedStyle
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed
          ]}
          onPress={() => handleCardPress(card)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={card.accessibilityLabel}
          accessibilityHint={card.accessibilityHint}
        >
          <LinearGradient
            colors={card.gradient}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name={card.icon} size={28} color="white" />
              </View>
              <Text style={styles.cardTitle}>{card.name}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
              
              {/* Action indicator */}
              <View style={styles.actionIndicator}>
                <Ionicons name="arrow-forward" size={16} color="rgba(255, 255, 255, 0.7)" />
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }, [handleCardPress]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {homeScreenCards.map((card, index) => (
          <View key={card.route}>
            {renderCard(card, index)}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardContainer: {
    width: (screenWidth - 48) / 2, // 2 cards per row with proper spacing
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardGradient: {
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    position: 'relative',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 14,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  actionIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
