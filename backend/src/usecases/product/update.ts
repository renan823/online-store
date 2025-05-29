import { Product, UpdateProductDTO } from "../../domain/product";
import { products } from "../../mock";

export function updateProductUseCase(data: UpdateProductDTO): Product | null {
    const index = products.findIndex(p => p.id === data.id && !p.deleted);

    if (index === -1) return null;

    const updatedProduct = { ...products[index], ...data };
    products[index] = updatedProduct;

    return updatedProduct;
}