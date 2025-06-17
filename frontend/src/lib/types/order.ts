import { z } from "zod";

// Tipos baseados no backend/src/domain/order.ts

export const OrderItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number()
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export type Order = {
    id: string;
    user: string; // ID do usuário
    items: OrderItem[];
    total: number;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
    createdAt: Date;
}

export const CreateOrderSchema = z.object({
    userId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
    })),
    cardId: z.string(), // Mesmo que não implementado, o backend espera
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;