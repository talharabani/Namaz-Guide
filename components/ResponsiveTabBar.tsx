import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
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

// Main tabs (always visible)
const mainTabs = [
  { 
    name: 'Home', 
    icon: 'home-outline' as any, 
    activeIcon: 'home' as any,
    route: 'index', 
    color: '#10b981',
    gradient: ['#10b981', '#059669'],
    accessibilityLabel: 'Home tab',
    accessibilityHint: 'Navigate to home screen'
  },
  { 
    name: 'Namaz', 
    icon: 'time-outline' as any, 
    activeIcon: 'time' as any,
    route: 'prayer-times', 
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#7c3aed'],
    accessibilityLabel: 'Prayer Times tab',
    accessibilityHint: 'View prayer times and schedule'
  },
  { 
    name: 'Duas', 
    icon: 'book-outline' as any, 
    activeIcon: 'book' as any,
    route: 'duas', 
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
    accessibilityLabel: 'Duas tab',
    accessibilityHint: 'Browse Islamic supplications and prayers'
  },
  { 
    name: 'Quiz', 
    icon: 'help-circle-outline' as any, 
    activeIcon: 'help-circle' as any,
    route: 'quiz', 
    color: '#ec4899',
    gradient: ['#ec4899', '#db2777'],
    accessibilityLabel: 'Quiz tab',
    accessibilityHint: 'Take Islamic knowledge quizzes'
  },
  { 
    name: 'Progress', 
    icon: 'stats-chart-outline' as any, 
    activeIcon: 'stats-chart' as any,
    route: 'progress', 
    color: '#3b82f6',
    gradient: ['#3b82f6', '#2563eb'],
    accessibilityLabel: 'Progress tab',
    accessibilityHint: 'View your learning progress and statistics'
  },
];

// Secondary tabs (accessible via More menu)
const secondaryTabs = [
  { 
    name: 'Qibla', 
    icon: 'compass-outline' as any, 
    activeIcon: 'compass' as any,
    route: 'qibla', 
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2'],
    accessibilityLabel: 'Qibla tab',
    accessibilityHint: 'Find the direction of the Kaaba'
  },
  { 
    name: 'AI Help', 
    icon: 'chatbox-outline' as any, 
    activeIcon: 'chatbox' as any,
    route: 'ai-assistant', 
    color: '#a855f7',
    gradient: ['#a855f7', '#9333ea'],
    accessibilityLabel: 'AI Assistant tab',
    accessibilityHint: 'Get AI-powered Islamic guidance'
  },
  { 
    name: 'Mistakes', 
    icon: 'alert-circle-outline' as any, 
    activeIcon: 'alert-circle' as any,
    route: 'mistakes', 
    color: '#f97316',
    gradient: ['#f97316', '#ea580c'],
    accessibilityLabel: 'Mistakes tab',
    accessibilityHint: 'Track and learn from common mistakes'
  },
  { 
    name: 'Learn', 
    icon: 'school-outline' as any, 
    activeIcon: 'school' as any,
    route: 'learn', 
    color: '#22c55e',
    gradient: ['#22c55e', '#16a34a'],
    accessibilityLabel: 'Learn tab',
    accessibilityHint: 'Learn Namaz step by step'
  },
  { 
    name: 'Settings', 
    icon: 'settings-outline' as any, 
    activeIcon: 'settings' as any,
    route: 'settings', 
    color: '#6b7280',
    gradient: ['#6b7280', '#4b5563'],
    accessibilityLabel: 'Settings tab',
    accessibilityHint: 'App settings and preferences'
  },
];

