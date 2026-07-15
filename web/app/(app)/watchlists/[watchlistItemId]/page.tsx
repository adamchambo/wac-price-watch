export default async function WatchlistItemPage({
	params,
}: {
	params: Promise<{ watchlistItemId: string }>;
}) {
	const { watchlistItemId } = await params;

	return <main>Watchlist item: {watchlistItemId}</main>;
}
