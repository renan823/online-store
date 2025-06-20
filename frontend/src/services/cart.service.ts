import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./config";
import { notify } from "@/lib/notify";
import { Cart, UpdateCartItemDTO } from "@/lib/types/cart";

// Buscar o carrinho do usuário
async function fetchCart(userId: string): Promise<Cart> {
    const response = await api.get<Cart>(`/cart/${userId}`);
    if (response.status !== 200) {
        throw new Error("Falha ao buscar o carrinho.");
    }
    return response.data;
}

export function useFetchCart(userId: string | undefined) {
    return useQuery({
        queryKey: ["cart", userId],
        queryFn: () => fetchCart(userId!),
        enabled: !!userId, // A query só roda se o userId existir
    });
}

// Atualizar um item no carrinho
async function updateCartItem(data: UpdateCartItemDTO): Promise<boolean> {
    const response = await api.post<boolean>("/cart/item", data);
    if (response.status !== 200) {
        throw new Error("Falha ao atualizar o item.");
    }
    return response.data;
}

export function useUpdateCartItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: () => notify.error("Não foi possível atualizar o item."),
    });
}

// Limpar o carrinho
async function clearCart(userId: string): Promise<boolean> {
    const response = await api.delete<boolean>(`/cart/clear/${userId}`);
     if (response.status !== 200) {
        throw new Error("Falha ao limpar o carrinho.");
    }
    return response.data;
}

export function useClearCart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: () => notify.error("Não foi possível limpar o carrinho."),
    });
}