"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
				<p className="text-sm text-muted-foreground">
					Product matching is not available yet.
				</p>
			</DialogContent>
		</Dialog>
	);
}
