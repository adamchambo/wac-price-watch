import Image from "next/image";

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
	imageUrl,
	label,
	className,
}: {
	alt: string;
	imageKey?: CatalogProductMock["imageKey"];
	imageUrl?: string | null;
	label?: string | null;
	className?: string;
}) {
	const fallbackLabel = imageKey ? imageLabels[imageKey] : getProductLabel(label ?? alt);

	return (
		<div
			aria-label={alt}
			className={cn(
				"relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted shadow-inner",
				className,
			)}
			role="img"
		>
			{imageUrl ? (
				<Image
					src={imageUrl}
					alt={alt}
					fill
					sizes="(max-width: 768px) 50vw, 220px"
					className="object-contain p-3"
				/>
			) : (
				<>
			<div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/45" />
			<div className="absolute -left-10 bottom-2 h-24 w-24 rounded-full bg-primary/10" />
			<div className="absolute inset-x-6 bottom-4 h-3 rounded-full bg-black/15 blur-sm" />
			<div
				className="relative flex h-20 w-14 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground shadow-md"
			>
				{fallbackLabel}
			</div>
				</>
			)}
		</div>
	);
}

function getProductLabel(value: string) {
	const words = value.trim().split(/\s+/).filter(Boolean);

	if (words.length === 0) return "Item";

	return words[0].slice(0, 8);
}
