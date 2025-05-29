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

const productsRouter = new Hono().basePath('/products');

// List products with filters
productsRouter.get('/', (c) => {
    const filter = ProductFilterSchema.parse({
        search: c.req.query('search') ?? undefined,
        offers: c.req.query('offers') === 'true',
        page: parseInt(c.req.query('page') ?? '0'),
        limit: parseInt(c.req.query('limit') ?? '10'),
    });

    const products = findManyProductsUseCase(filter);
    return c.json(products, 200);
});

// Get product by ID
productsRouter.get('/:id', (c) => {
    const id = c.req.param('id');
    const product = findProductByIdUseCase(id);

    if (!product || (product as any).deleted) {
        return c.json({ product: null }, 404);
    }

    return c.json(product, 200);
});

// Create new product
productsRouter.post('/new', async (c) => {
    const body = await c.req.json();
    const data = CreateProductSchema.parse(body);

    const created = createProductUseCase(data);
    return c.json(created, 201);
});

// Update product
productsRouter.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = UpdateProductSchema.parse({ ...body, id });

    const updated = updateProductUseCase(data);
    if (!updated) {
        return c.json({ error: 'Product not found or deleted' }, 404);
    }

    return c.json(updated, 200);
});

// Soft delete product
productsRouter.delete('/:id', (c) => {
    const id = c.req.param('id');

    const success = deleteProductUseCase(id);
    if (!success) {
        return c.json({ error: 'Product not found or already deleted' }, 404);
    }

    return c.json({ message: 'Product deleted' }, 200);
});

export default productsRouter;
