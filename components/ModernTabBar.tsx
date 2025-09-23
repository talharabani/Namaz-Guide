import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Theme';

// Get initial dimensions
const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

// All tabs configuration with modern design
const allTabs = [
  { 
    name: 'Home', 
    icon: 'home-outline' as any, 
    activeIcon: 'home' as any,
    route: 'index', 
    color: '#10b981',
    gradient: ['#10b981', '#059669'],
    accessibilityLabel: 'Home',
    accessibilityHint: 'Go to home screen'
  },
  { 
    name: 'Prayer', 
    icon: 'time-outline' as any, 
    activeIcon: 'time' as any,
    route: 'prayer-times', 
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#7c3aed'],
    accessibilityLabel: 'Prayer Times',
    accessibilityHint: 'View prayer times and schedule'
  },
  { 
    name: 'Qibla', 
    icon: 'compass-outline' as any, 
    activeIcon: 'compass' as any,
    route: 'qibla', 
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2'],
    accessibilityLabel: 'Qibla',
    accessibilityHint: 'Find the direction of the Kaaba'
  },
  { 
    name: 'Duas', 
    icon: 'book-outline' as any, 
    activeIcon: 'book' as any,
    route: 'duas', 
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
    accessibilityLabel: 'Duas',
    accessibilityHint: 'Browse Islamic supplications'
  },
  { 
    name: 'Learn', 
    icon: 'school-outline' as any, 
    activeIcon: 'school' as any,
    route: 'learn', 
    color: '#22c55e',
    gradient: ['#22c55e', '#16a34a'],
    accessibilityLabel: 'Learn',
    accessibilityHint: 'Learn Namaz step by step'
  },
  { 
    name: 'Quiz', 
    icon: 'help-circle-outline' as any, 
    activeIcon: 'help-circle' as any,
    route: 'quiz', 
    color: '#ec4899',
    gradient: ['#ec4899', '#db2777'],
    accessibilityLabel: 'Quiz',
    accessibilityHint: 'Take Islamic knowledge quizzes'
  },
  { 
    name: 'Progress', 
    icon: 'stats-chart-outline' as any, 
    activeIcon: 'stats-chart' as any,
    route: 'progress', 
    color: '#3b82f6',
    gradient: ['#3b82f6', '#2563eb'],
    accessibilityLabel: 'Progress',
    accessibilityHint: 'View your learning progress'
  },
  { 
    name: 'AI Help', 
    icon: 'chatbox-outline' as any, 
    activeIcon: 'chatbox' as any,
    route: 'ai-assistant', 
    color: '#a855f7',
    gradient: ['#a855f7', '#9333ea'],
    accessibilityLabel: 'AI Assistant',
    accessibilityHint: 'Get AI-powered Islamic guidance'
  },
  { 
    name: 'Mistakes', 
    icon: 'alert-circle-outline' as any, 
    activeIcon: 'alert-circle' as any,
    route: 'mistakes', 
    color: '#f97316',
    gradient: ['#f97316', '#ea580c'],
    accessibilityLabel: 'Mistakes',
    accessibilityHint: 'Track and learn from mistakes'
  },
  { 
    name: 'Settings', 
    icon: 'settings-outline' as any, 
    activeIcon: 'settings' as any,
    route: 'settings', 
    color: '#6b7280',
    gradient: ['#6b7280', '#4b5563'],
    accessibilityLabel: 'Settings',
    accessibilityHint: 'App settings and preferences'
  },
];

