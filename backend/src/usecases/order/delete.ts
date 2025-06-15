import { OrderModel } from "../../models/order";

// Caso de uso: remover compra (soft delete)
export async function deleteOrderUseCase(id: string): Promise<boolean> {
    const result = await OrderModel.findOneAndUpdate(
        { _id: id, deleted: { $ne: true } }, 
        { $set: { deleted: true } }
    );

    return result !== null;
}