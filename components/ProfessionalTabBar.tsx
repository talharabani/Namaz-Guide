import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

// Get initial dimensions
const { width: initialWidth } = Dimensions.get('window');

// Main tab bar configuration - only 4 essential tabs
const mainTabs = [
  { 
    name: 'Home', 
    icon: 'home-outline' as any, 
    activeIcon: 'home' as any,
    route: 'index', 
    color: '#10b981',
    accessibilityLabel: 'Home',
    accessibilityHint: 'Go to home screen'
  },
  { 
    name: 'Prayer', 
    icon: 'time-outline' as any, 
    activeIcon: 'time' as any,
    route: 'prayer-times', 
    color: '#8b5cf6',
    accessibilityLabel: 'Prayer Times',
    accessibilityHint: 'View prayer times and schedule'
  },
  { 
    name: 'AI Help', 
    icon: 'chatbox-outline' as any, 
    activeIcon: 'chatbox' as any,
    route: 'ai-assistant', 
    color: '#a855f7',
    accessibilityLabel: 'AI Assistant',
    accessibilityHint: 'Get AI-powered Islamic guidance'
  },
  { 
    name: 'Settings', 
    icon: 'settings-outline' as any, 
    activeIcon: 'settings' as any,
    route: 'settings', 
    color: '#6b7280',
    accessibilityLabel: 'Settings',
    accessibilityHint: 'App settings and preferences'
  },
];

export default function ProfessionalTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const handleTabPress = useCallback(async (tab: any) => {
    try {
      // Haptic feedback
      if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      // Check if already on the same tab
      const currentRoute = getCurrentRouteName();
      if (currentRoute === tab.route) {
        return;
      }
      
      // Navigate using proper navigation method
      const event = navigation.emit({
        type: 'tabPress',
        target: state.routes[state.index].key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.navigate(tab.route as any);
      }
    } catch (error) {
      console.warn('Navigation error:', error);
    }
  }, [navigation, state.routes, state.index]);

  const getCurrentRouteName = useCallback(() => {
    return state.routes[state.index]?.name || 'index';
  }, [state.routes, state.index]);

  const currentRoute = getCurrentRouteName();

  // Tab rendering with text labels and centered home tab
  const renderTab = useCallback((tab: any, index: number) => {
    const isActive = currentRoute === tab.route;
    const isHomeTab = tab.route === 'index';
    
    return (
      <Pressable
        key={tab.route}
        style={[
          styles.tabButton,
          isHomeTab && styles.homeTabButton
        ]}
        onPress={() => handleTabPress(tab)}
        accessibilityRole="button"
        accessibilityLabel={tab.accessibilityLabel}
        accessibilityHint={tab.accessibilityHint}
        accessibilityState={{ selected: isActive }}
      >
        <View style={[
          styles.tabContent,
          isHomeTab && styles.homeTabContent
        ]}>
          <View style={[
            styles.iconContainer,
            isActive && styles.iconContainerActive,
            isHomeTab && styles.homeIconContainer,
          ]}>
            <Ionicons 
              name={isActive ? tab.activeIcon : tab.icon} 
              size={isHomeTab ? 16 : 14} 
              color={isActive ? (isHomeTab ? '#10b981' : 'white') : '#94a3b8'}
            />
          </View>
          
          <Text style={[
            styles.tabLabel,
            isActive && styles.tabLabelActive,
            isHomeTab && styles.homeTabLabel,
          ]}>
            {tab.name}
          </Text>
        </View>
      </Pressable>
    );
  }, [currentRoute, handleTabPress]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {/* Left side tabs */}
        <View style={styles.sideTabsContainer}>
          {mainTabs.filter(tab => tab.route !== 'index').slice(0, 2).map(renderTab)}
        </View>
        
        {/* Center home tab */}
        {mainTabs.filter(tab => tab.route === 'index').map(renderTab)}
        
        {/* Right side tabs */}
        <View style={styles.sideTabsContainer}>
          {mainTabs.filter(tab => tab.route !== 'index').slice(2).map(renderTab)}
        </View>
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
    backgroundColor: '#0f172a',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: 16,
    paddingHorizontal: 20,
    zIndex: 1000,
    elevation: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    minHeight: 42,
    flex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 3,
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 12,
  },
  tabLabelActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  // Home tab specific styles - larger and centered
  homeTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    minHeight: 42,
    flex: 1,
  },
  homeTabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIconContainer: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 3,
    borderRadius: 13,
  },
  homeTabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
    lineHeight: 12,
  },
});