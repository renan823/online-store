import { Pagination } from "../../domain/pagination";
import { Order, OrderFilter } from "../../domain/order";
import { OrderModel } from "../../models/order";

// Caso de uso: buscar compras pelo filtro
export async function findManyOrdersUseCase(filter: OrderFilter): Promise<Pagination<Order>> {
	const query: any = { deleted: false };

	if (filter.userId) {
		query.user = filter.userId;
	}
	if (filter.status) {
		query.status = filter.status;
	}

	const page = filter.page || 0;
	const limit = filter.limit || 10;
	const skip = page * limit;

	const [items, total] = await Promise.all([
		OrderModel.find(query).skip(skip).limit(limit).lean(),
		OrderModel.countDocuments(query),
	]);

	return {
		items: items as unknown as Order[],
		meta: {
			page,
			limit,
			total,
			pages: Math.ceil(total / limit),
		},
	};
}