import { Hono } from 'hono'

import { cors } from 'hono/cors';
import { logger } from 'hono/logger'

import mongoose from 'mongoose';
import { checkForAdmin } from './usecases/auth/login';
import { getCookie } from "hono/cookie"
import { bearerAuth } from 'hono/bearer-auth'

import authRouter from './handlers/auth.handler';
import analyticsRouter from './handlers/analitycs.handler';
import ordersRouter from './handlers/order.handler'; 
import userRouter from './handlers/users.handler';
import profileRouter from './handlers/profile.handler';
import productsRouter from './handlers/products.handler'
import cartRouter from './handlers/cart.handler'; 
import { createDefaultAdminUseCase } from './usecases/user/admin';

const app = new Hono();

// Iniciar mongoose
(async () => {
	await mongoose.connect(`mongodb://localhost:27017/web`, { authSource: "admin", auth: { username: "root", password: "root" } });

	await createDefaultAdminUseCase();
})();

app.use(
	'*',
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
	})
);

app.use(logger());

app.use("/users/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token") && checkForAdmin(getCookie(c, "id"))
}))

app.post("/products/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token") && checkForAdmin(getCookie(c, "id"))
}))

app.delete("/products/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token") && checkForAdmin(getCookie(c, "id"))
}))

app.put("/products/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token") && checkForAdmin(getCookie(c, "id"))
}))

app.use("/analytics/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token") && checkForAdmin(getCookie(c, "id"))
}))

app.use("/profiles/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token")
}))

app.get("/orders/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token")
}))

app.post("/orders/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token")
}))

app.put("/orders/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token")
}))

app.delete("/orders/*", bearerAuth({
	verifyToken: async (token, c) => token === getCookie(c, "token")
}))

app.route('/', authRouter)
app.route('/', productsRouter);
app.route('/', analyticsRouter);
app.route('/', ordersRouter); 
app.route('/', userRouter);
app.route('/', profileRouter);
app.route('/', cartRouter);

// app.get('/users/');
// app.get('/users/:id');
// app.post('/users/new');
// app.put('/users/:id');
// app.delete('/users/:id');

// app.get('/cart/');
// app.put('/cart/update/');

// app.post('/auth/login/');
// app.post('/auth/refresh/');
// app.post('/auth/register/');

export default app
