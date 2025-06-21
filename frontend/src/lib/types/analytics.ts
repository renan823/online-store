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