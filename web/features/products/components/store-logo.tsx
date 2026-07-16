import Image from "next/image";

import { cn } from "@/lib/utils";
import type { StoreName } from "@/features/products/lib/product-utils";

const storeStyles: Record<StoreName, string> = {
	Coles: "bg-red-600 text-white",
	Aldi: "bg-blue-700 text-yellow-300",
	Woolworths: "bg-green-600 text-white",
};

export function StoreLogo({
	store,
	className,
}: {
	store: StoreName;
	className?: string;
}) {
	if (store === "Coles") {
		return <Image src="/wac-logo.png" alt={store} width={28} height={28} className={className} />;
	}

	return (
		<div
			className={cn(
				"flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold",
				storeStyles[store],
				className,
			)}
		>
			{store === "Woolworths" ? "W" : "A"}
		</div>
	);
}
