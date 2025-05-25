import { Hono } from "hono";
import { findProductByIdUseCase } from "../usecases/product/find-by-id";
import { ProductFilterSchema } from "../domain/product";
import { findManyProductsUseCase } from "../usecases/product/find-many";

const productsRouter = new Hono().basePath('/products');

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

productsRouter.get('/:id', (c) => {
	const id = c.req.param('id');
	const product = findProductByIdUseCase(id);

	if (!product) {
		return c.json({ product: null }, 400);
	}

	return c.json(product, 200);
});

productsRouter.post('/new', (c) => {
    return c.json({ message: 'done' }, 201);
});

productsRouter.put('/:id', (c) => {
    return c.json({ message: 'done' }, 200);
});

productsRouter.delete('/:id', (c) => {
    return c.json({ message: 'done' }, 200);
});

export default productsRouter;