export default function ResponsiveTabBar({ state }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = dimensions;
  
  // Memoize responsive calculations
  const responsiveStyles = useMemo(() => {
    const isTablet = screenWidth >= 768;
    const isLandscape = screenWidth > screenHeight;
    const isSmallScreen = screenWidth < 375;
    
    return {
      tabBarWidth: Math.min(screenWidth - Spacing.lg * 2, isTablet ? 600 : screenWidth - Spacing.lg * 2),
      iconSize: isSmallScreen ? 20 : isTablet ? 28 : 24,
      fontSize: isSmallScreen ? FontSizes.xs - 1 : isTablet ? FontSizes.sm : FontSizes.xs,
      tabHeight: isLandscape ? 60 : isTablet ? 80 : 64,
      paddingHorizontal: isSmallScreen ? Spacing.sm : Spacing.lg,
      paddingVertical: isLandscape ? Spacing.xs : Spacing.sm,
    };
  }, [screenWidth, screenHeight]);

  const handleTabPress = useCallback(async (tab: any) => {
    try {
      // Haptic feedback
      if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      // Navigate to tab
      router.push(`/(tabs)/${tab.route}` as any);
    } catch (error) {
      console.warn('Navigation error:', error);
    }
  }, []);

  const getCurrentRouteName = useCallback(() => {
    return state.routes[state.index]?.name || 'index';
  }, [state.routes, state.index]);

  const currentRoute = getCurrentRouteName();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Check if current route is a secondary tab
  const isSecondaryRoute = secondaryTabs.some(tab => tab.route === currentRoute);

  // Memoize tab rendering
  const renderTab = useCallback((tab: any, index: number) => {
    const isActive = currentRoute === tab.route;
    
    return (
      <Pressable
        key={tab.route}
        style={({ pressed }) => [
          styles.tabButton,
          pressed && styles.tabButtonPressed,
        ]}
        onPress={() => handleTabPress(tab)}
        accessibilityRole="button"
        accessibilityLabel={tab.accessibilityLabel}
        accessibilityHint={tab.accessibilityHint}
        accessibilityState={{ selected: isActive }}
        accessibilityActions={[
          { name: 'activate', label: `Navigate to ${tab.name}` }
        ]}
        onAccessibilityAction={() => handleTabPress(tab)}
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
                { width: responsiveStyles.iconSize + 24, height: responsiveStyles.iconSize + 24 }
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
              { width: responsiveStyles.iconSize + 24, height: responsiveStyles.iconSize + 24 }
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
    );
  }, [currentRoute, handleTabPress, responsiveStyles]);

  // Render More tab
  const renderMoreTab = useCallback(() => {
    const isActive = showMoreMenu || isSecondaryRoute;
    
    return (
      <Pressable
        key="more"
        style={({ pressed }) => [
          styles.tabButton,
          pressed && styles.tabButtonPressed,
        ]}
        onPress={() => setShowMoreMenu(!showMoreMenu)}
        accessibilityRole="button"
        accessibilityLabel="More options tab"
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
                { width: responsiveStyles.iconSize + 24, height: responsiveStyles.iconSize + 24 }
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
              { width: responsiveStyles.iconSize + 24, height: responsiveStyles.iconSize + 24 }
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
  }, [showMoreMenu, isSecondaryRoute, responsiveStyles]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.95)', 'rgba(15, 23, 42, 0.9)']}
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
          {mainTabs.map(renderTab)}
          {renderMoreTab()}
        </View>
      </LinearGradient>

      {/* More Menu Overlay */}
      {showMoreMenu && (
        <View style={styles.moreMenuOverlay}>
          <Pressable 
            style={styles.moreMenuBackdrop}
            onPress={() => setShowMoreMenu(false)}
          />
          <View style={[styles.moreMenu, { width: responsiveStyles.tabBarWidth }]}>
            <Text style={styles.moreMenuTitle}>More Options</Text>
            <View style={styles.moreMenuGrid}>
              {secondaryTabs.map((tab) => (
                <Pressable
                  key={tab.route}
                  style={({ pressed }) => [
                    styles.moreMenuItem,
                    pressed && styles.moreMenuItemPressed
                  ]}
                  onPress={() => {
                    handleTabPress(tab);
                    setShowMoreMenu(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={tab.accessibilityLabel}
                  accessibilityHint={tab.accessibilityHint}
                >
                  <View style={[styles.moreMenuIcon, { backgroundColor: tab.color }]}>
                    <Ionicons name={tab.icon} size={20} color="white" />
                  </View>
                  <Text style={styles.moreMenuText}>{tab.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
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
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Account for home indicator
    zIndex: 1000, // Ensure tab bar stays on top
  },
  tabBar: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.lg,
    // Dynamic width will be set via style prop
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // Dynamic padding will be set via style prop
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    minHeight: 44, // Minimum touch target size for accessibility
  },
  tabButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  tabContent: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    // Dynamic minHeight will be set via style prop
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
    // Dynamic size will be set via style prop
  },
  iconContainerInactive: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    // Dynamic size will be set via style prop
  },
  tabLabel: {
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
    letterSpacing: 0.2,
    // Dynamic fontSize will be set via style prop
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  moreMenu: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 32,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  moreMenuTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.lg,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  moreMenuText: {
    fontSize: FontSizes.sm,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});