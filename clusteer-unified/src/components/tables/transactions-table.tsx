"use client";

import { Input } from "@/components/ui/input";
import {
	PaginationControls,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableRowsSkeleton,
} from "@/components/ui/table";
import { getAllTransactions } from "@/lib/api/user/queries";
import { PAGE_SIZE, TRANSACTION_STATUS_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ITransaction } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Search, Clock } from "lucide-react";
import * as React from "react";
import { TableStatusFilter } from "../table-status-filter";
import { CopyButton } from "../copy-button";

export const columns: ColumnDef<ITransaction>[] = [
	{
		header: "Type / Time",
		cell: ({ row }) => {
			const { type, currency, dateCreated } = row.original;
			return (
				<div className="capitalize font-medium flex flex-col">
					<p>
						<span
							className={cn({
								"text-destructive": type.toLowerCase() === "sell",
								"text-[#008000]": type.toLowerCase() === "buy",
							})}
						>
							{type + " "}
						</span>
						<span>{currency}</span>
					</p>
					<p className="text-[#475569]">{dateCreated}</p>
				</div>
			);
		},
	},
	{
		header: "Amount / Rate",
		cell: ({ row }) => {
			const { amount, rate, currency } = row.original;
			return (
				<div>
					<p className="font-medium">
						{amount.toLocaleString()} {currency}
					</p>
					<p className="text-[#475467]">{rate} NGN</p>
				</div>
			);
		},
	},
	{
		header: "Title",
		cell: ({ row }) => {
			const { flow } = row.original;
			return <p className="text-[#475467] font-medium">{flow}</p>;
		},
	},
	{
		accessorKey: "orderNumber",
		header: "Order Number",
		cell: ({ row }) => {
			return (
				<div className="font-medium flex flex-wrap items-center gap-x-1 font-inter">
					<p className="text-wrap">{row.original.orderNumber}</p>
					<CopyButton
						className="border-0 p-0"
						value={row.original.orderNumber}
						icon="/assets/icons/copy.svg"
					/>
				</div>
			);
		},
	},
	{
		id: "status",
		accessorKey: "status",
		header: "Status / Action",
		enableHiding: false,
		cell: ({ row }) => {
			return (
				<div className="font-inter capitalize">
					<p className="font-medium">{row.original.status}</p>
					<span className="text-[#008000]">Download receipt</span>
				</div>
			);
		},
	},
];

type TransactionStatus = (typeof TRANSACTION_STATUS_FILTERS)[number];

export function TransactionsTable() {
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: PAGE_SIZE,
	});

	const { data, isFetching } = useQuery({
		queryKey: [
			"transactions",
			{
				pageIndex: pagination.pageIndex + 1,
				pageSize: pagination.pageSize,
			},
		],
		queryFn: () =>
			getAllTransactions({
				page: pagination.pageIndex + 1,
				size: pagination.pageSize,
			}),
		staleTime: 1000 * 60 * 5,
		placeholderData: keepPreviousData,
	});

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const table = useReactTable({
		data: data?.data ?? [],
		columns,
		state: {
			pagination,
			columnFilters,
		},
		getRowId: (row) => row.id.toString(),
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		onColumnFiltersChange: setColumnFilters,
		manualPagination: true,
		pageCount: data?.metadata.totalPages ?? -1,
	});

	const getActiveFilter =
		(table.getColumn("status")?.getFilterValue() as TransactionStatus) ?? "ALL";

	const handleFilterChange = (filter: TransactionStatus) => {
		if (filter === "ALL") {
			table.getColumn("status")?.setFilterValue(undefined);
		} else {
			table.getColumn("status")?.setFilterValue(filter);
		}
	};

	return (
		<div className="w-full font-inter border-t border-t-[#21241D] border border-[#EAECF0] shadow-[0px_1px_3px_0px_#1018281A] pb-5">
			{/* <div className="py-5 px-6 border-b border-[#EAECF0]">
				<h3 className="text-[#101828] text-2xl font-semibold">
					Latest Transactions
				</h3>
			</div> */}
			<div className="flex items-center py-3 px-4">
				<TableStatusFilter
					filters={TRANSACTION_STATUS_FILTERS}
					activeFilter={getActiveFilter}
					onFilterChange={handleFilterChange}
				/>
				<div className="max-w-sm flex items-center px-3.5 py-2.5 ml-auto border border-[#D0D5DD] rounded-xl">
					<Search
						stroke="#667085"
						size={20}
					/>
					<Input
						placeholder="Search"
						value={
							(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn("orderNumber")?.setFilterValue(event.target.value)
						}
						className="text-[#667085] placeholder:text-[#667085] border-none shadow-none h-6"
					/>
				</div>
			</div>
			<div className="rounded-md">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											className="xl:px-6 py-3.5"
											key={header.id}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isFetching ? (
							<TableRowsSkeleton
								length={4}
								columnCount={columns.length}
							/>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											className="py-4 xl:px-6"
											key={cell.id}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-auto py-16"
								>
									<div className="text-center">
										<div className="w-16 h-16 mx-auto bg-pale-green rounded-full flex items-center justify-center mb-4">
											<Clock className="w-8 h-8 text-dark-green" />
										</div>
										<h3 className="font-semibold text-lg text-[#0D0D0D] mb-2">
											No transactions yet
										</h3>
										<p className="text-sm text-[#667085]">
											Your transactions will appear here
										</p>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<PaginationControls table={table} />
		</div>
	);
}
