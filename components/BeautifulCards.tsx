import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    View,
    ViewProps,
} from 'react-native';
import { BorderRadius, Spacing } from '../constants/Theme';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark';
  borderRadius?: number;
  padding?: number;
  margin?: number;
  onPress?: () => void;
  hoverable?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export function GlassCard({
  children,
  intensity = 20,
  tint = 'dark',
  borderRadius = BorderRadius.lg,
  padding = Spacing.lg,
  margin = 0,
  onPress,
  hoverable = false,
  glow = false,
  glowColor = '#10b981',
  style,
  ...props
}: GlassCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (hoverable) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (hoverable) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.glassCard,
          {
            borderRadius,
            padding,
            margin,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            shadowColor: glow ? glowColor : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: glow ? 0.3 : 0.2,
            shadowRadius: glow ? 20 : 8,
            elevation: glow ? 10 : 5,
          },
          style,
        ]}
        {...props}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={[
            styles.gradientOverlay,
            { borderRadius },
          ]}
        />
        {children}
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

interface GradientCardProps extends ViewProps {
  children: React.ReactNode;
  gradient: string[];
  borderRadius?: number;
  padding?: number;
  margin?: number;
  onPress?: () => void;
  hoverable?: boolean;
  glow?: boolean;
  shadow?: boolean;
}

export function GradientCard({
  children,
  gradient,
  borderRadius = BorderRadius.lg,
  padding = Spacing.lg,
  margin = 0,
  onPress,
  hoverable = false,
  glow = false,
  shadow = true,
  style,
  ...props
}: GradientCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (hoverable) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (hoverable) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={gradient as any}
        style={[
          styles.gradientCard,
          {
            borderRadius,
            padding,
            margin,
            shadowColor: glow ? gradient[0] : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: glow ? 0.3 : 0.2,
            shadowRadius: glow ? 20 : 8,
            elevation: glow ? 10 : 5,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

interface FloatingCardProps extends ViewProps {
  children: React.ReactNode;
  elevation?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  onPress?: () => void;
  hoverable?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export function FloatingCard({
  children,
  elevation = 10,
  borderRadius = BorderRadius.lg,
  padding = Spacing.lg,
  margin = 0,
  onPress,
  hoverable = false,
  glow = false,
  glowColor = '#10b981',
  style,
  ...props
}: FloatingCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (hoverable) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(translateYAnim, {
          toValue: 2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (hoverable) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.floatingCard,
          {
            borderRadius,
            padding,
            margin,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            shadowColor: glow ? glowColor : '#000',
            shadowOffset: { width: 0, height: elevation / 2 },
            shadowOpacity: glow ? 0.3 : 0.2,
            shadowRadius: glow ? 25 : elevation,
            elevation: glow ? 20 : elevation,
          },
          style,
        ]}
        {...props}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
          style={[
            styles.gradientOverlay,
            { borderRadius },
          ]}
        />
        {children}
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  glassCard: {
    overflow: 'hidden',
  },
  gradientCard: {
    overflow: 'hidden',
  },
  floatingCard: {
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});