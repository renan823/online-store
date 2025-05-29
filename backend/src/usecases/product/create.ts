import { CreateProductDTO, Product } from "../../domain/product";
import { products } from "../../mock";

export function createProductUseCase(data: CreateProductDTO): Product {
    const newProduct: Product = {
        id: crypto.randomUUID(),
        quantitySold: 0,
        ...data,
    };

    products.push(newProduct);
    return newProduct;
}
