import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { BorderRadius, Spacing, Shadows } from '../../constants/DesignSystem';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  onPress?: () => void;
  style?: ViewStyle;
  gradient?: string[];
  hapticFeedback?: boolean;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Card({
  children,
  variant = 'default',
  size = 'md',
  onPress,
  style,
  gradient,
  hapticFeedback = true,
  disabled = false,
}: CardProps) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
      opacity.value = withSpring(0.9, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getSizeStyles = () => {
    const sizeMap = {
      sm: { padding: Spacing[3], borderRadius: BorderRadius.md },
      md: { padding: Spacing[4], borderRadius: BorderRadius.lg },
      lg: { padding: Spacing[6], borderRadius: BorderRadius.xl },
      xl: { padding: Spacing[8], borderRadius: BorderRadius['2xl'] },
    };
    return sizeMap[size];
  };

  const getVariantStyles = () => {
    const baseStyles = {
      backgroundColor: colors.surface,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyles,
          ...Shadows.sm,
        };
      case 'elevated':
        return {
          ...baseStyles,
          ...Shadows.lg,
        };
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'gradient':
        return {
          backgroundColor: 'transparent',
        };
      case 'glass':
        return {
          backgroundColor: isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.8)',
          borderWidth: 1,
          borderColor: isDark 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(255, 255, 255, 0.3)',
          ...Shadows.md,
        };
      default:
        return baseStyles;
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const cardContent = (
    <View
      style={[
        styles.card,
        variantStyles,
        {
          padding: sizeStyles.padding,
          borderRadius: sizeStyles.borderRadius,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (variant === 'gradient' && gradient) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || !onPress}
        style={[animatedStyle]}
      >
        <LinearGradient
          colors={gradient}
          style={[
            styles.card,
            {
              padding: sizeStyles.padding,
              borderRadius: sizeStyles.borderRadius,
              ...Shadows.md,
            },
            style,
          ]}
        >
          {children}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[animatedStyle]}
      >
        {cardContent}
      </AnimatedPressable>
    );
  }

  return cardContent;
}

// Card sub-components
export function CardHeader({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function CardContent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.content, style]}>{children}</View>;
}

export function CardFooter({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

export function CardTitle({ children, style }: { children: React.ReactNode; style?: any }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.title, { color: colors.text }, style]}>
      {children}
    </Text>
  );
}

export function CardDescription({ children, style }: { children: React.ReactNode; style?: any }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.description, { color: colors.textSecondary }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  header: {
    marginBottom: Spacing[3],
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: Spacing[3],
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing[1],
  },
});
