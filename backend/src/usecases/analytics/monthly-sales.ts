import { Context } from "hono";

export function findMonthlySalesUseCase(c: Context) {
    return c.json({ sales: [] }, 200);
}