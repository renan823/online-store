import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
    OrderFilterSchema,
    CreateOrderSchema,
    UpdateOrderSchema
} from '../domain/order';
import { findManyOrdersUseCase } from '../usecases/order/find-many';
import { findOrderByIdUseCase } from '../usecases/order/find-by-id';
import { createOrderUseCase } from '../usecases/order/create';
import { updateOrderUseCase } from '../usecases/order/update';
import { deleteOrderUseCase } from '../usecases/order/delete';
import { getCookie } from 'hono/cookie';

// Roteador de Compras
const ordersRouter = new Hono().basePath('/orders');

// Buscar compras com filtros
ordersRouter.get('/', zValidator("query", OrderFilterSchema), async (c) => {
    const filter = c.req.valid("query");
    const orders = await findManyOrdersUseCase(filter);
    return c.json(orders, 200);
});

// Buscar compra por id
ordersRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    if(getCookie(c, "id") !== id) return c.json({ error: 'Invalid credentials' }, 401);

    const order = await findOrderByIdUseCase(id);

    if (!order) {
        return c.json({ order: null }, 404);
    }
    return c.json(order, 200);
});

// Criar nova compra
ordersRouter.post('/', zValidator("json", CreateOrderSchema),  async (c) => {
    const data = c.req.valid("json");
    try {
        const created = await createOrderUseCase(data);
        if (!created) {
            return c.json({ error: 'Falha ao criar a compra' }, 400);
        }

        return c.json(created, 201);
    } catch (error: any) {
        return c.json({ error: error.message ?? "Algo deu errado" }, 400);
    }
});

// Atualizar status de uma compra
ordersRouter.put('/', zValidator("json", UpdateOrderSchema), async (c) => {
    const data = c.req.valid("json");
    const updated = await updateOrderUseCase(data);
    if (!updated) {
        return c.json({ error: 'Compra não encontrada ou já deletada' }, 404);
    }
    return c.json(updated, 200);
});

// delete da compra
ordersRouter.delete('/:id', async (c) => {
    const id = c.req.param('id');
    const success = await deleteOrderUseCase(id);
    if (!success) {
        return c.json({ error: 'Compra não encontrada ou já deletada' }, 404);
    }
    return c.json({ success: true }, 200);
});

export default ordersRouter;