import { products } from "../../mock";

export function deleteProductUseCase(id: string): boolean {
    const index = products.findIndex(p => p.id === id && !p.deleted);

    if (index === -1) return false;

    products[index].deleted = true;
    return true;
}