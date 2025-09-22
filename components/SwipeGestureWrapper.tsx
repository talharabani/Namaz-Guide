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

interface SwipeGestureWrapperProps {
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

export default function SwipeGestureWrapper({
  children,
  currentTab,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
}: SwipeGestureWrapperProps) {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const onGestureEvent = Animated.event(
    [
      { nativeEvent: { translationX: translateX, translationY: translateY } }
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;
      
      // Reset animations
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(opacityAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      // Handle swipe gestures
      const swipeThreshold = 50;
      const velocityThreshold = 500;

      // Swipe Right (Previous Tab)
      if (translationX > swipeThreshold || velocityX > velocityThreshold) {
        handleSwipeRight();
      }
      // Swipe Left (Next Tab)
      else if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
        handleSwipeLeft();
      }
      // Swipe Up
      else if (translationY < -swipeThreshold || velocityY < -velocityThreshold) {
        if (onSwipeUp) {
          onSwipeUp();
        }
      }
      // Swipe Down
      else if (translationY > swipeThreshold || velocityY > velocityThreshold) {
        if (onSwipeDown) {
          onSwipeDown();
        }
      }
    }
  };

  const handleSwipeLeft = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabOrder.length;
    const nextTab = tabOrder[nextIndex];
    
    // Animate transition
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateX, {
        toValue: width,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(opacityAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setTimeout(() => {
      router.push(`/(tabs)/${nextTab}` as any);
    }, 200);

    if (onSwipeLeft) {
      onSwipeLeft();
    }
  };

  const handleSwipeRight = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    const prevIndex = currentIndex === 0 ? tabOrder.length - 1 : currentIndex - 1;
    const prevTab = tabOrder[prevIndex];
    
    // Animate transition
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateX, {
        toValue: -width,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(opacityAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setTimeout(() => {
      router.push(`/(tabs)/${prevTab}` as any);
    }, 200);

    if (onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      minDist={10}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateX },
              { translateY },
              { scale: scaleAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        {children}
        
        {/* Swipe indicators */}
        <View style={styles.swipeIndicators}>
          <View style={[styles.indicator, styles.leftIndicator]} />
          <View style={[styles.indicator, styles.rightIndicator]} />
          <View style={[styles.indicator, styles.upIndicator]} />
          <View style={[styles.indicator, styles.downIndicator]} />
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
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
    width: 2,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1,
  },
  leftIndicator: {
    left: 10,
    top: '50%',
  },
  rightIndicator: {
    right: 10,
    top: '50%',
  },
  upIndicator: {
    top: 10,
    left: '50%',
  },
  downIndicator: {
    bottom: 10,
    left: '50%',
  },
});
