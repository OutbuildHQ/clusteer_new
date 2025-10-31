"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Table as TanstackTable } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
} from "@tabler/icons-react";

function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<div
			data-slot="table-container"
			className="relative w-full overflow-x-auto"
		>
			<table
				data-slot="table"
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			data-slot="table-header"
			className={cn("[&_tr]:border-b [&_tr]:border-[#EAECF0]", className)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="table-body"
			className={cn("[&_tr:last-child]:border-0", className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				"bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
				className
			)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors",
				className
			)}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				"text-[#475467] h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className
			)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				"p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className
			)}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">) {
	return (
		<caption
			data-slot="table-caption"
			className={cn("text-muted-foreground mt-4 text-sm", className)}
			{...props}
		/>
	);
}

function TableRowsSkeleton({
	columnCount,
	length,
}: {
	columnCount: number;
	length: number;
}) {
	return (
		<>
			{Array.from({ length }).map((_, idx) => (
				<TableRow
					key={`loading-row-${idx}`}
					className="animate-pulse"
				>
					{Array.from({ length: columnCount }).map((_, colIdx) => (
						<TableCell key={colIdx}>
							<div className="h-[32px] w-full bg-muted rounded" />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}

type PaginationControlsProps<TData> = {
	table: TanstackTable<TData>;
};

function PaginationControls<TData>({ table }: PaginationControlsProps<TData>) {
	const {
		pagination: { pageIndex, pageSize },
	} = table.getState();

	const pageCount = table.getPageCount();
	const canPreviousPage = table.getCanPreviousPage();
	const canNextPage = table.getCanNextPage();

	const handlePageSizeChange = React.useCallback(
		(value: string) => {
			table.setPageSize(Number(value));
		},
		[table]
	);

	const goToFirstPage = React.useCallback(() => {
		table.setPageIndex(0);
	}, [table]);

	const goToLastPage = React.useCallback(() => {
		table.setPageIndex(pageCount - 1);
	}, [table, pageCount]);

	return (
		<div className="flex w-full items-center gap-8 px-6">
			{/* Page size selector */}
			<div className="hidden items-center gap-2 lg:flex">
				<Label
					htmlFor="rows-per-page"
					className="text-sm font-medium"
				>
					Rows per page
				</Label>
				<Select
					value={String(pageSize)}
					onValueChange={handlePageSizeChange}
				>
					<SelectTrigger
						size="sm"
						className="w-20"
						id="rows-per-page"
					>
						<SelectValue placeholder={String(pageSize)} />
					</SelectTrigger>
					<SelectContent side="top">
						{[5, 10, 15, 20].map((size) => (
							<SelectItem
								key={size}
								value={String(size)}
							>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Pagination navigation */}
			<div className="ml-auto flex w-full lg:w-fit gap-x-5 items-center">
				<div className="flex w-fit items-center justify-center text-sm font-medium">
					Page {pageIndex + 1} of {pageCount}
				</div>

				<div className="ml-auto flex items-center gap-2 lg:ml-0">
					<Button
						type="button"
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={goToFirstPage}
						disabled={!canPreviousPage}
					>
						<span className="sr-only">Go to first page</span>
						<IconChevronsLeft />
					</Button>
					<Button
						type="button"
						variant="outline"
						className="size-8"
						size="icon"
						onClick={() => table.previousPage()}
						disabled={!canPreviousPage}
					>
						<span className="sr-only">Go to previous page</span>
						<IconChevronLeft />
					</Button>
					<Button
						type="button"
						variant="outline"
						className="size-8"
						size="icon"
						onClick={() => table.nextPage()}
						disabled={!canNextPage}
					>
						<span className="sr-only">Go to next page</span>
						<IconChevronRight />
					</Button>
					<Button
						type="button"
						variant="outline"
						className="hidden size-8 lg:flex"
						size="icon"
						onClick={goToLastPage}
						disabled={!canNextPage}
					>
						<span className="sr-only">Go to last page</span>
						<IconChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	);
}

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
	TableRowsSkeleton,
	PaginationControls,
};
