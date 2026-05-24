"use client";

import { useState } from "react";
import Link from "next/link";
import { USERS } from "@/lib/mock-data";
import { formatMoney, relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Num } from "@/components/primitives/num";
import { Search, Download, MoreHorizontal } from "lucide-react";

export default function AdminUsers() {
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("all");
	const rows = USERS.filter((u) =>
		(status === "all" || u.status === status) &&
		(!q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
	);
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="font-display text-2xl font-bold tracking-tight">Users</h1>
				<Button variant="outline" size="sm"><Download className="size-4" />Export</Button>
			</div>
			<Card>
				<CardHeader>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input className="pl-9" placeholder="Search by name or email…" value={q} onChange={(e) => setQ(e.target.value)} />
						</div>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All statuses</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="suspended">Suspended</SelectItem>
								<SelectItem value="closed">Closed</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>KYC</TableHead>
								<TableHead>Total deposits</TableHead>
								<TableHead>30d volume</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Joined</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((u) => (
								<TableRow key={u.id}>
									<TableCell>
										<Link href={`/admin/users/${u.id}`} className="flex items-center gap-3">
											<Avatar className="size-9"><AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{u.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
											<div className="min-w-0">
												<div className="font-medium">{u.name}</div>
												<div className="text-xs text-muted-foreground">{u.email}</div>
											</div>
										</Link>
									</TableCell>
									<TableCell>
										<Badge variant={u.kycStatus === "approved" ? "success" : u.kycStatus === "pending" ? "warning" : u.kycStatus === "rejected" ? "danger" : "secondary"}>Tier {u.kycTier}</Badge>
									</TableCell>
									<TableCell><Num value={formatMoney(u.totalDepositsNgn, "NGN", { decimals: 0, compact: true })} /></TableCell>
									<TableCell><Num value={formatMoney(u.totalVolume30dNgn, "NGN", { decimals: 0, compact: true })} /></TableCell>
									<TableCell>
										<Badge variant={u.status === "active" ? "success" : u.status === "suspended" ? "danger" : "secondary"} className="capitalize">{u.status}</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">{relativeTime(u.createdAt)}</TableCell>
									<TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
