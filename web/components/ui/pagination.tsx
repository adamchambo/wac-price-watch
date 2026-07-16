import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			aria-label="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		/>
	);
}

export function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

export function PaginationItem({ ...props }: React.ComponentProps<"li">) {
	return <li {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
	size?: ButtonProps["size"];
} & React.ComponentProps<"button">;

export function PaginationLink({
	className,
	isActive,
	size = "icon",
	...props
}: PaginationLinkProps) {
	return (
		<button
			className={cn(
				buttonVariants({
					variant: isActive ? "secondary" : "ghost",
					size,
				}),
				"h-9 min-w-9 px-3",
				isActive && "bg-primary/15 text-primary hover:bg-primary/20",
				className,
			)}
			type="button"
			aria-current={isActive ? "page" : undefined}
			{...props}
		/>
	);
}

export function PaginationPrevious(props: React.ComponentProps<"button">) {
	return (
		<PaginationLink size="default" {...props}>
			<ChevronLeft className="h-4 w-4" />
			<span>Previous</span>
		</PaginationLink>
	);
}

export function PaginationNext(props: React.ComponentProps<"button">) {
	return (
		<PaginationLink size="default" {...props}>
			<span>Next</span>
			<ChevronRight className="h-4 w-4" />
		</PaginationLink>
	);
}

export function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden
			className={cn("flex h-9 w-9 items-center justify-center", className)}
			{...props}
		>
			<MoreHorizontal className="h-4 w-4" />
			<span className="sr-only">More pages</span>
		</span>
	);
}
