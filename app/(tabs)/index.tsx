import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useCategories } from '../../src/hooks/useCategories';
import { useProducts, useProductSearch } from '../../src/hooks/useProducts';
import { useCartStore } from '../../src/store/cartStore';
import { CategoryCard } from '../../src/components/CategoryCard';
import { CompactProductCard } from '../../src/components/CompactProductCard';
import { ProductCard } from '../../src/components/ProductCard';
import { SearchBar } from '../../src/components/SearchBar';
import { SkeletonCard } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { EmptyState } from '../../src/components/EmptyState';
import { Product } from '../../src/types/product';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../src/theme';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const {
    data: categories,
    isLoading: catLoading,
    isError: catError,
    refetch: refetchCats,
  } = useCategories();

  const {
    data: products,
    isLoading: prodLoading,
    isError: prodError,
    refetch: refetchProds,
  } = useProducts();

  const {
    data: searchResults,
    isLoading: searchLoading,
    isError: searchError,
  } = useProductSearch(searchQuery);

  const isSearching = searchQuery.trim().length > 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCats(), refetchProds()]);
    setRefreshing(false);
  }, [refetchCats, refetchProds]);

  const displayProducts: Product[] = isSearching
    ? (searchResults ?? [])
    : (products ?? []);

  // Filter special offers (products with discount)
  const discountedProducts = (products ?? []).filter(
    (p) => p.discount_price && parseFloat(p.discount_price) < parseFloat(p.price)
  );

  const renderProductSkeleton = () => (
    <View style={styles.productSkeletonGrid}>
      {[1, 2, 3, 4].map((k) => (
        <View key={k} style={styles.productGridItem}>
          <SkeletonCard />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.maroon}
            colors={[Colors.maroon]}
          />
        }
      >
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          {/* Location Delivery Selector */}
          <TouchableOpacity
            style={styles.locationSelector}
            activeOpacity={0.8}
            accessibilityLabel="Change delivery location"
          >
            <Ionicons name="location-sharp" size={18} color={Colors.maroon} style={styles.pinIcon} />
            <View>
              <Text style={styles.deliverToText}>Deliver to</Text>
              <View style={styles.addressRow}>
                <Text style={styles.addressText} numberOfLines={1}>
                  {user?.addresses?.[0]?.type
                    ? `${user.addresses[0].type} - ${user.addresses[0].pincode}`
                    : 'Home - 110001'}
                </Text>
                <Ionicons name="chevron-down" size={14} color={Colors.textPrimary} style={{ marginLeft: 3 }} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Header Actions */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => router.push('/(tabs)/cart')}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarCircle}
              onPress={() => router.push('/(tabs)/profile')}
              accessibilityLabel="Profile"
            >
              <Ionicons name="person" size={18} color={Colors.maroon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search cakes, milk, sweets..."
          />
        </View>

        {/* Search Results Screen Mode */}
        {isSearching ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {searchLoading ? 'Searching...' : `Results for "${searchQuery}"`}
            </Text>
            {searchLoading ? (
              renderProductSkeleton()
            ) : searchError ? (
              <ErrorState message="Search failed. Please try again." />
            ) : displayProducts.length === 0 ? (
              <EmptyState
                title="No results found"
                message={`No products match "${searchQuery}"`}
                icon="search-outline"
              />
            ) : (
              <View style={styles.productGrid}>
                {displayProducts.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.productGridItem}
                    onPress={() => router.push(`/product/${p.id}`)}
                    activeOpacity={0.9}
                  >
                    <ProductCard product={p} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Promotional Banner Card */}
            <View style={styles.bannerContainer}>
              <View style={styles.bannerCard}>
                <View style={styles.bannerContent}>
                  <View style={styles.festiveBadge}>
                    <Text style={styles.festiveBadgeText}>FESTIVE OFFER</Text>
                  </View>
                  <Text style={styles.bannerTitle}>Flat 20% OFF{'\n'}on Sweet Boxes</Text>
                  <TouchableOpacity
                    style={styles.shopNowBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      const sweetsCat = categories?.find((c) => c.sector === 'SWEETS');
                      if (sweetsCat) router.push(`/category/${sweetsCat.id}`);
                    }}
                  >
                    <Text style={styles.shopNowText}>SHOP NOW</Text>
                  </TouchableOpacity>
                </View>

                {/* Right Illustration/Image */}
                <View style={styles.bannerIllustration}>
                  <View style={styles.bannerArtBox}>
                    <Ionicons name="gift" size={56} color="#FFE0B2" />
                    <View style={styles.bannerSubArt}>
                      <Ionicons name="sparkles" size={20} color="#FFF8E1" />
                    </View>
                  </View>
                </View>
              </View>

              {/* Banner Pagination Dots */}
              <View style={styles.paginationDots}>
                {[0, 1, 2, 3].map((idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setActiveBannerIndex(idx)}
                    style={[
                      styles.dot,
                      activeBannerIndex === idx ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Shop by Category Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Shop by Category</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (categories?.[0]) router.push(`/category/${categories[0].id}`);
                  }}
                >
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>

              {catLoading ? (
                <View style={styles.categorySkeleton}>
                  {[1, 2, 3, 4].map((k) => (
                    <View key={k} style={styles.categorySkeletonItem} />
                  ))}
                </View>
              ) : catError ? (
                <ErrorState message="Could not load categories." onRetry={refetchCats} />
              ) : !categories?.length ? (
                <EmptyState title="No categories available" icon="grid-outline" />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryList}
                >
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      onPress={() => router.push(`/category/${cat.id}`)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Popular Products Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Products</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (categories?.[0]) router.push(`/category/${categories[0].id}`);
                  }}
                >
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>

              {prodLoading ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
                  {[1, 2, 3, 4].map((k) => (
                    <View key={k} style={styles.popularSkeletonItem} />
                  ))}
                </ScrollView>
              ) : prodError ? (
                <ErrorState message="Could not load products." onRetry={refetchProds} />
              ) : !products?.length ? (
                <EmptyState title="No products yet" message="Check back soon!" icon="bag-outline" />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.popularScroll}
                >
                  {products.map((p) => (
                    <CompactProductCard
                      key={p.id}
                      product={p}
                      onPress={() => router.push(`/product/${p.id}`)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Special Offers Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Special Offers</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (categories?.[0]) router.push(`/category/${categories[0].id}`);
                  }}
                >
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>

              {prodLoading ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
                  {[1, 2, 3, 4].map((k) => (
                    <View key={k} style={styles.popularSkeletonItem} />
                  ))}
                </ScrollView>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.popularScroll}
                >
                  {(discountedProducts.length > 0 ? discountedProducts : products ?? []).map((p) => (
                    <CompactProductCard
                      key={`offer-${p.id}`}
                      product={p}
                      onPress={() => router.push(`/product/${p.id}`)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.bottomPad} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
  },
  pinIcon: {
    marginRight: 6,
  },
  deliverToText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFB300',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.maroonSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.maroonLight,
  },
  searchSection: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  bannerContainer: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  bannerCard: {
    backgroundColor: Colors.maroonDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
    overflow: 'hidden',
    ...Shadow.md,
  },
  bannerContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  festiveBadge: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  festiveBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#FFE0B2',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  shopNowBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  shopNowText: {
    color: Colors.maroonDark,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  bannerIllustration: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerArtBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerSubArt: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 5,
  },
  dot: {
    height: 5,
    borderRadius: 3,
  },
  activeDot: {
    width: 14,
    backgroundColor: Colors.maroon,
  },
  inactiveDot: {
    width: 5,
    backgroundColor: Colors.gray300,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  categoryList: {
    paddingHorizontal: Spacing.base,
  },
  categorySkeleton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  categorySkeletonItem: {
    width: 74,
    height: 74,
    borderRadius: 18,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.md,
  },
  popularScroll: {
    paddingHorizontal: Spacing.base,
  },
  popularSkeletonItem: {
    width: 104,
    height: 140,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  productGridItem: {
    width: '47.5%',
  },
  productSkeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  bottomPad: {
    height: Spacing['2xl'],
  },
});
