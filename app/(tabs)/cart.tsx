import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../src/store/cartStore';
import { EmptyState } from '../../src/components/EmptyState';
import {
  Colors,
  FontSize,
  FontWeight,
  BorderRadius,
  Spacing,
  Shadow,
} from '../../src/theme';

export default function CartScreen() {
  const { items, increaseQty, decreaseQty, removeItem, clearCart, subtotal } =
    useCartStore();
  const total = subtotal();

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} accessibilityLabel="Clear cart">
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <EmptyState
            icon="bag-outline"
            title="Your cart is empty"
            message="Add items from the Home or Category screens to start shopping."
          />
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(tabs)')}
            accessibilityLabel="Continue shopping"
          >
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {items.map((item) => (
              <View key={item.productId} style={styles.cartItem}>
                {/* Thumbnail */}
                <View style={styles.thumbnail}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.thumbImage}
                      resizeMode="cover"
                      accessibilityLabel={item.name}
                    />
                  ) : (
                    <View style={styles.thumbPlaceholder}>
                      <Ionicons name="bag-outline" size={24} color={Colors.gray400} />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemUnit}>{item.unit}</Text>
                  <Text style={styles.itemPrice}>
                    ₹{parseFloat(item.price).toFixed(0)}
                    {item.price !== item.originalPrice && (
                      <Text style={styles.itemOriginalPrice}>
                        {' '}₹{parseFloat(item.originalPrice).toFixed(0)}
                      </Text>
                    )}
                  </Text>
                </View>

                {/* Quantity + Remove */}
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => removeItem(item.productId)}
                    style={styles.removeBtn}
                    accessibilityLabel={`Remove ${item.name}`}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.gray400} />
                  </TouchableOpacity>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity
                      onPress={() => decreaseQty(item.productId)}
                      style={styles.qtyBtn}
                      accessibilityLabel="Decrease quantity"
                    >
                      <Ionicons name="remove" size={14} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => increaseQty(item.productId)}
                      style={styles.qtyBtn}
                      accessibilityLabel="Increase quantity"
                    >
                      <Ionicons name="add" size={14} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Bottom Spacer for summary */}
            <View style={{ height: 160 }} />
          </ScrollView>

          {/* Summary Footer */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </Text>
              <Text style={styles.summaryValue}>₹{total.toFixed(0)}</Text>
            </View>

            <View style={styles.prototypeBanner}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.prototypeText}>
                {' '}Phase 1 prototype · Checkout coming soon
              </Text>
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => router.push('/(tabs)')}
              accessibilityLabel="Continue shopping"
            >
              <Ionicons name="arrow-back-outline" size={18} color={Colors.magenta} style={{ marginRight: 6 }} />
              <Text style={styles.continueBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  shopBtn: {
    backgroundColor: Colors.magenta,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  shopBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.gray100,
    marginRight: Spacing.md,
    flexShrink: 0,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  itemUnit: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  itemOriginalPrice: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    fontWeight: FontWeight.regular,
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  removeBtn: {
    padding: 4,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.magenta,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  qtyBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  summaryValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  prototypeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  prototypeText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.magenta,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  continueBtnText: {
    color: Colors.magenta,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
  },
});
