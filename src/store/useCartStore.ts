import { create } from 'zustand';
import { useGamificationStore } from './useGamificationStore';

export interface CartItem {
  perfumeId: string;
  name: string;
  size: number | string;
  price: number;
  sku: string;
  quantity: number;
  purchaseType?: 'new' | 'refill';
}

interface CartNotification {
  message: string;
  itemName: string;
  visible: boolean;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  notification: CartNotification;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, delta: number) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalPrice: () => number;
  totalItems: () => number;
  showNotification: (itemName: string) => void;
  hideNotification: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  notification: { message: '', itemName: '', visible: false },

  addItem: (item) => {
    const finalPrice = item.purchaseType === 'refill' ? Math.floor(item.price * 0.8) : item.price;
    const finalSku = `${item.sku}-${item.purchaseType || 'new'}`;

    // Award 10% of final price as Aura Points for gamification
    useGamificationStore.getState().addPoints(Math.floor(finalPrice * 0.1));

    set((state) => {
      const existing = state.items.find(i => i.sku === finalSku);
      if (existing) {
        return { items: state.items.map(i => i.sku === finalSku ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...state.items, { ...item, price: finalPrice, sku: finalSku, quantity: 1 }] };
    });

    // Show floating notification
    get().showNotification(item.name + (item.purchaseType === 'refill' ? ' (Refill)' : ''));
  },

  removeItem: (sku) => set((state) => ({
    items: state.items.filter(i => i.sku !== sku),
  })),

  updateQuantity: (sku, delta) => set((state) => {
    const item = state.items.find(i => i.sku === sku);
    if (!item) return state;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      return { items: state.items.filter(i => i.sku !== sku) };
    }
    return { items: state.items.map(i => i.sku === sku ? { ...i, quantity: newQty } : i) };
  }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setCartOpen: (open) => set({ isOpen: open }),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  showNotification: (itemName) => {
    set({ notification: { message: 'Added to cart', itemName, visible: true } });
    setTimeout(() => {
      get().hideNotification();
    }, 2500);
  },

  hideNotification: () => set((state) => ({
    notification: { ...state.notification, visible: false },
  })),
}));
