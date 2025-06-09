import { Hono } from 'hono';
import { findProductByIdUseCase } from '../usecases/product/find-by-id';
import { findManyProductsUseCase } from '../usecases/product/find-many';
import {
    ProductFilterSchema,
    CreateProductSchema,
    UpdateProductSchema
} from '../domain/product';
import { createProductUseCase } from '../usecases/product/create';
import { updateProductUseCase } from '../usecases/product/update';
import { deleteProductUseCase } from '../usecases/product/delete';

import { zValidator } from '@hono/zod-validator';

// Roteador 
const productsRouter = new Hono().basePath('/products');

// Buscar produtos com filtros (paginação, etc)
productsRouter.get('/', zValidator("query", ProductFilterSchema), async (c) => {
    const filter = c.req.valid("query");

    const products = await findManyProductsUseCase(filter);
    return c.json(products, 200);
});

// Buscar produtos por id
productsRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const product = await findProductByIdUseCase(id);

    if (!product || (product as any).deleted) {
        return c.json({ product: null }, 404);
    }

    return c.json(product, 200);
});

// Criar novo produto
productsRouter.post('/new', zValidator("json", CreateProductSchema),  async (c) => {
    const data = c.req.valid("json");

    const created = await createProductUseCase(data);
    return c.json(created, 201);
});

// Atualizar dados de um produto (por id)
productsRouter.put('/', zValidator("json", UpdateProductSchema), async (c) => {
    const data = c.req.valid("json");

    const updated = await updateProductUseCase(data);
    if (!updated) {
        return c.json({ error: 'Product not found or deleted' }, 404);
    }

    return c.json(updated, 200);
});

// Soft delete do produto (por id)
productsRouter.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const success = await deleteProductUseCase(id);
    if (!success) {
        return c.json({ error: 'Product not found or already deleted' }, 404);
    }

    return c.json(success, 200);
});

export default productsRouter;
