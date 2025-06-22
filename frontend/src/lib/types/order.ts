import { z } from "zod";
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
    createdAt: string;
}

export const CreateOrderSchema = z.object({
    userId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
    })),
    card: PaymentCardSchema,
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;


export const statusStyles: Record<Order['status'], string> = {
    pending: "text-md font-semibold bg-yellow-500 hover:bg-yellow-600 text-black",
    paid: "text-md font-semibold bg-blue-500 hover:bg-blue-600 text-white",
    shipped: "text-md font-semibold bg-green-500 hover:bg-green-600 text-white",
    cancelled: "text-md font-semibold bg-red-600 hover:bg-red-700 text-white",
};

export const statusTranslations: Record<Order['status'], string> = {
    pending: "Pendente",
    paid: "Pago",
    shipped: "Enviado",
    cancelled: "Cancelado",
};
