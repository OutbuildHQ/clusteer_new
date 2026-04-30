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

function PaginationControls({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
	if (totalPages <= 1) return null;
	return (
		<div className="flex items-center justify-between px-4 py-3 border-t border-border">
			<p className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</p>
			<div className="flex gap-1">
				<button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-3 py-1 text-xs rounded-md border border-border hover:bg-muted disabled:opacity-50">Prev</button>
				<button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-3 py-1 text-xs rounded-md border border-border hover:bg-muted disabled:opacity-50">Next</button>
			</div>
		</div>
	);
}

function TableRowsSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, r) => (
				<TableRow key={r}>
					{Array.from({ length: cols }).map((_, c) => (
						<TableCell key={c}><div className="h-4 w-full rounded bg-muted animate-pulse" /></TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, PaginationControls, TableRowsSkeleton };
