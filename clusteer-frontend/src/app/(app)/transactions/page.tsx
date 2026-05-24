"use client";

import { useState } from "react";
import { ORDERS } from "@/lib/mock-data";
import { formatMoney, relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Search, Download } from "lucide-react";

export default function TransactionsPage() {
	const [q, setQ] = useState("");
	const [kind, setKind] = useState("all");
	const [status, setStatus] = useState("all");

	const rows = ORDERS.filter((o) =>
		(kind === "all" || o.kind === kind) &&
		(status === "all" || o.status === status) &&
		(!q || o.id.toLowerCase().includes(q.toLowerCase()) || o.asset.toLowerCase().includes(q.toLowerCase()))
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
							<Input className="pl-9" placeholder="Search by ID or asset…" value={q} onChange={(e) => setQ(e.target.value)} />
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
									<TableCell><code className="mono text-xs text-muted-foreground">{o.id}</code></TableCell>
									<TableCell><span className="capitalize font-medium">{o.kind}</span></TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<AssetLogo symbol={o.asset} size="sm" />
											<span className="text-sm">{o.asset}</span>
											<ChainBadge chain={o.chain} />
										</div>
									</TableCell>
									<TableCell>
										<Num as="div" value={o.amount + " " + o.asset} />
										<Num as="div" tone="muted" className="text-xs" value={formatMoney(o.amountNgn, "NGN", { decimals: 0 })} />
									</TableCell>
									<TableCell>
										<Badge variant={o.status === "completed" ? "success" : o.status === "failed" ? "danger" : "warning"} className="capitalize">{o.status}</Badge>
									</TableCell>
									<TableCell className="text-right text-sm text-muted-foreground">{relativeTime(o.createdAt)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					{rows.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No transactions match your filters.</div>}
				</CardContent>
			</Card>
		</div>
	);
}
