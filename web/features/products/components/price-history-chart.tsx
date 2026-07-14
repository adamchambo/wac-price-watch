"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PriceHistoryChart({
	data,
}: {
	data: Array<{ capturedAt: string; price: number | string | null }>;
}) {
	const chartData = data.map((point) => ({
		month: new Intl.DateTimeFormat("en-AU", { month: "short", year: "2-digit" }).format(
			new Date(point.capturedAt),
		),
		price: Number(point.price ?? 0),
	}));

	return (
		<Card>
			<CardHeader className="flex-row items-center justify-between py-4">
				<CardTitle>Price history</CardTitle>
				<Select defaultValue="1y">
					<SelectTrigger className="w-28">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="3m">3 Months</SelectItem>
						<SelectItem value="6m">6 Months</SelectItem>
						<SelectItem value="1y">1 Year</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<LineChart
					accessibilityLayer
					data={chartData}
					height={230}
					margin={{ left: 8, right: 16, top: 12, bottom: 8 }}
					width={760}
					className="max-w-full"
				>
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					<XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
					<YAxis
						tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
						tickLine={false}
						axisLine={false}
						tickMargin={10}
					/>
					<Line
						type="monotone"
						dataKey="price"
						stroke="var(--primary)"
						strokeWidth={2}
						dot={{ r: 4, fill: "var(--primary)" }}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</CardContent>
		</Card>
	);
}
