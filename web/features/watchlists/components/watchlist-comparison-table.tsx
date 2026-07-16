import Link from "next/link";
import { BarChart3, MoreVertical, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MatchSearchDialog } from "@/features/products/components/match-search-dialog";
import { ProductImage } from "@/features/products/components/product-image";
import { StoreLogo } from "@/features/products/components/store-logo";
import {
	formatCurrency,
	getLowestMatchPrice,
	getMatchForStore,
	storeNames,
	stores,
} from "@/features/products/lib/mock-data";
import type { WatchlistItemResponse } from "@/lib/api/generated/api";

export function WatchlistComparisonTable({
	items,
	deletingItemId,
	onDeleteItem,
}: {
	items: WatchlistItemResponse[];
	deletingItemId?: string | null;
	onDeleteItem?: (item: WatchlistItemResponse) => void;
}) {
	return (
		<Card className="h-full overflow-hidden border-primary/10 bg-card shadow-sm">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						<TableHead>Coles</TableHead>
						<TableHead>Aldi</TableHead>
						<TableHead>Woolworths</TableHead>
						<TableHead>Best price</TableHead>
						<TableHead>Last checked</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => {
						const aldiMatch = getMatchForStore(item, stores.Aldi);
						const woolworthsMatch = getMatchForStore(item, stores.Woolworths);
						const best = getLowestMatchPrice(item);
						const detailHref = `/watchlists/${item.id}`;

						return (
							<TableRow key={item.id}>
								<TableCell>
									<Link className="flex items-center gap-3" href={detailHref}>
										<ProductImage
											alt={item.displayName}
											imageUrl={item.baseProduct.imageUrl}
											label={item.baseProduct.brand ?? item.displayName}
											className="h-12 w-14"
										/>
										<div>
											<p className="font-semibold">{item.displayName}</p>
											<p className="text-xs text-muted-foreground">
												{storeNames[item.baseProduct.store]} base item
											</p>
										</div>
									</Link>
								</TableCell>
								<TableCell>
									<p className="font-semibold">{formatCurrency(item.baseProduct.currentPrice)}</p>
									<p className="text-xs text-muted-foreground">1 day ago</p>
								</TableCell>
								<TableCell>
									{aldiMatch ? (
										<div className="space-y-1">
											<p className="font-semibold">{formatCurrency(aldiMatch.product.currentPrice)}</p>
											{best.store === stores.Aldi ? <Badge>Best price</Badge> : null}
										</div>
									) : (
										<MatchSearchDialog
											store="Aldi"
											trigger={
												<Button size="sm" variant="outline">
													<Plus className="h-4 w-4" />
													Add
												</Button>
											}
										/>
									)}
								</TableCell>
								<TableCell>
									{woolworthsMatch ? (
										<div className="space-y-1">
											<p className="font-semibold">
												{formatCurrency(woolworthsMatch.product.currentPrice)}
											</p>
											{best.store === stores.Woolworths ? <Badge>Best price</Badge> : null}
										</div>
									) : (
										<MatchSearchDialog
											store="Woolworths"
											trigger={
												<Button size="sm" variant="outline">
													<Plus className="h-4 w-4" />
													Add
												</Button>
											}
										/>
									)}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<StoreLogo store={storeNames[best.store]} />
										<div>
											<p className="text-sm font-medium">{storeNames[best.store]}</p>
											<p className="font-semibold text-primary">{formatCurrency(best.currentPrice)}</p>
										</div>
									</div>
								</TableCell>
								<TableCell>1 day ago</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Link
											className={buttonVariants({ size: "icon", variant: "outline" })}
											href={detailHref}
										>
											<BarChart3 className="h-4 w-4" />
										</Link>
										<Button size="icon" variant="outline">
											<MoreVertical className="h-4 w-4" />
										</Button>
										<Button
											size="icon"
											variant="outline"
											disabled={deletingItemId === item.id}
											aria-label={`Delete ${item.displayName}`}
											onClick={() => onDeleteItem?.(item)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Card>
	);
}
