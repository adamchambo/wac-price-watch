import { cn } from "@/lib/utils";

export function StatePanel({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"rounded-md border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground",
				className,
			)}
		>
			{children}
		</div>
	);
}
