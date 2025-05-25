import { Product, ProductFilter } from "@/lib/types/product";
import { api } from "./api";
import { useQuery } from "@tanstack/react-query";

export async function fetchProducts(filter: ProductFilter): Promise<Product[]> {
    const response = await api.get<Product[]>('/products', { params: filter });
    if (response.status !== 200) {
        throw new Error("Failed to fetch products!");
    }

    return response.data;
}

export function useFetchProducts(params: ProductFilter) {
    return useQuery({
        queryKey: ["products", params.page, params.limit],
        queryFn: () => fetchProducts(params)
    })
}

export async function fetchProductById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch products!");
    }

    return response.data;
}

export function useFetchProductById(id: string) {
    return useQuery({
        queryKey: ["products", id],
        queryFn: () => fetchProductById(id)
    })
}