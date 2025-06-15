import { CreateOrderDTO, Order } from "../../domain/order";
import { OrderModel } from "../../models/order";
import { ProductModel } from "../../models/product";

// Caso de uso: criar nova compra
export async function createOrderUseCase(data: CreateOrderDTO): Promise<Order | null> {
    try {
        let total = 0;
        const processedItems = [];

        for (const item of data.items) {
            const product = await ProductModel.findOne({ id: item.productId, deleted: false });

            if (!product || product.quantityStock < item.quantity) {
                throw new Error(`Produto ${item.productId} indisponível.`);
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
            status: 'pending',
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
                productId: item.product?.id || '',
                quantity: item.quantity || 0,
                price: item.product?.price || 0,
            })),
            total: savedOrder.total ?? 0, 
            status: savedOrder.status,
            createdAt: savedOrder.createdAt,
        };

        return result;

    } catch (error) {
        console.error("Erro ao criar a ordem:", error);
        return null;
    }
}