export default function ModernTabBar({ state }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Animation values
  const slideAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = dimensions;
  
  // Calculate visible tabs based on screen width
  const visibleTabs = useMemo(() => {
    const isTablet = screenWidth >= 768;
    const isLandscape = screenWidth > screenHeight;
    
    if (isTablet) {
      return allTabs; // Show all tabs on tablets
    } else if (isLandscape) {
      return allTabs.slice(0, 6); // Show 6 tabs in landscape
    } else {
      return allTabs.slice(0, 5); // Show 5 tabs in portrait
    }
  }, [screenWidth, screenHeight]);

  const hiddenTabs = useMemo(() => {
    return allTabs.filter(tab => !visibleTabs.some(visibleTab => visibleTab.route === tab.route));
  }, [visibleTabs]);

  // Responsive styles
  const responsiveStyles = useMemo(() => {
    const isTablet = screenWidth >= 768;
    const isLandscape = screenWidth > screenHeight;
    const isSmallScreen = screenWidth < 375;
    
    return {
      tabBarWidth: Math.min(screenWidth - Spacing.lg * 2, isTablet ? 800 : screenWidth - Spacing.lg * 2),
      iconSize: isSmallScreen ? 20 : isTablet ? 26 : 22,
      fontSize: isSmallScreen ? FontSizes.xs - 1 : isTablet ? FontSizes.sm : FontSizes.xs,
      tabHeight: isLandscape ? 70 : isTablet ? 85 : 75,
      paddingHorizontal: isSmallScreen ? Spacing.sm : Spacing.lg,
      paddingVertical: isLandscape ? Spacing.sm : Spacing.md,
      tabSpacing: isTablet ? Spacing.md : Spacing.sm,
    };
  }, [screenWidth, screenHeight]);

  const handleTabPress = useCallback(async (tab: any) => {
    try {
      // Haptic feedback
      if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      // Animate press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Navigate to tab
      router.push(`/(tabs)/${tab.route}` as any);
      setShowMoreMenu(false);
    } catch (error) {
      console.warn('Navigation error:', error);
    }
  }, [scaleAnim]);

  const getCurrentRouteName = useCallback(() => {
    return state.routes[state.index]?.name || 'index';
  }, [state.routes, state.index]);

  const currentRoute = getCurrentRouteName();

  // Render individual tab
  const renderTab = useCallback((tab: any, index: number) => {
    const isActive = currentRoute === tab.route;
    
    return (
      <Animated.View
        key={tab.route}
        style={[
          { transform: [{ scale: isActive ? scaleAnim : 1 }] }
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.tabButton,
            { 
              marginHorizontal: responsiveStyles.tabSpacing / 2,
              opacity: pressed ? 0.8 : 1,
            }
          ]}
          onPress={() => handleTabPress(tab)}
          accessibilityRole="button"
          accessibilityLabel={tab.accessibilityLabel}
          accessibilityHint={tab.accessibilityHint}
          accessibilityState={{ selected: isActive }}
        >
          <View style={[
            styles.tabContent,
            isActive && styles.tabContentActive,
            { minHeight: responsiveStyles.tabHeight }
          ]}>
            {isActive ? (
              <LinearGradient
                colors={tab.gradient}
                style={[
                  styles.iconContainer,
                  { 
                    width: responsiveStyles.iconSize + 20, 
                    height: responsiveStyles.iconSize + 20 
                  }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons 
                  name={tab.activeIcon} 
                  size={responsiveStyles.iconSize} 
                  color="white"
                />
              </LinearGradient>
            ) : (
              <View style={[
                styles.iconContainerInactive,
                { 
                  width: responsiveStyles.iconSize + 20, 
                  height: responsiveStyles.iconSize + 20 
                }
              ]}>
                <Ionicons 
                  name={tab.icon} 
                  size={responsiveStyles.iconSize} 
                  color="#94a3b8"
                />
              </View>
            )}
            
            <Text style={[
              styles.tabLabel,
              isActive && styles.tabLabelActive,
              { fontSize: responsiveStyles.fontSize }
            ]}>
              {tab.name}
            </Text>
            
            {isActive && (
              <View style={[styles.activeIndicator, { backgroundColor: tab.color }]} />
            )}
          </View>
        </Pressable>
      </Animated.View>
    );
  }, [currentRoute, handleTabPress, responsiveStyles, scaleAnim]);

  // Render More button
  const renderMoreButton = useCallback(() => {
    const isActive = showMoreMenu || hiddenTabs.some(tab => tab.route === currentRoute);
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.tabButton,
          { 
            marginHorizontal: responsiveStyles.tabSpacing / 2,
            opacity: pressed ? 0.8 : 1,
          }
        ]}
        onPress={() => setShowMoreMenu(!showMoreMenu)}
        accessibilityRole="button"
        accessibilityLabel="More options"
        accessibilityHint="Show additional navigation options"
        accessibilityState={{ selected: isActive }}
      >
        <View style={[
          styles.tabContent,
          isActive && styles.tabContentActive,
          { minHeight: responsiveStyles.tabHeight }
        ]}>
          {isActive ? (
            <LinearGradient
              colors={['#6b7280', '#4b5563']}
              style={[
                styles.iconContainer,
                { 
                  width: responsiveStyles.iconSize + 20, 
                  height: responsiveStyles.iconSize + 20 
                }
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons 
                name="ellipsis-horizontal" 
                size={responsiveStyles.iconSize} 
                color="white"
              />
            </LinearGradient>
          ) : (
            <View style={[
              styles.iconContainerInactive,
              { 
                width: responsiveStyles.iconSize + 20, 
                height: responsiveStyles.iconSize + 20 
              }
            ]}>
              <Ionicons 
                name="ellipsis-horizontal-outline" 
                size={responsiveStyles.iconSize} 
                color="#94a3b8"
              />
            </View>
          )}
          
          <Text style={[
            styles.tabLabel,
            isActive && styles.tabLabelActive,
            { fontSize: responsiveStyles.fontSize }
          ]}>
            More
          </Text>
          
          {isActive && (
            <View style={[styles.activeIndicator, { backgroundColor: '#6b7280' }]} />
          )}
        </View>
      </Pressable>
    );
  }, [showMoreMenu, hiddenTabs, currentRoute, responsiveStyles]);

  return (
    <View style={styles.container}>
      {/* Main Tab Bar */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.98)', 'rgba(15, 23, 42, 0.95)']}
        style={[
          styles.tabBar,
          { 
            width: responsiveStyles.tabBarWidth,
            paddingHorizontal: responsiveStyles.paddingHorizontal,
            paddingVertical: responsiveStyles.paddingVertical,
          }
        ]}
      >
        <View style={styles.tabBarInner}>
          {visibleTabs.map(renderTab)}
          {hiddenTabs.length > 0 && renderMoreButton()}
        </View>
      </LinearGradient>

      {/* More Menu Overlay */}
      {showMoreMenu && hiddenTabs.length > 0 && (
        <View style={styles.moreMenuOverlay}>
          <Pressable 
            style={styles.moreMenuBackdrop}
            onPress={() => setShowMoreMenu(false)}
          />
          <Animated.View 
            style={[
              styles.moreMenu, 
              { 
                width: responsiveStyles.tabBarWidth,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  })
                }]
              }
            ]}
          >
            <View style={styles.moreMenuHeader}>
              <Text style={styles.moreMenuTitle}>More Options</Text>
              <Pressable 
                onPress={() => setShowMoreMenu(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>
            
            <View style={styles.moreMenuGrid}>
              {hiddenTabs.map((tab) => (
                <Pressable
                  key={tab.route}
                  style={({ pressed }) => [
                    styles.moreMenuItem,
                    pressed && styles.moreMenuItemPressed
                  ]}
                  onPress={() => handleTabPress(tab)}
                  accessibilityRole="button"
                  accessibilityLabel={tab.accessibilityLabel}
                  accessibilityHint={tab.accessibilityHint}
                >
                  <LinearGradient
                    colors={tab.gradient as [string, string]}
                    style={styles.moreMenuIcon}
                  >
                    <Ionicons name={tab.icon} size={24} color="white" />
                  </LinearGradient>
                  <Text style={styles.moreMenuText}>{tab.name}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    zIndex: 1000,
  },
  tabBar: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.lg,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    minHeight: 44,
  },
  tabContent: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  tabContentActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.md,
  },
  iconContainerInactive: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  tabLabel: {
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  moreMenuOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 2000,
  },
  moreMenuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  moreMenu: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 32,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  moreMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  moreMenuTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  moreMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moreMenuItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  moreMenuItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{ scale: 0.95 }],
  },
  moreMenuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  moreMenuText: {
    fontSize: FontSizes.sm,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});
