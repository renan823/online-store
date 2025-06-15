import { Order, UpdateOrderDTO } from "../../domain/order";
import { OrderModel } from "../../models/order";

// Caso de uso: atualizar dados da compra (status)
export async function updateOrderUseCase(data: UpdateOrderDTO): Promise<Order | null> {
    const { id, status } = data;

    const updated = await OrderModel.findOneAndUpdate(
        { _id: id, deleted: { $ne: true } },
        { $set: { status } },
        { new: true, lean: true }
    );

    if (!updated) {
        return null;
    }

    return updated as unknown as Order;
}