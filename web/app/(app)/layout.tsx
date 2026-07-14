import { AppShell } from "@/components/layout/app-shell";
import { StoreProvider } from "@/features/stores/store-context";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<StoreProvider>
			<AppShell>{children}</AppShell>
		</StoreProvider>
	);
}
