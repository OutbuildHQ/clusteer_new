import Link from "next/link";
import { ADMIN_TXNS, KYC_QUEUE, USERS, WALLETS, generateAreaSeries } from "@/lib/mock-data";
import { formatMoney, relativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";
import { AlertTriangle, TrendingUp, TrendingDown, Users as UsersIcon, ShieldCheck, Wallet, Download } from "lucide-react";

const SYSTEM_HEALTH = [
	{ service: "API gateway",      uptime: "99.99%", status: "operational" },
	{ service: "BVN/NIN service",  uptime: "99.94%", status: "operational" },
	{ service: "Paystack",         uptime: "99.81%", status: "operational" },
	{ service: "Tron RPC",         uptime: "98.40%", status: "degraded" },
	{ service: "BTC node",         uptime: "99.99%", status: "operational" },
];

const ACTION_QUEUE = [
	{ label: "KYC reviews",          count: KYC_QUEUE.filter(k => k.status === "pending").length, href: "/admin/kyc" },
	{ label: "Flagged transactions",  count: ADMIN_TXNS.filter(t => t.flagged).length, href: "/admin/transactions" },
	{ label: "Withdrawals > ₦5M",    count: 7, href: "/admin/transactions" },
	{ label: "Manual approvals",     count: 2, href: "/admin/transactions" },
];

function SectionCard({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
	return (
		<div className="ds-card overflow-hidden">
			<div className="ds-card-hd">
				<div>
					<h3 className="text-[15px] font-semibold text-[var(--c-text)]">{title}</h3>
					{subtitle && <p className="text-[12px] text-[var(--c-text-3)] mt-0.5">{subtitle}</p>}
				</div>
				{action}
			</div>
			{children}
		</div>
	);
}

export default function AdminOverview() {
	const volumeSeries = generateAreaSeries(30, 180_000_000);
	const totalUsers = USERS.length * 2418;
	const totalAum = WALLETS.reduce((s, w) => s + w.balanceUsd, 0) * 1580;
	const volume24h = 1_482_300_000;
	const pendingKyc = KYC_QUEUE.filter(k => k.status === "pending").length;
	const flaggedTxns = ADMIN_TXNS.filter((t) => t.flagged).length;

	const kpiCards = [
		{ label: "Total AUM",        value: formatMoney(totalAum, "NGN", { decimals: 0, compact: true }), sub: "+₦284M (24h)", up: true,  icon: <Wallet className="size-4" /> },
		{ label: "24h volume",       value: formatMoney(volume24h, "NGN", { decimals: 0, compact: true }),  sub: `${ADMIN_TXNS.length} transactions`, up: null, icon: <TrendingUp className="size-4" /> },
		{ label: "Active users (24h)", value: "8,421",                                                     sub: "+12.4% WoW", up: true,  icon: <UsersIcon className="size-4" /> },
		{ label: "Revenue (24h)",    value: formatMoney(volume24h * 0.005, "NGN", { decimals: 0, compact: true }), sub: "0.5% fee", up: null, icon: <TrendingUp className="size-4" /> },
	];

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">Operations</h1>
					<p className="text-[13px] text-[var(--c-text-3)] mt-0.5">
						Live snapshot · {new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}
					</p>
				</div>
				<div className="flex items-center gap-2">
					{/* Period tabs */}
					<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
						{["Today", "7D", "30D", "90D"].map((p, i) => (
							<button key={p} className={`px-3 py-1 rounded-md text-[12.5px] font-medium transition-colors ${i === 0 ? "bg-[var(--c-surface)] text-[var(--c-text)] shadow-[var(--sh-1)]" : "text-[var(--c-text-2)]"}`}>
								{p}
							</button>
						))}
					</div>
					<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
						<Download className="size-3.5 text-[var(--c-text-3)]" />
						Export
					</button>
				</div>
			</div>

			{/* 4-col KPI grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{kpiCards.map((k) => (
					<div key={k.label} className="ds-card p-5">
						<div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">
							{k.icon}{k.label}
						</div>
						<div className="mt-2 font-display tabular-nums text-[26px] font-semibold leading-none text-[var(--c-text)]">{k.value}</div>
						<div className={`mt-1.5 flex items-center gap-1 text-[12px] ${k.up === true ? "text-[var(--c-up)]" : k.up === false ? "text-[var(--c-down)]" : "text-[var(--c-text-3)]"}`}>
							{k.up === true && <TrendingUp className="size-3 shrink-0" />}
							{k.up === false && <TrendingDown className="size-3 shrink-0" />}
							{k.sub}
						</div>
					</div>
				))}
			</div>

			{/* Volume chart + health/actions */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
				<SectionCard
					title="Platform volume"
					subtitle="30-day trailing · NGN equivalent"
					action={
						<Link href="/admin/reports" className="text-[13px] text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">
							Full reports →
						</Link>
					}
				>
					<div className="p-5 pt-3">
						<PriceAreaChart data={volumeSeries} currency="NGN" height={220} />
					</div>
				</SectionCard>

				<div className="space-y-3">
					{/* System health */}
					<SectionCard title="System health">
						<div className="p-4 space-y-3">
							{SYSTEM_HEALTH.map((s) => (
								<div key={s.service} className="flex items-center justify-between text-[13px]">
									<div className="flex items-center gap-2">
										<span
											className="size-[6px] rounded-full shrink-0"
											style={{ background: s.status === "operational" ? "var(--c-up)" : "var(--c-warn)" }}
										/>
										<span className="text-[var(--c-text)]">{s.service}</span>
									</div>
									<span className="tabular-nums text-[var(--c-text-3)]">{s.uptime}</span>
								</div>
							))}
						</div>
					</SectionCard>

					{/* Action queue */}
					<SectionCard title="Action queue">
						<div className="p-3 space-y-2">
							{ACTION_QUEUE.map((a) => (
								<div key={a.label} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--c-surface-2)]">
									<span className="text-[13px] text-[var(--c-text)]">{a.label}</span>
									<div className="flex items-center gap-2">
										<span className="ds-badge ds-badge-warn text-[11px]">{a.count}</span>
										<Link href={a.href} className="text-[12px] font-medium text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">
											Review →
										</Link>
									</div>
								</div>
							))}
						</div>
					</SectionCard>
				</div>
			</div>

			{/* KYC queue + flagged txns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<SectionCard
					title="KYC queue"
					subtitle={`${pendingKyc} pending submissions`}
					action={<Link href="/admin/kyc" className="text-[13px] text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">Review all →</Link>}
				>
					<table className="w-full text-[13px] border-collapse">
						<tbody>
							{KYC_QUEUE.slice(0, 4).map((k) => (
								<tr key={k.id} className="border-b border-[var(--c-line)] hover:bg-[var(--c-surface-2)] transition-colors">
									<td className="px-4 py-3">
										<div className="font-semibold text-[var(--c-text)]">{k.userName}</div>
										<div className="text-[11px] text-[var(--c-text-3)]">{k.userEmail}</div>
									</td>
									<td className="px-4 py-3">
										<Badge variant="info" className="text-[11px]">Tier {k.tier}</Badge>
									</td>
									<td className="px-4 py-3 text-right text-[12px] text-[var(--c-text-3)]">
										{relativeTime(k.submittedAt)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</SectionCard>

				<SectionCard
					title="Flagged transactions"
					subtitle="Require manual review"
					action={<Link href="/admin/transactions" className="text-[13px] text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">See all →</Link>}
				>
					<table className="w-full text-[13px] border-collapse">
						<tbody>
							{ADMIN_TXNS.filter((t) => t.flagged).slice(0, 4).map((t) => (
								<tr key={t.id} className="border-b border-[var(--c-line)] hover:bg-[var(--c-surface-2)] transition-colors">
									<td className="px-4 py-3">
										<div className="flex items-center gap-2">
											<AssetLogo symbol={t.asset} size="sm" />
											<code className="font-mono text-[11px] text-[var(--c-text-3)]">{t.id}</code>
										</div>
										<div className="text-[11px] text-[var(--c-text-3)] mt-0.5">{t.userName}</div>
									</td>
									<td className="px-4 py-3 tabular-nums text-[var(--c-text)] font-medium">
										{formatMoney(t.amountNgn, "NGN", { decimals: 0 })}
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1.5 text-[12px] text-[var(--c-warn)]">
											<AlertTriangle className="size-3 shrink-0" />
											{t.reason}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</SectionCard>
			</div>

			{/* Wallet pool health */}
			<SectionCard
				title="Wallet pool health"
				subtitle="Hot, warm, cold & multi-sig pools"
				action={<Link href="/admin/wallets" className="text-[13px] text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">See all →</Link>}
			>
				<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{WALLETS.map((w) => {
						const inRange = !w.threshold || (w.balance >= w.threshold.min && w.balance <= w.threshold.max);
						const pct = w.threshold ? Math.min(100, (w.balance / w.threshold.max) * 100) : 60;
						return (
							<div key={w.id} className="rounded-[12px] border border-[var(--c-line)] bg-[var(--c-surface-2)] p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<AssetLogo symbol={w.asset} size="sm" />
										<span className="font-semibold text-[13px] text-[var(--c-text)]">{w.asset}</span>
										<Badge variant={w.type === "cold" ? "info" : w.type === "hot" ? "warning" : "success"} className="capitalize text-[10px]">{w.type}</Badge>
									</div>
									<span className="text-[11px] text-[var(--c-text-3)]">{w.chain}</span>
								</div>
								<div className="mt-2 font-display tabular-nums text-[18px] font-semibold text-[var(--c-text)]">
									{w.balance.toLocaleString()} {w.asset}
								</div>
								<div className="text-[11px] text-[var(--c-text-3)] tabular-nums">${w.balanceUsd.toLocaleString()}</div>
								{w.threshold && (
									<>
										<div className="mt-3 ds-bar">
											<span
												style={{
													width: `${pct}%`,
													background: inRange ? "var(--c-up)" : "var(--c-warn)"
												}}
											/>
										</div>
										<div className="mt-1 flex justify-between text-[11px] text-[var(--c-text-3)]">
											<span>min {w.threshold.min.toLocaleString()}</span>
											<span>max {w.threshold.max.toLocaleString()}</span>
										</div>
									</>
								)}
								{w.signers && <div className="mt-2 text-[11px] text-[var(--c-text-3)]">{w.required}-of-{w.signers} multi-sig</div>}
							</div>
						);
					})}
				</div>
			</SectionCard>
		</div>
	);
}
