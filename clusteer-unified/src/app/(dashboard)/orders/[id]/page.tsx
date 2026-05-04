"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

async function fetchOrder(orderId: string) {
	const res = await fetch(`/api/order?id=${orderId}`);
	if (!res.ok) throw new Error("Failed to fetch order");
	const json = await res.json();
	return json.data || json;
}

const STATUS_CONFIG: Record<string, { icon: typeof Clock; color: string; label: string }> = {
	pending: { icon: Clock, color: "text-amber-500", label: "Pending" },
	processing: { icon: Clock, color: "text-blue-500", label: "Processing" },
	completed: { icon: CheckCircle2, color: "text-green-600", label: "Completed" },
	cancelled: { icon: XCircle, color: "text-muted-foreground", label: "Cancelled" },
	failed: { icon: XCircle, color: "text-red-500", label: "Failed" },
};

export default function OrderDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();

	const { data: order, isLoading, error } = useQuery({
		queryKey: ["order", id],
		queryFn: () => fetchOrder(id),
		enabled: !!id,
	});

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard");
	}

	if (isLoading) {
		return (
			<div className="space-y-4 sm:space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-[300px] rounded-[20px]" />
				<Skeleton className="h-[200px] rounded-[20px]" />
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<AlertCircle className="size-12 text-muted-foreground mb-4" />
				<h2 className="font-display text-xl font-bold mb-2">Order not found</h2>
				<p className="text-sm text-muted-foreground mb-6">This order doesn't exist or you don't have access to it.</p>
				<Button onClick={() => router.back()} variant="outline" className="rounded-full border-2 border-custom-black">
					<ArrowLeft className="size-4 mr-2" /> Go back
				</Button>
			</div>
		);
	}

	const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
	const StatusIcon = status.icon;
	const isBuy = order.order_type === "buy" || order.type === "buy";
	const createdAt = order.created_at ? new Date(order.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "—";
	const updatedAt = order.updated_at ? new Date(order.updated_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "—";

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div className="flex items-center gap-3">
					<Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full">
						<ArrowLeft className="size-5" />
					</Button>
					<div>
						<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">
							&#9670; Order details
						</div>
						<h1 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">
							{isBuy ? "Buy" : "Sell"} {order.crypto_currency || "USDT"}
						</h1>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<StatusIcon className={`size-5 ${status.color}`} />
					<Badge variant={order.status === "completed" ? "success" : order.status === "failed" ? "danger" : "warning"} className="text-sm">
						{status.label}
					</Badge>
				</div>
			</div>

			{/* Main details */}
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="p-4 sm:p-6">
					<CardTitle className="font-display text-lg font-bold tracking-[-0.02em]">Order Summary</CardTitle>
				</CardHeader>
				<CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<DetailRow label="Order ID" value={order.order_id || order.id || id} mono copyable onCopy={copyToClipboard} />
						<DetailRow label="Type" value={isBuy ? "Buy" : "Sell"} />
						<DetailRow label="Asset" value={order.crypto_currency || "USDT"} />
						<DetailRow label="Chain" value={order.chain || "—"} />
						<DetailRow label="Crypto Amount" value={`${order.crypto_amount || order.amount || "—"} ${order.crypto_currency || "USDT"}`} mono />
						<DetailRow label="Fiat Amount" value={`₦${Number(order.fiat_amount || order.total_amount || 0).toLocaleString()}`} mono />
						<DetailRow label="Exchange Rate" value={order.exchange_rate ? `₦${Number(order.exchange_rate).toLocaleString()}/USDT` : "—"} mono />
						<DetailRow label="Platform Fee" value={order.platform_fee ? `₦${Number(order.platform_fee).toLocaleString()}` : "—"} mono />
						<DetailRow label="Payment Method" value={order.payment_method?.replace(/_/g, " ") || "Bank transfer"} />
						<DetailRow label="Status" value={status.label} />
						<DetailRow label="Created" value={createdAt} />
						<DetailRow label="Last Updated" value={updatedAt} />
					</div>

					{order.blockchain_tx_hash && (
						<div className="mt-4 p-3 sm:p-4 bg-warm-beige rounded-[14px] border-2 border-custom-black/10">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Blockchain Transaction</p>
							<div className="flex items-center gap-2">
								<code className="text-sm font-mono break-all flex-1">{order.blockchain_tx_hash}</code>
								<button onClick={() => copyToClipboard(order.blockchain_tx_hash)} className="shrink-0 p-1.5 rounded hover:bg-background transition-colors">
									<Copy className="size-3.5" />
								</button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3">
				<Button asChild variant="outline" className="rounded-full border-2 border-custom-black w-full sm:w-auto">
					<Link href="/transaction-history">View all orders</Link>
				</Button>
				{order.status === "completed" && isBuy && (
					<Button asChild className="btn-shine shadow-brutal-sm w-full sm:w-auto">
						<Link href="/send">Send {order.crypto_currency || "USDT"}</Link>
					</Button>
				)}
			</div>
		</div>
	);
}

function DetailRow({ label, value, mono, copyable, onCopy }: {
	label: string;
	value: string;
	mono?: boolean;
	copyable?: boolean;
	onCopy?: (v: string) => void;
}) {
	return (
		<div className="flex items-start justify-between gap-2 py-2 border-b border-custom-black/5 last:border-0">
			<span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground shrink-0">{label}</span>
			<div className="flex items-center gap-1.5">
				<span className={`text-sm text-right ${mono ? "font-mono tabular-nums" : ""}`}>{value}</span>
				{copyable && onCopy && (
					<button onClick={() => onCopy(value)} className="p-1 rounded hover:bg-muted transition-colors">
						<Copy className="size-3" />
					</button>
				)}
			</div>
		</div>
	);
}
