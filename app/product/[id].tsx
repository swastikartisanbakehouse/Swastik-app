import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { useProduct } from '../../src/hooks/useProduct';
import { useCartStore } from '../../src/store/cartStore';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import {
  Colors,
  FontSize,
  FontWeight,
  BorderRadius,
  Spacing,
  Shadow,
} from '../../src/theme';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id ?? '0', 10);
  const navigation = useNavigation();

  const { data: product, isLoading, isError, refetch } = useProduct(productId);
  const { items, addItem, increaseQty, decreaseQty } = useCartStore();
  const cartItem = items.find((i) => i.productId === productId);
  const quantity = cartItem?.quantity ?? 0;

  useLayoutEffect(() => {
    if (product?.name) {
      navigation.setOptions({ title: product.name });
    }
  }, [product, navigation]);

  if (isLoading) {
    return <LoadingState message="Loading product..." />;
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState
          message="Could not load product details."
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const hasDiscount =
    product.discount_price !== null &&
    parseFloat(product.discount_price) < parseFloat(product.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((parseFloat(product.price) - parseFloat(product.discount_price!)) /
          parseFloat(product.price)) *
          100,
      )
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={product.name}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="bag-outline" size={72} color={Colors.gray300} />
              <Text style={styles.imagePlaceholderText}>No image available</Text>
            </View>
          )}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{discountPercent}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Category / Subcategory tag */}
          {(product.category_detail || product.subcategory_name) && (
            <View style={styles.tagRow}>
              {product.category_detail && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{product.category_detail.name}</Text>
                </View>
              )}
              {product.subcategory_name && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{product.subcategory_name}</Text>
                </View>
              )}
            </View>
          )}

          {/* Name */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Brand + Unit */}
          <View style={styles.metaRow}>
            {product.brand && (
              <Text style={styles.brand}>{product.brand}</Text>
            )}
            <View style={styles.unitBadge}>
              <Text style={styles.unit}>{product.unit}</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceBlock}>
            {hasDiscount ? (
              <View style={styles.priceRow}>
                <Text style={styles.discountedPrice}>
                  ₹{parseFloat(product.discount_price!).toFixed(0)}
                </Text>
                <Text style={styles.originalPrice}>
                  ₹{parseFloat(product.price).toFixed(0)}
                </Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>
                    Save ₹{(parseFloat(product.price) - parseFloat(product.discount_price!)).toFixed(0)}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.price}>₹{parseFloat(product.price).toFixed(0)}</Text>
            )}
          </View>

          {/* Availability */}
          <View style={styles.availabilityRow}>
            <View
              style={[
                styles.availabilityDot,
                { backgroundColor: product.is_available ? Colors.success : Colors.error },
              ]}
            />
            <Text
              style={[
                styles.availabilityText,
                { color: product.is_available ? Colors.success : Colors.error },
              ]}
            >
              {product.is_available ? 'In Stock' : 'Currently Unavailable'}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          {product.description && (
            <View style={styles.descSection}>
              <Text style={styles.descLabel}>About this product</Text>
              <Text style={styles.desc}>{product.description}</Text>
            </View>
          )}

          {/* SKU */}
          <Text style={styles.sku}>SKU: {product.sku}</Text>
        </View>
      </ScrollView>

      {/* Add to Cart Footer */}
      <View style={styles.footer}>
        {product.is_available ? (
          quantity > 0 ? (
            <View style={styles.qtyFooter}>
              <TouchableOpacity
                onPress={() => decreaseQty(product.id)}
                style={styles.qtyBtn}
                accessibilityLabel="Decrease quantity"
              >
                <Ionicons name="remove" size={20} color={Colors.magenta} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity} in cart</Text>
              <TouchableOpacity
                onPress={() => increaseQty(product.id)}
                style={styles.qtyBtn}
                accessibilityLabel="Increase quantity"
              >
                <Ionicons name="add" size={20} color={Colors.magenta} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={() => addItem(product)}
              accessibilityLabel="Add to cart"
            >
              <Ionicons name="bag-add-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          )
        ) : (
          <View style={styles.unavailableBtn}>
            <Text style={styles.unavailableText}>Currently Unavailable</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: Colors.gray100,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
  },
  imagePlaceholderText: {
    marginTop: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.magenta,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  discountBadgeText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  content: {
    padding: Spacing.base,
    paddingBottom: 100,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.magentaSubtle,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: FontSize.xs,
    color: Colors.magenta,
    fontWeight: FontWeight.medium,
  },
  name: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  brand: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  unitBadge: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  unit: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  priceBlock: {
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  discountedPrice: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  originalPrice: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  savingsText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: FontWeight.semiBold,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.base,
  },
  descSection: {
    marginBottom: Spacing.base,
  },
  descLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  desc: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  sku: {
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    marginTop: Spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.base,
    ...Shadow.lg,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.magenta,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
  },
  addToCartText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
  },
  unavailableBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
  },
  unavailableText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  qtyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.magenta,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.magentaSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
});
