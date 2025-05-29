import { Product, ProductFilter } from "../../domain/product";
import { products } from "../../mock";

export function findManyProductsUseCase(filter: ProductFilter): Product[] {
    let results: Product[] = [];

    if (filter.search !== undefined) {
        results = products.filter(p => p.name.includes(filter.search!));
    } else {
        results = products;
    }

    if (filter.offers) {
        results = results.filter(p => p.discount > 0);
    }

    const offset = filter.page * filter.limit;
    const end = offset + filter.limit;
    
    return results.slice(offset, end);
}