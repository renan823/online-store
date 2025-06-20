import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateOrderDTO, Order } from "@/lib/types/order";
import { api } from "./config";
import { notify } from "@/lib/notify";
import { Pagination } from "@/lib/utils";


//Cria uma nova compra no backend.
async function createOrder(orderData: CreateOrderDTO, token: string): Promise<Order> {
    const response = await api.post<Order>('/orders', orderData, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 201) {
        throw new Error("Falha ao criar a compra.");
    }
    return response.data;
}

/**
 * Hook de mutação para criar uma nova compra.
 * Invalida as queries de 'orders' em caso de sucesso para atualizar a lista.
 */
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderData, token }: { orderData: CreateOrderDTO, token: string }) => createOrder(orderData, token),
        onSuccess: () => {
            notify.success("Compra realizada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => {
            console.error("Erro ao criar a compra:", error);
            notify.error("Não foi possível finalizar a compra.");
        },
    });
}


// Busca as compras de um usuário específico.

async function fetchUserOrders(userId: string, token: string): Promise<Pagination<Order>> {
    const response = await api.get<Pagination<Order>>('/orders', {
        params: { userId },
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Falha ao buscar as compras.");
    }
    return response.data;
}


//Hook de query para buscar as compras de um usuário.

export function useFetchUserOrders(userId: string, token: string) {
    return useQuery({
        queryKey: ["orders", userId],
        queryFn: () => fetchUserOrders(userId, token),
        enabled: !!userId, // A query só será executada se o userId existir.
    });
}