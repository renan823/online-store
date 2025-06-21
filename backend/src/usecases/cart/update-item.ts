import { UpdateCartItemDTO } from "../../domain/cart";
import { CartModel } from "../../models/cart";
import { ProductModel } from "../../models/product";
import { UserSchema } from "../../models/user"; // CORREÇÃO AQUI

export async function updateCartItemUseCase(data: UpdateCartItemDTO): Promise<boolean> {
    const user = await UserSchema.findOne({ id: data.userId }); // CORREÇÃO AQUI
    if (!user) return false;

    const product = await ProductModel.findOne({ id: data.productId });
    if (!product) return false;

    let cart = await CartModel.findOne({ user: user._id });

    if (!cart) {
        cart = new CartModel({ user: user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.equals(product._id));

    if (data.quantity > 0) {
        if (itemIndex > -1) {
            // Atualiza quantidade
            cart.items[itemIndex].quantity = data.quantity;
        } else {
            // Adiciona novo item
            cart.items.push({ product: product._id, quantity: data.quantity });
        }
    } else {
        if (itemIndex > -1) {
            // Remove o item se a quantidade for 0 ou menor
            cart.items.splice(itemIndex, 1);
        }
    }

    await cart.save();
    return true;
}