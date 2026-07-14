import { cn } from "@/lib/utils";
import type { CatalogProductMock } from "@/features/products/lib/mock-data";

const artStyles: Record<CatalogProductMock["imageKey"], { bg: string; label: string; shape: string }> = {
	cola: { bg: "from-[#ffe3d8] via-[#fff8ef] to-[#f4dfd0]", label: "Cola", shape: "bg-[#c82818]" },
	bread: { bg: "from-[#ffe9b8] via-[#fff8e9] to-[#ead49b]", label: "Bread", shape: "bg-[#c17a22]" },
	milk: { bg: "from-[#d9edff] via-[#fff8ef] to-[#cfe2ef]", label: "Milk", shape: "bg-[#2368a7]" },
	cereal: { bg: "from-[#fff0a9] via-[#fff8ef] to-[#f3c76a]", label: "Corn", shape: "bg-[#d39a12]" },
	coffee: { bg: "from-[#d4c0a9] via-[#fff8ef] to-[#b89572]", label: "Blend", shape: "bg-[#3b251a]" },
	chips: { bg: "from-[#d5e8ff] via-[#fff8ef] to-[#f5d55d]", label: "Chips", shape: "bg-[#185aa6]" },
	eggs: { bg: "from-[#e6f5c7] via-[#fff8ef] to-[#d8c6a7]", label: "Eggs", shape: "bg-[#5c8d2c]" },
	tissue: { bg: "from-[#d6efff] via-[#fff8ef] to-[#bcd8ea]", label: "Tissue", shape: "bg-[#43a6cf]" },
	laundry: { bg: "from-[#c9f2dc] via-[#fff8ef] to-[#a8d5b4]", label: "Ariel", shape: "bg-[#17965d]" },
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
	const art = artStyles[imageKey];

	return (
		<div
			aria-label={alt}
			className={cn(
				"relative flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border border-primary/10 bg-gradient-to-br shadow-inner",
				art.bg,
				className,
			)}
			role="img"
		>
			<div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/45" />
			<div className="absolute -left-10 bottom-2 h-24 w-24 rounded-full bg-primary/10" />
			<div className="absolute inset-x-6 bottom-4 h-3 rounded-full bg-black/15 blur-sm" />
			<div
				className={cn(
					"relative flex h-20 w-12 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-md",
					art.shape,
				)}
			>
				{art.label}
			</div>
		</div>
	);
}
