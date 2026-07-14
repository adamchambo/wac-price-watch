import type { CatalogProductMock } from "@/features/products/lib/mock-data";
import { cn } from "@/lib/utils";

const imageLabels: Record<CatalogProductMock["imageKey"], string> = {
	cola: "Cola",
	bread: "Bread",
	milk: "Milk",
	cereal: "Corn",
	coffee: "Blend",
	chips: "Chips",
	eggs: "Eggs",
	tissue: "Tissue",
	laundry: "Ariel",
};

export function ProductImage({
	alt,
	imageKey,
	className,
}: {
	alt: string;
	imageKey: CatalogProductMock["imageKey"];
	className?: string;
}) {
	return (
		<div
			aria-label={alt}
			className={cn(
				"relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted shadow-inner",
				className,
			)}
			role="img"
		>
			<div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/45" />
			<div className="absolute -left-10 bottom-2 h-24 w-24 rounded-full bg-primary/10" />
			<div className="absolute inset-x-6 bottom-4 h-3 rounded-full bg-black/15 blur-sm" />
			<div
				className="relative flex h-20 w-14 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground shadow-md"
			>
				{imageLabels[imageKey]}
			</div>
		</div>
	);
}
