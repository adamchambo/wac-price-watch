"use client";

import { Search } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProductImage } from "@/features/products/components/product-image";
import { formatCurrency, matchCandidates } from "@/features/products/lib/mock-data";

export function MatchSearchDialog({
	store = "Woolworths",
	trigger,
}: {
	store?: "Aldi" | "Woolworths";
	trigger?: ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger ?? <Button>Add {store} match</Button>}
			</DialogTrigger>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>Add {store} Match</DialogTitle>
					<DialogDescription>
						Match this product with a {store} product.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Searching for: <span className="font-medium text-foreground">Coca-Cola Classic 1.25L</span>
					</p>
					<div className="relative">
						<Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input placeholder={`Search ${store} products...`} />
					</div>
					<div className="max-h-[420px] space-y-3 overflow-auto pr-1">
						{matchCandidates.map((candidate) => (
							<div
								key={candidate.id}
								className="flex items-center gap-4 rounded-lg border border-border p-3"
							>
								<ProductImage
									alt={candidate.name}
									imageKey={candidate.imageKey}
									className="h-16 w-16"
								/>
								<div className="min-w-0 flex-1">
									<p className="font-medium">{candidate.name} {candidate.sizeLabel}</p>
									<p className="mt-1 font-semibold">{formatCurrency(candidate.currentPrice)}</p>
								</div>
								<Button size="sm" variant="secondary">Select Match</Button>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
