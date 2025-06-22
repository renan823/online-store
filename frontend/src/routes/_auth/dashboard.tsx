import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchMonthlyReport } from "@/services/analytics.service";
import { AlertCircle, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentMonth, currentYear } from "@/lib/utils";
import { useAuth } from "@/context/auth";
import { Badge } from "@/components/ui/badge";
import { statusStyles, statusTranslations } from "@/lib/types/order";

export const Route = createFileRoute("/_auth/dashboard")({
	beforeLoad: ({ context, location }) => {
		if (context.auth.user === null || context.auth.user.role !== "admin") {
			throw redirect({
				to: "/user/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-4 space-y-6">
			<h1 className="text-3xl font-bold text-rose-600">Painel Administrativo</h1>
			<Separator />
			<MonthlySalesChart />
		</div>
	);
}

function MonthlySalesChart() {
	const { token } = useAuth()
	const [month, setMonth] = useState(currentMonth());
	const [year, setYear] = useState(currentYear());

	const { isLoading, error, data } = useFetchMonthlyReport(token || "", parseInt(month), parseInt(year));

	const chartData = useMemo(() => {
		if (!data || !data.dailySales) return [];

		return data.dailySales.map((item) => ({
			day: item.day.toString(),
			sales: item.total,
		}));
	}, [data]);

	const chartConfig = {
		sales: {
			label: "Vendas",
			color: "red",
		},
	} satisfies ChartConfig;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
				<Loader2 className="animate-spin w-8 h-8" />
				<p>Carregando relatório mensal...</p>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4 text-red-500">
				<AlertCircle className="w-8 h-8" />
				<p>Erro ao carregar os dados.</p>
				<Button onClick={() => window.location.reload()}>Tentar novamente</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Select value={month} onValueChange={setMonth}>
					<SelectTrigger className="w-[140px]">
						<SelectValue placeholder="Mês" />
					</SelectTrigger>
					<SelectContent>
						{[
							["01", "Janeiro"],
							["02", "Fevereiro"],
							["03", "Março"],
							["04", "Abril"],
							["05", "Maio"],
							["06", "Junho"],
							["07", "Julho"],
							["08", "Agosto"],
							["09", "Setembro"],
							["10", "Outubro"],
							["11", "Novembro"],
							["12", "Dezembro"],
						].map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={year} onValueChange={setYear}>
					<SelectTrigger className="w-[120px]">
						<SelectValue placeholder="Ano" />
					</SelectTrigger>
					<SelectContent>
						{["2023", "2024", "2025"].map((yr) => (
							<SelectItem key={yr} value={yr}>
								{yr}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{data.dailySales.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground my-20">
					<BarChart3 className="w-12 h-12 text-rose-700" />
					<p className="text-xl">Nenhum dado disponível para este mês.</p>
				</div>
			) : (
				<div className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Vendas de {month}/{year}</CardTitle>
						</CardHeader>
						<CardContent>
							<ChartContainer className="h-[400px] w-full" config={chartConfig}>
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={chartData} margin={{ left: 12, right: 12 }}>
										<CartesianGrid vertical={false} />
										<XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
										<YAxis tickLine={false} axisLine={false} tickMargin={8} />
										<ChartTooltip
											cursor={false}
											content={<ChartTooltipContent indicator="line" />}
										/>
										<Line
											dataKey="sales"
											type="natural"
											stroke="var(--color-sales)"
											strokeWidth={3}
											fillOpacity={0.3}
										/>
										<ChartLegend content={<ChartLegendContent />} />
									</LineChart>
								</ResponsiveContainer>
							</ChartContainer>
						</CardContent>
					</Card>

					<div className="grid md:grid-cols-3 gap-4">
						<Card>
							<CardHeader>
								<CardTitle>Total de Pedidos</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold text-rose-500">{data.totalOrders}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Receita Total</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold text-rose-500">R$ {data.totalRevenue.toFixed(2)}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Status dos Pedidos</CardTitle>
							</CardHeader>
							<CardContent className="grid-cols-4">
								{data.statusBreakdown.map((item) => (
									<Badge className={statusStyles[item._id]}>{statusTranslations[item._id]} - {item.count}</Badge>
								))}
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Produtos Mais Vendidos</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{data.topProducts.map((product) => (
								<div key={product._id} className="flex justify-between">
									<span>{product.name}</span>
									<span className="font-medium text-rose-600">{product.totalSold} vendidos</span>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			)}

		</div>
	);
}
