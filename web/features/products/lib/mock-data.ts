import type {
	CatalogProductDetailsResponse,
	CatalogProductResponse,
	PriceSnapshotResponse,
	Store,
	WatchlistItemMatchResponse,
	WatchlistItemResponse,
	WatchlistResponse,
} from "@/lib/api/generated/api";

export const stores = {
	Coles: 0,
	Woolworths: 1,
	Aldi: 2,
} as const satisfies Record<string, Store>;

export type StoreName = keyof typeof stores;

export const storeNames: Record<Store, StoreName> = {
	[stores.Coles]: "Coles",
	[stores.Woolworths]: "Woolworths",
	[stores.Aldi]: "Aldi",
};

const storeThemeClasses: Record<Store, { active: string; subtle: string; text: string }> = {
	[stores.Coles]: {
		active: "border-red-200 bg-red-50 text-red-700",
		subtle: "border-red-100 text-red-700",
		text: "text-red-700",
	},
	[stores.Woolworths]: {
		active: "border-green-200 bg-green-50 text-green-700",
		subtle: "border-green-100 text-green-700",
		text: "text-green-700",
	},
	[stores.Aldi]: {
		active: "border-blue-200 bg-blue-50 text-blue-700",
		subtle: "border-blue-100 text-blue-700",
		text: "text-blue-700",
	},
};

export function getStoreTheme(store: Store, active = false) {
	const theme = storeThemeClasses[store] ?? storeThemeClasses[stores.Coles];

	return {
		label: storeNames[store] ?? "Store",
		className: active ? theme.active : theme.subtle,
		textClassName: theme.text,
	};
}

type ProductImageKey = "cola" | "bread" | "milk" | "cereal" | "coffee" | "chips" | "eggs" | "tissue" | "laundry";

export type CatalogProductMock = CatalogProductResponse & {
	imageKey: ProductImageKey;
	routeId: string;
};

export type CatalogProductDetailsMock = CatalogProductDetailsResponse & {
	imageKey: ProductImageKey;
	routeId: string;
};

export type WatchlistItemMatchMock = WatchlistItemMatchResponse & {
	product: CatalogProductMock;
};

export type WatchlistItemMock = Omit<WatchlistItemResponse, "baseProduct" | "matches"> & {
	baseProduct: CatalogProductMock;
	matches: WatchlistItemMatchMock[];
};

export type WatchlistMock = Omit<WatchlistResponse, "items"> & {
	items: WatchlistItemMock[];
};

export type MatchCandidate = CatalogProductMock & {
	matchRouteId: string;
};

const now = "2026-07-14T00:00:00.000Z";

