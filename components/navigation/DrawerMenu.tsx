import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Spacing, BorderRadius, Shadows } from '../../constants/DesignSystem';
import { FeatureColors } from '../../constants/DesignSystem';
import IslamicText from '../ui/IslamicText';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  gradient?: string[];
  badge?: string;
  badgeColor?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    title: 'Home',
    subtitle: 'Dashboard & Overview',
    icon: 'home',
    route: '/(tabs)/index',
    color: FeatureColors.home,
    gradient: ['#10b981', '#059669'],
  },
  {
    id: 'prayer',
    title: 'Prayer Times',
    subtitle: 'Daily Prayer Schedule',
    icon: 'time',
    route: '/(tabs)/prayer-times',
    color: FeatureColors.prayer,
    gradient: ['#8b5cf6', '#7c3aed'],
  },
  {
    id: 'qibla',
    title: 'Qibla Direction',
    subtitle: 'Find Kaaba Direction',
    icon: 'compass',
    route: '/(tabs)/qibla',
    color: FeatureColors.qibla,
    gradient: ['#06b6d4', '#0891b2'],
  },
  {
    id: 'duas',
    title: 'Duas & Supplications',
    subtitle: 'Islamic Prayers',
    icon: 'book',
    route: '/(tabs)/duas',
    color: FeatureColors.duas,
    gradient: ['#f59e0b', '#d97706'],
  },
  {
    id: 'learn',
    title: 'Learn Namaz',
    subtitle: 'Step-by-Step Guide',
    icon: 'school',
    route: '/(tabs)/learn',
    color: FeatureColors.learn,
    gradient: ['#22c55e', '#16a34a'],
  },
  {
    id: 'quiz',
    title: 'Islamic Quiz',
    subtitle: 'Test Your Knowledge',
    icon: 'help-circle',
    route: '/(tabs)/quiz',
    color: FeatureColors.quiz,
    gradient: ['#ec4899', '#db2777'],
  },
  {
    id: 'progress',
    title: 'Progress Tracker',
    subtitle: 'Learning Statistics',
    icon: 'stats-chart',
    route: '/(tabs)/progress',
    color: FeatureColors.progress,
    gradient: ['#3b82f6', '#2563eb'],
  },
  {
    id: 'ai',
    title: 'AI Assistant',
    subtitle: 'Islamic Guidance',
    icon: 'chatbox',
    route: '/(tabs)/ai-assistant',
    color: FeatureColors.ai,
    gradient: ['#a855f7', '#9333ea'],
  },
  {
    id: 'mistakes',
    title: 'Common Mistakes',
    subtitle: 'Learn from Errors',
    icon: 'alert-circle',
    route: '/(tabs)/mistakes',
    color: FeatureColors.mistakes,
    gradient: ['#f97316', '#ea580c'],
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'App Preferences',
    icon: 'settings',
    route: '/(tabs)/settings',
    color: FeatureColors.settings,
    gradient: ['#6b7280', '#4b5563'],
  },
];

export default function DrawerMenu({ isVisible, onClose }: DrawerMenuProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const overlayOpacity = useSharedValue(0);
  const drawerTranslateX = useSharedValue(-screenWidth);

  React.useEffect(() => {
    if (isVisible) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
      drawerTranslateX.value = withSpring(0, { damping: 20, stiffness: 100 });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      drawerTranslateX.value = withTiming(-screenWidth, { duration: 200 });
    }
  }, [isVisible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerTranslateX.value }],
  }));

  const handleMenuItemPress = useCallback(async (item: MenuItem) => {
    setSelectedItem(item.id);
    
    // Add haptic feedback
    // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to route
    router.push(item.route as any);
    
    // Close drawer after a short delay
    setTimeout(() => {
      onClose();
      setSelectedItem(null);
    }, 150);
  }, [onClose]);

  const handleLogout = useCallback(() => {
    logout();
    onClose();
  }, [logout, onClose]);

  const renderMenuItem = useCallback((item: MenuItem) => {
    const isSelected = selectedItem === item.id;
    
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.menuItem,
          isSelected && styles.menuItemSelected,
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.menuItemPressable,
            pressed && styles.menuItemPressed,
          ]}
          onPress={() => handleMenuItemPress(item)}
        >
          <LinearGradient
            colors={item.gradient || [item.color, item.color]}
            style={styles.menuItemGradient}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIconContainer}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color="white"
                />
              </View>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              {item.badge && (
                <View style={[
                  styles.badge,
                  { backgroundColor: item.badgeColor || item.color }
                ]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons
                name="chevron-forward"
                size={20}
                color="rgba(255, 255, 255, 0.7)"
              />
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }, [selectedItem, handleMenuItemPress]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
      
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.drawer, drawerStyle]}>
        <LinearGradient
          colors={isDark ? ['#0f172a', '#1e293b'] : ['#ffffff', '#f8fafc']}
          style={styles.drawerGradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Ionicons name="mosque" size={32} color={colors.primary} />
              </View>
              <View style={styles.headerText}>
                <IslamicText variant="title" style={styles.appName}>
                  Namaz Mobile
                </IslamicText>
                <IslamicText variant="caption" style={styles.appSubtitle}>
                  Your Islamic Companion
                </IslamicText>
              </View>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* User Info */}
          {user && (
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={24} color="white" />
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user.name || 'User'}
                </Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                  {user.email}
                </Text>
              </View>
            </View>
          )}

          {/* Menu Items */}
          <ScrollView
            style={styles.menuContainer}
            showsVerticalScrollIndicator={false}
          >
            {menuItems.map(renderMenuItem)}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Pressable style={styles.footerButton} onPress={toggleTheme}>
              <Ionicons 
                name={isDark ? 'sunny' : 'moon'} 
                size={20} 
                color={colors.text} 
              />
              <Text style={[styles.footerButtonText, { color: colors.text }]}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </Pressable>
            
            <Pressable style={styles.footerButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color="#ef4444" />
              <Text style={[styles.footerButtonText, { color: '#ef4444' }]}>
                Logout
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayPressable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: screenWidth * 0.85,
    maxWidth: 320,
  },
  drawerGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[12],
    paddingBottom: Spacing[4],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[4],
  },
  headerText: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
  },
  appSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  closeButton: {
    padding: Spacing[2],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
    marginBottom: Spacing[4],
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: Spacing[4],
  },
  menuItem: {
    marginBottom: Spacing[2],
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuItemSelected: {
    transform: [{ scale: 0.98 }],
  },
  menuItemPressable: {
    borderRadius: BorderRadius.lg,
  },
  menuItemPressed: {
    opacity: 0.9,
  },
  menuItemGradient: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.sm,
    marginRight: Spacing[2],
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  footer: {
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing[2],
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: Spacing[2],
  },
});
