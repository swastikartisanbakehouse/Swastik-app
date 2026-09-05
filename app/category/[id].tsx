import React, { useState, useMemo, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCategory, useCategoryProducts } from '../../src/hooks/useCategories';
import { ProductCard } from '../../src/components/ProductCard';
import { SkeletonCard } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { EmptyState } from '../../src/components/EmptyState';
import { useCartStore } from '../../src/store/cartStore';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
} from '../../src/theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = parseInt(id ?? '0', 10);
  const navigation = useNavigation();
  const totalItems = useCartStore((s) => s.totalItems());

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');

  const {
    data: category,
    isLoading: catLoading,
  } = useCategory(categoryId);

  const {
    data: products,
    isLoading: prodLoading,
    isError: prodError,
    refetch,
  } = useCategoryProducts(categoryId);

  // Set navigation header with search and cart icons
  useLayoutEffect(() => {
    navigation.setOptions({
      title: category?.name ?? '',
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/(tabs)')}
            accessibilityLabel="Search"
          >
            <Ionicons name="search-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/(tabs)/cart')}
            accessibilityLabel="View Cart"
          >
            <Ionicons name="bag-outline" size={22} color={Colors.textPrimary} />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [category, navigation, totalItems]);

  // Extract subcategories
  const subcategories = useMemo(() => {
    const subs = new Set<string>();
    subs.add('All');
    if (category?.metadata && Array.isArray((category.metadata as any).popular_subcategories)) {
      (category.metadata as any).popular_subcategories.forEach((s: string) => subs.add(s));
    }
    products?.forEach((p) => {
      if (p.subcategory_name) subs.add(p.subcategory_name);
    });
    return Array.from(subs);
  }, [category, products]);

  // Filter products by selected subcategory
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedSubcategory === 'All') return products;
    return products.filter(
      (p) =>
        p.subcategory_name?.toLowerCase() === selectedSubcategory.toLowerCase() ||
        p.tags?.some((t) => t.toLowerCase() === selectedSubcategory.toLowerCase())
    );
  }, [products, selectedSubcategory]);

  const isLoading = catLoading || prodLoading;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Subcategories Filter Bar */}
      {subcategories.length > 1 && (
        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {subcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub;
              return (
                <TouchableOpacity
                  key={sub}
                  style={[
                    styles.filterChip,
                    isSelected ? styles.filterChipActive : styles.filterChipInactive,
                  ]}
                  onPress={() => setSelectedSubcategory(sub)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected ? styles.filterChipTextActive : styles.filterChipTextInactive,
                    ]}
                  >
                    {sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Products Grid */}
        {isLoading ? (
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <View key={k} style={styles.gridItem}>
                <SkeletonCard />
              </View>
            ))}
          </View>
        ) : prodError ? (
          <ErrorState
            message="Could not load products. Please try again."
            onRetry={refetch}
          />
        ) : !filteredProducts?.length ? (
          <EmptyState
            title="No products available"
            message={`No items found in ${selectedSubcategory === 'All' ? 'this category' : selectedSubcategory}.`}
            icon="bag-outline"
          />
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.gridItem}
                onPress={() => router.push(`/product/${p.id}`)}
                activeOpacity={0.9}
              >
                <ProductCard product={p} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginRight: Spacing.xs,
  },
  headerIconBtn: {
    position: 'relative',
    padding: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: Colors.magenta,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: FontWeight.bold,
  },
  filterBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: 7,
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.xs,
  },
  filterChipActive: {
    backgroundColor: Colors.magenta,
  },
  filterChipInactive: {
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipText: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.medium,
  },
  filterChipTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.semiBold,
  },
  filterChipTextInactive: {
    color: Colors.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    width: '47.5%',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
