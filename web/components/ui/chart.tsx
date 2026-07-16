"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = {
	[key: string]: {
		label?: React.ReactNode;
		color?: string;
	};
};

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

export function ChartContainer({
	id,
	className,
	children,
	config,
	...props
}: React.ComponentProps<"div"> & {
	config: ChartConfig;
	children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
	const uniqueId = React.useId();
	const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
	const chartStyle = Object.fromEntries(
		Object.entries(config)
			.filter(([, item]) => item.color)
			.map(([key, item]) => [`--color-${key}`, item.color]),
	) as React.CSSProperties;

	return (
		<ChartContext.Provider value={{ config }}>
			<div
				data-chart={chartId}
				style={chartStyle}
				className={cn(
					"flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
					className,
				)}
				{...props}
			>
				<RechartsPrimitive.ResponsiveContainer>
					{children}
				</RechartsPrimitive.ResponsiveContainer>
			</div>
		</ChartContext.Provider>
	);
}

export function ChartTooltipContent({
	active,
	payload,
	label,
	className,
}: React.ComponentProps<"div"> & {
	active?: boolean;
	payload?: Array<{ dataKey?: string | number; color?: string; value?: unknown; name?: string | number }>;
	label?: string;
}) {
	const context = React.useContext(ChartContext);

	if (!active || !payload?.length) return null;

	return (
		<div className={cn("grid min-w-32 gap-1.5 rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md", className)}>
			{label ? <div className="font-medium">{label}</div> : null}
			<div className="grid gap-1.5">
				{payload.map((item) => {
					const key = String(item.dataKey ?? item.name ?? "");
					const config = context?.config[key];

					return (
						<div key={key} className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2 text-muted-foreground">
								<span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
								<span>{config?.label ?? item.name ?? key}</span>
							</div>
							<span className="font-mono font-medium tabular-nums">{String(item.value ?? "")}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
