import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Separator } from '@/components/ui/separator'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute('/_auth/dashboard')({
	beforeLoad: ({ context, location }) => {
		if (context.auth.user === null || context.auth.user.role !== "admin") {
			throw redirect({
				to: '/user/login',
				search: {
					redirect: location.href,
				},
			})
		}
	},
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<h1>Dashboard</h1>
			<Separator />
			<div>
				<MonthlySalesChart />
			</div>
		</div>
	)
}

function MonthlySalesChart() {
	const chartData = [
		{ month: "January", sales: 186 },
		{ month: "February", sales: 305 },
		{ month: "March", sales: 237 },
		{ month: "April", sales: 73 },
		{ month: "May", sales: 209 },
		{ month: "June", sales: 214 },
	]


	const chartConfig = {
		sales: {
			label: "Vendas",
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Last months sales</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartContainer className="h-[500px] w-full" config={chartConfig}>
						<LineChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickCount={3}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator="line" />}
							/>

							<Line
								dataKey="sales"
								type="natural"
								fill="var(--color-sales)"
								fillOpacity={0.4}
								stroke="var(--color-sales)"
								strokeWidth={3}
							/>
							<ChartLegend content={<ChartLegendContent />} />
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	)
}
