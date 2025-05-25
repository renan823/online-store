import { Context } from "hono";

export function createProductUseCase(c: Context) {
    return c.json({ message: "hello "}, 201);
}