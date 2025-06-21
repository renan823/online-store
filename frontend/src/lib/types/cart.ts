import z from "zod";

// Estrutura de um item no carrinho, como recebido da API
export interface CartItem {
    product: {
        id: string;
        name: string;
        price: number;
        discount: number;
        image: string;
    };
    quantity: number;
}

// Estrutura completa do carrinho
export interface Cart {
    id: string;
    user: string;
    items: CartItem[];
}

// DTO para atualizar um item no carrinho
export const UpdateCartItemSchema = z.object({
    userId: z.string(),
    productId: z.string(),
    quantity: z.number().min(0), // 0 para remover
});
export type UpdateCartItemDTO = z.infer<typeof UpdateCartItemSchema>;