import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface AppLogoProps {
  size?: number;
  variant?: 'full' | 'icon' | 'minimal';
  animated?: boolean;
}

export default function AppLogo({ size = 120, variant = 'full', animated = false }: AppLogoProps) {
  const iconSize = size * 0.6;
  const textSize = size * 0.4;

  const renderIcon = () => (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#fcd34d" stopOpacity="1" />
          <Stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
          <Stop offset="100%" stopColor="#d97706" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <Stop offset="100%" stopColor="#059669" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="crescentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
          <Stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Background circle with glow */}
      <Circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#moonGradient)"
        opacity="0.2"
      />
      
      {/* Main crescent moon */}
      <Path
        d="M 30 50 A 20 20 0 1 1 70 50 A 15 15 0 1 0 30 50 Z"
        fill="url(#crescentGradient)"
        stroke="#ffffff"
        strokeWidth="2"
      />
      
      {/* Inner crescent */}
      <Path
        d="M 35 50 A 15 15 0 1 1 65 50 A 10 10 0 1 0 35 50 Z"
        fill="url(#moonGradient)"
      />
      
      {/* Stars around the moon */}
      <G>
        {/* Top star */}
        <Path
          d="M 50 15 L 52 21 L 58 21 L 53 25 L 55 31 L 50 27 L 45 31 L 47 25 L 42 21 L 48 21 Z"
          fill="url(#starGradient)"
          opacity="0.8"
        />
        
        {/* Right star */}
        <Path
          d="M 85 50 L 79 52 L 79 58 L 75 53 L 69 55 L 73 50 L 69 45 L 75 47 L 79 42 L 79 48 Z"
          fill="url(#starGradient)"
          opacity="0.6"
        />
        
        {/* Bottom star */}
        <Path
          d="M 50 85 L 48 79 L 42 79 L 47 75 L 45 69 L 50 73 L 55 69 L 53 75 L 58 79 L 52 79 Z"
          fill="url(#starGradient)"
          opacity="0.7"
        />
        
        {/* Left star */}
        <Path
          d="M 15 50 L 21 48 L 21 42 L 25 47 L 31 45 L 27 50 L 31 55 L 25 53 L 21 58 L 21 52 Z"
          fill="url(#starGradient)"
          opacity="0.5"
        />
      </G>
      
      {/* Decorative dots */}
      <Circle cx="20" cy="20" r="2" fill="#10b981" opacity="0.6" />
      <Circle cx="80" cy="20" r="2" fill="#10b981" opacity="0.6" />
      <Circle cx="20" cy="80" r="2" fill="#10b981" opacity="0.6" />
      <Circle cx="80" cy="80" r="2" fill="#10b981" opacity="0.6" />
    </Svg>
  );

  if (variant === 'icon') {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        {renderIcon()}
      </View>
    );
  }

  if (variant === 'minimal') {
    return (
      <View style={[styles.container, { width: size * 0.8, height: size * 0.8 }]}>
        <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#10b981" stopOpacity="1" />
              <Stop offset="100%" stopColor="#059669" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 30 50 A 20 20 0 1 1 70 50 A 15 15 0 1 0 30 50 Z"
            fill="url(#minimalGradient)"
          />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
