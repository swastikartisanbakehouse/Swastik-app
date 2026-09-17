import React from 'react';
import { View, Image, Text, StyleSheet, Platform } from 'react-native';
import { Colors, FontSize, Spacing } from '../theme';

interface SwastikLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

const LOGO = require('../../assets/logo.png');

// Image native dimensions: 1496 x 1051 (aspect ratio ~1.423)
const SIZES = {
  sm: { width: 140, height: 98 },
  md: { width: 185, height: 130 },
  lg: { width: 215, height: 151 },
  xl: { width: 250, height: 176 },
};

export function SwastikLogo({ size = 'md', showTagline = true }: SwastikLogoProps) {
  const dims = SIZES[size];

  return (
    <View style={styles.wrapper}>
      <Image
        source={LOGO}
        style={{ width: dims.width, height: dims.height }}
        resizeMode="contain"
        accessibilityLabel="Swastik logo"
      />
      {showTagline && (
        <Text style={styles.tagline}>
          Bakery • Dairy • Sweets • Confectionery
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.maroon,
    letterSpacing: 0.3,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontWeight: '500',
  },
});
