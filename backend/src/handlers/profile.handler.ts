import { Hono } from 'hono';
import { createUserUseCase } from '../usecases/user/create';
import {
    CreateUserDTO,
} from '../domain/user';
import {
    RegisterUserSchema,
    UpdatePaymentSchema,
    UpdatePersonalSchema,
} from '../domain/profile'
import { zValidator } from '@hono/zod-validator';
import { findPaymentByUserIdUseCase } from '../usecases/profile/find-payment-by-id';
import { updatePaymentUseCase } from '../usecases/profile/update-payment';
import { findUserByIdUseCase } from '../usecases/user/find-by-id';
import { updatePersonalUseCase } from '../usecases/profile/update';

// Router
const profileRouter = new Hono().basePath('/profiles');

// Register new user
profileRouter.post('/', zValidator("json", RegisterUserSchema),  async (c) => {
    const data = c.req.valid("json");
    const newUser: CreateUserDTO = {isAdmin: false, ...data}

    const created = await createUserUseCase(newUser);
    return c.json(created, 201);
});

// Fetch personal information
profileRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const user = await findUserByIdUseCase(id);

    if (!user || (user as any).deleted) {
        return c.json({ user: null }, 404);
    }

    return c.json(user, 200);
})

// Update personal information
profileRouter.put('/', zValidator("json", UpdatePersonalSchema), async (c) => {
    const data = c.req.valid("json");

    const updated = await updatePersonalUseCase(data);
    if (!updated) {
        return c.json({ error: 'User not found or deleted' }, 404);
    }

    return c.json(updated, 200);
});

// Fetch payment information
profileRouter.get('/payments/:id', async (c) => {
    const userId = c.req.param('id');
    const paymentInfo = await findPaymentByUserIdUseCase(userId);

    if (!paymentInfo || (paymentInfo as any).deleted) {
        return c.json({ paymentInfo: null }, 404);
    }

    return c.json(paymentInfo, 200);
})

// Update payment information
profileRouter.put('/payments', zValidator("json", UpdatePaymentSchema), async (c) => {
    const data = c.req.valid("json");

    const updated = await updatePaymentUseCase(data);
    if (!updated) {
        return c.json({ error: 'User not found or deleted' }, 404);
    }

    return c.json(updated, 200);
});

export default profileRouter