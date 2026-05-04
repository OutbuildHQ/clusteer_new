"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { getAllTransactions } from "@/lib/api/user/queries";
import { formatMoney, relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { TableSkeleton } from "@/components/primitives/table-skeleton";
import { Search, Download, ArrowUpDown, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.03 } } };
const fadeIn = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } };

export default function TransactionsPage() {
	const [q, setQ] = useState("");
	const [kind, setKind] = useState("all");
	const [status, setStatus] = useState("all");
	const [page, setPage] = useState(1);
	const pageSize = 10;

	const { data: transactionsData, isLoading, error } = useQuery({
		queryKey: ["transactions", page, pageSize],
		queryFn: () => getAllTransactions({ page, size: pageSize }),
	});

	const allRows = transactionsData?.data ?? [];
	const metadata = transactionsData?.metadata;
	const totalPages = metadata?.totalPages ?? 1;

	// Client-side filtering on the current page of results
	const rows = allRows.filter((o) =>
		(kind === "all" || o.type === kind) &&
		(status === "all" || o.status === status) &&
		(!q || (o.orderNumber ?? o.id)?.toLowerCase().includes(q.toLowerCase()) || (o.currency ?? "").toLowerCase().includes(q.toLowerCase()))
	);

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4">
				<div>
					<p className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">&#9670; History</p>
					<h1 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">Transactions</h1>
				</div>
				<Button variant="outline" size="sm" className="w-full sm:w-auto border-2 border-custom-black rounded-full"><Download className="size-4" />Export CSV</Button>
			</div>
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="space-y-3 p-4 sm:p-6 lg:p-8">
					<div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input className="pl-9" placeholder="Search by ID or asset..." value={q} onChange={(e) => setQ(e.target.value)} />
						</div>
						<Select value={kind} onValueChange={setKind}>
							<SelectTrigger className="md:w-40"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All types</SelectItem>
								<SelectItem value="buy">Buy</SelectItem>
								<SelectItem value="sell">Sell</SelectItem>
								<SelectItem value="swap">Swap</SelectItem>
								<SelectItem value="send">Send</SelectItem>
								<SelectItem value="receive">Receive</SelectItem>
							</SelectContent>
						</Select>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="md:w-40"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All statuses</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading ? (
						<TableSkeleton columns={6} rows={5} />
					) : error ? (
						<div className="py-12 text-center px-4">
							<AlertCircle className="size-10 text-destructive/40 mx-auto mb-3" />
							<p className="font-display font-bold">Failed to load transactions</p>
							<p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
						</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow className="bg-warm-beige/40">
										<TableHead className="hidden md:table-cell">ID</TableHead>
										<TableHead className="px-3 sm:px-4">Type</TableHead>
										<TableHead className="hidden sm:table-cell">Asset</TableHead>
										<TableHead className="px-3 sm:px-4">Amount</TableHead>
										<TableHead className="px-3 sm:px-4">Status</TableHead>
										<TableHead className="hidden md:table-cell text-right">When</TableHead>
									</TableRow>
								</TableHeader>
								<motion.tbody variants={stagger} initial="hidden" animate="visible">
									{rows.map((o) => (
										<motion.tr key={o.id} variants={fadeIn} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
											<TableCell className="hidden md:table-cell"><code className="font-mono text-xs text-muted-foreground tabular-nums">{o.orderNumber ?? o.id}</code></TableCell>
											<TableCell className="px-3 sm:px-4"><span className="capitalize font-medium text-sm">{o.type}</span></TableCell>
											<TableCell className="hidden sm:table-cell">
												<div className="flex items-center gap-2">
													{o.currency && <AssetLogo symbol={o.currency} size="sm" />}
													<span className="text-sm">{o.currency ?? "\u2014"}</span>
												</div>
											</TableCell>
											<TableCell className="px-3 sm:px-4">
												<Num as="div" className="font-mono tabular-nums text-sm" value={(o.amount ?? 0) + " " + (o.currency ?? "")} />
											</TableCell>
											<TableCell className="px-3 sm:px-4">
												<Badge variant={o.status === "completed" ? "success" : o.status === "failed" ? "danger" : "warning"} className="capitalize">{o.status}</Badge>
											</TableCell>
											<TableCell className="hidden md:table-cell text-right text-sm text-muted-foreground">{relativeTime(o.dateCreated ?? o.date)}</TableCell>
										</motion.tr>
									))}
								</motion.tbody>
							</Table>
							{rows.length === 0 && (
								<div className="py-12 text-center px-4">
									<ArrowUpDown className="size-10 text-muted-foreground/40 mx-auto mb-3" />
									<p className="font-display font-bold">No transactions found</p>
									<p className="text-sm text-muted-foreground mt-1">
										{q || kind !== "all" || status !== "all"
											? "No transactions match your current filters. Try adjusting your search."
											: "Your transaction history will appear here once you start trading."}
									</p>
									<Button asChild size="sm" className="mt-4 w-full sm:w-auto btn-shine shadow-brutal-sm">
										<Link href="/trade">Make your first trade</Link>
									</Button>
								</div>
							)}
							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-custom-black/10 px-4 sm:px-6 py-3 sm:py-4">
									<p className="text-xs sm:text-sm text-muted-foreground font-mono tabular-nums">
										Page {page} of {totalPages}
										{metadata?.totalItems != null && <> &middot; {metadata.totalItems} total</>}
									</p>
									<div className="flex gap-2 w-full sm:w-auto">
										<Button
											variant="outline"
											size="sm"
											className="flex-1 sm:flex-initial rounded-full border-2 border-custom-black"
											disabled={page <= 1}
											onClick={() => setPage((p) => Math.max(1, p - 1))}
										>
											<ChevronLeft className="size-4" />
											<span className="hidden sm:inline">Previous</span>
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="flex-1 sm:flex-initial rounded-full border-2 border-custom-black"
											disabled={page >= totalPages}
											onClick={() => setPage((p) => p + 1)}
										>
											<span className="hidden sm:inline">Next</span>
											<ChevronRight className="size-4" />
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
