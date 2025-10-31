"use client";

import { formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Clock, Repeat } from "lucide-react";
import Link from "next/link";

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
				<div className="p-2 rounded-full bg-green-100">
					<ArrowDownLeft className="w-4 h-4 text-green-600" />
				</div>
			);
		case "out":
			return (
				<div className="p-2 rounded-full bg-gray-100">
					<ArrowUpRight className="w-4 h-4 text-gray-600" />
				</div>
			);
		case "convert":
			return (
				<div className="p-2 rounded-full bg-blue-100">
					<Repeat className="w-4 h-4 text-blue-600" />
				</div>
			);
		default:
			return null;
	}
}

export default function RecentActivity() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["transactions", "recent"],
		queryFn: async () => {
			const response = await fetch("/api/transaction/user?page=1&size=5");
			if (!response.ok) {
				throw new Error("Failed to fetch transactions");
			}
			const result = await response.json();
			return result;
		},
	});

	const apiTransactions: ApiTransaction[] = data?.data || [];

	// Transform API transactions to component format
	const transactions: Transaction[] = apiTransactions.map((tx) => ({
		id: tx.id,
		type: mapTransactionType(tx.type),
		description: tx.flow,
		amount: tx.amount,
		currency: tx.currency,
		date: tx.dateCreated,
		status: tx.status as "completed" | "pending" | "failed",
	}));

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-[#0D0D0D]">Recent Activity</h3>
				</div>
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-8">
					<div className="animate-pulse space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-4">
								<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
								<div className="flex-1 space-y-2">
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2"></div>
								</div>
								<div className="h-4 bg-gray-200 rounded w-20"></div>
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
					<h3 className="text-xl font-bold text-[#0D0D0D]">Recent Activity</h3>
				</div>
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-8 text-center">
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
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-bold text-[#0D0D0D]">Recent Activity</h3>
				<Link
					href="/transaction-history"
					className="text-sm font-medium text-dark-green hover:underline"
				>
					View all
				</Link>
			</div>

			<div className="bg-white rounded-2xl border border-[#E9EAEB] divide-y divide-[#E9EAEB] overflow-hidden">
				{transactions.map((transaction) => (
					<div
						key={transaction.id}
						className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
					>
						<div className="flex items-center gap-3 flex-1 min-w-0">
							{getTransactionIcon(transaction.type)}
							<div className="flex-1 min-w-0">
								<p className="font-medium text-[#0D0D0D] truncate">
									{transaction.description}
								</p>
								<div className="flex items-center gap-2 mt-0.5">
									<p className="text-sm text-[#667085]">{transaction.date}</p>
									{transaction.status === "pending" && (
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
										? "text-green-600"
										: "text-[#0D0D0D]"
								}`}
							>
								{transaction.type === "in" ? "+" : transaction.type === "out" ? "-" : ""}
								{transaction.currency === "NGN" && "₦"}
								{(transaction.currency === "USDT" ||
									transaction.currency === "USDC") &&
									"$"}
								{formatNumber(transaction.amount)}
							</p>
							<p className="text-xs text-[#667085] mt-0.5">
								{transaction.currency}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
