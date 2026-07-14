import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/features/products/lib/mock-data";

export function PriceStats({
	current,
	lowest,
	highest,
	average,
}: {
	current: number | string | null;
	lowest: number;
	highest: number;
	average: number;
}) {
	const stats = [
		{ label: "Current price", value: current },
		{ label: "Lowest price", value: lowest, className: "text-primary" },
		{ label: "Highest price", value: highest, className: "text-destructive" },
		{ label: "Average price", value: average },
	];

	return (
		<Card className="grid divide-y divide-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
			{stats.map((stat) => (
				<div key={stat.label} className="p-5 text-center">
					<p className="text-sm text-muted-foreground">{stat.label}</p>
					<p className={cn("mt-2 text-xl font-semibold", stat.className)}>
						{formatCurrency(stat.value)}
					</p>
				</div>
			))}
		</Card>
	);
}
