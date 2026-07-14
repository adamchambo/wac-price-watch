export default async function CatalogProductPage({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	const { productId } = await params;

	return <main>Product detail redesign pending for {productId}.</main>;
}
