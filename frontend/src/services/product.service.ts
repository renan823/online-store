import { CreateProductDTO, Product, ProductFilter, ProductFilterSchema } from "@/lib/types/product";
import { api } from "./config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/lib/utils";
import { notify } from "@/lib/notify";
import { useNavigate, useRouter } from "@tanstack/react-router";

/* 
Função para buscar produtos com filtro e seu hook
*/
async function fetchProducts(filter: ProductFilter): Promise<Pagination<Product>> {
    const response = await api.get<Pagination<Product>>('/products', { params: filter });
    if (response.status !== 200) {
        throw new Error("Failed to fetch products!");
    }

    return response.data;
}

export function useFetchProducts(params: ProductFilter) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => fetchProducts(params)
    })
}

/*
Função para buscar um produto por id e seu hook
*/
async function fetchProductById(id: string): Promise<Product> {
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

/*
Função para criar um produto e seu hook
*/
export async function createProduct(product: CreateProductDTO, token: string): Promise<boolean> {
    const response = await api.post<boolean>("/products/new", product, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 201) {
        throw new Error("Failed to create product!");
    }

    return response.data;
}

export function useCreateProduct() {
    const router = useRouter();
    const client = useQueryClient();

    const params = ProductFilterSchema.parse(router.state.location.search)

    return useMutation({
        mutationKey: ["create", "product"],
        mutationFn: ({ product, token }: { product: CreateProductDTO, token: string }) => createProduct(product, token),
        onSuccess: () => {
            notify.success("Produto criado.");
            client.invalidateQueries({ queryKey: ["products", params] });
        },
        onError: () => notify.error("Falha ao criar o produto.")
    })
}

/*
Função para deletar um produto e seu hook
*/
export async function deleteProduct(id: string, token: string): Promise<boolean> {
    const response = await api.delete<boolean>(`/products/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to delete product!");
    }

    return response.data;
}

export function useDeleteProduct() {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: ["delete", "product"],
        mutationFn: ({ id, token }: { id: string, token: string }) => deleteProduct(id, token),
        onSuccess: () => {
            notify.success("Produto deletado.");
            navigate({ to: "/products", replace: true });
        },
        onError: () => notify.error("Falha ao deletar o produto.")
    })
}

/*
Função para atualizar o produto e seu hook
*/

export async function updateProduct(id: string, data: CreateProductDTO, token: string): Promise<string> {
    const response = await api.put<boolean>("/products", { ...data, id }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to update product!");
    }

    return id;
}

export function useUpdateProduct() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["update", "product"],
        mutationFn: ({ id, data, token }: { id: string, data: CreateProductDTO, token: string}) => updateProduct(id, data, token),
        onSuccess: (id) => {
            notify.success("Produto atualizado.");
            client.invalidateQueries({ queryKey: ["products", id] })
        },
        onError: (err) => {
            console.log(err)
            notify.error("Falha ao atualizar o produto. ")
        },
    });
}