"use client";

import { formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Clock, Repeat, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
	id: string;
	type: "in" | "out" | "convert" | "buy" | "sell";
	description: string;
	amount: number;
	currency: string;
	date: string;
	status: "completed" | "pending" | "failed";
}

interface ApiTransaction {
	id: string;
	type: string;
	currency: string;
	amount: number;
	rate: number;
	flow: string;
	orderNumber: string;
	status: string;
	dateCreated: string;
}

// Map API transaction type to display type
function mapTransactionType(apiType: string): "in" | "out" | "convert" | "buy" | "sell" {
	const type = apiType.toLowerCase();
	if (type === "buy" || type === "deposit" || type === "receive") return "in";
	if (type === "sell" || type === "withdraw" || type === "send") return "out";
	if (type === "convert" || type === "swap") return "convert";
	return apiType as any;
}

function getTransactionIcon(type: string) {
	switch (type) {
		case "in":
			return (
				<div className="p-2 rounded-full bg-success/10">
					<ArrowDownLeft className="w-4 h-4 text-success" />
				</div>
			);
		case "out":
			return (
				<div className="p-2 rounded-full bg-muted">
					<ArrowUpRight className="w-4 h-4 text-muted-foreground" />
				</div>
			);
		case "convert":
			return (
				<div className="p-2 rounded-full bg-[var(--c-lime-500)]/10">
					<Repeat className="w-4 h-4 text-[var(--c-lime-500)]" />
				</div>
			);
		default:
			return null;
	}
}

export default function RecentActivity() {
	const [filterType, setFilterType] = useState<"all" | "in" | "out" | "convert">("all");

	const { data, isLoading, error } = useQuery({
		queryKey: ["transactions", "recent"],
		queryFn: async () => {
			const response = await fetch("/api/transaction/user?page=1&size=10");
			if (!response.ok) {
				throw new Error("Failed to fetch transactions");
			}
			const result = await response.json();
			return result;
		},
	});

	const apiTransactions: ApiTransaction[] = data?.data || [];

	// Transform API transactions to component format
	const allTransactions: Transaction[] = apiTransactions.map((tx) => ({
		id: tx.id,
		type: mapTransactionType(tx.type),
		description: tx.flow,
		amount: tx.amount,
		currency: tx.currency,
		date: tx.dateCreated,
		status: tx.status as "completed" | "pending" | "failed",
	}));

	// Filter transactions based on selected filter
	const transactions = useMemo(() => {
		if (filterType === "all") return allTransactions.slice(0, 5);
		return allTransactions.filter((tx) => tx.type === filterType).slice(0, 5);
	}, [allTransactions, filterType]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
				</div>
				<div className="bg-card rounded-2xl border border-border p-8">
					<div className="animate-pulse space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-4">
								<div className="w-10 h-10 bg-muted rounded-full"></div>
								<div className="flex-1 space-y-2">
									<div className="h-4 bg-muted rounded w-3/4"></div>
									<div className="h-3 bg-muted rounded w-1/2"></div>
								</div>
								<div className="h-4 bg-muted rounded w-20"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error || transactions.length === 0) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
				</div>
				<div className="bg-card rounded-2xl border border-border p-8 text-center">
					<div className="w-16 h-16 mx-auto bg-pale-green rounded-full flex items-center justify-center mb-4">
						<Clock className="w-8 h-8 text-[var(--c-lime-500)]" />
					</div>
					<h3 className="font-semibold text-lg text-foreground mb-2">
						No transactions yet
					</h3>
					<p className="text-sm text-muted-foreground">
						Your transactions will appear here
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 gap-2">
								<Filter className="h-4 w-4" />
								<span className="hidden sm:inline">
									{filterType === "all" ? "All" : filterType === "in" ? "Received" : filterType === "out" ? "Sent" : "Converted"}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setFilterType("all")}>
								All transactions
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterType("in")}>
								Received only
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterType("out")}>
								Sent only
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterType("convert")}>
								Conversions only
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Link
						href="/transaction-history"
						className="text-sm font-medium text-[var(--c-lime-500)] hover:underline"
					>
						View all
					</Link>
				</div>
			</div>

			<div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
				{transactions.map((transaction) => (
					<div
						key={transaction.id}
						className="flex items-center justify-between p-4 hover:bg-background transition-colors"
					>
						<div className="flex items-center gap-3 flex-1 min-w-0">
							{getTransactionIcon(transaction.type)}
							<div className="flex-1 min-w-0">
								<p className="font-medium text-foreground truncate">
									{transaction.description}
								</p>
								<div className="flex items-center gap-2 mt-0.5">
									<p className="text-sm text-muted-foreground">{transaction.date}</p>
									{transaction.status === "pending" && (
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
											Pending
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="text-right">
							<p
								className={`font-semibold ${
									transaction.type === "in"
										? "text-success"
										: "text-foreground"
								}`}
							>
								{transaction.type === "in" ? "+" : transaction.type === "out" ? "-" : ""}
								{transaction.currency === "NGN" && "₦"}
								{(transaction.currency === "USDT" ||
									transaction.currency === "USDC") &&
									"$"}
								{formatNumber(transaction.amount)}
							</p>
							<p className="text-xs text-muted-foreground mt-0.5">
								{transaction.currency}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
