import { cn } from "@/lib/utils";

type NoticeVariant = "info" | "success" | "error";

const noticeClasses: Record<NoticeVariant, string> = {
	info: "border-border bg-card text-muted-foreground",
	success: "border-primary/20 bg-primary/10 text-primary",
	error: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function Notice({
	children,
	className,
	variant = "info",
	...props
}: {
	children: React.ReactNode;
	className?: string;
	variant?: NoticeVariant;
} & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("rounded-md border px-4 py-3 text-sm", noticeClasses[variant], className)} {...props}>
			{children}
		</div>
	);
}
