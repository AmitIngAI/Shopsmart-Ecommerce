// src/store/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],
      cartOpen: false,
      
      // Wishlist State
      wishlist: [],
      
      // User State
      user: null,
      isAuthenticated: false,

      // Orders State (NEW)
      orders: [],

      // Addresses State (NEW)
      addresses: [
        {
          id: 1,
          type: 'Home',
          name: 'John Doe',
          address: '123, Green Valley Apartments, Sector 45',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '9876543210',
          isDefault: true
        }
      ],

      // Cart Actions
      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter(item => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set({
          cart: get().cart.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => set({ cart: [] }),

      toggleCart: () => set({ cartOpen: !get().cartOpen }),

      getCartTotal: () => {
        return get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Wishlist Actions
      addToWishlist: (product) => {
        const wishlist = get().wishlist;
        if (!wishlist.find(item => item.id === product.id)) {
          set({ wishlist: [...wishlist, product] });
        }
      },

      removeFromWishlist: (id) => {
        set({ wishlist: get().wishlist.filter(item => item.id !== id) });
      },

      isInWishlist: (id) => {
        return get().wishlist.some(item => item.id === id);
      },

      moveToCart: (product) => {
        get().addToCart(product);
        get().removeFromWishlist(product.id);
      },

      // Auth Actions
      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      // Orders Actions (NEW)
      addOrder: (orderData) => {
        const newOrder = {
          id: `ORD${Date.now()}`,
          ...orderData,
          date: new Date().toISOString(),
          status: 'processing'
        };
        set({ orders: [...get().orders, newOrder] });
        return newOrder;
      },

      getOrders: () => get().orders,

      // Address Actions (NEW)
      addAddress: (address) => {
        const newAddress = {
          id: Date.now(),
          ...address,
          isDefault: get().addresses.length === 0
        };
        set({ addresses: [...get().addresses, newAddress] });
      },

      updateAddress: (id, addressData) => {
        set({
          addresses: get().addresses.map(addr =>
            addr.id === id ? { ...addr, ...addressData } : addr
          )
        });
      },

      deleteAddress: (id) => {
        set({ addresses: get().addresses.filter(addr => addr.id !== id) });
      },

      setDefaultAddress: (id) => {
        set({
          addresses: get().addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
          }))
        });
      }
    }),
    { name: 'shopsmart-store' }
  )
);

export default useStore;