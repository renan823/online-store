import { CreateOrderDTO, Order, OrderStatus } from "../../domain/order";
import { OrderModel } from "../../models/order";
import { ProductModel } from "../../models/product";

function randomStatus(): OrderStatus {
    const value = Math.random();

    if (value < 0.1) {
        return "cancelled";
    }

    if (value < 0.25) {
        return "paid";
    }

    if (value < 0.5) {
        return "pending";
    }

    return "shipped";
}

// Caso de uso: criar nova compra
export async function createOrderUseCase(data: CreateOrderDTO): Promise<Order | null> {
    let total = 0;
    const processedItems = [];

    for (const item of data.items) {
        const product = await ProductModel.findOne({ id: item.productId, deleted: false });

        if (!product || product.quantityStock < item.quantity) {
            throw new Error("Um ou mais produtos indisponíveis.");
        }

        const itemPrice = product.price - (product.price * product.discount / 100);
        total += itemPrice * item.quantity;

        processedItems.push({
            product: {
                _id: product._id,
                id: product.id,
                name: product.name,
                price: itemPrice,
            },
            quantity: item.quantity,
        });
    }

    // 2. Cria a nova ordem no banco. Note que 'data.cardId' é usado aqui
    //    apenas para lógica de pagamento, mas não é salvo diretamente.
    const newOrder = new OrderModel({
        user: data.userId,
        items: processedItems,
        total,
        status: randomStatus(),
        payment: {
            method: 'card', // Lógica que pode usar o data.cardId
            transactionId: crypto.randomUUID(),
        },
    });

    const savedOrder = await newOrder.save();

    for (const item of data.items) {
        await ProductModel.updateOne(
            { id: item.productId },
            {
                $inc: {
                    quantityStock: -item.quantity,
                    quantitySold: item.quantity,
                }
            }
        );
    }

    const result: Order = {
        id: savedOrder.id,
        user: savedOrder.user?.toString() ?? '',
        items: savedOrder.items.map(item => ({
            product: {
                id: item.product?.id ?? '',
                name: item.product?.name ?? '',
                price: item.product?.price ?? 0
            },
            quantity: item.quantity || 0,
        })),
        total: savedOrder.total ?? 0,
        status: savedOrder.status,
        createdAt: savedOrder.createdAt,
    };

    return result;


}