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

export type ProductFilter = z.infer<typeof ProductFilterSchema>;

export type CreateProductDTO = {
    name: string;
    description: string;
    quantityStock: number;
    price: number;
    brand: string;
    discount: number;
    images: string[];
};

export type UpdateProductDTO = Partial<CreateProductDTO> & {
    id: string;
};

export const ProductFilterSchema = z.object({
    page: z.number().optional().default(0),
    limit: z.number().optional().default(15),
    search: z.string().optional(),
    offers: z.boolean().optional().default(false),
})

export const CreateProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    quantityStock: z.number(),
    price: z.number(),
    brand: z.string(),
    discount: z.number(),
    images: z.array(z.string())
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
    id: z.string(),
});
