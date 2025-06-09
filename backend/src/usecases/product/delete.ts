import { ProductModel } from "../../models/product";

// Caso de uso: remover produto (soft delete)
export async function deleteProductUseCase(id: string): Promise<boolean> {
    const result = await ProductModel.findOneAndUpdate(
        { id, deleted: { $ne: true } }, 
        { $set: { deleted: true } }
    );

    return result !== null;
}
