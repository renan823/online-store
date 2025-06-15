import { Order } from "../../domain/order";
import { OrderModel } from "../../models/order";

// Caso de uso: buscar compra por id
export async function findOrderByIdUseCase(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id).lean();

    if (!order || (order as any).deleted) {
        return null;
    }

    return order as unknown as Order;
}