export const catalogProducts = [
	{
		id: "11111111-1111-4111-8111-111111111111",
		routeId: "coke-125",
		store: stores.Coles,
		name: "Coca-Cola Classic",
		brand: "Coca-Cola",
		sizeLabel: "1.25L",
		imageUrl: null,
		imageKey: "cola",
		currentPrice: 2.4,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: true,
	},
	{
		id: "22222222-2222-4222-8222-222222222222",
		routeId: "bread-700",
		store: stores.Coles,
		name: "Wonder White Bread",
		brand: "Wonder",
		sizeLabel: "700g",
		imageUrl: null,
		imageKey: "bread",
		currentPrice: 2.9,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "33333333-3333-4333-8333-333333333333",
		routeId: "milk-2l",
		store: stores.Coles,
		name: "Pauls Full Cream Milk",
		brand: "Pauls",
		sizeLabel: "2L",
		imageUrl: null,
		imageKey: "milk",
		currentPrice: 3.2,
		isOnSpecial: true,
		status: 0,
		isWatchlisted: true,
	},
	{
		id: "44444444-4444-4444-8444-444444444444",
		routeId: "corn-flakes",
		store: stores.Coles,
		name: "Kellogg's Corn Flakes",
		brand: "Kellogg's",
		sizeLabel: "725g",
		imageUrl: null,
		imageKey: "cereal",
		currentPrice: 4.5,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: true,
	},
	{
		id: "55555555-5555-4555-8555-555555555555",
		routeId: "nescafe",
		store: stores.Coles,
		name: "Nescafe Blend 43",
		brand: "Nescafe",
		sizeLabel: "200g",
		imageUrl: null,
		imageKey: "coffee",
		currentPrice: 8,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: true,
	},
	{
		id: "66666666-6666-4666-8666-666666666666",
		routeId: "chips",
		store: stores.Coles,
		name: "Smith's Original Chips",
		brand: "Smith's",
		sizeLabel: "170g",
		imageUrl: null,
		imageKey: "chips",
		currentPrice: 2.75,
		isOnSpecial: true,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "77777777-7777-4777-8777-777777777777",
		routeId: "eggs",
		store: stores.Coles,
		name: "Coles Free Range Eggs",
		brand: "Coles",
		sizeLabel: "12 Pack",
		imageUrl: null,
		imageKey: "eggs",
		currentPrice: 6.5,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "88888888-8888-4888-8888-888888888888",
		routeId: "tissue",
		store: stores.Coles,
		name: "Kleenex Toilet Tissue",
		brand: "Kleenex",
		sizeLabel: "12 Pack",
		imageUrl: null,
		imageKey: "tissue",
		currentPrice: 9,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "99999999-9999-4999-8999-999999999999",
		routeId: "laundry",
		store: stores.Coles,
		name: "Ariel Laundry Liquid",
		brand: "Ariel",
		sizeLabel: "2L",
		imageUrl: null,
		imageKey: "laundry",
		currentPrice: 14,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "aaaa1111-1111-4111-8111-111111111111",
		routeId: "aldi-cola-125",
		store: stores.Aldi,
		name: "Coca-Cola Classic",
		brand: "Coca-Cola",
		sizeLabel: "1.25L",
		imageUrl: null,
		imageKey: "cola",
		currentPrice: 2.35,
		isOnSpecial: true,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "aaaa2222-2222-4222-8222-222222222222",
		routeId: "aldi-bread-700",
		store: stores.Aldi,
		name: "Bakers Life White Bread",
		brand: "Bakers Life",
		sizeLabel: "700g",
		imageUrl: null,
		imageKey: "bread",
		currentPrice: 2.49,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "aaaa3333-3333-4333-8333-333333333333",
		routeId: "aldi-milk-2l",
		store: stores.Aldi,
		name: "Farmdale Full Cream Milk",
		brand: "Farmdale",
		sizeLabel: "2L",
		imageUrl: null,
		imageKey: "milk",
		currentPrice: 3.1,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: true,
	},
	{
		id: "aaaa4444-4444-4444-8444-444444444444",
		routeId: "aldi-corn-flakes",
		store: stores.Aldi,
		name: "Goldenvale Corn Flakes",
		brand: "Goldenvale",
		sizeLabel: "500g",
		imageUrl: null,
		imageKey: "cereal",
		currentPrice: 2.99,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "aaaa5555-5555-4555-8555-555555555555",
		routeId: "aldi-coffee",
		store: stores.Aldi,
		name: "Alcafe Classic Coffee",
		brand: "Alcafe",
		sizeLabel: "200g",
		imageUrl: null,
		imageKey: "coffee",
		currentPrice: 7.5,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: true,
	},
	{
		id: "wwww1111-1111-4111-8111-111111111111",
		routeId: "woolworths-cola-125",
		store: stores.Woolworths,
		name: "Coca-Cola Classic",
		brand: "Coca-Cola",
		sizeLabel: "1.25L",
		imageUrl: null,
		imageKey: "cola",
		currentPrice: 2.6,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "wwww2222-2222-4222-8222-222222222222",
		routeId: "woolworths-bread-700",
		store: stores.Woolworths,
		name: "Wonder White Bread",
		brand: "Wonder",
		sizeLabel: "700g",
		imageUrl: null,
		imageKey: "bread",
		currentPrice: 3,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "wwww3333-3333-4333-8333-333333333333",
		routeId: "woolworths-milk-2l",
		store: stores.Woolworths,
		name: "Dairy Farmers Full Cream Milk",
		brand: "Dairy Farmers",
		sizeLabel: "2L",
		imageUrl: null,
		imageKey: "milk",
		currentPrice: 3.35,
		isOnSpecial: false,
		status: 0,
		isWatchlisted: false,
	},
	{
		id: "wwww4444-4444-4444-8444-444444444444",
		routeId: "woolworths-cereal",
		store: stores.Woolworths,
		name: "Kellogg's Corn Flakes",
		brand: "Kellogg's",
		sizeLabel: "725g",
		imageUrl: null,
		imageKey: "cereal",
		currentPrice: 4.2,
		isOnSpecial: true,
		status: 0,
		isWatchlisted: true,
	},
	{
		id: "wwww5555-5555-4555-8555-555555555555",
		routeId: "woolworths-tissue",
		store: stores.Woolworths,
		name: "Kleenex Toilet Tissue",
		brand: "Kleenex",
		sizeLabel: "12 Pack",
		imageUrl: null,
		imageKey: "tissue",
		currentPrice: 8.5,
		isOnSpecial: true,
		status: 0,
		isWatchlisted: false,
	},
] satisfies CatalogProductMock[];

