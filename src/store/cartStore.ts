import { create } from 'zustand';
import { CartItem, Product } from '../types/product';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  increaseQty: (productId: number) => void;
  decreaseQty: (productId: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

function getEffectivePrice(product: Product): string {
  return product.discount_price ?? product.price;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      });
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: getEffectivePrice(product),
        originalPrice: product.price,
        unit: product.unit,
        image: product.image,
        quantity: 1,
        is_available: product.is_available,
      };
      set({ items: [...items, newItem] });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.productId !== productId) });
  },

  increaseQty: (productId) => {
    set({
      items: get().items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    });
  },

  decreaseQty: (productId) => {
    const items = get().items;
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    if (item.quantity <= 1) {
      set({ items: items.filter((i) => i.productId !== productId) });
    } else {
      set({
        items: items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      });
    }
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0),
}));
