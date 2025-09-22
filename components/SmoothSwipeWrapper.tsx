import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

interface SmoothSwipeWrapperProps {
  children: React.ReactNode;
  currentTab: string;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const tabOrder = [
  'index',
  'prayer-times',
  'qibla',
  'duas',
  'progress',
  'quiz',
  'ai-assistant',
  'mistakes',
  'learn',
  'settings',
];

export default function SmoothSwipeWrapper({
  children,
  currentTab,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
}: SmoothSwipeWrapperProps) {
  const router = useRouter();
  
  // Animation values
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  
  // Gesture state
  const lastGesture = useRef({ x: 0, y: 0 });
  const gestureStartTime = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    const { state, translationX, translationY, velocityX, velocityY } = event.nativeEvent;
    
    if (state === State.BEGAN) {
      gestureStartTime.current = Date.now();
      lastGesture.current = { x: translationX, y: translationY };
      velocity.current = { x: velocityX, y: velocityY };
      
      // Subtle scale down effect
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 0.98,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    if (state === State.END) {
      const gestureDuration = Date.now() - gestureStartTime.current;
      const gestureDistance = Math.sqrt(translationX * translationX + translationY * translationY);
      const gestureSpeed = gestureDistance / gestureDuration;
      
      // Determine swipe direction and strength
      const isHorizontalSwipe = Math.abs(translationX) > Math.abs(translationY);
      const isVerticalSwipe = Math.abs(translationY) > Math.abs(translationX);
      const isStrongSwipe = gestureDistance > 50 || gestureSpeed > 0.5;
      
      if (isStrongSwipe) {
        if (isHorizontalSwipe) {
          if (translationX > 0) {
            // Swipe right - go to previous tab
            handleSwipeRight();
          } else {
            // Swipe left - go to next tab
            handleSwipeLeft();
          }
        } else if (isVerticalSwipe) {
          if (translationY > 0) {
            // Swipe down
            handleSwipeDown();
          } else {
            // Swipe up
            handleSwipeUp();
          }
        }
      } else {
        // Return to original position with smooth animation
        resetPosition();
      }
    }
  };

  const resetPosition = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(rotation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  };

  const handleSwipeLeft = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextTab = tabOrder[currentIndex + 1] || tabOrder[0];
    
    // Smooth exit animation
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: -0.1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(`/(tabs)/${nextTab}` as any);
      resetPosition();
    });

    if (onSwipeLeft) {
      onSwipeLeft();
    }
  };

  const handleSwipeRight = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    const prevTab = tabOrder[currentIndex - 1] || tabOrder[tabOrder.length - 1];
    
    // Smooth exit animation
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: 0.1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(`/(tabs)/${prevTab}` as any);
      resetPosition();
    });

    if (onSwipeRight) {
      onSwipeRight();
    }
  };

  const handleSwipeUp = () => {
    // Smooth upward animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -height * 0.3,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.7,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      resetPosition();
    });

    if (onSwipeUp) {
      onSwipeUp();
    }
  };

  const handleSwipeDown = () => {
    // Smooth downward animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height * 0.3,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.7,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      resetPosition();
    });

    if (onSwipeDown) {
      onSwipeDown();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background blur effect */}
      <BlurView intensity={20} style={styles.blurBackground} />
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.8)', 'rgba(30, 41, 59, 0.6)', 'rgba(51, 65, 85, 0.4)']}
        style={styles.gradientOverlay}
      />
      
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        minDist={10}
        activeOffsetX={[-10, 10]}
        activeOffsetY={[-10, 10]}
      >
        <Animated.View
          style={[
            styles.content,
            {
              transform: [
                { translateX },
                { translateY },
                { scale },
                { rotate: rotation.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-5deg', '5deg'],
                }) },
              ],
              opacity,
            },
          ]}
        >
          {children}
          
          {/* Swipe indicators with glow effect */}
          <View style={styles.swipeIndicators}>
            <Animated.View style={[
              styles.indicator,
              styles.leftIndicator,
              {
                opacity: translateX.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
                transform: [{
                  scale: translateX.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0.5, 1],
                    extrapolate: 'clamp',
                  }),
                }],
              },
            ]}>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.4)']}
                style={styles.indicatorGradient}
              />
            </Animated.View>
            
            <Animated.View style={[
              styles.indicator,
              styles.rightIndicator,
              {
                opacity: translateX.interpolate({
                  inputRange: [-50, 0],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
                transform: [{
                  scale: translateX.interpolate({
                    inputRange: [-50, 0],
                    outputRange: [1, 0.5],
                    extrapolate: 'clamp',
                  }),
                }],
              },
            ]}>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.4)']}
                style={styles.indicatorGradient}
              />
            </Animated.View>
            
            <Animated.View style={[
              styles.indicator,
              styles.upIndicator,
              {
                opacity: translateY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
                transform: [{
                  scale: translateY.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0.5, 1],
                    extrapolate: 'clamp',
                  }),
                }],
              },
            ]}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.4)']}
                style={styles.indicatorGradient}
              />
            </Animated.View>
            
            <Animated.View style={[
              styles.indicator,
              styles.downIndicator,
              {
                opacity: translateY.interpolate({
                  inputRange: [-50, 0],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
                transform: [{
                  scale: translateY.interpolate({
                    inputRange: [-50, 0],
                    outputRange: [1, 0.5],
                    extrapolate: 'clamp',
                  }),
                }],
              },
            ]}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.4)']}
                style={styles.indicatorGradient}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
  },
  swipeIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  indicator: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  indicatorGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIndicator: {
    left: 20,
    top: '50%',
    marginTop: -30,
  },
  rightIndicator: {
    right: 20,
    top: '50%',
    marginTop: -30,
  },
  upIndicator: {
    top: 20,
    left: '50%',
    marginLeft: -30,
  },
  downIndicator: {
    bottom: 20,
    left: '50%',
    marginLeft: -30,
  },
});
