import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface NotificationIconProps {
  size?: number;
  color?: string;
}

export default function NotificationIcon({ size = 64, color = '#10b981' }: NotificationIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </LinearGradient>
        </Defs>
        
        {/* Background circle */}
        <Circle
          cx="32"
          cy="32"
          r="30"
          fill="url(#iconGradient)"
          opacity="0.1"
        />
        
        {/* Main crescent moon */}
        <Path
          d="M 20 32 A 12 12 0 1 1 44 32 A 9 9 0 1 0 20 32 Z"
          fill="url(#iconGradient)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        
        {/* Inner crescent */}
        <Path
          d="M 24 32 A 9 9 0 1 1 40 32 A 6 6 0 1 0 24 32 Z"
          fill="#ffffff"
          opacity="0.3"
        />
        
        {/* Small star */}
        <Path
          d="M 32 12 L 33 16 L 37 16 L 34 18 L 35 22 L 32 20 L 29 22 L 30 18 L 27 16 L 31 16 Z"
          fill="#ffffff"
          opacity="0.8"
        />
      </Svg>
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
