import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export function ResultsFooter({
	currentPage,
	firstItem,
	lastItem,
	onPageChange,
	totalItems,
	totalPages,
}: {
	currentPage: number;
	firstItem: number;
	lastItem: number;
	onPageChange: (page: number) => void;
	totalItems: number;
	totalPages: number;
}) {
	const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

	return (
		<div className="mt-auto grid gap-3 pt-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
			<p className="text-sm text-muted-foreground">
				Showing {firstItem}-{lastItem} of {totalItems} items
			</p>
			<Pagination className="mx-0 w-auto justify-center">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							disabled={currentPage === 1}
							onClick={() => onPageChange(Math.max(1, currentPage - 1))}
						/>
					</PaginationItem>
					{pages.map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								isActive={page === currentPage}
								onClick={() => onPageChange(page)}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							disabled={currentPage === totalPages}
							onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			<div className="hidden sm:block" />
		</div>
	);
}
