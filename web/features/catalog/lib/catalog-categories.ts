import type { CatalogProductResponse } from "@/lib/api/generated/api";

export type CatalogCategorySlug =
	| "all"
	| "specials"
	| "watchlisted"
	| "dairy-eggs"
	| "fruit-veg"
	| "meat-seafood"
	| "bakery"
	| "pantry"
	| "frozen"
	| "snacks-drinks"
	| "household";

type CatalogCategory = {
	slug: CatalogCategorySlug;
	label: string;
	matches: (product: CatalogProductResponse) => boolean;
};

const productText = (product: CatalogProductResponse) =>
	`${product.name} ${product.brand ?? ""} ${product.sizeLabel ?? ""}`.toLowerCase();

const includesAny = (product: CatalogProductResponse, keywords: string[]) => {
	const text = productText(product);

	return keywords.some((keyword) => text.includes(keyword));
};

export const catalogCategories: CatalogCategory[] = [
	{
		slug: "all",
		label: "All products",
		matches: () => true,
	},
	{
		slug: "specials",
		label: "Specials",
		matches: (product) => product.isOnSpecial,
	},
	{
		slug: "watchlisted",
		label: "Watchlisted",
		matches: (product) => product.isWatchlisted,
	},
	{
		slug: "dairy-eggs",
		label: "Dairy & eggs",
		matches: (product) => includesAny(product, ["milk", "cream", "cheese", "yoghurt", "yogurt", "butter", "eggs"]),
	},
	{
		slug: "fruit-veg",
		label: "Fruit & veg",
		matches: (product) => includesAny(product, ["apple", "banana", "berries", "lettuce", "tomato", "potato", "onion"]),
	},
	{
		slug: "meat-seafood",
		label: "Meat & seafood",
		matches: (product) => includesAny(product, ["beef", "chicken", "pork", "lamb", "fish", "salmon", "prawns", "mince"]),
	},
	{
		slug: "bakery",
		label: "Bakery",
		matches: (product) => includesAny(product, ["bread", "rolls", "wraps", "bakery"]),
	},
	{
		slug: "pantry",
		label: "Pantry",
		matches: (product) => includesAny(product, ["cereal", "flakes", "coffee", "tea", "rice", "pasta", "sauce", "oil"]),
	},
	{
		slug: "frozen",
		label: "Frozen",
		matches: (product) => includesAny(product, ["frozen", "ice cream", "peas", "pizza"]),
	},
	{
		slug: "snacks-drinks",
		label: "Snacks & drinks",
		matches: (product) => includesAny(product, ["coca-cola", "cola", "soft drink", "chips", "chocolate", "biscuits"]),
	},
	{
		slug: "household",
		label: "Household",
		matches: (product) => includesAny(product, ["tissue", "toilet", "laundry", "cleaner", "detergent", "paper towel"]),
	},
];

export function getCatalogCategoryCounts(products: CatalogProductResponse[]) {
	return Object.fromEntries(
		catalogCategories.map((category) => [
			category.slug,
			products.filter(category.matches).length,
		]),
	) as Record<CatalogCategorySlug, number>;
}
