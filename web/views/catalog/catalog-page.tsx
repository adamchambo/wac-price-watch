"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductGrid } from "@/features/products/components/product-grid";
import { catalogProducts } from "@/features/products/lib/mock-data";
import { useSelectedStore } from "@/features/stores/store-context";

const pageSize = 20;

export function CatalogPage() {
	const { selectedStoreId, selectedStoreName } = useSelectedStore();
	const currentPage = 1;
	const storeProducts = catalogProducts.filter((product) => product.store === selectedStoreId);
	const totalPages = Math.max(1, Math.ceil(storeProducts.length / pageSize));
	const paginationPages = Array.from({ length: totalPages }, (_, index) => index + 1);
	const visibleProducts = storeProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const firstVisibleProduct = storeProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const lastVisibleProduct = Math.min(currentPage * pageSize, storeProducts.length);

	return (
		<div className="flex min-h-[calc(100dvh-6.5rem)] flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Browse {selectedStoreName} products and add the ones you want to track.
					</p>
				</div>
				<div className="relative w-full sm:w-96">
					<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
					<Input className="bg-card pl-9 shadow-sm" placeholder="Search products..." />
				</div>
			</div>
			<ProductGrid products={visibleProducts} />
			<div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm text-muted-foreground">
					Showing {firstVisibleProduct}-{lastVisibleProduct} of {storeProducts.length} products
				</p>
				<Pagination className="mx-0 w-auto justify-start sm:justify-end">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious disabled={currentPage === 1} />
						</PaginationItem>
						{paginationPages.map((page) => (
							<PaginationItem key={page}>
								<PaginationLink isActive={page === currentPage}>{page}</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext disabled={currentPage === totalPages} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
