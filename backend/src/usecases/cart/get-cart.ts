import { Cart } from "../../domain/cart";
import { CartModel } from "../../models/cart";
import { ProductModel } from "../../models/product";
import { UserSchema } from "../../models/user"; // CORREÇÃO AQUI

export async function getCartByUserIdUseCase(userId: string): Promise<Cart | null> {
    const user = await UserSchema.findOne({ id: userId }); // CORREÇÃO AQUI
    if (!user) {
        return null;
    }

    const cart = await CartModel.findOne({ user: user._id }).populate({
        path: 'items.product',
        model: ProductModel,
    });

    if (!cart) {
        // Se o carrinho não existe, retornamos um carrinho vazio
        return {
            id: '',
            user: userId,
            items: [],
        };
    }

    // Mapeia o resultado para o formato do nosso domínio
    return {
        id: cart._id.toString(),
        user: userId,
        items: cart.items.map((item: any) => ({
            product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                discount: item.product.discount,
                image: item.product.images[0] || "https://placehold.co/600x400/gray/white",
            },
            quantity: item.quantity,
        })),
    };
}