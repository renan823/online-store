import { z } from "zod";

export type CartItem = {
    product: {
        id: string;
        name: string;
        price: number;
        discount: number;
        image: string;
    };
    quantity: number;
}

export type Cart = {
    id: string;
    user: string;
    items: CartItem[];
}

export const AddToCartSchema = z.object({
    userId: z.string(),
    productId: z.string(),
    quantity: z.number().min(1),
});
export type AddToCartDTO = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
    userId: z.string(),
    productId: z.string(),
    quantity: z.number().min(0), // 0 para remover
});
export type UpdateCartItemDTO = z.infer<typeof UpdateCartItemSchema>;