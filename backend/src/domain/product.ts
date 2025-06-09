import z from "zod";

// Definição dos tipos e validadores do Product

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
    page: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 0))
        .refine((val) => !isNaN(val), { message: "page must be an integer" }),

    limit: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 15))
        .refine((val) => !isNaN(val), { message: "limit must be an integer" }),

    search: z.string().optional(),

    offers: z
        .string()
        .optional()
        .transform((val) => val === "true")
        .default("false")
        .pipe(z.boolean()),
});

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
