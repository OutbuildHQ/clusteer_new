import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, ref) => (
		<div className="relative w-full overflow-auto">
			<table
				ref={ref}
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<thead ref={ref} className={cn("[&_tr]:border-b bg-muted/40", className)} {...props} />
	),
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
	),
);
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
	({ className, ...props }, ref) => (
		<tr
			ref={ref}
			className={cn("border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted", className)}
			{...props}
		/>
	),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<th
			ref={ref}
			className={cn("h-10 px-4 text-left align-middle text-xs font-medium uppercase tracking-wide text-muted-foreground", className)}
			{...props}
		/>
	),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<td ref={ref} className={cn("p-4 align-middle", className)} {...props} />
	),
);
TableCell.displayName = "TableCell";

function TableRowsSkeleton({
	rows = 5,
	cols = 4,
}: {
	rows?: number;
	cols?: number;
}) {
	return (
		<>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<TableRow key={`skeleton-row-${rowIndex}`}>
					{Array.from({ length: cols }).map((__, colIndex) => (
						<TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
							<div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-muted" />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}

function PaginationControls({
	pageIndex,
	pageCount,
	onPrevious,
	onNext,
	className,
}: {
	pageIndex: number;
	pageCount: number;
	onPrevious: () => void;
	onNext: () => void;
	className?: string;
}) {
	return (
		<div className={cn("flex items-center justify-between gap-3 px-4 py-3", className)}>
			<button
				type="button"
				onClick={onPrevious}
				disabled={pageIndex <= 0}
				className="rounded-md border border-border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
			>
				Previous
			</button>
			<span className="text-xs text-muted-foreground">
				Page {Math.min(pageIndex + 1, Math.max(pageCount, 1))} of {Math.max(pageCount, 1)}
			</span>
			<button
				type="button"
				onClick={onNext}
				disabled={pageIndex >= pageCount - 1}
				className="rounded-md border border-border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
			>
				Next
			</button>
		</div>
	);
}

export {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableRowsSkeleton,
	PaginationControls,
};
