import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    ViewProps
} from 'react-native';
import { BorderRadius, Spacing } from '../constants/Theme';

interface SimpleCardProps extends ViewProps {
  children: React.ReactNode;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  onPress?: () => void;
  hoverable?: boolean;
  glow?: boolean;
  glowColor?: string;
}

interface GradientCardProps extends SimpleCardProps {
  gradient: string[];
}

interface FloatingCardProps extends SimpleCardProps {
  elevation?: number;
}

export function GlassCard({
  children,
  borderRadius = BorderRadius.lg,
  padding = Spacing.lg,
  margin = 0,
  onPress,
  hoverable = false,
  glow = false,
  glowColor = '#10b981',
  style,
  ...props
}: SimpleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.glassCard,
        {
          borderRadius,
          padding,
          margin,
          transform: [{ scale: pressed && hoverable ? 0.98 : 1 }],
        },
        glow && {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 15,
        },
        style,
      ]}
      {...props}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      {children}
    </Pressable>
  );
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
  glowColor = '#10b981',
  style,
  ...props
}: GradientCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.gradientCard,
        {
          borderRadius,
          padding,
          margin,
          transform: [{ scale: pressed && hoverable ? 0.98 : 1 }],
        },
        glow && {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 15,
        },
        style,
      ]}
      {...props}
    >
      <LinearGradient
        colors={gradient as any}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      {children}
    </Pressable>
  );
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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.floatingCard,
        {
          borderRadius,
          padding,
          margin,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: elevation / 2 },
          shadowOpacity: 0.3,
          shadowRadius: elevation,
          elevation,
          transform: [{ scale: pressed && hoverable ? 0.98 : 1 }],
        },
        glow && {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 20,
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  gradientCard: {
    overflow: 'hidden',
  },
  floatingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
