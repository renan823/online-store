import z from "zod";

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

export const CreateProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    quantityStock: z.number().min(0).default(0),
    brand: z.string(),
})

export const ProductFilterSchema = z.object({
    page: z.number().optional().default(0),
    limit: z.number().optional().default(15),
    search: z.string().optional(),
    offers: z.boolean().optional().default(false),
})

export type ProductFilter = z.infer<typeof ProductFilterSchema>;