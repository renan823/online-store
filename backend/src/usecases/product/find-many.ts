import { Pagination } from "../../domain/pagination";
import { Product, ProductFilter } from "../../domain/product";
import { ProductModel } from "../../models/product";

// Caso de uso: buscar produtos pelo filtro
export async function findManyProductsUseCase(filter: ProductFilter): Promise<Pagination<Product>> {
	// Cria uma query e adiciona filtros (se tiver)
	const query: any = { deleted: false };

	// Filtro de busca (texto no nome - ignora upperCase etc)
	if (filter.search && filter.search.trim() !== "") {
		query.name = { $regex: filter.search.trim(), $options: "i" };
	}

	// Filtro de ofertas (desconto > 0)
	if (filter.offers) {
		query.discount = { $gt: 0 };
	}

	const page = filter.page || 0;
	const limit = filter.limit || 10;
	const skip = page * limit;

	// Consulta e paginação
	const [items, total] = await Promise.all([
		ProductModel.find(query).skip(skip).limit(limit).lean(),
		ProductModel.countDocuments(query),
	]);

	// Mapeia resultados
	const products: Product[] = items.map((p) => ({
		id: p.id,
		name: p.name,
		price: p.price,
		discount: p.discount,
		brand: p.brand,
		description: p.description,
		images: p.images.length === 0 ? ["https://placehold.co/600x400/gray/white"] : p.images,
		quantitySold: p.quantitySold,
		quantityStock: p.quantityStock
	}));

	return {
		items: products,
		meta: {
			page,
			limit,
			total,
			pages: Math.ceil(total / limit),
		},
	};
}