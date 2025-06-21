import { MontlhySalesReport } from "@/lib/types/analytics";
import { api } from "./config";
import { useQuery } from "@tanstack/react-query";

async function fetchMonthlyReport(token: string, month: number, year: number): Promise<MontlhySalesReport> {
    const response = await api.get<MontlhySalesReport>("/analytics", { 
        params: { month, year },
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch monthly report");
    }

    console.log(response.data);

    return response.data;
}

export function useFetchMonthlyReport(token: string, month: number, year: number) {
    return useQuery({
        queryKey: ["report", month, year],
        queryFn: () => fetchMonthlyReport(token, month, year)
    })
}