import { Product } from "../../domain/product";
import { products } from "../../mock";

export function findProductByIdUseCase(id: string): Product | null {
    const results = products.filter(p => p.id === id);

    if (results.length !== 0) {
        return results[0];
    }

    return null;
}