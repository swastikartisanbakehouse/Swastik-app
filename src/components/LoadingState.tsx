import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors, FontSize, Spacing } from '../theme';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.magenta} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

// Skeleton card placeholder
export function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonInfo}>
        <View style={[styles.skeletonLine, { width: '70%' }]} />
        <View style={[styles.skeletonLine, { width: '40%', marginTop: 4 }]} />
        <View style={[styles.skeletonLine, { width: '50%', marginTop: 8 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  message: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  skeletonCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skeletonImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.gray200,
  },
  skeletonInfo: {
    padding: Spacing.sm,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: Colors.gray200,
    borderRadius: 6,
  },
});
