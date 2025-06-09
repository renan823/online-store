import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { MonthlyReportSchema } from "../domain/analytics";
import { generateMonthlyReportUseCase } from "../usecases/analytics/monthly-report";

// Roteador
const analyticsRouter = new Hono().basePath("/analytics");

//Rota para gerar o relatorio mensal
analyticsRouter.get("/", zValidator("query", MonthlyReportSchema), async (c) => {
    const filter = c.req.valid("query");

    const report = await generateMonthlyReportUseCase(filter.month, filter.year);
    return c.json(report, 200);
})

export default analyticsRouter;