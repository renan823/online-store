import { z } from "zod";

export type Product = {
    id: string;
    name: string;
    description: string;
    quantityStock: number;
    price: number;
    brand: string;
    discount: number;
    quantitySold: number;
    images: string[];
}

export type CreateProductDTO = {
    name: string;
    description: string;
    quantityStock: number;
    price: number;
    brand: string;
    discount: number;
    images: string[];
}

export const CreateProductSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    quantityStock: z.coerce.number().nonnegative("Deve ser 0 ou maior"),
    price: z.coerce.number().positive("Deve ser maior que 0"),
    brand: z.string().min(1, "Marca é obrigatória"),
    discount: z.coerce.number().min(0, "Mínimo é 0%").max(100, "Máximo é 100%"),
    files: z.array(z.instanceof(File))
})

export const ProductFilterSchema = z.object({
    page: z.number().optional().default(0),
    limit: z.number().optional().default(15),
    search: z.string().optional(),
    offers: z.boolean().optional().default(false),
})

export type ProductFilter = z.infer<typeof ProductFilterSchema>;