import { CartItem } from "@/lib/types/cart";
import { createContext, useContext, useEffect, useState } from "react";

export interface CartContextType {
    items: CartItem[];
    add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    remove: (productId: string) => void;
    update: (productId: string, quantity: number) => void;
    clear: () => void;
    getTotal: () => number;
    getTotalWithDiscounts: () => number;
    getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cart-items";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	});

    useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}, [items]);

    function add(item: Omit<CartItem, "quantity">, quantity = 1) {
        setItems(prev => {
            const existing = prev.find(p => p.productId === item.productId);
            if (existing) {
                return prev.map(p =>
                    p.productId === item.productId
                        ? { ...p, quantity: p.quantity + quantity }
                        : p
                );
            }
            return [...prev, { ...item, quantity }];
        });
    };

    function remove(productId: string) {
        setItems(prev => prev.filter(p => p.productId !== productId));
    };

    function update(productId: string, quantity: number) {
        if (quantity <= 0) {
            return remove(productId);
        }
    
        setItems(prev =>
            prev.map(p =>
                p.productId === productId ? { ...p, quantity } : p
            )
        );
    };

    function clear() {
        setItems([]);
    };

    function getTotal() {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function getTotalWithDiscounts() {
        return items.reduce((total, item) => {
            const priceWithDiscount = item.price - item.discount;
            return total + priceWithDiscount * item.quantity;
        }, 0);
    };

    function getTotalItems() {
        return items.reduce((total, item) => total + item.quantity, 0);
    }

    return (
        <CartContext.Provider
            value={{ items, add, remove, update, clear, getTotal, getTotalWithDiscounts, getTotalItems }}
        >
            {children}
        </CartContext.Provider>
    );
};

export function useCart(): CartContextType {
    const context = useContext(CartContext);
    
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
};