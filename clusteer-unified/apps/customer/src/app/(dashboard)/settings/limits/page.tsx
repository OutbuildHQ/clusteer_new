"use client";

import Link from "next/link";
import { Shield, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIERS = [
	{ tier: 1, name: "Starter", dailyCap: 10_000_000, monthlyCap: 50_000_000, perOrder: 5_000_000 },
	{ tier: 2, name: "Pro", dailyCap: 50_000_000, monthlyCap: 300_000_000, perOrder: 25_000_000 },
	{ tier: 3, name: "Institution", dailyCap: 500_000_000, monthlyCap: 5_000_000_000, perOrder: 100_000_000 },
];

function fmt(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }

function ProgressMeter({ label, used, cap, note }: { label: string; used: number; cap: number; note: string }) {
	const pct = cap > 0 ? Math.min(100, (used / cap) * 100) : 0;
	const remaining = Math.max(0, cap - used);
	return (
		<div style={{ marginBottom: 16 }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
				<span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text)" }}>{label}</span>
				<span style={{ fontSize: 12, color: "var(--c-text-2)", fontVariantNumeric: "tabular-nums" }}>
					{fmt(used)} / {fmt(cap)}
				</span>
			</div>
			<div style={{ height: 8, borderRadius: 99, background: "var(--c-surface-2)", overflow: "hidden" }}>
				<div style={{
					height: "100%", borderRadius: 99,
					width: `${pct}%`,
					background: pct > 80 ? "var(--c-warn)" : "var(--c-lime-500)",
					transition: "width 0.5s ease",
				}} />
			</div>
			<div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
				<span style={{ fontSize: 11, color: "var(--c-text-3)" }}>{pct.toFixed(0)}% used</span>
				<span style={{ fontSize: 11, color: "var(--c-text-3)" }}>{fmt(remaining)} remaining</span>
			</div>
			<p style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 2 }}>{note}</p>
		</div>
	);
}

export default function LimitsPage() {
	const currentTier = 1;
	const tier = TIERS[currentTier - 1];
	const nextTier = TIERS[currentTier] || null;

	const dailyUsed = 2_450_000;
	const monthlyUsed = 12_800_000;

	return (
		<div style={{ maxWidth: 520, margin: "0 auto" }}>
			<h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", marginBottom: 8 }}>
				Account Limits
			</h1>
			<p style={{ fontSize: 14, color: "var(--c-text-2)", marginBottom: 24, lineHeight: 1.5 }}>
				Your trading limits are determined by your verification tier.
			</p>

			{/* Current tier */}
			<div style={{ padding: 16, borderRadius: 14, border: "1px solid var(--c-line)", background: "var(--c-surface)", marginBottom: 20 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
					<div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--c-lime-500)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
						<Shield size={20} style={{ color: "var(--c-onyx-900)" }} />
					</div>
					<div style={{ flex: 1 }}>
						<div style={{ fontSize: 16, fontWeight: 700, color: "var(--c-text)" }}>Tier {tier.tier} · {tier.name}</div>
					</div>
					<span style={{ fontSize: 11, fontWeight: 600, color: "var(--c-up)", background: "var(--c-up-soft)", padding: "3px 10px", borderRadius: 99 }}>
						Active
					</span>
				</div>

				<div style={{ fontSize: 13, color: "var(--c-text-2)", marginBottom: 16 }}>
					Max per order: <strong style={{ color: "var(--c-text)" }}>{fmt(tier.perOrder)}</strong>
				</div>

				<ProgressMeter label="Daily" used={dailyUsed} cap={tier.dailyCap} note="Resets daily at 00:00 WAT" />
				<ProgressMeter label="Monthly" used={monthlyUsed} cap={tier.monthlyCap} note="Resets on the 1st of each month" />
			</div>

			{/* Upgrade card */}
			{nextTier && (
				<Link
					href="/identity-verification"
					style={{
						display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 14, textDecoration: "none",
						background: "var(--c-lime-500)", color: "var(--c-onyx-900)",
					}}
				>
					<div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--c-onyx-900)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
						<Shield size={22} style={{ color: "var(--c-lime-500)" }} />
					</div>
					<div style={{ flex: 1 }}>
						<div style={{ fontSize: 15, fontWeight: 700 }}>Unlock Tier {nextTier.tier} — {fmt(nextTier.dailyCap)}/day</div>
						<div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
							{nextTier.tier === 2 ? "Proof of address required" : "Source of funds + institution docs"}
						</div>
					</div>
					<ArrowRight size={18} />
				</Link>
			)}

			{/* Info */}
			<div style={{ display: "flex", gap: 10, padding: 14, borderRadius: 12, background: "var(--c-surface-2)", marginTop: 16 }}>
				<Info size={16} style={{ color: "var(--c-text-3)", flexShrink: 0, marginTop: 1 }} />
				<p style={{ fontSize: 12, color: "var(--c-text-2)", lineHeight: 1.5, margin: 0 }}>
					Limits apply to the NGN value of all orders. Pending orders count toward your daily and monthly usage.
				</p>
			</div>
		</div>
	);
}
