import { create } from 'zustand';
import api from '@/lib/api';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/cart');
      set({
        items: data.items,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    await api.post('/cart/items', { product_id: productId, quantity });
    await get().fetchCart();
  },

  updateQuantity: async (productId, quantity) => {
    await api.put(`/cart/items/${productId}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (productId) => {
    await api.delete(`/cart/items/${productId}`);
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [] });
  },

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
