import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ActivityIndicator,
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
import { BorderRadius, Shadows, Spacing } from '../../constants/DesignSystem';
import { useTheme } from '../../contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: any;
  gradient?: string[];
  hapticFeedback?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  gradient,
  hapticFeedback = true,
}: ButtonProps) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    opacity.value = withSpring(0.8, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getSizeStyles = () => {
    const sizeMap = {
      xs: { paddingVertical: Spacing[1], paddingHorizontal: Spacing[3], fontSize: 12 },
      sm: { paddingVertical: Spacing[2], paddingHorizontal: Spacing[4], fontSize: 14 },
      md: { paddingVertical: Spacing[3], paddingHorizontal: Spacing[5], fontSize: 16 },
      lg: { paddingVertical: Spacing[4], paddingHorizontal: Spacing[6], fontSize: 18 },
      xl: { paddingVertical: Spacing[5], paddingHorizontal: Spacing[8], fontSize: 20 },
    };
    return sizeMap[size];
  };

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: BorderRadius.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: colors.primary || '#10b981',
          ...Shadows.md,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          ...Shadows.sm,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary || '#10b981',
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      case 'gradient':
        return {
          ...baseStyles,
          ...Shadows.md,
        };
      default:
        return baseStyles;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'gradient':
        return '#ffffff';
      case 'secondary':
        return colors.text;
      case 'outline':
        return colors.primary || '#10b981';
      case 'ghost':
        return colors.primary || '#10b981';
      default:
        return '#ffffff';
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();
  const textColor = getTextColor();

  const buttonContent = (
    <AnimatedPressable
      style={[
        variantStyles,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[animatedStyle]}
    >
      {variant === 'gradient' ? (
        <LinearGradient
          colors={gradient || ['#10b981', '#059669']}
          style={[
            variantStyles,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              width: fullWidth ? '100%' : 'auto',
            },
          ]}
        >
          {renderButtonContent()}
        </LinearGradient>
      ) : (
        renderButtonContent()
      )}
    </AnimatedPressable>
  );

  function renderButtonContent() {
    return (
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={textColor}
            style={styles.loader}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyles.fontSize}
                color={textColor}
                style={styles.iconLeft}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeStyles.fontSize,
                  color: textColor,
                  fontWeight: '600',
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sizeStyles.fontSize}
                color={textColor}
                style={styles.iconRight}
              />
            )}
          </>
        )}
      </View>
    );
  }

  return buttonContent;
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: Spacing[2],
  },
  iconRight: {
    marginLeft: Spacing[2],
  },
  loader: {
    marginRight: Spacing[2],
  },
});
