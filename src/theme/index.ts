// Swastik Design System — Theme Tokens
// White + Maroon minimal premium theme

export const Colors = {
  // Brand (Maroon #650000)
  primary: '#650000',
  primaryDark: '#4A0000',
  primaryLight: '#E8B3B3',
  primarySubtle: '#FDF0F0',

  maroon: '#650000',
  maroonDark: '#4A0000',
  maroonLight: '#E8B3B3',
  maroonSubtle: '#FDF0F0',

  // Backward compatibility aliases
  magenta: '#650000',
  magentaDark: '#4A0000',
  magentaLight: '#E8B3B3',
  magentaSubtle: '#FDF0F0',

  // Backgrounds
  background: '#FFFFFF',
  backgroundAlt: '#FAFAFA',
  backgroundMuted: '#F5F5F5',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textMuted: '#9E9E9E',
  textDisabled: '#BDBDBD',
  textInverse: '#FFFFFF',

  // UI Elements
  border: '#EEEEEE',
  borderFocus: '#650000',
  divider: '#F0F0F0',

  // States
  error: '#D32F2F',
  errorLight: '#FFEBEE',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#F57F17',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#555555',
  gray800: '#333333',
  gray900: '#1A1A1A',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 22,
  '2xl': 26,
  '3xl': 32,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
