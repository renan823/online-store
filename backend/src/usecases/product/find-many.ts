import { Pagination } from "../../domain/pagination";
import { Product, ProductFilter } from "../../domain/product";
import { products } from "../../mock";

export function findManyProductsUseCase(filter: ProductFilter): Pagination<Product> {
	let results: Product[] = [];

	if (filter.search !== undefined && filter.search.trim() !== "") {
		results = products.filter(p =>
			p.name.toLowerCase().includes(filter.search!.toLowerCase())
		);
	} else {
		results = products;
	}

	if (filter.offers) {
		results = results.filter(p => p.discount > 0);
	}

	const total = results.length;
	const limit = filter.limit;
	const page = filter.page;

	const pages = Math.ceil(total / limit);
	const offset = page * limit;
	const items = results.slice(offset, offset + limit);

	return {
		items,
		meta: {
			page,
			limit,
			total,
			pages,
		},
	};
}
