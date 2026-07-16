import { ProductCard } from "@/features/products/components/product-card";
import type { CatalogProductResponse } from "@/lib/api/generated/api";

export function ProductGrid({
	products,
	addingProductId,
	onAddProduct,
}: {
	products: CatalogProductResponse[];
	addingProductId?: string | null;
	onAddProduct?: (product: CatalogProductResponse) => void;
}) {
	return (
		<div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					isAdding={addingProductId === product.id}
					onAdd={onAddProduct}
				/>
			))}
		</div>
	);
}
