import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadow } from '../theme';

interface ProductCardProps {
  product: Product;
  style?: ViewStyle;
}

export function ProductCard({ product, style }: ProductCardProps) {
  const { items, addItem, increaseQty, decreaseQty } = useCartStore();
  const cartItem = items.find((i) => i.productId === product.id);
  const quantity = cartItem?.quantity ?? 0;

  const hasDiscount =
    product.discount_price !== null &&
    parseFloat(product.discount_price) < parseFloat(product.price);

  const displayPrice = hasDiscount ? product.discount_price! : product.price;

  const handleAdd = () => {
    if (product.is_available) addItem(product);
  };

  return (
    <View style={[styles.card, style]}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            accessibilityLabel={product.name}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="bag-handle-outline" size={36} color={Colors.gray400} />
          </View>
        )}

        {/* Favorite/Heart Icon */}
        <View style={styles.heartBtn}>
          <Ionicons name="heart-outline" size={16} color={Colors.gray600} />
        </View>

        {!product.is_available && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.unit}>{product.unit}</Text>

        {/* Price & Add Row */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.price}>₹{parseFloat(displayPrice).toFixed(0)}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                ₹{parseFloat(product.price).toFixed(0)}
              </Text>
            )}
          </View>

          {/* Add / Quantity Control */}
          {product.is_available ? (
            quantity > 0 ? (
              <View style={styles.qtyControl}>
                <TouchableOpacity
                  onPress={() => decreaseQty(product.id)}
                  style={styles.qtyBtn}
                  accessibilityLabel="Decrease quantity"
                >
                  <Ionicons name="remove" size={13} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => increaseQty(product.id)}
                  style={styles.qtyBtn}
                  accessibilityLabel="Increase quantity"
                >
                  <Ionicons name="add" size={13} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleAdd}
                style={styles.addBtn}
                accessibilityLabel={`Add ${product.name} to cart`}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.addBtnDisabled}>
              <Text style={styles.addBtnDisabledText}>N/A</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.05,
    backgroundColor: '#F9F9F9',
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
    backgroundColor: '#F7F7F7',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  info: {
    padding: Spacing.sm,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
    lineHeight: 18,
  },
  unit: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  originalPrice: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: Colors.magenta,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    minWidth: 54,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
  },
  addBtnDisabled: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  addBtnDisabledText: {
    color: Colors.textDisabled,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.magenta,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    paddingHorizontal: 4,
    minWidth: 16,
    textAlign: 'center',
  },
});
