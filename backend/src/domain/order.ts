import z from "zod";
import { PaymentCardSchema } from "./user";

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

export type OrderItem = {
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
    }
}
export type Order = {
    id: string;
    user: string; // ID do usuário
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
}

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;

export const CreateOrderSchema = z.object({
    userId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
    })),
    card: PaymentCardSchema,
});

export type UpdateOrderDTO = z.infer<typeof UpdateOrderSchema>;

export const UpdateOrderSchema = z.object({
    id: z.string(),
    status: z.enum(['pending', 'paid', 'shipped', 'cancelled']),
});

export const OrderFilterSchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 0))
        .refine((val) => !isNaN(val), { message: "A página deve ser um número" }),

    limit: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 15))
        .refine((val) => !isNaN(val), { message: "O limite deve ser um número" }),

    userId: z.string().optional(),
    status: z.enum(['pending', 'paid', 'shipped', 'cancelled']).optional(),
});

export type OrderFilter = z.infer<typeof OrderFilterSchema>;