import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { BorderRadius, FontSizes, Spacing } from '../constants/Theme';

const { width } = Dimensions.get('window');

interface TabItem {
  name: string;
  title: string;
  icon: string;
  focusedIcon: string;
  color: string;
  gradient: string[];
  category: 'main' | 'secondary';
}

const mainTabs: TabItem[] = [
  {
    name: 'index',
    title: 'Home',
    icon: 'home-outline',
    focusedIcon: 'home',
    color: '#10b981',
    gradient: ['#10b981', '#059669'],
    category: 'main',
  },
  {
    name: 'prayer-times',
    title: 'Prayer',
    icon: 'time-outline',
    focusedIcon: 'time',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
    category: 'main',
  },
  {
    name: 'qibla',
    title: 'Qibla',
    icon: 'compass-outline',
    focusedIcon: 'compass',
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#7c3aed'],
    category: 'main',
  },
  {
    name: 'duas',
    title: 'Duas',
    icon: 'heart-outline',
    focusedIcon: 'heart',
    color: '#ef4444',
    gradient: ['#ef4444', '#dc2626'],
    category: 'main',
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: 'settings-outline',
    focusedIcon: 'settings',
    color: '#6b7280',
    gradient: ['#6b7280', '#4b5563'],
    category: 'main',
  },
];

const secondaryTabs: TabItem[] = [
  {
    name: 'progress',
    title: 'Progress',
    icon: 'trending-up-outline',
    focusedIcon: 'trending-up',
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2'],
    category: 'secondary',
  },
  {
    name: 'quiz',
    title: 'Quiz',
    icon: 'school-outline',
    focusedIcon: 'school',
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#7c3aed'],
    category: 'secondary',
  },
  {
    name: 'ai-assistant',
    title: 'AI Help',
    icon: 'chatbubble-ellipses-outline',
    focusedIcon: 'chatbubble-ellipses',
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2'],
    category: 'secondary',
  },
  {
    name: 'mistakes',
    title: 'Mistakes',
    icon: 'warning-outline',
    focusedIcon: 'warning',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
    category: 'secondary',
  },
  {
    name: 'learn',
    title: 'Learn',
    icon: 'book-outline',
    focusedIcon: 'book',
    color: '#10b981',
    gradient: ['#10b981', '#059669'],
    category: 'secondary',
  },
];

const allTabs = [...mainTabs, ...secondaryTabs];

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      // Hide tab bar on swipe down
      if (translationY > 50 || velocityY > 500) {
        hideTabBar();
      }
      // Show tab bar on swipe up
      else if (translationY < -50 || velocityY < -500) {
        showTabBar();
      }
      // Reset position
      else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const hideTabBar = () => {
    setIsVisible(false);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showTabBar = () => {
    setIsVisible(true);
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleTabPress = (route: any, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
      
      // Collapse expanded tabs when navigating
      if (isExpanded) {
        toggleExpanded();
      }
      
      // Add haptic feedback animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const renderTab = (route: any, index: number, isMainTab: boolean = true) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;
    const tab = allTabs.find(t => t.name === route.name) || allTabs[0];

    return (
      <TouchableOpacity
        key={route.key}
        style={[styles.tabItem, isMainTab && styles.mainTabItem]}
        onPress={() => handleTabPress(route, index)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.tabContent,
            isFocused && styles.activeTabContent,
            !isMainTab && styles.secondaryTabContent,
          ]}
        >
          {isFocused ? (
            <LinearGradient
              colors={tab.gradient as [string, string]}
              style={styles.iconContainer}
            >
              <Ionicons
                name={tab.focusedIcon as any}
                size={isMainTab ? 20 : 18}
                color="white"
              />
            </LinearGradient>
          ) : (
            <View style={styles.iconContainer}>
              <Ionicons
                name={tab.icon as any}
                size={isMainTab ? 20 : 18}
                color="#94a3b8"
              />
            </View>
          )}
          
          {isMainTab && (
            <Text
              style={[
                styles.tabLabel,
                isFocused && styles.activeTabLabel,
              ]}
              numberOfLines={1}
            >
              {tab.title}
            </Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateY },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <BlurView intensity={20} style={styles.blurContainer}>
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']}
            style={styles.gradientContainer}
          >
            {/* Main Tabs */}
            <View style={styles.mainTabContainer}>
              {state.routes
                .filter((route: any) => mainTabs.some(tab => tab.name === route.name))
                .map((route: any, index: number) => renderTab(route, index, true))}
              
              {/* More Button */}
              <TouchableOpacity
                style={styles.moreButton}
                onPress={toggleExpanded}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.moreButtonContent,
                    {
                      transform: [{
                        rotate: expandAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '45deg'],
                        }),
                      }],
                    },
                  ]}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color="#94a3b8"
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Secondary Tabs (Expandable) */}
            <Animated.View
              style={[
                styles.secondaryTabContainer,
                {
                  height: expandAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 60],
                  }),
                  opacity: expandAnim,
                },
              ]}
            >
              <View style={styles.secondaryTabsRow}>
                {state.routes
                  .filter((route: any) => secondaryTabs.some(tab => tab.name === route.name))
                  .map((route: any, index: number) => renderTab(route, index, false))}
              </View>
            </Animated.View>
            
            {/* Swipe indicator */}
            <View style={styles.swipeIndicator}>
              <View style={styles.indicatorDot} />
            </View>
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  blurContainer: {
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gradientContainer: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  secondaryTabContainer: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  secondaryTabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  mainTabItem: {
    minWidth: 60,
  },
  tabContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    minWidth: 50,
  },
  secondaryTabContent: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    minWidth: 40,
  },
  activeTabContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  tabLabel: {
    fontSize: FontSizes.xs,
    color: '#94a3b8',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: 'white',
    fontWeight: '600',
  },
  moreButton: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  moreButtonContent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeIndicator: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
