import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'prayer' | 'qibla' | 'duas' | 'progress' | 'quiz' | 'ai' | 'mistakes' | 'learn' | 'settings';
}

export default function AnimatedBackground({ children, variant = 'default' }: AnimatedBackgroundProps) {
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const animatedValue3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animatedValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = createAnimation(animatedValue1, 8000);
    const animation2 = createAnimation(animatedValue2, 12000);
    const animation3 = createAnimation(animatedValue3, 10000);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, []);

  const getGradientColors = () => {
    switch (variant) {
      case 'prayer':
        return [
          ['rgba(245, 158, 11, 0.3)', 'rgba(217, 119, 6, 0.2)', 'rgba(180, 83, 9, 0.1)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
          ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.05)'],
        ];
      case 'qibla':
        return [
          ['rgba(139, 92, 246, 0.4)', 'rgba(124, 58, 237, 0.3)', 'rgba(109, 40, 217, 0.2)'],
          ['rgba(16, 185, 129, 0.3)', 'rgba(5, 150, 105, 0.2)', 'rgba(4, 120, 87, 0.1)'],
          ['rgba(245, 158, 11, 0.2)', 'rgba(217, 119, 6, 0.1)', 'rgba(180, 83, 9, 0.05)'],
        ];
      case 'duas':
        return [
          ['rgba(236, 72, 153, 0.3)', 'rgba(219, 39, 119, 0.2)', 'rgba(190, 24, 93, 0.1)'],
          ['rgba(252, 211, 77, 0.2)', 'rgba(245, 158, 11, 0.1)', 'rgba(217, 119, 6, 0.05)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
        ];
      case 'progress':
        return [
          ['rgba(6, 182, 212, 0.3)', 'rgba(8, 145, 178, 0.2)', 'rgba(14, 116, 144, 0.1)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
          ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.05)'],
        ];
      case 'quiz':
        return [
          ['rgba(249, 115, 22, 0.3)', 'rgba(234, 88, 12, 0.2)', 'rgba(194, 65, 12, 0.1)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
          ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.05)'],
        ];
      case 'ai':
        return [
          ['rgba(132, 204, 22, 0.3)', 'rgba(101, 163, 13, 0.2)', 'rgba(77, 124, 15, 0.1)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
          ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.05)'],
        ];
      case 'mistakes':
        return [
          ['rgba(239, 68, 68, 0.3)', 'rgba(220, 38, 38, 0.2)', 'rgba(185, 28, 28, 0.1)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
          ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.05)'],
        ];
      case 'learn':
        return [
          ['rgba(168, 85, 247, 0.3)', 'rgba(147, 51, 234, 0.2)', 'rgba(126, 34, 206, 0.1)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
          ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.05)'],
        ];
      case 'settings':
        return [
          ['rgba(107, 114, 128, 0.3)', 'rgba(75, 85, 99, 0.2)', 'rgba(55, 65, 81, 0.1)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
          ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.05)'],
        ];
      default:
        return [
          ['rgba(15, 23, 42, 0.8)', 'rgba(30, 41, 59, 0.6)', 'rgba(51, 65, 85, 0.4)'],
          ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)', 'rgba(4, 120, 87, 0.05)'],
          ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(109, 40, 217, 0.05)'],
        ];
    }
  };

  const gradients = getGradientColors();

  const translateX1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.5, width * 0.5],
  });

  const translateY1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.3, height * 0.3],
  });

  const translateX2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.3, -width * 0.3],
  });

  const translateY2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.2, -height * 0.2],
  });

  const translateX3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.2, width * 0.2],
  });

  const translateY3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.4, -height * 0.4],
  });

  const scale1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const scale2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [1.1, 0.9],
  });

  const scale3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1],
  });

  return (
    <View style={styles.container}>
      {/* Base gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.baseGradient}
      />
      
      {/* Animated gradient layers */}
      <Animated.View
        style={[
          styles.animatedLayer,
          {
            transform: [
              { translateX: translateX1 },
              { translateY: translateY1 },
              { scale: scale1 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={gradients[0] as any}
          style={styles.gradientLayer}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.animatedLayer,
          {
            transform: [
              { translateX: translateX2 },
              { translateY: translateY2 },
              { scale: scale2 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={gradients[1] as any}
          style={styles.gradientLayer}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.animatedLayer,
          {
            transform: [
              { translateX: translateX3 },
              { translateY: translateY3 },
              { scale: scale3 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={gradients[2] as any}
          style={styles.gradientLayer}
        />
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  baseGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  animatedLayer: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    borderRadius: width,
  },
  gradientLayer: {
    flex: 1,
    borderRadius: width,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
