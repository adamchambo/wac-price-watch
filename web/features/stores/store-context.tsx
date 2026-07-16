"use client";

import { createContext, type CSSProperties, useContext, useMemo, useState } from "react";

import { stores, type StoreName } from "@/features/products/lib/mock-data";
import type { Store } from "@/lib/api/generated/api";

export type StoreSlug = "coles" | "aldi" | "woolworths";

const storeBySlug: Record<StoreSlug, Store> = {
	coles: stores.Coles,
	aldi: stores.Aldi,
	woolworths: stores.Woolworths,
};

const storeNameBySlug: Record<StoreSlug, StoreName> = {
	coles: "Coles",
	aldi: "Aldi",
	woolworths: "Woolworths",
};

type StoreContextValue = {
	selectedStore: StoreSlug;
	selectedStoreId: Store;
	selectedStoreName: StoreName;
	selectedStoreTheme: CSSProperties;
	setSelectedStore: (store: StoreSlug) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const storeThemeVariables: Record<StoreSlug, CSSProperties> = {
	coles: {
		"--primary": "#dc2626",
		"--primary-foreground": "#ffffff",
		"--secondary": "#fee2e2",
		"--secondary-foreground": "#7f1d1d",
		"--accent": "#fee2e2",
		"--accent-foreground": "#991b1b",
		"--ring": "#dc2626",
	} as CSSProperties,
	aldi: {
		"--primary": "#2563eb",
		"--primary-foreground": "#ffffff",
		"--secondary": "#dbeafe",
		"--secondary-foreground": "#1e3a8a",
		"--accent": "#dbeafe",
		"--accent-foreground": "#1d4ed8",
		"--ring": "#2563eb",
	} as CSSProperties,
	woolworths: {
		"--primary": "#16a34a",
		"--primary-foreground": "#ffffff",
		"--secondary": "#dcfce7",
		"--secondary-foreground": "#14532d",
		"--accent": "#dcfce7",
		"--accent-foreground": "#166534",
		"--ring": "#16a34a",
	} as CSSProperties,
};

export function StoreProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [selectedStore, setSelectedStore] = useState<StoreSlug>("coles");

	const value = useMemo(
		() => ({
			selectedStore,
			selectedStoreId: storeBySlug[selectedStore],
			selectedStoreName: storeNameBySlug[selectedStore],
			selectedStoreTheme: storeThemeVariables[selectedStore],
			setSelectedStore,
		}),
		[selectedStore],
	);

	return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useSelectedStore() {
	const context = useContext(StoreContext);

	if (!context) {
		throw new Error("useSelectedStore must be used inside StoreProvider.");
	}

	return context;
}