export const priceSnapshots = [
	{ id: "p-01", price: 2.55, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2025-05-01T00:00:00.000Z" },
	{ id: "p-02", price: 2.25, currency: "AUD", unitPrice: null, wasOnSpecial: true, availabilityStatus: 0, capturedAt: "2025-06-01T00:00:00.000Z" },
	{ id: "p-03", price: 2.48, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2025-07-01T00:00:00.000Z" },
	{ id: "p-04", price: 2.4, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2025-08-01T00:00:00.000Z" },
	{ id: "p-05", price: 2.2, currency: "AUD", unitPrice: null, wasOnSpecial: true, availabilityStatus: 0, capturedAt: "2025-09-01T00:00:00.000Z" },
	{ id: "p-06", price: 2.52, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2025-10-01T00:00:00.000Z" },
	{ id: "p-07", price: 2.3, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2025-11-01T00:00:00.000Z" },
	{ id: "p-08", price: 2.28, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2025-12-01T00:00:00.000Z" },
	{ id: "p-09", price: 2.48, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2026-01-01T00:00:00.000Z" },
	{ id: "p-10", price: 2.31, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2026-02-01T00:00:00.000Z" },
	{ id: "p-11", price: 2.28, currency: "AUD", unitPrice: null, wasOnSpecial: false, availabilityStatus: 0, capturedAt: "2026-03-01T00:00:00.000Z" },
	{ id: "p-12", price: 1.95, currency: "AUD", unitPrice: null, wasOnSpecial: true, availabilityStatus: 0, capturedAt: "2026-04-01T00:00:00.000Z" },
] satisfies PriceSnapshotResponse[];

export const selectedProduct = {
	...catalogProducts[0],
	productUrl: "https://www.coles.com.au/product/coca-cola-classic-soft-drink-bottle-1.25l",
	storeSku: "COL-CC-125",
	lastCheckedAt: now,
	priceHistory: priceSnapshots,
} satisfies CatalogProductDetailsMock;

const aldiCoke = {
	id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
	routeId: "aldi-coke-125",
	store: stores.Aldi,
	name: "Coca-Cola Classic",
	brand: "Coca-Cola",
	sizeLabel: "1.25L",
	imageUrl: null,
	imageKey: "cola",
	currentPrice: 2.35,
	isOnSpecial: true,
	status: 0,
	isWatchlisted: false,
} satisfies CatalogProductMock;

const woolworthsCoke = {
	id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
	routeId: "woolworths-coke-125",
	store: stores.Woolworths,
	name: "Coca-Cola Classic",
	brand: "Coca-Cola",
	sizeLabel: "1.25L",
	imageUrl: null,
	imageKey: "cola",
	currentPrice: 2.6,
	isOnSpecial: false,
	status: 0,
	isWatchlisted: false,
} satisfies CatalogProductMock;

export const watchlistItems = [
	{
		id: "wl-11111111-1111-4111-8111-111111111111",
		baseStoreProductId: catalogProducts[0].id,
		displayName: "Coca-Cola Classic 1.25L",
		baseProduct: catalogProducts[0],
		matches: [
			{ id: "match-aldi-coke", storeProductId: aldiCoke.id, product: aldiCoke, createdAt: now },
			{ id: "match-ww-coke", storeProductId: woolworthsCoke.id, product: woolworthsCoke, createdAt: now },
		],
		addedAt: "2026-06-30T00:00:00.000Z",
	},
	{
		id: "wl-55555555-5555-4555-8555-555555555555",
		baseStoreProductId: catalogProducts[4].id,
		displayName: "Nescafe Blend 43 200g",
		baseProduct: catalogProducts[4],
		matches: [
			{
				id: "match-aldi-coffee",
				storeProductId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
				product: { ...catalogProducts[4], id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", routeId: "aldi-coffee", store: stores.Aldi, currentPrice: 7.5 },
				createdAt: now,
			},
			{
				id: "match-ww-coffee",
				storeProductId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
				product: { ...catalogProducts[4], id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", routeId: "ww-coffee", store: stores.Woolworths, currentPrice: 7.8 },
				createdAt: now,
			},
		],
		addedAt: "2026-07-02T00:00:00.000Z",
	},
	{
		id: "wl-44444444-4444-4444-8444-444444444444",
		baseStoreProductId: catalogProducts[3].id,
		displayName: "Kellogg's Corn Flakes 725g",
		baseProduct: catalogProducts[3],
		matches: [
			{
				id: "match-ww-cereal",
				storeProductId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
				product: { ...catalogProducts[3], id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", routeId: "ww-cereal", store: stores.Woolworths, currentPrice: 4.2 },
				createdAt: now,
			},
		],
		addedAt: "2026-07-04T00:00:00.000Z",
	},
] satisfies WatchlistItemMock[];

export const watchlist = {
	id: "watchlist-coles",
	store: stores.Coles,
	name: "Coles Watchlist",
	items: watchlistItems,
} satisfies WatchlistMock;

export const matchCandidates = [
	{ ...woolworthsCoke, matchRouteId: "candidate-ww-coke-125" },
	{ ...woolworthsCoke, id: "candidate-2", routeId: "candidate-coke-2l", matchRouteId: "candidate-coke-2l", sizeLabel: "2L", currentPrice: 3.5 },
	{ ...woolworthsCoke, id: "candidate-3", routeId: "candidate-no-sugar", matchRouteId: "candidate-no-sugar", name: "Coca-Cola No Sugar", currentPrice: 2.6 },
	{ ...woolworthsCoke, id: "candidate-4", routeId: "candidate-diet-coke", matchRouteId: "candidate-diet-coke", name: "Diet Coke", currentPrice: 2.6 },
	{ ...woolworthsCoke, id: "candidate-5", routeId: "candidate-coke-600", matchRouteId: "candidate-coke-600", sizeLabel: "600mL", currentPrice: 1.8 },
] satisfies MatchCandidate[];

export function formatCurrency(value: number | string | null | undefined) {
	const numberValue = Number(value ?? 0);

	return new Intl.NumberFormat("en-AU", {
		style: "currency",
		currency: "AUD",
	}).format(numberValue);
}

export function formatDateLabel(value: string | null | undefined) {
	if (!value) return "Not checked yet";

	return new Intl.DateTimeFormat("en-AU", {
		month: "short",
		day: "numeric",
	}).format(new Date(value));
}

export function getProductByRouteId(routeId: string) {
	return catalogProducts.find((product) => product.routeId === routeId) ?? catalogProducts[0];
}

export function getWatchlistItemByRouteId(routeId: string) {
	return watchlistItems.find((item) => item.baseProduct.routeId === routeId || item.id === routeId) ?? watchlistItems[0];
}

export function getMatchForStore(item: WatchlistItemMock, store: Store) {
	return item.matches.find((match) => match.product.store === store);
}

export function getLowestMatchPrice(item: WatchlistItemMock) {
	const products = [item.baseProduct, ...item.matches.map((match) => match.product)];

	return products.reduce((lowest, product) => {
		const price = Number(product.currentPrice ?? Number.POSITIVE_INFINITY);
		return price < Number(lowest.currentPrice ?? Number.POSITIVE_INFINITY) ? product : lowest;
	}, products[0]);
}
