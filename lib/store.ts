import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer } from '@/types/customer';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';

interface StoreState {
    // User & Auth
    user: Customer | null;
    isAuthenticated: boolean;
    setUser: (user: Customer | null) => void;
    logout: () => void;

    // Cart
    cart: CartItem[];
    addToCart: (product: Product, variant: any) => void;
    removeFromCart: (productId: string, variantId: string) => void;
    updateQuantity: (productId: string, variantId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;

    // Favorites
    favorites: Product[];
    addToFavorites: (product: Product) => void;
    removeFromFavorites: (productId: string) => void;
    isFavorite: (productId: string) => boolean;

    // UI State
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            // User & Auth
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            logout: () => {
                set({ user: null, isAuthenticated: false });
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            },

            // Cart
            cart: [],
            addToCart: (product, variant) => {
                const cart = get().cart;
                const existingItem = cart.find(
                    (item) =>
                        item.product.id === product.id && item.variant.variant_id === variant.variant_id
                );

                if (existingItem) {
                    set({
                        cart: cart.map((item) =>
                            item.product.id === product.id && item.variant.variant_id === variant.variant_id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ cart: [...cart, { product, variant, quantity: 1 }] });
                }
            },

            removeFromCart: (productId, variantId) => {
                set({
                    cart: get().cart.filter(
                        (item) =>
                            !(item.product.id === productId && item.variant.variant_id === variantId)
                    ),
                });
            },

            updateQuantity: (productId, variantId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId, variantId);
                } else {
                    set({
                        cart: get().cart.map((item) =>
                            item.product.id === productId && item.variant.variant_id === variantId
                                ? { ...item, quantity }
                                : item
                        ),
                    });
                }
            },

            clearCart: () => set({ cart: [] }),

            getCartTotal: () => {
                return get().cart.reduce((total, item) => {
                    return total + item.variant.price * item.quantity;
                }, 0);
            },

            // Favorites
            favorites: [],
            addToFavorites: (product) => {
                const favorites = get().favorites;
                if (!favorites.find((p) => p.id === product.id)) {
                    set({ favorites: [...favorites, product] });
                }
            },

            removeFromFavorites: (productId) => {
                set({ favorites: get().favorites.filter((p) => p.id !== productId) });
            },

            isFavorite: (productId) => {
                return get().favorites.some((p) => p.id === productId);
            },

            // UI State
            isDarkMode: false,
            toggleDarkMode: () => set({ isDarkMode: !get().isDarkMode }),
            selectedCategory: null,
            setSelectedCategory: (category) => set({ selectedCategory: category }),
        }),
        {
            name: 'delice-store',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                cart: state.cart,
                favorites: state.favorites,
                isDarkMode: state.isDarkMode,
            }),
        }
    )
);
