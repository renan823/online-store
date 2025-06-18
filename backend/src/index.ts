import { Hono } from 'hono'
import productsRouter from './handlers/products.handler'

import { cors } from 'hono/cors';
import { logger } from 'hono/logger'

import mongoose from 'mongoose';
import analyticsRouter from './handlers/analitycs.handler';
import ordersRouter from './handlers/order.handler'; 
import userRouter from './handlers/users.handler';
import profileRouter from './handlers/profile.handler';

const app = new Hono();

// Iniciar mongoose
(async () => {
	await mongoose.connect(`mongodb://localhost:27017/web`, { authSource: "admin", auth: { username: "root", password: "root" } });
})();

app.use(
	'*',
	cors({
		origin: '*',
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
	})
);

app.use(logger());

app.route('/', productsRouter);
app.route('/', analyticsRouter);
app.route('/', ordersRouter); 
app.route('/', userRouter);
app.route('/', profileRouter);

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
