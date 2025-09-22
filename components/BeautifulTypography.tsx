import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextProps,
    View,
} from 'react-native';
import { FontSizes } from '../constants/Theme';

interface BeautifulTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'arabic' | 'calligraphy';
  color?: string;
  gradient?: string[];
  glow?: boolean;
  shadow?: boolean;
  italic?: boolean;
}

export function BeautifulText({
  children,
  variant = 'body',
  color = '#ffffff',
  gradient,
  glow = false,
  shadow = false,
  italic = false,
  style,
  ...props
}: BeautifulTextProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'title':
        return {
          fontSize: FontSizes.xxl,
          fontWeight: 'bold' as const,
          letterSpacing: 1,
        };
      case 'subtitle':
        return {
          fontSize: FontSizes.lg,
          fontWeight: '600' as const,
          letterSpacing: 0.5,
        };
      case 'body':
        return {
          fontSize: FontSizes.md,
          fontWeight: '400' as const,
        };
      case 'caption':
        return {
          fontSize: FontSizes.sm,
          fontWeight: '400' as const,
          opacity: 0.8,
        };
      case 'arabic':
        return {
          fontSize: FontSizes.xl,
          fontWeight: '400' as const,
          textAlign: 'right' as const,
          lineHeight: FontSizes.xl * 1.8,
        };
      case 'calligraphy':
        return {
          fontSize: FontSizes.xxl,
          fontWeight: '300' as const,
          letterSpacing: 2,
          fontStyle: 'italic' as const,
        };
      default:
        return {};
    }
  };

  const textStyle = [
    getVariantStyles(),
    {
      color,
      fontStyle: italic ? 'italic' : 'normal',
      textShadowColor: shadow ? 'rgba(0, 0, 0, 0.5)' : undefined,
      textShadowOffset: shadow ? { width: 1, height: 1 } : undefined,
      textShadowRadius: shadow ? 3 : undefined,
    },
    style,
  ];

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        <Text style={[textStyle, { color: 'transparent' }]} {...props}>
          {children}
        </Text>
      </LinearGradient>
    );
  }

  if (glow) {
    return (
      <View style={styles.glowContainer}>
        <Text style={[textStyle, styles.glowText]} {...props}>
          {children}
        </Text>
      </View>
    );
  }

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}

interface ArabicTextProps extends TextProps {
  children: string;
  size?: number;
  color?: string;
  glow?: boolean;
}

export function ArabicText({
  children,
  size = FontSizes.xl,
  color = '#fcd34d',
  glow = false,
  style,
  ...props
}: ArabicTextProps) {
  const textStyle = [
    {
      fontSize: size,
      color,
      textAlign: 'right',
      lineHeight: size * 1.8,
      fontFamily: 'System',
      fontWeight: '400',
    },
    glow && styles.arabicGlow,
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}

interface CalligraphyTextProps extends TextProps {
  children: string;
  size?: number;
  gradient?: string[];
  glow?: boolean;
}

export function CalligraphyText({
  children,
  size = FontSizes.xxl,
  gradient = ['#fcd34d', '#f59e0b', '#d97706'],
  glow = false,
  style,
  ...props
}: CalligraphyTextProps) {
  const textStyle = [
    {
      fontSize: size,
      fontWeight: '300',
      letterSpacing: 2,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    glow && styles.calligraphyGlow,
    style,
  ];

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        <Text style={[textStyle, { color: 'transparent' }]} {...props}>
          {children}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}

interface GlowingTextProps extends TextProps {
  children: string;
  glowColor?: string;
  intensity?: number;
}

export function GlowingText({
  children,
  glowColor = '#10b981',
  intensity = 0.8,
  style,
  ...props
}: GlowingTextProps) {
  return (
    <View style={styles.glowContainer}>
      <Text
        style={[
          {
            textShadowColor: glowColor,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 20 * intensity,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  glowContainer: {
    flex: 1,
  },
  glowText: {
    textShadowColor: '#10b981',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  arabicGlow: {
    textShadowColor: '#fcd34d',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  calligraphyGlow: {
    textShadowColor: '#f59e0b',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
