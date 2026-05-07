"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { ASSETS, FIAT_BALANCE } from "@/lib/mock-data";
import { formatMoney, formatPct } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Sparkline } from "@/components/primitives/sparkline";
import { Plus, Download, ChevronRight, TrendingUp, Wallet } from "lucide-react";
const TABS = ["All", "Holdings", "Watchlist"] as const;
type Tab = typeof TABS[number];

export default function AssetsPage() {
	const [tab, setTab] = useState<Tab>("All");

	const { data: walletData, isLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
	});

	const liveAssets = walletData?.walletAssets;
	const hasLive = liveAssets && liveAssets.length > 0;

	const totalNgn = hasLive
		? liveAssets.reduce((s: number, a: { balance?: number }) => s + (a.balance ?? 0), 0)
		: ASSETS.reduce((s, a) => s + a.balanceNgn, 0) + FIAT_BALANCE.balance;

	const displayAssets = tab === "Holdings"
		? ASSETS.filter(a => a.balance > 0)
		: ASSETS;

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--c-text)" }}>Wallet</h1>
				<div className="flex items-center gap-2">
					<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
						<Download className="size-3.5 text-[var(--c-text-3)]" />
						Export CSV
					</button>
					<Link
						href="/trade"
						className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:bg-[var(--c-lime-400)] transition-colors"
					>
						<Plus className="size-3.5" />
						Buy
					</Link>
				</div>
			</div>

			{/* Balance cards */}
			<div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3">
				{/* Dark total balance card */}
				<div
					className="relative overflow-hidden rounded-[18px] p-6"
					style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
				>
					<div>
						<div className="text-[11px] font-medium uppercase tracking-[0.06em] opacity-60">Total wallet value</div>
						{isLoading ? (
							<div className="animate-pulse rounded-[10px] mt-2 w-48" style={{ background: "rgba(255,255,255,0.1)", height: 40 }} />
						) : (
							<div className="mt-2 font-display tabular-nums text-[30px] lg:text-[42px] font-semibold leading-none">
								₦{totalNgn.toLocaleString("en-NG")}
							</div>
						)}
						<div className="mt-2 flex items-center gap-3 text-[12px]">
							<span className="flex items-center gap-1 text-[var(--c-lime-500)]">
								<TrendingUp className="size-3.5" />
								+₦487,210 today
							</span>
							<span style={{ opacity: 0.5 }}>≈ ${(totalNgn / 1610).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
						</div>
					</div>
				</div>

				{/* NGN fiat balance */}
				<div className="ds-card p-5">
					<div className="mb-1">
						<span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">NGN Balance</span>
					</div>
					<div className="font-display tabular-nums text-[30px] font-semibold leading-none text-[var(--c-text)]">
						₦{FIAT_BALANCE.balance.toLocaleString("en-NG")}
					</div>
					<div className="mt-3 flex gap-2">
						<Link href="/withdraw" className="flex-1 flex items-center justify-center h-8 rounded-lg border border-[var(--c-line)] text-[12.5px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
							Withdraw
						</Link>
						<Link href="/trade" className="flex-1 flex items-center justify-center h-8 rounded-lg border border-[var(--c-line)] text-[12.5px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
							Add funds
						</Link>
					</div>
				</div>
			</div>

			{/* Assets table */}
			<div className="ds-card overflow-hidden">
				<div className="ds-card-hd">
					<h3 className="text-[15px] font-semibold text-[var(--c-text)]">Assets</h3>
					{/* Tab switcher */}
					<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
						{TABS.map(t => (
							<button
								key={t}
								onClick={() => setTab(t)}
								className={`px-3 py-1 rounded-md text-[12.5px] font-medium transition-colors ${
									tab === t
										? "bg-[var(--c-surface)] text-[var(--c-text)] shadow-[var(--sh-1)]"
										: "text-[var(--c-text-2)] hover:text-[var(--c-text)]"
								}`}
							>
								{t}
							</button>
						))}
					</div>
				</div>

				{isLoading ? (
					<div className="p-6 space-y-3">
						{[1, 2, 3].map(i => <div key={i} className="animate-pulse rounded-[10px]" style={{ background: "var(--c-surface-3)", height: 44 }} />)}
					</div>
				) : displayAssets.length === 0 ? (
					<div className="py-16 text-center px-4 bg-grid">
						<div className="size-14 rounded-2xl inline-flex items-center justify-center mb-4 bg-[var(--c-lime-500)]">
							<Wallet className="size-6 text-[var(--c-onyx-900)]" />
						</div>
						<p className="font-semibold text-[17px] text-[var(--c-text)]">Your wallet is waiting</p>
						<p className="text-[13px] text-[var(--c-text-3)] mt-1">Supported assets will appear once you start trading</p>
						<Link href="/trade" className="mt-4 inline-flex h-9 px-4 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:bg-[var(--c-lime-400)] transition-colors">
							Start trading
						</Link>
					</div>
				) : (
					<>
					{/* Desktop table */}
					<div className="hidden lg:block overflow-x-auto">
						<table className="w-full text-[13px] border-collapse">
							<thead>
								<tr className="border-b border-[var(--c-line)] bg-[var(--c-surface-2)]">
									{["Asset", "Balance", "Price", "24h", "Trend", "Value", ""].map((h, i) => (
										<th
											key={i}
											className={`px-4 py-3 text-left text-[11.5px] font-medium uppercase tracking-[0.05em] text-[var(--c-text-3)] ${i === 5 ? "text-right" : ""}`}
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{displayAssets.map((a) => (
									<tr
										key={a.symbol}
										className="border-b border-[var(--c-line)] hover:bg-[var(--c-surface-2)] transition-colors cursor-pointer"
									>
										<td className="px-4 py-3">
											<Link href={`/assets/${a.symbol}`} className="flex items-center gap-2.5">
												<AssetLogo symbol={a.symbol} />
												<div>
													<div className="font-semibold text-[13px] text-[var(--c-text)]">{a.name}</div>
													<div className="text-[11px] text-[var(--c-text-3)]">{a.chains?.[0]}</div>
												</div>
											</Link>
										</td>
										<td className="px-4 py-3 tabular-nums text-[var(--c-text)]">
											{a.balance.toFixed(a.balance > 1 ? 4 : 6)} {a.symbol}
										</td>
										<td className="px-4 py-3 tabular-nums text-[var(--c-text)]">
											{formatMoney(a.priceNgn, "NGN", { decimals: 0 })}
										</td>
										<td className="px-4 py-3">
											<span className={`tabular-nums font-medium ${a.change24h >= 0 ? "text-[var(--c-up)]" : "text-[var(--c-down)]"}`}>
												{a.change24h >= 0 ? "+" : ""}{formatPct(a.change24h)}
											</span>
										</td>
										<td className="px-4 py-3">
											<Sparkline
												data={a.sparkline}
												width={80}
												height={24}
												tone={a.change24h >= 0 ? "positive" : "negative"}
											/>
										</td>
										<td className="px-4 py-3 text-right tabular-nums font-semibold text-[var(--c-text)]">
											{formatMoney(a.balanceNgn, "NGN", { decimals: 0 })}
										</td>
										<td className="px-4 py-3">
											<ChevronRight className="size-4 text-[var(--c-text-3)]" />
										</td>
									</tr>
								))}
								</tbody>
						</table>
					</div>
					{/* Mobile stacked cards */}
					<div className="lg:hidden">
						{displayAssets.map((a, i) => (
							<Link
								key={a.symbol}
								href={`/assets/${a.symbol}`}
								className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-[var(--c-surface-2)]"
								style={{ borderBottom: i < displayAssets.length - 1 ? "1px solid var(--c-line)" : "none" }}
							>
								<div className="flex items-center gap-2.5">
									<AssetLogo symbol={a.symbol} />
									<div>
										<div className="font-semibold text-[13.5px] text-[var(--c-text)]">{a.name}</div>
										<div className="text-[11px] text-[var(--c-text-3)]">{a.chains?.[0]}</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-[13.5px] font-semibold tabular-nums text-[var(--c-text)]">
										{formatMoney(a.balanceNgn, "NGN", { decimals: 0 })}
									</div>
									<div className="text-[11px] tabular-nums text-[var(--c-text-3)]">
										{a.balance.toFixed(a.balance > 1 ? 4 : 6)} {a.symbol}
									</div>
								</div>
							</Link>
						))}
					</div>
				</>
				)}
			</div>
		</div>
	);
}
