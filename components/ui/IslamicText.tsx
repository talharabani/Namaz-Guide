import { LinearGradient } from 'expo-linear-gradient';
import {
    StyleSheet,
    Text,
    TextProps,
    View,
} from 'react-native';
import { CalligraphyStyles, IslamicTypography } from '../../constants/DesignSystem';
import { useTheme } from '../../contexts/ThemeContext';

export type IslamicTextVariant = 
  | 'bismillah' 
  | 'ayat' 
  | 'translation' 
  | 'hadith' 
  | 'dua' 
  | 'title' 
  | 'subtitle' 
  | 'body' 
  | 'caption'
  | 'arabic'
  | 'english';

interface IslamicTextProps extends TextProps {
  children: string | string[];
  variant?: IslamicTextVariant;
  color?: string;
  gradient?: string[];
  glow?: boolean;
  shadow?: boolean;
  center?: boolean;
  right?: boolean;
  italic?: boolean;
  bold?: boolean;
}

export default function IslamicText({
  children,
  variant = 'body',
  color,
  gradient,
  glow = false,
  shadow = false,
  center = false,
  right = false,
  italic = false,
  bold = false,
  style,
  ...props
}: IslamicTextProps) {
  const { colors, isDark } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'bismillah':
        return {
          ...CalligraphyStyles.bismillah,
          fontSize: IslamicTypography.arabic['4xl'],
          textAlign: 'center' as const,
        };
      case 'ayat':
        return {
          ...CalligraphyStyles.ayat,
          fontSize: IslamicTypography.arabic.lg,
          textAlign: 'right' as const,
        };
      case 'translation':
        return {
          ...CalligraphyStyles.translation,
          fontSize: IslamicTypography.english.base,
          textAlign: 'left' as const,
        };
      case 'hadith':
        return {
          fontSize: IslamicTypography.arabic.base,
          textAlign: 'right' as const,
          lineHeight: IslamicTypography.lineHeights.loose,
          fontStyle: 'italic' as const,
        };
      case 'dua':
        return {
          fontSize: IslamicTypography.arabic.lg,
          textAlign: 'right' as const,
          lineHeight: IslamicTypography.lineHeights.loose,
          fontWeight: '500' as const,
        };
      case 'title':
        return {
          fontSize: IslamicTypography.english['3xl'],
          fontWeight: '700' as const,
          lineHeight: IslamicTypography.lineHeights.tight,
        };
      case 'subtitle':
        return {
          fontSize: IslamicTypography.english.xl,
          fontWeight: '600' as const,
          lineHeight: IslamicTypography.lineHeights.normal,
        };
      case 'body':
        return {
          fontSize: IslamicTypography.english.base,
          fontWeight: '400' as const,
          lineHeight: IslamicTypography.lineHeights.normal,
        };
      case 'caption':
        return {
          fontSize: IslamicTypography.english.sm,
          fontWeight: '400' as const,
          lineHeight: IslamicTypography.lineHeights.normal,
        };
      case 'arabic':
        return {
          fontSize: IslamicTypography.arabic.base,
          textAlign: 'right' as const,
          lineHeight: IslamicTypography.lineHeights.loose,
        };
      case 'english':
        return {
          fontSize: IslamicTypography.english.base,
          textAlign: 'left' as const,
          lineHeight: IslamicTypography.lineHeights.normal,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'bismillah':
        return '#fcd34d'; // Golden color for Bismillah
      case 'ayat':
        return isDark ? '#10b981' : '#059669';
      case 'translation':
        return colors.textSecondary;
      case 'hadith':
        return isDark ? '#f8fafc' : '#1e293b';
      case 'dua':
        return isDark ? '#f1f5f9' : '#0f172a';
      default:
        return colors.text;
    }
  };

  const textStyle = [
    getVariantStyles(),
    {
      color: getTextColor(),
      textAlign: center ? 'center' as const : right ? 'right' as const : undefined,
      fontStyle: italic ? 'italic' as const : 'normal' as const,
      fontWeight: bold ? '700' as const : undefined,
      textShadowColor: shadow ? (isDark ? '#000' : '#fff') : undefined,
      textShadowOffset: shadow ? { width: 1, height: 1 } : undefined,
      textShadowRadius: shadow ? 2 : undefined,
    },
    glow && styles.glow,
    style,
  ];

          if (gradient) {
            return (
              <LinearGradient
                colors={gradient as [string, string, ...string[]]}
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

// Specialized Islamic text components
export function Bismillah({ style, ...props }: Omit<IslamicTextProps, 'variant' | 'children'>) {
  return (
    <IslamicText
      variant="bismillah"
      style={style}
      {...props}
    >
      بِسْمِ اللهِ الرّحمن الرّحيم
    </IslamicText>
  );
}

export function Ayat({ 
  children, 
  translation, 
  style, 
  ...props 
}: IslamicTextProps & { translation?: string }) {
  return (
    <View style={styles.ayatContainer}>
      <IslamicText variant="ayat" style={style} {...props}>
        {children}
      </IslamicText>
      {translation && (
        <IslamicText variant="translation" style={styles.translation}>
          {translation}
        </IslamicText>
      )}
    </View>
  );
}

export function Hadith({ 
  children, 
  narrator, 
  style, 
  ...props 
}: IslamicTextProps & { narrator?: string }) {
  return (
    <View style={styles.hadithContainer}>
      <IslamicText variant="hadith" style={style} {...props}>
        {children}
      </IslamicText>
      {narrator && (
        <IslamicText variant="caption" style={styles.narrator}>
          — {narrator}
        </IslamicText>
      )}
    </View>
  );
}

export function Dua({ 
  children, 
  translation, 
  style, 
  ...props 
}: IslamicTextProps & { translation?: string }) {
  return (
    <View style={styles.duaContainer}>
      <IslamicText variant="dua" style={style} {...props}>
        {children}
      </IslamicText>
      {translation && (
        <IslamicText variant="translation" style={styles.translation}>
          {translation}
        </IslamicText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  glow: {
    textShadowColor: '#fcd34d',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  ayatContainer: {
    marginVertical: 8,
  },
  hadithContainer: {
    marginVertical: 8,
  },
  duaContainer: {
    marginVertical: 8,
  },
  translation: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  narrator: {
    marginTop: 4,
    fontStyle: 'italic',
    opacity: 0.8,
  },
});
