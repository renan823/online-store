import z from "zod";

// Definição dos tipos e validadores do Analytics

type StatusBreakDown = {
    _id: string;
    count: number;
}

type TopProduct = {
    _id: string;
    name: string;
    totalSold: number;
}

export type MontlhySalesReport = {
    totalOrders: number;
    totalRevenue: number;
    statusBreakdown: StatusBreakDown[];
    topProducts: TopProduct[];
    dailySales: { day: number; total: number }[];
}

export const MonthlyReportSchema = z.object({
    month: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : new Date().getMonth()))
        .refine((val) => !isNaN(val), { message: "page must be an integer" }),

    year: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : new Date().getFullYear()))
        .refine((val) => !isNaN(val), { message: "limit must be an integer" }),
});
