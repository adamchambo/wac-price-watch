"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, LinkIcon, Plus, Trash2 } from "lucide-react";

import { Notice } from "@/components/feedback/notice";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PriceHistoryChart } from "@/features/products/components/price-history-chart";
import { ProductImage } from "@/features/products/components/product-image";
import { StoreLogo } from "@/features/products/components/store-logo";
import {
	formatCurrency,
	getMatchForStore,
	getStoreTheme,
	storeNames,
	stores,
} from "@/features/products/lib/mock-data";
import { useSelectedStore } from "@/features/stores/store-context";
import {
	deleteApiWatchlistsItemsWatchlistItemId,
	getApiCatalogProductId,
	getApiWatchlistsStoreItemsWatchlistItemId,
	postApiWatchlistsStoreItems,
	type CatalogProductDetailsResponse,
	type CatalogProductResponse,
	type PriceSnapshotResponse,
	type WatchlistItemMatchResponse,
	type WatchlistItemResponse,
} from "@/lib/api/generated/api";
import { getApiErrorMessage, unwrapApiData } from "@/lib/api/response";
import { cn } from "@/lib/utils";

const productVariantStores = [stores.Coles, stores.Aldi, stores.Woolworths];
type ProductLike = CatalogProductResponse | CatalogProductDetailsResponse;

export function ProductDetailPage({
	routeId,
	source = "catalog",
}: {
	routeId?: string;
	source?: "catalog" | "watchlist";
}) {
	const { selectedStoreId } = useSelectedStore();
	const [productDetails, setProductDetails] = useState<CatalogProductDetailsResponse | null>(null);
	const [watchlistItem, setWatchlistItem] = useState<WatchlistItemResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isMutatingWatchlist, setIsMutatingWatchlist] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const backHref = source === "watchlist" ? "/watchlists" : "/catalog";

	useEffect(() => {
		let isMounted = true;

		if (source === "watchlist") {
			getApiWatchlistsStoreItemsWatchlistItemId(selectedStoreId, routeId ?? "")
				.then((response) => {
				if (!isMounted) return;

					const item = unwrapApiData<WatchlistItemResponse>(response);
					setWatchlistItem(item);
					setProductDetails(toDetailsResponse(item.baseProduct, []));
					setErrorMessage(null);
				})
				.catch((error) => {
					if (isMounted) {
						setProductDetails(null);
						setWatchlistItem(null);
						setErrorMessage(getApiErrorMessage(error, "Could not load product."));
					}
				})
				.finally(() => {
					if (isMounted) {
						setIsLoading(false);
					}
				});
		} else {
			getApiCatalogProductId(routeId ?? "")
				.then((response) => {
					if (!isMounted) return;

					setWatchlistItem(null);
					setProductDetails(unwrapApiData<CatalogProductDetailsResponse>(response));
					setErrorMessage(null);
				})
				.catch((error) => {
					if (isMounted) {
						setProductDetails(null);
						setWatchlistItem(null);
						setErrorMessage(getApiErrorMessage(error, "Could not load product."));
					}
				})
				.finally(() => {
					if (isMounted) {
						setIsLoading(false);
					}
				});
		}

		return () => {
			isMounted = false;
		};
	}, [routeId, selectedStoreId, source]);

	const product = watchlistItem?.baseProduct ?? productDetails;
	const aldiMatch = watchlistItem ? getMatchForStore(watchlistItem, stores.Aldi) : undefined;
	const woolworthsMatch = watchlistItem ? getMatchForStore(watchlistItem, stores.Woolworths) : undefined;
	const priceHistory = productDetails?.priceHistory ?? [];
	const prices = priceHistory.map((point) => Number(point.price ?? 0));
	const fallbackPrice = Number(product?.currentPrice ?? 0);
	const priceValues = prices.length > 0 ? prices : [fallbackPrice];
	const lowest = Math.min(...priceValues);
	const highest = Math.max(...priceValues);
	const average = priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length;

	async function handleAddToWatchlist() {
		if (!product) return;

		setIsMutatingWatchlist(true);
		setErrorMessage(null);

		try {
			const item = unwrapApiData<WatchlistItemResponse>(
				await postApiWatchlistsStoreItems(selectedStoreId, {
					storeProductId: product.id,
					displayName: product.name,
				}),
			);
			setWatchlistItem(item);
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, "Could not add product to watchlist."));
		} finally {
			setIsMutatingWatchlist(false);
		}
	}

	async function handleDeleteFromWatchlist() {
		if (!watchlistItem) return;

		setIsMutatingWatchlist(true);
		setErrorMessage(null);

		try {
			await deleteApiWatchlistsItemsWatchlistItemId(watchlistItem.id);
			setWatchlistItem(null);
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, "Could not remove product from watchlist."));
		} finally {
			setIsMutatingWatchlist(false);
		}
	}

	if (isLoading) {
		return (
			<div className="mx-auto max-w-7xl px-6 py-6 pb-16 lg:px-8 md:pb-6">
				<StatePanel>Loading product...</StatePanel>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="mx-auto max-w-7xl px-6 py-6 pb-16 lg:px-8 md:pb-6">
				<Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground" href={backHref}>
					<ArrowLeft className="h-4 w-4" />
					Back to {source === "watchlist" ? "watchlist" : "results"}
				</Link>
				<Notice variant="error">{errorMessage ?? "Product not found."}</Notice>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-6 py-6 pb-16 lg:px-8 md:pb-6">
			{errorMessage ? (
				<Notice className="mb-4" variant="error">{errorMessage}</Notice>
			) : null}
			<Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground" href={backHref}>
				<ArrowLeft className="h-4 w-4" />
				Back to {source === "watchlist" ? "watchlist" : "results"}
			</Link>
			<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
				<Card className="h-fit self-start lg:col-span-8">
					<CardContent className="p-6">
						<div className="grid gap-6 md:grid-cols-[144px_minmax(0,1fr)_auto] md:items-start">
							<ProductImage
								imageUrl={product.imageUrl}
								label={product.brand ?? product.name}
								alt={product.name}
								className="h-36"
							/>
							<div className="min-w-0 space-y-3">
								<div className="min-w-0">
									<p className={cn("text-sm font-medium", getStoreTheme(product.store).textClassName)}>
										{storeNames[product.store]}
									</p>
									<h1 className="mt-1 text-xl font-semibold tracking-tight">{product.name}</h1>
									<p className="mt-1 text-base text-muted-foreground">{product.sizeLabel}</p>
								</div>
								{productDetails?.productUrl ? (
									<a
										className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
										href={productDetails.productUrl}
									>
										<LinkIcon className="h-4 w-4" />
										View on {storeNames[product.store]}
										<ExternalLink className="h-4 w-4" />
									</a>
								) : null}
							</div>
							<div className="flex flex-col items-start gap-3 md:items-end md:text-right">
								<p className="text-3xl font-semibold leading-none">{formatCurrency(product.currentPrice)}</p>
								<p className="text-sm text-muted-foreground">Checked 1 day ago</p>
								{watchlistItem ? (
									<Button size="sm" variant="destructive" disabled={isMutatingWatchlist} onClick={handleDeleteFromWatchlist}>
										<Trash2 className="h-4 w-4" />
										{isMutatingWatchlist ? "Removing..." : "Delete from watchlist"}
									</Button>
								) : (
									<Button size="sm" disabled={isMutatingWatchlist} onClick={handleAddToWatchlist}>
										<Plus className="h-4 w-4" />
										{isMutatingWatchlist ? "Adding..." : "Add to watchlist"}
									</Button>
								)}
							</div>
						</div>
						<Separator className="my-6" />
						<PriceStatsGrid current={product.currentPrice} lowest={lowest} highest={highest} average={average} />
					</CardContent>
				</Card>
				<Card className="h-fit self-start lg:col-span-4">
					<CardHeader className="px-5 py-4">
						<CardTitle className="text-base">Store variants</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3 p-5 pt-0">
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
				<PriceHistoryChart data={priceHistory} className="lg:col-span-12" />
			</div>
		</div>
	);
}

