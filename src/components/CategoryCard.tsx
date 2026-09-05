import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types/category';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadow } from '../theme';

const SECTOR_CONFIG: Record<string, { icon: string; bg: string; iconColor: string }> = {
  BAKERY: { icon: 'cafe', bg: '#F8EFE4', iconColor: '#A06B36' },
  DAIRY: { icon: 'water', bg: '#EAF3FA', iconColor: '#3686C8' },
  SWEETS: { icon: 'nutrition', bg: '#FDF0DF', iconColor: '#D88A27' },
  CONFECTIONERY: { icon: 'gift', bg: '#F5E6EC', iconColor: Colors.magenta },
};

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const config = SECTOR_CONFIG[category.sector] ?? {
    icon: 'grid',
    bg: '#F5F5F5',
    iconColor: Colors.magenta,
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`Browse ${category.name}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
        {category.image ? (
          <Image
            source={{ uri: category.image }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={category.name}
          />
        ) : (
          <Ionicons
            name={config.icon as any}
            size={34}
            color={config.iconColor}
          />
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 78,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  iconContainer: {
    width: 74,
    height: 74,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...Shadow.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
