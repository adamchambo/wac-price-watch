import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, LinkIcon, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceHistoryChart } from "@/features/products/components/price-history-chart";
import { PriceStats } from "@/features/products/components/price-stats";
import { ProductImage } from "@/features/products/components/product-image";
import { StoreLogo } from "@/features/products/components/store-logo";
import {
	formatCurrency,
	getMatchForStore,
	getProductByRouteId,
	getStoreTheme,
	getWatchlistItemByRouteId,
	selectedProduct,
	storeNames,
	stores,
	type CatalogProductMock,
	type WatchlistItemMatchMock,
} from "@/features/products/lib/mock-data";
import { cn } from "@/lib/utils";

const productVariantStores = [stores.Coles, stores.Aldi, stores.Woolworths];

export function ProductDetailPage({
	routeId,
	source = "catalog",
}: {
	routeId?: string;
	source?: "catalog" | "watchlist";
}) {
	const watchlistItem = source === "watchlist" ? getWatchlistItemByRouteId(routeId ?? "") : null;
	const product = watchlistItem?.baseProduct ?? getProductByRouteId(routeId ?? selectedProduct.routeId);
	const details = product.routeId === selectedProduct.routeId ? selectedProduct : { ...selectedProduct, ...product };
	const backHref = source === "watchlist" ? "/watchlists" : "/catalog";
	const aldiMatch = watchlistItem ? getMatchForStore(watchlistItem, stores.Aldi) : undefined;
	const woolworthsMatch = watchlistItem ? getMatchForStore(watchlistItem, stores.Woolworths) : undefined;
	const prices = details.priceHistory.map((point) => Number(point.price ?? 0));
	const lowest = Math.min(...prices);
	const highest = Math.max(...prices);
	const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

	return (
		<div className="flex h-full flex-col gap-4 overflow-hidden pb-16 md:pb-0">
			<Link className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground" href={backHref}>
				<ArrowLeft className="h-4 w-4" />
				Back to {source === "watchlist" ? "watchlist" : "results"}
			</Link>
			<div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
				<Card>
					<CardContent className="grid gap-5 p-4 md:grid-cols-[180px_1fr]">
						<ProductImage
							imageKey={product.imageKey}
							alt={product.name}
							className="h-44"
						/>
						<div className="flex min-w-0 flex-col gap-4">
							<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
								<div className="min-w-0">
									<p className={cn("text-sm font-medium", getStoreTheme(product.store).textClassName)}>
										{storeNames[product.store]}
									</p>
									<h1 className="mt-1 text-2xl font-semibold tracking-tight">{product.name}</h1>
									<p className="mt-1 text-base text-muted-foreground">{product.sizeLabel}</p>
								</div>
								<div className="text-left md:text-right">
									<p className="text-3xl font-semibold">{formatCurrency(product.currentPrice)}</p>
									<p className="mt-1 text-sm text-muted-foreground">Last checked: 1 day ago</p>
								</div>
							</div>
							<a
								className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
								href={details.productUrl}
							>
								<LinkIcon className="h-4 w-4" />
								View on Coles
								<ExternalLink className="h-4 w-4" />
							</a>
							<div className="flex flex-wrap items-center gap-2 pt-1">
								{!watchlistItem ? (
									<Button>
										<Check className="h-4 w-4" />
										{product.isWatchlisted ? "In Watchlist" : "Add to watchlist"}
									</Button>
								) : (
									<Button variant="destructive">
										<Trash2 className="h-4 w-4" />
										Delete from watchlist
									</Button>
								)}
								{watchlistItem ? <p>Added to watchlist: 2 weeks ago</p> : null}
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Store variants</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3 md:grid-cols-3">
						{productVariantStores.map((store) => {
							const match = store === product.store ? undefined : store === stores.Aldi ? aldiMatch : woolworthsMatch;
							const variantProduct = store === product.store ? product : match?.product;

							return (
								<ProductVariantCard
									key={store}
									store={store}
									product={variantProduct}
									match={match}
									isBase={store === product.store}
								/>
							);
						})}
					</CardContent>
				</Card>
				<PriceHistoryChart data={details.priceHistory} />
				<PriceStats current={product.currentPrice} lowest={lowest} highest={highest} average={average} />
			</div>
		</div>
	);
}

function ProductVariantCard({
	store,
	product,
	match,
	isBase,
}: {
	store: typeof stores.Coles | typeof stores.Aldi | typeof stores.Woolworths;
	product?: CatalogProductMock;
	match?: WatchlistItemMatchMock;
	isBase?: boolean;
}) {
	const theme = getStoreTheme(store, Boolean(product));
	const storeName = storeNames[store];

	return (
		<div className={cn("rounded-lg border p-4", product ? theme.className : "border-dashed bg-muted/30")}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<StoreLogo store={storeName} />
					<div className="min-w-0">
						<p className="font-medium">{storeName}</p>
						<p className="text-xs text-muted-foreground">{isBase ? "Source product" : match ? "Matched variant" : "No variant added"}</p>
					</div>
				</div>
				{product ? <p className="shrink-0 text-sm font-semibold">{formatCurrency(product.currentPrice)}</p> : null}
			</div>
			{product ? (
				<p className="mt-4 line-clamp-2 text-sm">
					{product.name} {product.sizeLabel}
				</p>
			) : (
				<div className="mt-4 space-y-3">
					<p className="text-sm text-muted-foreground">Add this store&apos;s matching product to compare prices.</p>
					<Button size="sm" variant="outline">
						<Plus className="h-4 w-4" />
						Find match
					</Button>
				</div>
			)}
		</div>
	);
}
