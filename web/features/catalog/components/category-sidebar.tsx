import {
	Apple,
	BadgePercent,
	Beef,
	ChevronsLeft,
	ChevronsRight,
	Coffee,
	Croissant,
	Heart,
	Home,
	Milk,
	Package,
	ShoppingBasket,
	Snowflake,
	type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	catalogCategories,
	type CatalogCategorySlug,
} from "@/features/catalog/lib/catalog-categories";
import { cn } from "@/lib/utils";

const categoryIcons: Record<CatalogCategorySlug, LucideIcon> = {
	all: ShoppingBasket,
	specials: BadgePercent,
	watchlisted: Heart,
	"dairy-eggs": Milk,
	"fruit-veg": Apple,
	"meat-seafood": Beef,
	bakery: Croissant,
	pantry: Package,
	frozen: Snowflake,
	"snacks-drinks": Coffee,
	household: Home,
};

export function CategorySidebar({
	activeCategory,
	categoryCounts,
	isCollapsed,
	onCategoryChange,
	onCollapsedChange,
}: {
	activeCategory: CatalogCategorySlug;
	categoryCounts: Record<CatalogCategorySlug, number>;
	isCollapsed: boolean;
	onCategoryChange: (category: CatalogCategorySlug) => void;
	onCollapsedChange: (isCollapsed: boolean) => void;
}) {
	const activeCategoryLabel =
		catalogCategories.find((category) => category.slug === activeCategory)?.label ?? "Categories";

	return (
		<aside className={cn("shrink-0 transition-[width] md:self-stretch", isCollapsed ? "md:w-16" : "md:w-56")}>
			<div className="rounded-md border border-border bg-card p-2 shadow-sm md:sticky md:top-20">
				<div className={cn("flex items-center gap-2 px-2 py-2", isCollapsed && "justify-center px-0")}>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-12 w-12 shrink-0 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
						aria-expanded={!isCollapsed}
						aria-label={isCollapsed ? "Expand categories" : "Collapse categories"}
						title={isCollapsed ? "Expand categories" : "Collapse categories"}
						onClick={() => onCollapsedChange(!isCollapsed)}
					>
						{isCollapsed ? <ChevronsRight className="h-8 w-8" /> : <ChevronsLeft className="h-8 w-8" />}
					</Button>
					<div className={cn("min-w-0 flex-1", isCollapsed && "hidden")}>
						<h2 className="truncate text-sm font-semibold">Categories</h2>
					</div>
				</div>
				<Separator className="mb-2" />
				<nav
					className={cn(
						"flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0",
						isCollapsed && "md:items-center",
					)}
					aria-label="Catalog categories"
				>
					{catalogCategories.map((category) => {
						const isActive = category.slug === activeCategory;
						const Icon = categoryIcons[category.slug];

						return (
							<Button
								key={category.slug}
								type="button"
								variant="ghost"
								className={cn(
									"h-9 shrink-0 justify-between gap-3 px-3 text-sm md:w-full",
									isCollapsed && "md:w-10 md:justify-center md:px-0",
									isActive && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
								)}
								aria-label={isCollapsed ? `${category.label}, ${categoryCounts[category.slug]} products` : undefined}
								title={isCollapsed ? category.label : undefined}
								onClick={() => onCategoryChange(category.slug)}
							>
								<Icon className={cn("h-4 w-4 shrink-0", !isCollapsed && "md:hidden")} />
								<span className={cn(isCollapsed && "md:hidden")}>{category.label}</span>
								<span className={cn("rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground", isCollapsed && "md:hidden")}>
									{categoryCounts[category.slug]}
								</span>
							</Button>
						);
					})}
				</nav>
				<p className={cn("hidden pt-2 text-center text-xs text-muted-foreground md:block", !isCollapsed && "md:hidden")}>
					{activeCategoryLabel}
				</p>
			</div>
		</aside>
	);
}
