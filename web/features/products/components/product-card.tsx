import Link from "next/link";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/features/products/components/product-image";
import { formatCurrency, storeNames, type CatalogProductMock } from "@/features/products/lib/mock-data";

export function ProductCard({ product }: { product: CatalogProductMock }) {
	return (
		<Card className="overflow-hidden bg-card shadow-sm transition-colors hover:border-foreground/20">
			<CardContent className="p-3">
				<Link href={`/catalog/${product.routeId}`}>
					<ProductImage imageKey={product.imageKey} alt={product.name} />
				</Link>
				<div className="mt-3 space-y-0.5">
					<Link className="line-clamp-1 font-semibold leading-tight hover:text-primary" href={`/catalog/${product.routeId}`}>
						{product.name}
					</Link>
					<p className="text-sm font-medium">{product.sizeLabel}</p>
					<div className="flex items-end justify-between pt-2">
						<p className="text-xl font-bold tracking-tight">{formatCurrency(product.currentPrice)}</p>
						<p className="text-xs font-medium text-muted-foreground">{storeNames[product.store]}</p>
					</div>
				</div>
				<div className="mt-3 flex items-center gap-2">
					<Button
						className="h-8 flex-1"
						variant={product.isWatchlisted ? "secondary" : "default"}
						disabled={product.isWatchlisted}
					>
						{product.isWatchlisted ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
						{product.isWatchlisted ? "In Watchlist" : "Add"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
