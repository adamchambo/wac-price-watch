import { ProductDetailPage } from "@/views/product-detail/product-detail-page";

export default async function CatalogProductPage({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	const { productId } = await params;

	return <ProductDetailPage routeId={productId} source="catalog" />;
}
