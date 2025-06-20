import { Hono } from 'hono';
import {
    UpdatePaymentSchema,
    UpdatePersonalSchema,
} from '../domain/profile'
import { zValidator } from '@hono/zod-validator';
import { findPaymentByUserIdUseCase } from '../usecases/profile/find-payment-by-id';
import { updatePaymentUseCase } from '../usecases/profile/update-payment';
import { findUserByIdUseCase } from '../usecases/user/find-by-id';
import { updatePersonalUseCase } from '../usecases/profile/update';
import { getCookie } from 'hono/cookie';

// Router
const profileRouter = new Hono().basePath('/profiles');

// Fetch personal information
profileRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    if(getCookie(c, "id") !== id) return c.json({ error: 'Invalid credentials' }, 401);

    const user = await findUserByIdUseCase(id);

    if (!user || (user as any).deleted) {
        return c.json({ user: null }, 404);
    }

    return c.json(user, 200);
})

// Update personal information
profileRouter.put('/', zValidator("json", UpdatePersonalSchema), async (c) => {
    const data = c.req.valid("json");
    if(getCookie(c, "id") !== data.id) return c.json({ error: 'Invalid credentials' }, 401);

    const updated = await updatePersonalUseCase(data);
    if (!updated) {
        return c.json({ error: 'User not found or deleted' }, 404);
    }

    return c.json(updated, 200);
});

// Fetch payment information
profileRouter.get('/payment/:id', async (c) => {
    const userId = c.req.param('id');
    if(getCookie(c, "id") !== userId) return c.json({ error: 'Invalid credentials' }, 401);

    const paymentInfo = await findPaymentByUserIdUseCase(userId);

    if (!paymentInfo || (paymentInfo as any).deleted) {
        return c.json({ paymentInfo: null }, 404);
    }

    return c.json(paymentInfo, 200);
})

// Update payment information
profileRouter.put('/payment', zValidator("json", UpdatePaymentSchema), async (c) => {
    const data = c.req.valid("json");
    if(getCookie(c, "id") !== data.userId) return c.json({ error: 'Invalid credentials' }, 401);

    const updated = await updatePaymentUseCase(data);
    if (!updated) {
        return c.json({ error: 'User not found or deleted' }, 404);
    }

    return c.json(updated, 200);
});

export default profileRouter