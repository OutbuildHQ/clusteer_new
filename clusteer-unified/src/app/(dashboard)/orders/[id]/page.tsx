"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface OrderDetail {
	order_id?: string;
	id?: string;
	order_type?: string;
	type?: string;
	status: string;
	crypto_currency?: string;
	crypto_amount?: number;
	fiat_amount?: number;
	total_amount?: number;
	exchange_rate?: number;
	platform_fee?: number;
	payment_method?: string;
	blockchain_tx_hash?: string;
	chain?: string;
	amount?: number;
	created_at?: string;
	updated_at?: string;
}

async function fetchOrder(orderId: string): Promise<OrderDetail> {
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
				<div className="animate-pulse rounded-[10px]" style={{ background: "var(--c-surface-3)", height: 32, width: 192 }} />
				<div className="animate-pulse rounded-[10px]" style={{ background: "var(--c-surface-3)", height: 300, borderRadius: 20 }} />
				<div className="animate-pulse rounded-[10px]" style={{ background: "var(--c-surface-3)", height: 200, borderRadius: 20 }} />
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<AlertCircle className="size-12 text-muted-foreground mb-4" />
				<h2 className="font-display text-xl font-bold mb-2">Order not found</h2>
				<p className="text-sm text-muted-foreground mb-6">This order doesn&apos;t exist or you don&apos;t have access to it.</p>
				<button
					onClick={() => router.back()}
					style={{ height: 36, padding: "0 14px", borderRadius: 9999, fontSize: 13.5, fontWeight: 500, border: "2px solid var(--c-line)", background: "transparent", color: "var(--c-text)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
				>
					<ArrowLeft className="size-4" /> Go back
				</button>
			</div>
		);
	}

	const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
	const StatusIcon = status.icon;
	const isBuy = order.order_type === "buy" || order.type === "buy";
	const createdAt = order.created_at ? new Date(order.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "\u2014";
	const updatedAt = order.updated_at ? new Date(order.updated_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "\u2014";

	const badgeStyle = (() => {
		const base = { display: "inline-flex" as const, alignItems: "center" as const, gap: 6, height: 22, padding: "0 8px", borderRadius: 999, fontSize: 11.5, fontWeight: 500 };
		if (order.status === "completed") return { ...base, background: "rgba(21,128,61,0.1)", color: "#15803d", border: "1px solid #15803d" };
		if (order.status === "failed") return { ...base, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid #ef4444" };
		return { ...base, background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid #f59e0b" };
	})();

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div className="flex items-center gap-3">
					<button
						onClick={() => router.back()}
						style={{ height: 36, width: 36, borderRadius: 9999, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-text)" }}
					>
						<ArrowLeft className="size-5" />
					</button>
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
					<span style={badgeStyle}>
						{status.label}
					</span>
				</div>
			</div>

			{/* Main details */}
			<div className="ds-card" style={{ border: "2px solid var(--c-line)", borderRadius: 16 }}>
				<div className="ds-card-hd p-4 sm:p-6">
					<h3 className="font-display text-lg font-bold tracking-[-0.02em]">Order Summary</h3>
				</div>
				<div className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<DetailRow label="Order ID" value={order.order_id || order.id || id} mono copyable onCopy={copyToClipboard} />
						<DetailRow label="Type" value={isBuy ? "Buy" : "Sell"} />
						<DetailRow label="Asset" value={order.crypto_currency || "USDT"} />
						<DetailRow label="Chain" value={order.chain || "\u2014"} />
						<DetailRow label="Crypto Amount" value={`${order.crypto_amount || order.amount || "\u2014"} ${order.crypto_currency || "USDT"}`} mono />
						<DetailRow label="Fiat Amount" value={`\u20A6${Number(order.fiat_amount || order.total_amount || 0).toLocaleString()}`} mono />
						<DetailRow label="Exchange Rate" value={order.exchange_rate ? `\u20A6${Number(order.exchange_rate).toLocaleString()}/USDT` : "\u2014"} mono />
						<DetailRow label="Platform Fee" value={order.platform_fee ? `\u20A6${Number(order.platform_fee).toLocaleString()}` : "\u2014"} mono />
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
								<button onClick={() => copyToClipboard(order.blockchain_tx_hash!)} className="shrink-0 p-1.5 rounded hover:bg-background transition-colors" style={{ border: "none", background: "transparent", cursor: "pointer" }}>
									<Copy className="size-3.5" />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3">
				<Link href="/transaction-history">
					<button
						style={{ height: 36, padding: "0 14px", borderRadius: 9999, fontSize: 13.5, fontWeight: 500, border: "2px solid var(--c-line)", background: "transparent", color: "var(--c-text)", cursor: "pointer", width: "100%" }}
					>
						View all orders
					</button>
				</Link>
				{order.status === "completed" && isBuy && (
					<Link href="/send">
						<button
							className="btn-shine shadow-brutal-sm"
							style={{ height: 36, padding: "0 14px", borderRadius: 9999, fontSize: 13.5, fontWeight: 500, border: "none", background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer", width: "100%" }}
						>
							Send {order.crypto_currency || "USDT"}
						</button>
					</Link>
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
					<button onClick={() => onCopy(value)} className="p-1 rounded hover:bg-muted transition-colors" style={{ border: "none", background: "transparent", cursor: "pointer" }}>
						<Copy className="size-3" />
					</button>
				)}
			</div>
		</div>
	);
}
