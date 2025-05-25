import { Hono } from 'hono'
import productsRouter from './handlers/products.handler'

import { cors } from 'hono/cors';

const app = new Hono();

// Ativando CORS globalmente
app.use(
  '*',
  cors({
    origin: '*', 
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

app.route('/', productsRouter);


// app.get('/analytics/sales');
// app.get('/analytics/users');
// app.get('/analytics/products');

// app.get('/users/');
// app.get('/users/:id');
// app.post('/users/new');
// app.put('/users/:id');
// app.delete('/users/:id');

// app.get('/users/payments/');
// app.get('/users/payments/:id');
// app.post('/users/payments/new');
// app.put('/users/payments/:id');
// app.delete('/users/payments/:id');

// app.get('/cart/');
// app.put('/cart/update/');

// app.post('/auth/login/');
// app.post('/auth/refresh/');
// app.post('/auth/register/');

export default app
