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

interface CompactProductCardProps {
  product: Product;
  onPress?: () => void;
  style?: ViewStyle;
}

export function CompactProductCard({ product, onPress, style }: CompactProductCardProps) {
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
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={`View ${product.name}`}
    >
      {/* Image Container */}
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
            <Ionicons name="bag-handle-outline" size={28} color={Colors.gray400} />
          </View>
        )}
        {hasDiscount && (
          <View style={styles.discountTag}>
            <Text style={styles.discountTagText}>
              {Math.round(
                ((parseFloat(product.price) - parseFloat(product.discount_price!)) /
                  parseFloat(product.price)) *
                  100,
              )}
              % OFF
            </Text>
          </View>
        )}
        {!product.is_available && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Sold out</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>₹{parseFloat(displayPrice).toFixed(0)}</Text>

        {/* Add Button / Quantity Control */}
        {product.is_available ? (
          quantity > 0 ? (
            <View style={styles.qtyControl}>
              <TouchableOpacity
                onPress={() => decreaseQty(product.id)}
                style={styles.qtyBtn}
                accessibilityLabel="Decrease quantity"
              >
                <Ionicons name="remove" size={12} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => increaseQty(product.id)}
                style={styles.qtyBtn}
                accessibilityLabel="Increase quantity"
              >
                <Ionicons name="add" size={12} color={Colors.white} />
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
          <View style={styles.disabledBtn}>
            <Text style={styles.disabledBtnText}>N/A</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 104,
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
  },
  imageContainer: {
    width: 104,
    height: 104,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F7F7F7',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: Colors.magenta,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  discountTagText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: FontWeight.bold,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  info: {
    paddingTop: 6,
  },
  name: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  price: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  addBtn: {
    backgroundColor: Colors.magenta,
    borderRadius: BorderRadius.sm,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
  },
  disabledBtn: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtnText: {
    color: Colors.textDisabled,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.magenta,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  qtyBtn: {
    padding: 3,
  },
  qtyText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    minWidth: 16,
    textAlign: 'center',
  },
});
