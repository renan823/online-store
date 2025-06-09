import { MontlhySalesReport } from "@/lib/types/analytics";
import { api } from "./config";
import { useQuery } from "@tanstack/react-query";

async function fetchMonthlyReport(month: number, year: number): Promise<MontlhySalesReport> {
    const response = await api.get<MontlhySalesReport>("/analytics", { params: { month, year }});
    if (response.status !== 200) {
        throw new Error("Failed to fetch monthly report");
    }

    return response.data;
}

export function useFetchMonthlyReport(month: number, year: number) {
    return useQuery({
        queryKey: ["report", month, year],
        queryFn: () => fetchMonthlyReport(month, year)
    })
}