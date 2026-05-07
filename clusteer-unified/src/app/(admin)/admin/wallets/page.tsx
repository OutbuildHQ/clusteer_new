import { WALLETS } from "@/lib/mock-data";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { CopyButton } from "@/components/primitives/copy-button";
import { Num } from "@/components/primitives/num";
import { Snowflake, Flame, Shield, Thermometer, RefreshCw } from "lucide-react";

/* ─── wallet type meta ─── */
const TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
	hot:        { icon: Flame,       label: "Hot",       color: "var(--c-warn)", bg: "var(--c-warn-soft)" },
	warm:       { icon: Thermometer, label: "Warm",      color: "var(--c-info)", bg: "var(--c-info-soft)" },
	cold:       { icon: Snowflake,   label: "Cold",      color: "var(--c-text-3)", bg: "var(--c-surface-3)" },
	"multi-sig":{ icon: Shield,      label: "Multi-sig", color: "var(--c-up)",  bg: "var(--c-up-soft)"   },
};

/* ─── summary totals ─── */
const totalUsd = WALLETS.reduce((s, w) => s + w.balanceUsd, 0);
const hotUsd   = WALLETS.filter((w) => w.type === "hot").reduce((s, w) => s + w.balanceUsd, 0);
const coldUsd  = WALLETS.filter((w) => w.type === "cold" || w.type === "multi-sig").reduce((s, w) => s + w.balanceUsd, 0);

const SUMMARY = [
	{ label: "Total AUM",   value: `$${totalUsd.toLocaleString()}`, sub: "Across all pools" },
	{ label: "Hot wallets", value: `$${hotUsd.toLocaleString()}`,   sub: `${Math.round((hotUsd / totalUsd) * 100)}% of total` },
	{ label: "Cold + Sig",  value: `$${coldUsd.toLocaleString()}`,  sub: `${Math.round((coldUsd / totalUsd) * 100)}% of total` },
	{ label: "Pools",       value: WALLETS.length.toString(),        sub: "Active custody pools" },
];

export default function AdminWallets() {
	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">Wallet pool</h1>
					<p className="text-[13px] text-[var(--c-text-3)] mt-0.5">Hot, warm, cold &amp; multi-sig custody pools</p>
				</div>
				<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-semibold transition-colors" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
					<RefreshCw className="size-3.5" />Trigger rebalance
				</button>
			</div>

			{/* Summary stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
				{SUMMARY.map((s) => (
					<div key={s.label} className="ds-card p-5">
						<div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">{s.label}</div>
						<div className="mt-2 font-display tabular-nums text-[22px] font-semibold leading-none text-[var(--c-text)]">
							<Num value={s.value} />
						</div>
						<div className="mt-1.5 text-[12px] text-[var(--c-text-3)]">{s.sub}</div>
					</div>
				))}
			</div>

			{/* Wallet pool cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
				{WALLETS.map((w) => {
					const meta    = TYPE_META[w.type];
					const inRange = !w.threshold || (w.balance >= w.threshold.min && w.balance <= w.threshold.max);
					const pct     = w.threshold ? Math.min(100, (w.balance / w.threshold.max) * 100) : 60;
					const Icon    = meta.icon;

					return (
						<div key={w.id} className="ds-card p-5 space-y-4">
							{/* Card header */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5">
									<AssetLogo symbol={w.asset} size="md" />
									<div>
										<div className="font-semibold text-[14px] text-[var(--c-text)]">{w.asset}</div>
										<ChainBadge chain={w.chain} />
									</div>
								</div>
								<span
									className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
									style={{ background: meta.bg, color: meta.color }}
								>
									<Icon className="size-3" />
									{meta.label}
								</span>
							</div>

							{/* Balance */}
							<div>
								<div className="font-display tabular-nums text-[22px] font-semibold leading-none text-[var(--c-text)]">
									<Num value={w.balance.toLocaleString()} /> <span className="text-[16px]">{w.asset}</span>
								</div>
								<div className="mt-1 text-[12px] text-[var(--c-text-3)] tabular-nums">
									${w.balanceUsd.toLocaleString()} USD
								</div>
							</div>

							{/* Threshold bar */}
							{w.threshold && (
								<div>
									<div className="ds-bar">
										<span
											style={{
												width: `${pct}%`,
												background: inRange ? "var(--c-up)" : "var(--c-warn)",
											}}
										/>
									</div>
									<div className="mt-1.5 flex justify-between text-[11px] text-[var(--c-text-3)] tabular-nums">
										<span>min {w.threshold.min.toLocaleString()}</span>
										<span className={!inRange ? "text-[var(--c-warn)] font-medium" : ""}>{Math.round(pct)}%</span>
										<span>max {w.threshold.max.toLocaleString()}</span>
									</div>
								</div>
							)}

							{/* Multi-sig badge */}
							{w.signers && (
								<div
									className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[12px]"
									style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}
								>
									<Shield className="size-3.5 shrink-0" />
									<span className="font-semibold">{w.required}-of-{w.signers}</span>
									<span className="text-[var(--c-text-3)]">signers required</span>
								</div>
							)}

							{/* Address */}
							<div>
								<div className="text-[11px] uppercase tracking-[0.05em] font-medium text-[var(--c-text-3)] mb-1.5">Address</div>
								<div
									className="flex items-center gap-2 rounded-[10px] p-2.5"
									style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}
								>
									<code className="flex-1 truncate text-[11px] font-mono text-[var(--c-text-2)]">{w.address}</code>
									<CopyButton value={w.address} />
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
