import { Cart, CartItem } from "@/lib/types/cart";
import { useClearCart, useFetchCart, useUpdateCartItem } from "@/services/cart.service";
import { createContext, useContext } from "react";
import { useAuth } from "./auth";
import { notify } from "@/lib/notify";

export interface CartContextType {
    cart: Cart | undefined;
    isLoading: boolean;
    add: (item: Omit<CartItem['product'], "quantity">, quantity?: number) => void;
    remove: (productId: string) => void;
    update: (productId: string, quantity: number) => void;
    clear: () => void;
    getTotal: () => number;
    getTotalWithDiscounts: () => number;
    getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { data: cart, isLoading } = useFetchCart(user?.id);

    const updateItemMutation = useUpdateCartItem();
    const clearCartMutation = useClearCart();

    function add(product: Omit<CartItem['product'], "quantity">, quantity = 1) {
        if (!user) {
            notify.error("Você precisa estar logado para adicionar itens ao carrinho.");
            return;
        }

        const existingItem = cart?.items.find(i => i.product.id === product.id);
        const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

        updateItemMutation.mutate({
            userId: user.id,
            productId: product.id,
            quantity: newQuantity,
        });
    };

    function remove(productId: string) {
        if (!user) return;
        updateItemMutation.mutate({
            userId: user.id,
            productId: productId,
            quantity: 0,
        });
    };

    function update(productId: string, quantity: number) {
        if (!user) return;
        updateItemMutation.mutate({
            userId: user.id,
            productId: productId,
            quantity: quantity,
        });
    };

    // A função 'clear' está definida aqui, e chama a mutação para limpar o carrinho no backend.
    function clear() {
        if (!user) return;
        clearCartMutation.mutate(user.id);
    };

    const items = cart?.items || [];

    function getTotal() {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    function getTotalWithDiscounts() {
        return items.reduce((total, item) => {
            const priceWithDiscount = item.product.price * (1 - item.product.discount / 100);
            return total + priceWithDiscount * item.quantity;
        }, 0);
    };

    function getTotalItems() {
        return items.reduce((total, item) => total + item.quantity, 0);
    }

    return (
        <CartContext.Provider
            // E a função 'clear' é exposta para os componentes filhos através do contexto.
            value={{ cart, isLoading, add, remove, update, clear, getTotal, getTotalWithDiscounts, getTotalItems }}
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