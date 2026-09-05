import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../theme';

interface SwastikLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const LOGO = require('../../assets/logo.png');

const SIZES = {
  sm: { width: 140, height: 90 },
  md: { width: 180, height: 115 },
  lg: { width: 220, height: 140 },
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
          Bakery · Dairy · Sweets · Confectionery
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
    marginTop: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
