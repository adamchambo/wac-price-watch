export default async function CatalogProductPage({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	const { productId } = await params;

	return <main>Catalog product: {productId}</main>;
}
