import { ProductCard } from "@/features/products/components/product-card";
import type { CatalogProductMock } from "@/features/products/lib/mock-data";

export function ProductGrid({ products }: { products: CatalogProductMock[] }) {
	return (
		<div className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 xl:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
