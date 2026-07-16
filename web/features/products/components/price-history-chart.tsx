"use client";

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/features/products/lib/product-utils";
import { cn } from "@/lib/utils";

const chartConfig = {
	price: {
		label: "Price",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

export function PriceHistoryChart({
	data,
	className,
}: {
	data: Array<{ capturedAt: string; price: number | string | null }>;
	className?: string;
}) {
	const chartData = data.map((point) => ({
		month: new Intl.DateTimeFormat("en-AU", { month: "short", year: "2-digit" }).format(
			new Date(point.capturedAt),
		),
		price: Number(point.price ?? 0),
		priceLabel: formatCurrency(point.price),
	}));

	return (
		<Card className={cn("flex flex-col", className)}>
			<CardHeader className="flex-row items-center justify-between px-4 py-3">
				<CardTitle>Price history</CardTitle>
				<Select defaultValue="1y">
					<SelectTrigger className="h-8 w-28">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="3m">3 Months</SelectItem>
						<SelectItem value="6m">6 Months</SelectItem>
						<SelectItem value="1y">1 Year</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="px-3 pb-4 pt-0">
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{ left: 8, right: 16, top: 16, bottom: 8 }}
					>
						<CartesianGrid stroke="var(--border)" vertical={false} />
						<XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
						<YAxis
							tickFormatter={(value) => formatCurrency(value)}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							width={56}
						/>
						<Tooltip
							cursor={false}
							content={
								<ChartTooltipContent
									className="[&_[class*=font-mono]]:before:content-['$']"
								/>
							}
						/>
						<Line
							type="monotone"
							dataKey="price"
							stroke="var(--color-price)"
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
