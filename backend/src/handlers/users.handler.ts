import { Hono } from 'hono';
import { findUserByIdUseCase } from '../usecases/user/find-by-id';
import { findManyUsersUseCase } from '../usecases/user/find-many';
import { createUserUseCase } from '../usecases/user/create';
import {
    CreateUserSchema,
    UpdateUserSchema,
} from '../domain/user';
import { zValidator } from '@hono/zod-validator';
import { deleteUserUseCase } from '../usecases/user/delete';
import { updateUserUseCase } from '../usecases/user/update';

// Router
const userRouter = new Hono().basePath('/users');

// Find user by id
userRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const user = await findUserByIdUseCase(id);

    if (!user || (user as any).deleted) {
        return c.json({ user: null }, 404);
    }

    return c.json(user, 200);
});

// Search users by name/email substring
userRouter.get('/', async (c) => {
    let searchTerm = c.req.query("search")
    // if no searchTerm was provided, retrieve all users
    if(searchTerm == undefined) searchTerm = ""

    const users = await findManyUsersUseCase(searchTerm)
    return c.json(users, 200)
})

// Create new user
userRouter.post('/new', zValidator("json", CreateUserSchema),  async (c) => {
    const data = c.req.valid("json");

    const created = await createUserUseCase(data);
    return c.json(created, 201);
});

// Update user data (by id)
userRouter.put('/', zValidator("json", UpdateUserSchema), async (c) => {
    const data = c.req.valid("json");

    const updated = await updateUserUseCase(data);
    if (!updated) {
        return c.json({ error: 'User not found or deleted' }, 404);
    }

    return c.json(updated, 200);
});

// Soft delete user
userRouter.delete('/:id', async (c) => {
    const id = c.req.param('id');
    if(id == undefined){
        return c.json({ user: null }, 404);
    }

    const success = await deleteUserUseCase(id);
    if (!success) {
        return c.json({ error: 'User not found or already deleted' }, 404);
    }

    return c.json(success, 200);
});
export default userRouter;