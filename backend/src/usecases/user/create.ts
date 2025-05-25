import { Context } from "hono";

export function createUserUseCase(c: Context) {
    return c.json({ message: "hello "}, 201);
}