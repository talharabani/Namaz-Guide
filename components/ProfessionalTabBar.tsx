import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { BorderRadius, FontSizes, Spacing } from '../constants/Theme';

const { width } = Dimensions.get('window');

interface Tab {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  category: 'main' | 'secondary';
  color: string;
  gradient: string[];
}

const tabs: Tab[] = [
  // Main tabs - always visible
  { name: 'Home', icon: 'home', route: 'index', category: 'main', color: '#10b981', gradient: ['#10b981', '#059669'] },
  { name: 'Prayer', icon: 'time', route: 'prayer-times', category: 'main', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },
  { name: 'Qibla', icon: 'compass', route: 'qibla', category: 'main', color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'] },
  { name: 'Settings', icon: 'settings', route: 'settings', category: 'main', color: '#6b7280', gradient: ['#6b7280', '#4b5563'] },
  
  // Secondary tabs - in expandable section
  { name: 'Duas', icon: 'book', route: 'duas', category: 'secondary', color: '#ec4899', gradient: ['#ec4899', '#db2777'] },
  { name: 'Progress', icon: 'trending-up', route: 'progress', category: 'secondary', color: '#06b6d4', gradient: ['#06b6d4', '#0891b2'] },
  { name: 'Quiz', icon: 'school', route: 'quiz', category: 'secondary', color: '#f97316', gradient: ['#f97316', '#ea580c'] },
  { name: 'AI Help', icon: 'chatbubble-ellipses', route: 'ai-assistant', category: 'secondary', color: '#84cc16', gradient: ['#84cc16', '#65a30d'] },
  { name: 'Mistakes', icon: 'warning', route: 'mistakes', category: 'secondary', color: '#ef4444', gradient: ['#ef4444', '#dc2626'] },
  { name: 'Learn', icon: 'library', route: 'learn', category: 'secondary', color: '#a855f7', gradient: ['#a855f7', '#9333ea'] },
];

interface ProfessionalTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function ProfessionalTabBar({ state, descriptors, navigation }: ProfessionalTabBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('index');
  
  // Animation values
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const secondaryTabsOpacity = useRef(new Animated.Value(0)).current;
  const secondaryTabsScale = useRef(new Animated.Value(0.8)).current;
  const moreButtonRotation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;

  // Glow animation effect
  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, []);

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.spring(expandAnimation, {
        toValue,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(secondaryTabsOpacity, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(secondaryTabsScale, {
        toValue: toValue === 1 ? 1 : 0.8,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(moreButtonRotation, {
        toValue: toValue === 1 ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsExpanded(!isExpanded);
  };

  const handleTabPress = (tab: Tab) => {
    setSelectedTab(tab.route);
    
    // Haptic feedback simulation
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[state.index].key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(tab.route);
    }
  };

  const mainTabs = tabs.filter(tab => tab.category === 'main');
  const secondaryTabs = tabs.filter(tab => tab.category === 'secondary');

  const secondaryTabsHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  return (
    <View style={styles.container}>
      {/* Background with glassmorphism */}
      <BlurView intensity={80} style={styles.blurBackground} />
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.9)', 'rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.7)']}
        style={styles.gradientOverlay}
      />
      
      {/* Glow effect */}
      <Animated.View style={[
        styles.glowEffect,
        {
          opacity: glowAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.7],
          }),
        },
      ]}>
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(16, 185, 129, 0.3)']}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Secondary tabs container */}
      <Animated.View style={[
        styles.secondaryTabsContainer,
        {
          height: secondaryTabsHeight,
          opacity: secondaryTabsOpacity,
        },
      ]}>
        <Animated.View style={[
          styles.secondaryTabsContent,
          {
            transform: [{ scale: secondaryTabsScale }],
          },
        ]}>
          {secondaryTabs.map((tab, index) => (
            <Pressable
              key={tab.route}
              style={({ pressed }) => [
                styles.secondaryTab,
                {
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              onPress={() => handleTabPress(tab)}
            >
              <LinearGradient
                colors={tab.gradient as any}
                style={styles.secondaryTabGradient}
              >
                <Ionicons name={tab.icon} size={20} color="white" />
                <Text style={styles.secondaryTabText}>{tab.name}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </Animated.View>
      </Animated.View>

      {/* Main tabs */}
      <View style={styles.mainTabsContainer}>
        {mainTabs.map((tab, index) => (
          <Pressable
            key={tab.route}
            style={({ pressed }) => [
              styles.mainTab,
              {
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
            onPress={() => handleTabPress(tab)}
          >
            <LinearGradient
              colors={selectedTab === tab.route ? tab.gradient as any : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.mainTabGradient}
            >
              <Ionicons 
                name={tab.icon} 
                size={24} 
                color={selectedTab === tab.route ? 'white' : '#94a3b8'} 
              />
              <Text style={[
                styles.mainTabText,
                { color: selectedTab === tab.route ? 'white' : '#94a3b8' }
              ]}>
                {tab.name}
              </Text>
            </LinearGradient>
          </Pressable>
        ))}
        
        {/* More button */}
        <Pressable
          style={({ pressed }) => [
            styles.moreButton,
            {
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
          onPress={toggleExpanded}
        >
          <Animated.View style={{
            transform: [{
              rotate: moreButtonRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            }],
          }}>
            <LinearGradient
              colors={isExpanded ? ['#ef4444', '#dc2626'] : ['#6b7280', '#4b5563']}
              style={styles.moreButtonGradient}
            >
              <Ionicons 
                name={isExpanded ? 'close' : 'ellipsis-horizontal'} 
                size={24} 
                color="white" 
              />
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 35,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 35,
  },
  secondaryTabsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  secondaryTabsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  secondaryTab: {
    marginHorizontal: 4,
    marginVertical: 2,
  },
  secondaryTabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryTabText: {
    fontSize: FontSizes.xs,
    color: 'white',
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  mainTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: 20,
  },
  mainTab: {
    flex: 1,
    marginHorizontal: 2,
  },
  mainTabGradient: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  mainTabText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  moreButton: {
    position: 'absolute',
    right: Spacing.md,
    top: -15,
  },
  moreButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
