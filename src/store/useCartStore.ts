import { create } from 'zustand';

interface CartItem {
  perfumeId: string;
  name: string;
  size: number | string;
  price: number;
  sku: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (sku: string) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.sku === item.sku);
    if (existing) {
      return { items: state.items.map(i => i.sku === item.sku ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (sku) => set((state) => ({
    items: state.items.filter(i => i.sku !== sku),
  })),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setCartOpen: (open) => set({ isOpen: open }),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
