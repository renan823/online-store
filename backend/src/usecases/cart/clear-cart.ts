import { CartModel } from "../../models/cart";
import { UserSchema } from "../../models/user";

export async function clearCartUseCase(userId: string): Promise<boolean> {
    const user = await UserSchema.findOne({ id: userId });
    if (!user) return false;

    const cart = await CartModel.findOne({ user: user._id });

    if (cart) {
        // CORREÇÃO: Em vez de atribuir um novo array, removemos todos os itens do array existente.
        cart.items.splice(0, cart.items.length);
        await cart.save();
    }
    
    return true;
}