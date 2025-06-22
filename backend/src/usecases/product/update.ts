import { Product, UpdateProductDTO } from "../../domain/product";
import { ProductModel } from "../../models/product";

// Caso de uso: atualizar dados do produto
export async function updateProductUseCase(data: UpdateProductDTO): Promise<Product | null> {
    const { id, ...updateFields } = data;

    const updated = await ProductModel.findOneAndUpdate(
        { id: id, deleted: { $ne: true } },
        { $set: updateFields },
        { new: true, lean: true }
    );

    if (!updated) {
        return null;
    };

    console.log(updated.images)

    const product: Product = {
        id: updated.id,
		name: updated.name,
		price: updated.price,
		discount: updated.discount,
		brand: updated.brand,
		description: updated.description,
		images: updated.images,
		quantitySold: updated.quantitySold,
		quantityStock: updated.quantityStock
    };

    return product;
}
