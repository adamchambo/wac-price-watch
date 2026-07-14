import { ProductCard } from "@/features/products/components/product-card";
import type { CatalogProductMock } from "@/features/products/lib/mock-data";

export function ProductGrid({ products }: { products: CatalogProductMock[] }) {
	return (
		<div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
