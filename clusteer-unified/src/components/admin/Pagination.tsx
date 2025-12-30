"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalItems: number;
	onPageChange: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	showPageSize?: boolean;
}

export default function Pagination({
	currentPage,
	totalPages,
	pageSize,
	totalItems,
	onPageChange,
	onPageSizeChange,
	pageSizeOptions = [10, 25, 50, 100],
	showPageSize = true,
}: PaginationProps) {
	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 7;

		if (totalPages <= maxVisible) {
			// Show all pages
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage > 3) {
				pages.push("...");
			}

			// Show pages around current page
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("...");
			}

			// Always show last page
			pages.push(totalPages);
		}

		return pages;
	};

	const pages = getPageNumbers();

	return (
		<div className="flex items-center justify-between px-6 py-4 border-t border-[#E9EAEB] bg-white">
			{/* Items info */}
			<div className="flex items-center gap-4">
				<p className="text-sm text-gray-600">
					Showing <span className="font-medium">{startItem}</span> to{" "}
					<span className="font-medium">{endItem}</span> of{" "}
					<span className="font-medium">{totalItems}</span> results
				</p>

				{/* Page size selector */}
				{showPageSize && onPageSizeChange && (
					<div className="flex items-center gap-2">
						<label htmlFor="pageSize" className="text-sm text-gray-600">
							Show:
						</label>
						<select
							id="pageSize"
							value={pageSize}
							onChange={(e) => onPageSizeChange(Number(e.target.value))}
							className="px-3 py-1.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01]"
						>
							{pageSizeOptions.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>
				)}
			</div>

			{/* Pagination controls */}
			<div className="flex items-center gap-2">
				{/* Previous button */}
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
					aria-label="Previous page"
				>
					<ChevronLeft className="w-4 h-4" />
					Previous
				</button>

				{/* Page numbers */}
				<div className="flex items-center gap-1">
					{pages.map((page, index) => {
						if (page === "...") {
							return (
								<span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
									...
								</span>
							);
						}

						return (
							<button
								key={page}
								onClick={() => onPageChange(page as number)}
								className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									currentPage === page
										? "bg-[#014F01] text-white"
										: "text-gray-700 hover:bg-gray-50 border border-[#E9EAEB]"
								}`}
								aria-label={`Page ${page}`}
								aria-current={currentPage === page ? "page" : undefined}
							>
								{page}
							</button>
						);
					})}
				</div>

				{/* Next button */}
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
					aria-label="Next page"
				>
					Next
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}

// Simple pagination for smaller datasets
export function SimplePagination({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	return (
		<div className="flex items-center justify-center gap-2 py-4">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="p-2 border border-[#E9EAEB] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Previous page"
			>
				<ChevronLeft className="w-5 h-5 text-gray-600" />
			</button>

			<span className="text-sm text-gray-600">
				Page {currentPage} of {totalPages}
			</span>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="p-2 border border-[#E9EAEB] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Next page"
			>
				<ChevronRight className="w-5 h-5 text-gray-600" />
			</button>
		</div>
	);
}
