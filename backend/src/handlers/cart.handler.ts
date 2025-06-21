import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getCartByUserIdUseCase } from '../usecases/cart/get-cart';
import { UpdateCartItemSchema } from '../domain/cart';
import { updateCartItemUseCase } from '../usecases/cart/update-item';
import { clearCartUseCase } from '../usecases/cart/clear-cart';

const cartRouter = new Hono().basePath('/cart');

// Obter o carrinho de um usuário
cartRouter.get('/:userId', async (c) => {
    const userId = c.req.param('userId');
    const cart = await getCartByUserIdUseCase(userId);
    if (!cart) {
        return c.json({ error: "Carrinho não encontrado" }, 404);
    }
    return c.json(cart, 200);
});

// Adicionar ou atualizar um item no carrinho
cartRouter.post('/item', zValidator("json", UpdateCartItemSchema), async (c) => {
    const data = c.req.valid("json");
    const success = await updateCartItemUseCase(data);
    if (!success) {
        return c.json({ error: 'Falha ao atualizar o carrinho' }, 400);
    }
    return c.json({ success: true }, 200);
});

// Limpar o carrinho de um usuário
cartRouter.delete('/clear/:userId', async (c) => {
    const userId = c.req.param('userId');
    const success = await clearCartUseCase(userId);
    if (!success) {
        return c.json({ error: 'Usuário não encontrado' }, 404);
    }
    return c.json({ success: true }, 200);
});

export default cartRouter;