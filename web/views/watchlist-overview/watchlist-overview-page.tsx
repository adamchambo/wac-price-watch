import { Plus, Radar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { WatchlistComparisonTable } from "@/features/watchlists/components/watchlist-comparison-table";

export function WatchlistOverviewPage() {
	return (
		<div className="flex h-full flex-col gap-4 overflow-hidden pb-16 md:pb-0">
			<div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
						<Radar className="h-3.5 w-3.5" />
						Tracked comparisons
					</div>
					<h1 className="mt-2 text-3xl font-black tracking-tight">Watchlist control room</h1>
					<p className="mt-1 text-sm font-medium text-muted-foreground">
						Monitor tracked base products and keep their cross-store matches clean.
					</p>
				</div>
				<Button>
					<Plus className="h-4 w-4" />
					Add to watchlist
				</Button>
			</div>
			<div className="min-h-0 flex-1 overflow-auto rounded-xl border border-primary/15 bg-[#fffdf4]/90 p-3 shadow-md">
				<WatchlistComparisonTable />
			</div>
			<Pagination className="shrink-0">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious />
					</PaginationItem>
					{[1, 2].map((page) => (
						<PaginationItem key={page}>
							<PaginationLink isActive={page === 1}>{page}</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
