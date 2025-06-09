import { CreateProductDTO, Product } from "../../domain/product";
import { ProductModel } from "../../models/product";

// Caso de uso: criar novo produto
export async function createProductUseCase(data: CreateProductDTO): Promise<boolean> {
    try {
        const product: Product = { id: crypto.randomUUID(), quantitySold: 0, ...data };

        await ProductModel.create(product);

        return true;
    } catch {
        return false;
    }
}
