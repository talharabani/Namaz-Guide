import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

interface SimpleSwipeWrapperProps {
  children: React.ReactNode;
  currentTab: string;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function SimpleSwipeWrapper({
  children,
  currentTab,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
}: SimpleSwipeWrapperProps) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
