import { ChevronRight, MoreVertical, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MatchSearchDialog } from "@/features/products/components/match-search-dialog";
import { StoreLogo } from "@/features/products/components/store-logo";
import { formatCurrency, stores } from "@/features/products/lib/product-utils";
import type { WatchlistItemMatchResponse } from "@/lib/api/generated/api";

export function MatchCard({
	store,
	match,
}: {
	store: typeof stores.Aldi | typeof stores.Woolworths;
	match?: WatchlistItemMatchResponse;
}) {
	const storeName = store === stores.Aldi ? "Aldi" : "Woolworths";

	return (
		<Card className="border-border/80 shadow-sm">
			<CardContent className="flex items-center gap-3 p-3">
				<StoreLogo store={storeName} />
				<div className="min-w-0 flex-1">
					<p className="font-semibold">{storeName}</p>
					{match ? (
						<>
							<p className="truncate text-xs text-muted-foreground">
								{match.product.name} {match.product.sizeLabel}
							</p>
							<p className="mt-1 text-sm font-semibold text-primary">
								{formatCurrency(match.product.currentPrice)}
							</p>
						</>
					) : (
						<p className="text-xs text-muted-foreground">No match added</p>
					)}
				</div>
				{match ? (
					<div className="flex items-center gap-2">
						<Button size="sm" variant="outline">View</Button>
						<MatchSearchDialog
							trigger={<Button size="sm" variant="outline">Replace</Button>}
							store={storeName}
						/>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="icon" variant="ghost">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Remove match</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : (
					<MatchSearchDialog
						store={storeName}
						trigger={
							<Button size="sm" variant="secondary">
								<Plus className="h-4 w-4" />
								Add match
							</Button>
						}
					/>
				)}
				<ChevronRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
			</CardContent>
		</Card>
	);
}
