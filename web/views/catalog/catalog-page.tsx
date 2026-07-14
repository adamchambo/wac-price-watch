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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGrid } from "@/features/products/components/product-grid";
import { catalogProducts, getStoreTheme, stores } from "@/features/products/lib/mock-data";
import { cn } from "@/lib/utils";

const catalogStores = [stores.Coles, stores.Aldi, stores.Woolworths];
const storeTabClasses = {
	[stores.Coles]: "data-[state=active]:border-red-200 data-[state=active]:bg-red-50 data-[state=active]:text-red-700",
	[stores.Aldi]: "data-[state=active]:border-blue-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700",
	[stores.Woolworths]: "data-[state=active]:border-green-200 data-[state=active]:bg-green-50 data-[state=active]:text-green-700",
};

export function CatalogPage() {
	return (
		<div className="flex h-full flex-col gap-4 overflow-hidden">
			<div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
					<p className="mt-1 text-sm text-muted-foreground">Browse products and add the ones you want to track.</p>
				</div>
				<div className="relative w-full sm:w-96">
					<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
					<Input className="bg-card pl-9 shadow-sm" placeholder="Search products..." />
				</div>
			</div>
			<Tabs defaultValue={String(stores.Coles)} className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
				<TabsList className="shrink-0 justify-start">
					{catalogStores.map((store) => {
						const theme = getStoreTheme(store, true);

						return (
							<TabsTrigger
								key={store}
								value={String(store)}
								className={cn("border border-transparent data-[state=active]:shadow-sm", storeTabClasses[store])}
							>
								{theme.label}
							</TabsTrigger>
						);
					})}
				</TabsList>
				{catalogStores.map((store) => (
					<TabsContent key={store} value={String(store)} className="mt-0 min-h-0 flex-1 overflow-y-auto rounded-lg border bg-card p-4">
						<ProductGrid products={catalogProducts.filter((product) => product.store === store)} />
					</TabsContent>
				))}
			</Tabs>
			<Pagination className="shrink-0">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious />
					</PaginationItem>
					{[1, 2, 3].map((page) => (
						<PaginationItem key={page}>
							<PaginationLink isActive={page === 1}>{page}</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