function PriceStatsGrid({
	current,
	lowest,
	highest,
	average,
}: {
	current: number | string | null;
	lowest: number;
	highest: number;
	average: number;
}) {
	const stats = [
		{ label: "Current price", value: current },
		{ label: "Lowest price", value: lowest, className: "text-primary" },
		{ label: "Highest price", value: highest, className: "text-destructive" },
		{ label: "Average price", value: average },
	];

	return (
		<div className="grid grid-cols-2 overflow-hidden rounded-md border md:grid-cols-4">
			{stats.map((stat, index) => (
				<div
					key={stat.label}
					className={cn(
						"p-3 text-center",
						index % 2 === 1 && "border-l",
						index > 1 && "border-t md:border-t-0",
						index > 0 && "md:border-l",
					)}
				>
					<p className="text-xs text-muted-foreground">{stat.label}</p>
					<p className={cn("mt-1 text-lg font-semibold", stat.className)}>
						{formatCurrency(stat.value)}
					</p>
				</div>
			))}
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
	product?: ProductLike;
	match?: WatchlistItemMatchResponse;
	isBase?: boolean;
}) {
	const theme = getStoreTheme(store, Boolean(product));
	const storeName = storeNames[store];

	return (
		<div className={cn("flex min-h-20 items-center justify-between gap-3 rounded-lg border p-4", isBase ? "bg-primary/10" : "bg-card")}>
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<StoreLogo store={storeName} />
					<div className="min-w-0">
						<p className="font-medium leading-tight">{storeName}</p>
						<p className="text-sm text-muted-foreground">{isBase ? "Source product" : match ? "Matched variant" : "No match added"}</p>
					</div>
				</div>
			</div>
			{product ? (
				<p className={cn("shrink-0 text-sm font-semibold", isBase && theme.textClassName)}>{formatCurrency(product.currentPrice)}</p>
			) : (
				<Button size="sm" variant="outline" disabled title="Match management is not available yet.">
					<Plus className="h-4 w-4" />
					Find match
				</Button>
			)}
		</div>
	);
}

function toDetailsResponse(
	product: CatalogProductResponse,
	priceHistory: PriceSnapshotResponse[],
): CatalogProductDetailsResponse {
	return {
		...product,
		productUrl: "",
		storeSku: null,
		lastCheckedAt: null,
		priceHistory,
	};
}
