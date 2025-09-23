import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, BorderRadius, Shadows } from '../../constants/DesignSystem';
import IslamicText from '../ui/IslamicText';
import DrawerMenu from './DrawerMenu';

const { width: screenWidth } = Dimensions.get('window');

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showDrawer?: boolean;
  showBack?: boolean;
  onBackPress?: () => void;
  rightActions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'transparent';
  centerTitle?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  showDrawer = true,
  showBack = false,
  onBackPress,
  rightActions,
  variant = 'default',
  centerTitle = false,
}: AppHeaderProps) {
  const { colors, isDark } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen]);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const renderHeaderContent = () => {
    if (variant === 'transparent') {
      return (
        <View style={styles.transparentHeader}>
          <View style={styles.headerContent}>
            {showBack ? (
              <Pressable style={styles.backButton} onPress={onBackPress}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
            ) : showDrawer ? (
              <Pressable style={styles.menuButton} onPress={handleDrawerToggle}>
                <Ionicons name="menu" size={24} color={colors.text} />
              </Pressable>
            ) : (
              <View style={styles.placeholder} />
            )}

            {title && (
              <View style={[styles.titleContainer, centerTitle && styles.centerTitle]}>
                <IslamicText variant="title" style={styles.title}>
                  {title}
                </IslamicText>
                {subtitle && (
                  <IslamicText variant="caption" style={styles.subtitle}>
                    {subtitle}
                  </IslamicText>
                )}
              </View>
            )}

            <View style={styles.rightActions}>
              {rightActions}
            </View>
          </View>
        </View>
      );
    }

    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={isDark ? ['#0f172a', '#1e293b'] : ['#ffffff', '#f8fafc']}
          style={styles.gradientHeader}
        >
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <View style={styles.headerContent}>
            {showBack ? (
              <Pressable style={styles.backButton} onPress={onBackPress}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
            ) : showDrawer ? (
              <Pressable style={styles.menuButton} onPress={handleDrawerToggle}>
                <Ionicons name="menu" size={24} color={colors.text} />
              </Pressable>
            ) : (
              <View style={styles.placeholder} />
            )}

            {title && (
              <View style={[styles.titleContainer, centerTitle && styles.centerTitle]}>
                <IslamicText variant="title" style={styles.title}>
                  {title}
                </IslamicText>
                {subtitle && (
                  <IslamicText variant="caption" style={styles.subtitle}>
                    {subtitle}
                  </IslamicText>
                )}
              </View>
            )}

            <View style={styles.rightActions}>
              {rightActions}
            </View>
          </View>
        </LinearGradient>
      );
    }

    // Default variant
    return (
      <View style={[styles.defaultHeader, { backgroundColor: colors.surface }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.headerContent}>
          {showBack ? (
            <Pressable style={styles.backButton} onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
          ) : showDrawer ? (
            <Pressable style={styles.menuButton} onPress={handleDrawerToggle}>
              <Ionicons name="menu" size={24} color={colors.text} />
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}

          {title && (
            <View style={[styles.titleContainer, centerTitle && styles.centerTitle]}>
              <IslamicText variant="title" style={styles.title}>
                {title}
              </IslamicText>
              {subtitle && (
                <IslamicText variant="caption" style={styles.subtitle}>
                  {subtitle}
                </IslamicText>
              )}
            </View>
          )}

          <View style={styles.rightActions}>
            {rightActions}
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {renderHeaderContent()}
      
      <DrawerMenu
        isVisible={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </>
  );
}

// Header action button component
export function HeaderActionButton({
  icon,
  onPress,
  color,
  size = 24,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  size?: number;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={styles.actionButton}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Ionicons
          name={icon}
          size={size}
          color={color || colors.text}
        />
      </Pressable>
    </Animated.View>
  );
}

// Header with search functionality
export function SearchHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  placeholder = 'Search...',
  showDrawer = true,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: () => void;
  placeholder?: string;
  showDrawer?: boolean;
}) {
  const { colors } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen]);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <>
      <View style={[styles.searchHeader, { backgroundColor: colors.surface }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.searchContent}>
          {showDrawer && (
            <Pressable style={styles.menuButton} onPress={handleDrawerToggle}>
              <Ionicons name="menu" size={24} color={colors.text} />
            </Pressable>
          )}
          
          <View style={[styles.searchContainer, { backgroundColor: colors.surfaceVariant }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={onSearchChange}
              onSubmitEditing={onSearchSubmit}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => onSearchChange('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>
      </View>
      
      <DrawerMenu
        isVisible={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  defaultHeader: {
    paddingTop: Spacing[12],
    paddingBottom: Spacing[4],
    paddingHorizontal: Spacing[4],
    ...Shadows.sm,
  },
  gradientHeader: {
    paddingTop: Spacing[12],
    paddingBottom: Spacing[4],
    paddingHorizontal: Spacing[4],
    ...Shadows.md,
  },
  transparentHeader: {
    paddingTop: Spacing[12],
    paddingBottom: Spacing[4],
    paddingHorizontal: Spacing[4],
  },
  searchHeader: {
    paddingTop: Spacing[12],
    paddingBottom: Spacing[4],
    paddingHorizontal: Spacing[4],
    ...Shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: Spacing[2],
    borderRadius: BorderRadius.md,
  },
  backButton: {
    padding: Spacing[2],
    borderRadius: BorderRadius.md,
  },
  placeholder: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: Spacing[4],
  },
  centerTitle: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Spacing[2],
    borderRadius: BorderRadius.md,
    marginLeft: Spacing[1],
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.lg,
    marginLeft: Spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: Spacing[2],
  },
});
