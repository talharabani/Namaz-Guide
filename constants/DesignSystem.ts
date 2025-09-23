/**
 * Comprehensive Design System for Namaz Mobile App
 * Professional, scalable design system with Islamic aesthetics
 */

export const IslamicColors = {
  // Primary Islamic Colors
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981', // Main primary
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#8b5cf6', // Main secondary
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main accent
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },
};

export const IslamicTypography = {
  // Arabic Font Sizes
  arabic: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  // English Font Sizes
  english: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 40,
  },
  // Font Weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

export const Spacing = {
  px: 1,
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const Breakpoints = {
  xs: 0,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const ZIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

export const AnimationDurations = {
  fastest: 100,
  faster: 150,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
};

export const AnimationEasing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  // Custom easing functions
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

// Islamic Calligraphy Styles
export const CalligraphyStyles = {
  // Bismillah styles
  bismillah: {
    fontSize: IslamicTypography.arabic['4xl'],
    fontWeight: IslamicTypography.weights.normal,
    textAlign: 'center' as const,
    lineHeight: IslamicTypography.lineHeights.loose,
    color: IslamicColors.accent[400],
    textShadowColor: IslamicColors.accent[300],
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  // Ayat styles
  ayat: {
    fontSize: IslamicTypography.arabic.lg,
    fontWeight: IslamicTypography.weights.normal,
    textAlign: 'right' as const,
    lineHeight: IslamicTypography.lineHeights.loose,
    color: IslamicColors.primary[600],
  },
  // Translation styles
  translation: {
    fontSize: IslamicTypography.english.base,
    fontWeight: IslamicTypography.weights.normal,
    textAlign: 'left' as const,
    lineHeight: IslamicTypography.lineHeights.normal,
    color: IslamicColors.primary[700],
    fontStyle: 'italic' as const,
  },
};

// Prayer Time Colors
export const PrayerColors = {
  fajr: {
    primary: '#1e40af', // Blue
    secondary: '#3b82f6',
    gradient: ['#1e40af', '#3b82f6'],
  },
  dhuhr: {
    primary: '#059669', // Green
    secondary: '#10b981',
    gradient: ['#059669', '#10b981'],
  },
  asr: {
    primary: '#dc2626', // Red
    secondary: '#ef4444',
    gradient: ['#dc2626', '#ef4444'],
  },
  maghrib: {
    primary: '#7c2d12', // Orange
    secondary: '#ea580c',
    gradient: ['#7c2d12', '#ea580c'],
  },
  isha: {
    primary: '#581c87', // Purple
    secondary: '#8b5cf6',
    gradient: ['#581c87', '#8b5cf6'],
  },
};

// Feature-specific colors
export const FeatureColors = {
  home: IslamicColors.primary[500],
  prayer: IslamicColors.secondary[500],
  qibla: '#06b6d4',
  duas: IslamicColors.accent[500],
  learn: '#22c55e',
  quiz: '#ec4899',
  progress: '#3b82f6',
  ai: '#a855f7',
  mistakes: '#f97316',
  settings: '#6b7280',
};

// Gradient definitions
export const Gradients = {
  primary: ['#10b981', '#059669'],
  secondary: ['#8b5cf6', '#7c3aed'],
  accent: ['#f59e0b', '#d97706'],
  sunset: ['#f97316', '#ea580c', '#dc2626'],
  ocean: ['#06b6d4', '#0891b2', '#0e7490'],
  forest: ['#22c55e', '#16a34a', '#15803d'],
  royal: ['#8b5cf6', '#7c3aed', '#6d28d9'],
  warm: ['#f59e0b', '#f97316', '#ea580c'],
  cool: ['#3b82f6', '#2563eb', '#1d4ed8'],
  neutral: ['#6b7280', '#4b5563', '#374151'],
};

// Dark theme colors
export const DarkTheme = {
  background: '#0f172a',
  surface: '#1e293b',
  surfaceVariant: '#334155',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  border: '#334155',
  borderLight: '#475569',
  divider: '#1e293b',
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.8)',
  primary: '#10b981',
  primaryLight: '#34d399',
  primaryDark: '#059669',
};

// Light theme colors
export const LightTheme = {
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceVariant: '#f1f5f9',
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#cbd5e1',
  divider: '#f1f5f9',
  overlay: 'rgba(0, 0, 0, 0.1)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
  primary: '#10b981',
  primaryLight: '#34d399',
  primaryDark: '#059669',
};

export default {
  colors: IslamicColors,
  typography: IslamicTypography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  breakpoints: Breakpoints,
  zIndex: ZIndex,
  animations: {
    durations: AnimationDurations,
    easing: AnimationEasing,
  },
  calligraphy: CalligraphyStyles,
  prayerColors: PrayerColors,
  featureColors: FeatureColors,
  gradients: Gradients,
  themes: {
    dark: DarkTheme,
    light: LightTheme,
  },
};
