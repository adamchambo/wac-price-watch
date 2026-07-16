"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Notice } from "@/components/feedback/notice";
import { StatePanel } from "@/components/feedback/state-panel";
import { ActionInputForm } from "@/components/forms/action-input-form";
import { PageHeader } from "@/components/layout/page-header";
import { ResultsFooter } from "@/components/navigation/results-footer";
import { WatchlistComparisonTable } from "@/features/watchlists/components/watchlist-comparison-table";
import { useSelectedStore } from "@/features/stores/store-context";
import {
	deleteApiWatchlistsItemsWatchlistItemId,
	getApiWatchlistsStoreItems,
	postApiWatchlistsStoreItemsByUrl,
	type WatchlistItemResponse,
	type WatchlistResponse,
} from "@/lib/api/generated/api";
import { getApiErrorMessage, unwrapApiData } from "@/lib/api/response";

const pageSize = 20;

export function WatchlistOverviewPage() {
	const { selectedStoreId } = useSelectedStore();
	const [watchlistItems, setWatchlistItems] = useState<WatchlistItemResponse[]>([]);
	const [productUrl, setProductUrl] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [isAdding, setIsAdding] = useState(false);
	const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const totalPages = Math.max(1, Math.ceil(watchlistItems.length / pageSize));
	const visibleItems = watchlistItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const firstVisibleItem = watchlistItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const lastVisibleItem = Math.min(currentPage * pageSize, watchlistItems.length);

	useEffect(() => {
		let isMounted = true;

		getApiWatchlistsStoreItems(selectedStoreId, { page: 1, pageSize: 200 })
			.then((response) => {
				if (isMounted) {
					const watchlist = unwrapApiData<WatchlistResponse | null>(response);
					setWatchlistItems(watchlist?.items ?? []);
					setCurrentPage(1);
					setErrorMessage(null);
				}
			})
			.catch((error) => {
				if (isMounted) {
					setWatchlistItems([]);
					setErrorMessage(getApiErrorMessage(error, "Could not load watchlist."));
				}
			})
			.finally(() => {
				if (isMounted) {
					setIsLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [selectedStoreId]);

	async function handleAddByUrl(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmedUrl = productUrl.trim();
		if (!trimmedUrl) return;

		setIsAdding(true);
		setStatusMessage(null);
		setErrorMessage(null);

		try {
			const item = unwrapApiData<WatchlistItemResponse>(
				await postApiWatchlistsStoreItemsByUrl(selectedStoreId, {
					productUrl: trimmedUrl,
					displayName: null,
				}),
			);

			setWatchlistItems((currentItems) => [
				item,
				...currentItems.filter((currentItem) => currentItem.id !== item.id),
			]);
			setProductUrl("");
			setStatusMessage("Added to watchlist.");
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, "Could not add product URL."));
		} finally {
			setIsAdding(false);
		}
	}

	async function handleDeleteItem(item: WatchlistItemResponse) {
		setDeletingItemId(item.id);
		setStatusMessage(null);
		setErrorMessage(null);

		try {
			await deleteApiWatchlistsItemsWatchlistItemId(item.id);
			setWatchlistItems((currentItems) => currentItems.filter((currentItem) => currentItem.id !== item.id));
			setStatusMessage("Removed from watchlist.");
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, "Could not remove watchlist item."));
		} finally {
			setDeletingItemId(null);
		}
	}

	return (
		<div className="flex h-full flex-col gap-4 overflow-hidden pb-16 md:pb-0">
			<PageHeader
				title="Watchlist"
				description="Monitor tracked products and keep cross-store comparisons clean."
				actions={
					<ActionInputForm
						buttonLabel={isAdding ? "Adding..." : "Add"}
						disabled={isAdding || !productUrl.trim()}
						icon={Plus}
						inputLabel="watchlist-product-url"
						inputType="url"
						onSubmit={handleAddByUrl}
						onValueChange={setProductUrl}
						placeholder="Paste a product URL..."
						value={productUrl}
					/>
				}
			/>
			{statusMessage ? (
				<Notice variant="success" role="status">{statusMessage}</Notice>
			) : null}
			{errorMessage ? (
				<Notice variant="error">{errorMessage}</Notice>
			) : null}
			<div className="min-h-0 flex-1 overflow-auto rounded-md border border-border bg-card p-3 shadow-sm">
				{isLoading ? (
					<StatePanel className="border-0 shadow-none">Loading watchlist...</StatePanel>
				) : visibleItems.length === 0 ? (
					<StatePanel className="border-0 shadow-none">No watchlist items yet.</StatePanel>
				) : (
					<WatchlistComparisonTable
						items={visibleItems}
						deletingItemId={deletingItemId}
						onDeleteItem={handleDeleteItem}
					/>
				)}
			</div>
			<ResultsFooter
				currentPage={currentPage}
				firstItem={firstVisibleItem}
				lastItem={lastVisibleItem}
				onPageChange={setCurrentPage}
				totalItems={watchlistItems.length}
				totalPages={totalPages}
			/>
		</div>
	);
}
