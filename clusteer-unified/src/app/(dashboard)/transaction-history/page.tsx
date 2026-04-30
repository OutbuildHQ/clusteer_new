"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="font-display text-2xl font-bold tracking-tight">Transactions</h1>
				<Button variant="outline" size="sm"><Download className="size-4" />Export CSV</Button>
			</div>
			<Card>
				<CardHeader className="space-y-3">
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
						<div className="py-12 text-center">
							<AlertCircle className="size-10 text-destructive/40 mx-auto mb-3" />
							<p className="font-medium">Failed to load transactions</p>
							<p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
						</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Asset</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">When</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.map((o) => (
										<TableRow key={o.id}>
											<TableCell><code className="mono text-xs text-muted-foreground">{o.orderNumber ?? o.id}</code></TableCell>
											<TableCell><span className="capitalize font-medium">{o.type}</span></TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{o.currency && <AssetLogo symbol={o.currency} size="sm" />}
													<span className="text-sm">{o.currency ?? "—"}</span>
												</div>
											</TableCell>
											<TableCell>
												<Num as="div" value={(o.amount ?? 0) + " " + (o.currency ?? "")} />
											</TableCell>
											<TableCell>
												<Badge variant={o.status === "completed" ? "success" : o.status === "failed" ? "danger" : "warning"} className="capitalize">{o.status}</Badge>
											</TableCell>
											<TableCell className="text-right text-sm text-muted-foreground">{relativeTime(o.dateCreated ?? o.date)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							{rows.length === 0 && (
								<div className="py-12 text-center">
									<ArrowUpDown className="size-10 text-muted-foreground/40 mx-auto mb-3" />
									<p className="font-medium">No transactions found</p>
									<p className="text-sm text-muted-foreground mt-1">
										{q || kind !== "all" || status !== "all"
											? "No transactions match your current filters. Try adjusting your search."
											: "Your transaction history will appear here once you start trading."}
									</p>
									<Button asChild size="sm" className="mt-4 w-full sm:w-auto">
										<Link href="/trade">Make your first trade</Link>
									</Button>
								</div>
							)}
							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between border-t px-4 py-3">
									<p className="text-sm text-muted-foreground">
										Page {page} of {totalPages}
										{metadata?.totalItems != null && <> &middot; {metadata.totalItems} total</>}
									</p>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											disabled={page <= 1}
											onClick={() => setPage((p) => Math.max(1, p - 1))}
										>
											<ChevronLeft className="size-4" />
											Previous
										</Button>
										<Button
											variant="outline"
											size="sm"
											disabled={page >= totalPages}
											onClick={() => setPage((p) => p + 1)}
										>
											Next
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
