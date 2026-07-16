"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Notice } from "@/components/feedback/notice";
import { StatePanel } from "@/components/feedback/state-panel";
import { ActionInputForm } from "@/components/forms/action-input-form";
import { PageHeader } from "@/components/layout/page-header";
import { ResultsFooter } from "@/components/navigation/results-footer";
import { CategorySidebar } from "@/features/catalog/components/category-sidebar";
import {
	catalogCategories,
	getCatalogCategoryCounts,
	type CatalogCategorySlug,
} from "@/features/catalog/lib/catalog-categories";
import { ProductGrid } from "@/features/products/components/product-grid";
import { useSelectedStore } from "@/features/stores/store-context";
import {
	getApiCatalog,
	postApiWatchlistsStoreItems,
	type CatalogProductResponse,
} from "@/lib/api/generated/api";
import { getApiErrorMessage, unwrapApiData } from "@/lib/api/response";

const pageSize = 20;

export function CatalogPage() {
	const { selectedStoreId, selectedStoreName } = useSelectedStore();
	const [activeCategory, setActiveCategory] = useState<CatalogCategorySlug>("all");
	const [isCategorySidebarCollapsed, setIsCategorySidebarCollapsed] = useState(false);
	const [products, setProducts] = useState<CatalogProductResponse[]>([]);
	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [addingProductId, setAddingProductId] = useState<string | null>(null);
	const storeProducts = products.filter((product) => product.store === selectedStoreId);
	const categoryCounts = useMemo(() => getCatalogCategoryCounts(storeProducts), [storeProducts]);
	const selectedCategory = catalogCategories.find((category) => category.slug === activeCategory) ?? catalogCategories[0];
	const filteredProducts = storeProducts
		.filter(selectedCategory.matches)
		.filter((product) => matchesSearch(product, searchTerm));
	const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
	const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const firstVisibleProduct = filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const lastVisibleProduct = Math.min(currentPage * pageSize, filteredProducts.length);

	useEffect(() => {
		let isMounted = true;

		getApiCatalog({ store: selectedStoreId, page: 1, pageSize: 200 })
			.then((response) => {
				if (isMounted) {
					setProducts(unwrapApiData<CatalogProductResponse[]>(response));
					setCurrentPage(1);
					setErrorMessage(null);
				}
			})
			.catch((error) => {
				if (isMounted) {
					setProducts([]);
					setErrorMessage(getApiErrorMessage(error, "Could not load catalog products."));
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

	function handleSearch(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setCurrentPage(1);
		setSearchTerm(searchInput.trim());
	}

	async function handleAddProduct(product: CatalogProductResponse) {
		setAddingProductId(product.id);
		setErrorMessage(null);

		try {
			await postApiWatchlistsStoreItems(selectedStoreId, {
				storeProductId: product.id,
				displayName: product.name,
			});
			setProducts((currentProducts) =>
				currentProducts.map((currentProduct) =>
					currentProduct.id === product.id
						? { ...currentProduct, isWatchlisted: true }
						: currentProduct,
				),
			);
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, "Could not add product to watchlist."));
		} finally {
			setAddingProductId(null);
		}
	}

	return (
		<div className="flex min-h-[calc(100dvh-6.5rem)] flex-col gap-4">
			<PageHeader
				title="Catalog"
				description={`Browse ${selectedStoreName} products and add the ones you want to track.`}
				actions={
					<ActionInputForm
						buttonLabel="Search"
						icon={Search}
						inputLabel="catalog-search"
						onSubmit={handleSearch}
						onValueChange={setSearchInput}
						placeholder="Search products..."
						value={searchInput}
					/>
				}
			/>
			<div className="flex flex-1 flex-col gap-4 md:flex-row md:items-start">
				<CategorySidebar
					activeCategory={activeCategory}
					categoryCounts={categoryCounts}
					isCollapsed={isCategorySidebarCollapsed}
					onCategoryChange={setActiveCategory}
					onCollapsedChange={setIsCategorySidebarCollapsed}
				/>
				<div className="flex min-w-0 flex-1 self-stretch">
					<div className="flex min-h-full w-full flex-col gap-4">
						{errorMessage ? (
							<Notice variant="error">{errorMessage}</Notice>
						) : null}
						{isLoading ? (
							<StatePanel>Loading products...</StatePanel>
						) : visibleProducts.length === 0 ? (
							<StatePanel>No products found.</StatePanel>
						) : (
							<ProductGrid
								products={visibleProducts}
								addingProductId={addingProductId}
								onAddProduct={handleAddProduct}
							/>
						)}
						<ResultsFooter
							currentPage={currentPage}
							firstItem={firstVisibleProduct}
							lastItem={lastVisibleProduct}
							onPageChange={setCurrentPage}
							totalItems={filteredProducts.length}
							totalPages={totalPages}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function matchesSearch(product: CatalogProductResponse, searchTerm: string) {
	if (!searchTerm) return true;

	const normalizedSearchTerm = searchTerm.toLowerCase();
	const searchableText = `${product.name} ${product.brand ?? ""} ${product.sizeLabel ?? ""}`.toLowerCase();

	return searchableText.includes(normalizedSearchTerm);
}
