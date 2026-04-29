"use client";

import { useState } from "react";
import { ORDERS } from "@/lib/mock-data";
import { formatMoney, relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Search, Download } from "lucide-react";

export default function AdminOrders() {
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("all");
	const rows = ORDERS.filter((o) =>
		(status === "all" || o.status === status) &&
		(!q || o.id.toLowerCase().includes(q.toLowerCase()) || o.asset.toLowerCase().includes(q.toLowerCase()) || o.kind.toLowerCase().includes(q.toLowerCase()))
	);
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="font-display text-2xl font-bold tracking-tight">Orders</h1>
				<Button variant="outline" size="sm"><Download className="size-4" />Export</Button>
			</div>
			<Card>
				<CardHeader>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input className="pl-9" placeholder="Search by ID, asset, type..." value={q} onChange={(e) => setQ(e.target.value)} />
						</div>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All statuses</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Asset</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Created</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.length === 0 && (
								<TableRow>
									<TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No orders found.</TableCell>
								</TableRow>
							)}
							{rows.map((o) => (
								<TableRow key={o.id}>
									<TableCell><code className="mono text-xs">{o.id}</code></TableCell>
									<TableCell><span className="capitalize">{o.kind}</span></TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<AssetLogo symbol={o.asset} size="sm" />
											{o.asset}
											<ChainBadge chain={o.chain} />
										</div>
									</TableCell>
									<TableCell>
										<Num as="div" value={o.amount + " " + o.asset} />
										<Num as="div" tone="muted" className="text-xs" value={formatMoney(o.amountNgn, "NGN", { decimals: 0 })} />
									</TableCell>
									<TableCell>
										<Badge
											variant={
												o.status === "completed" ? "success" :
												o.status === "failed" ? "danger" :
												o.status === "cancelled" ? "secondary" :
												"warning"
											}
											className="capitalize"
										>
											{o.status}
										</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">{relativeTime(o.createdAt)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
