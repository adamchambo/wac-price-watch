import type {
	CatalogProductResponse,
	Store,
	WatchlistItemResponse,
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

export function formatCurrency(value: number | string | null | undefined) {
	if (value == null || value === "") return "Unavailable";

	const numericValue = Number(value);

	if (!Number.isFinite(numericValue) || numericValue <= 0) return "Unavailable";

	return new Intl.NumberFormat("en-AU", {
		style: "currency",
		currency: "AUD",
		maximumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
	}).format(numericValue);
}

export function getMatchForStore(item: WatchlistItemResponse, store: Store) {
	return item.matches.find((match) => match.product.store === store);
}

export function getLowestMatchPrice(item: WatchlistItemResponse): CatalogProductResponse {
	return [item.baseProduct, ...item.matches.map((match) => match.product)]
		.filter((product) => product.currentPrice != null)
		.reduce((lowest, product) =>
			Number(product.currentPrice) < Number(lowest.currentPrice) ? product : lowest,
		item.baseProduct);
}
