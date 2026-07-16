import { ProductDetailPage } from "@/views/product-detail/product-detail-page";

export default async function WatchlistItemPage({
	params,
}: {
	params: Promise<{ watchlistItemId: string }>;
}) {
	const { watchlistItemId } = await params;

	return <ProductDetailPage routeId={watchlistItemId} source="watchlist" />;
}
