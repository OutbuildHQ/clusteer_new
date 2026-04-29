"use client";

import { useState } from "react";
import { ADMIN_TXNS } from "@/lib/mock-data";
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
import { Search, Flag, AlertTriangle } from "lucide-react";

export default function AdminTxns() {
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("all");
	const [flag, setFlag] = useState("all");
	const rows = ADMIN_TXNS.filter((t) =>
		(status === "all" || t.status === status) &&
		(flag === "all" || (flag === "flagged" ? t.flagged : !t.flagged)) &&
		(!q || t.id.toLowerCase().includes(q.toLowerCase()) || t.userName.toLowerCase().includes(q.toLowerCase()))
	);
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="font-display text-2xl font-bold tracking-tight">Transactions</h1>
				<Button variant="outline" size="sm">Export</Button>
			</div>
			<Card>
				<CardHeader>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input className="pl-9" placeholder="Search ID, user…" value={q} onChange={(e) => setQ(e.target.value)} />
						</div>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="md:w-36"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All statuses</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
							</SelectContent>
						</Select>
						<Select value={flag} onValueChange={setFlag}>
							<SelectTrigger className="md:w-32"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="flagged">Flagged</SelectItem>
								<SelectItem value="clean">Not flagged</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>User</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Asset</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>When</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((t) => (
								<TableRow key={t.id} className={t.flagged ? "bg-warning-bg/30" : ""}>
									<TableCell>
										<div className="flex items-center gap-2">
											{t.flagged && <Flag className="size-3.5 text-warning" />}
											<code className="mono text-xs">{t.id}</code>
										</div>
										{t.reason && <div className="mt-1 flex items-center gap-1 text-xs text-warning"><AlertTriangle className="size-3" />{t.reason}</div>}
									</TableCell>
									<TableCell>
										<div className="font-medium">{t.userName}</div>
										<div className="text-xs text-muted-foreground">{t.userId}</div>
									</TableCell>
									<TableCell><span className="capitalize">{t.kind}</span></TableCell>
									<TableCell>
										<div className="flex items-center gap-2"><AssetLogo symbol={t.asset} size="sm" />{t.asset}<ChainBadge chain={t.chain} /></div>
									</TableCell>
									<TableCell>
										<Num as="div" value={t.amount + " " + t.asset} />
										<Num as="div" tone="muted" className="text-xs" value={formatMoney(t.amountNgn, "NGN", { decimals: 0 })} />
									</TableCell>
									<TableCell>
										<Badge variant={t.status === "completed" ? "success" : t.status === "failed" ? "danger" : "warning"} className="capitalize">{t.status}</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">{relativeTime(t.createdAt)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
