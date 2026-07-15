"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelectedStore, type StoreSlug } from "@/features/stores/store-context";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/catalog", label: "Catalog", icon: Search },
	{ href: "/watchlists", label: "Watchlist", icon: Heart },
	{ href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();
	const { selectedStore, selectedStoreTheme, setSelectedStore } = useSelectedStore();

	return (
		<div data-store={selectedStore} style={selectedStoreTheme} className="min-h-screen bg-[var(--shell)] text-foreground">
			<header className="sticky top-0 z-40 border-b border-border bg-[var(--shell-header)] shadow-sm backdrop-blur">
				<div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
					<Link className="flex items-center gap-3" href="/catalog">
						<Image src="/wac-logo.png" alt="WAC Price Watch" width={30} height={30} />
						<span className="text-base font-black tracking-tight">WAC Price Watch</span>
					</Link>
					<nav className="hidden items-center gap-1 md:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								className={cn(
									"rounded-full px-3.5 py-1.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
									pathname.startsWith(item.href) && "bg-primary text-primary-foreground shadow-sm",
								)}
								href={item.href}
							>
								{item.label}
							</Link>
						))}
					</nav>
					<div className="ml-auto flex items-center gap-3">
						<Select value={selectedStore} onValueChange={(value) => setSelectedStore(value as StoreSlug)}>
							<SelectTrigger className="w-28">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="coles">Coles</SelectItem>
								<SelectItem value="aldi">Aldi</SelectItem>
								<SelectItem value="woolworths">Woolworths</SelectItem>
							</SelectContent>
						</Select>
						<Avatar>
							<AvatarFallback>JD</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</header>
			<main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-7xl px-4 py-4 pb-20 sm:px-6 md:pb-4">
				{children}
			</main>
			<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden">
				<div className="grid h-16 grid-cols-3">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname.startsWith(item.href);

						return (
							<Link
								key={item.href}
								className={cn(
									"flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground",
									isActive && "bg-primary/10 text-primary",
								)}
								href={item.href}
							>
								<Icon className="h-5 w-5" />
								{item.label}
							</Link>
						);
					})}
				</div>
			</nav>
		</div>
	);
}
