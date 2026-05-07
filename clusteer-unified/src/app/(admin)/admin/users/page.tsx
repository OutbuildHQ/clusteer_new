"use client";

import { useState } from "react";
import { USERS } from "@/lib/mock-data";
import { formatMoney, relativeTime } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import {
	Search, Download, ChevronRight, ChevronLeft, X,
	TrendingUp, TrendingDown, Users as UsersIcon,
	AlertTriangle, Mail, Phone, MapPin, Calendar,
	Shield, Ban, CheckCircle, RotateCcw, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

/* ─── stat cards ─── */
const totalUsers = USERS.length * 31_070;
const verifiedUsers = USERS.filter((u) => u.kycTier >= 1 && u.kycStatus === "approved").length * 23_718;
const active30d = USERS.filter((u) => u.status === "active").length * 15_341;
const flaggedUsers = USERS.filter((u) => u.status === "suspended" || u.kycStatus === "rejected").length * 52 + 6;

const STAT_CARDS = [
	{ label: "Total users",          value: (totalUsers).toLocaleString(),    sub: "+1.8% wk",       up: true  },
	{ label: "Verified (Tier 1+)",   value: (verifiedUsers).toLocaleString(), sub: "76.3% of total", up: null  },
	{ label: "Active · 30d",         value: (active30d).toLocaleString(),     sub: "+4.2% wk",       up: true  },
	{ label: "Flagged",              value: flaggedUsers.toLocaleString(),     sub: "Needs review",   up: false },
];

type TabKey = "all" | "new" | "flagged" | "frozen";
const TABS: { key: TabKey; label: string }[] = [
	{ key: "all",     label: `All ${(totalUsers).toLocaleString()}` },
	{ key: "new",     label: "New · 7d" },
	{ key: "flagged", label: `Flagged ${flaggedUsers}` },
	{ key: "frozen",  label: "Frozen 12" },
];

/* ─── tier / kyc helpers ─── */
function tierLabel(t: 0 | 1 | 2 | 3) { return `T${t}`; }
function tierColor(t: 0 | 1 | 2 | 3) {
	return t === 3 ? { bg: "var(--c-info-soft)",   color: "var(--c-info)"  }
		 : t === 2 ? { bg: "var(--c-up-soft)",    color: "var(--c-up)"   }
		 : t === 1 ? { bg: "var(--c-warn-soft)",  color: "var(--c-warn)" }
		 :           { bg: "var(--c-surface-3)",   color: "var(--c-text-3)" };
}
function kycColor(s: string) {
	return s === "approved" ? { bg: "var(--c-up-soft)",   color: "var(--c-up)"   }
		 : s === "pending"  ? { bg: "var(--c-warn-soft)", color: "var(--c-warn)" }
		 : s === "rejected" ? { bg: "var(--c-down-soft)", color: "var(--c-down)" }
		 :                    { bg: "var(--c-surface-3)",  color: "var(--c-text-3)" };
}
function statusColor(s: string) {
	return s === "active"    ? { bg: "var(--c-up-soft)",   color: "var(--c-up)"   }
		 : s === "suspended" ? { bg: "var(--c-down-soft)", color: "var(--c-down)" }
		 :                     { bg: "var(--c-surface-3)",  color: "var(--c-text-3)" };
}

/* ─── avatar initials ─── */
function initials(name: string) {
	return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ─── user drawer ─── */
function UserDrawer({ user, onClose }: { user: (typeof USERS)[0]; onClose: () => void }) {
	const t = tierColor(user.kycTier);
	const k = kycColor(user.kycStatus);
	const s = statusColor(user.status);

	return (
		<div
			className="fixed inset-0 z-50 flex justify-end"
			onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
		>
			<div className="pointer-events-none absolute inset-0 bg-black/20" />
			<aside
				className="relative z-10 flex h-full w-[480px] flex-col overflow-hidden"
				style={{ background: "var(--c-surface)", borderLeft: "1px solid var(--c-line)" }}
			>
				{/* Header */}
				<div
					className="flex items-center gap-3 px-5 py-4"
					style={{ borderBottom: "1px solid var(--c-line)" }}
				>
					<div
						className="size-11 shrink-0 rounded-full flex items-center justify-center text-[15px] font-bold"
						style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
					>
						{initials(user.name)}
					</div>
					<div className="flex-1 min-w-0">
						<div className="font-semibold text-[15px] text-[var(--c-text)] truncate">{user.name}</div>
						<div className="text-[12px] text-[var(--c-text-3)] truncate">{user.email}</div>
					</div>
					<button
						onClick={onClose}
						className="shrink-0 rounded-lg p-1.5 hover:bg-[var(--c-surface-2)] transition-colors text-[var(--c-text-3)]"
					>
						<X className="size-4" />
					</button>
				</div>

				{/* Status badges */}
				<div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={t}>{tierLabel(user.kycTier)}</span>
					<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize" style={k}>{user.kycStatus}</span>
					<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize" style={s}>{user.status}</span>
					<span className="ml-auto text-[12px] text-[var(--c-text-3)]">{relativeTime(user.createdAt)}</span>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 gap-3 p-5">
					{[
						{ label: "Total deposits", value: formatMoney(user.totalDepositsNgn, "NGN", { decimals: 0, compact: true }) },
						{ label: "30d volume",     value: formatMoney(user.totalVolume30dNgn, "NGN", { decimals: 0, compact: true }) },
					].map((stat) => (
						<div key={stat.label} className="rounded-[12px] p-4" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
							<div className="text-[11px] text-[var(--c-text-3)] uppercase tracking-[0.05em] font-medium">{stat.label}</div>
							<div className="mt-1 font-display tabular-nums text-[18px] font-semibold text-[var(--c-text)]">{stat.value}</div>
						</div>
					))}
				</div>

				{/* Contact info */}
				<div className="px-5 pb-4 space-y-2">
					<div className="text-[11px] text-[var(--c-text-3)] uppercase tracking-[0.05em] font-medium mb-3">Contact</div>
					{[
						{ icon: Mail,    text: user.email },
						{ icon: Phone,   text: user.phone },
						{ icon: MapPin,  text: user.country },
						{ icon: Calendar, text: `Joined ${relativeTime(user.createdAt)}` },
					].map(({ icon: Icon, text }) => (
						<div key={text} className="flex items-center gap-2.5 text-[13px] text-[var(--c-text-2)]">
							<Icon className="size-3.5 shrink-0 text-[var(--c-text-3)]" />
							{text}
						</div>
					))}
				</div>

				{/* Actions */}
				<div className="mt-auto px-5 pb-5 pt-4 space-y-2" style={{ borderTop: "1px solid var(--c-line)" }}>
					<div className="text-[11px] text-[var(--c-text-3)] uppercase tracking-[0.05em] font-medium mb-3">Actions</div>
					<div className="grid grid-cols-2 gap-2">
						<button
							onClick={() => { toast.success("User activated"); onClose(); }}
							className="flex items-center justify-center gap-2 h-9 rounded-lg text-[13px] font-medium transition-colors"
							style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}
						>
							<CheckCircle className="size-3.5" />Activate
						</button>
						<button
							onClick={() => { toast.warning("User suspended"); onClose(); }}
							className="flex items-center justify-center gap-2 h-9 rounded-lg text-[13px] font-medium transition-colors"
							style={{ background: "var(--c-down-soft)", color: "var(--c-down)" }}
						>
							<Ban className="size-3.5" />Suspend
						</button>
					</div>
					<button
						onClick={() => { toast.info("KYC status reset"); onClose(); }}
						className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors"
					>
						<RotateCcw className="size-3.5" />Reset KYC
					</button>
					<a
						href={`/admin/users/${user.id}`}
						className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-[13px] font-medium transition-colors"
						style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
					>
						<ExternalLink className="size-3.5" />Full profile
					</a>
				</div>
			</aside>
		</div>
	);
}

/* ─── page ─── */
export default function AdminUsers() {
	const [q, setQ]           = useState("");
	const [tab, setTab]       = useState<TabKey>("all");
	const [selected, setSelected] = useState<(typeof USERS)[0] | null>(null);

	const rows = USERS.filter((u) => {
		const matchQ = !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase());
		const matchTab =
			tab === "all"     ? true :
			tab === "new"     ? new Date(u.createdAt) > new Date(Date.now() - 7 * 86_400_000) :
			tab === "flagged" ? u.kycStatus === "rejected" || u.status === "suspended" :
			tab === "frozen"  ? u.status === "suspended" :
			true;
		return matchQ && matchTab;
	});

	return (
		<div className="space-y-5">
			{selected && <UserDrawer user={selected} onClose={() => setSelected(null)} />}

			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">Users</h1>
					<p className="text-[13px] text-[var(--c-text-3)] mt-0.5">
						{(totalUsers).toLocaleString()} registered accounts
					</p>
				</div>
				<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
					<Download className="size-3.5 text-[var(--c-text-3)]" />
					Export
				</button>
			</div>

			{/* 4-col stat cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{STAT_CARDS.map((s, i) => (
					<div key={i} className="ds-card p-5">
						<div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">
							<UsersIcon className="size-4" />
							{s.label}
						</div>
						<div className="mt-2 font-display tabular-nums text-[26px] font-semibold leading-none text-[var(--c-text)]">
							{s.value}
						</div>
						<div className={`mt-1.5 flex items-center gap-1 text-[12px] ${s.up === true ? "text-[var(--c-up)]" : s.up === false ? "text-[var(--c-down)]" : "text-[var(--c-text-3)]"}`}>
							{s.up === true  && <TrendingUp   className="size-3 shrink-0" />}
							{s.up === false && <TrendingDown  className="size-3 shrink-0" />}
							{s.up === false && <AlertTriangle className="size-3 shrink-0 -ml-0.5" />}
							{s.sub}
						</div>
					</div>
				))}
			</div>

			{/* Table card */}
			<div className="ds-card overflow-hidden">
				{/* Table header */}
				<div
					className="flex items-center gap-3 px-5 py-3 flex-wrap"
					style={{ borderBottom: "1px solid var(--c-line)" }}
				>
					<h3 className="text-[15px] font-semibold text-[var(--c-text)]">Users</h3>

					{/* Pill tabs */}
					<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
						{TABS.map((t) => (
							<button
								key={t.key}
								onClick={() => setTab(t.key)}
								className="px-3 py-1 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap"
								style={
									tab === t.key
										? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" }
										: { color: "var(--c-text-2)" }
								}
							>
								{t.label}
							</button>
						))}
					</div>

					<div className="flex-1" />

					{/* Search */}
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--c-text-3)]" />
						<input
							className="h-8 pl-8 pr-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent w-[200px]"
							placeholder="Name or email…"
							value={q}
							onChange={(e) => setQ(e.target.value)}
						/>
					</div>
				</div>

				{/* Table */}
				<table className="w-full text-[13px] border-collapse">
					<thead>
						<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
							{["User", "Tier", "KYC", "Balance", "Country", "Joined", "Status", ""].map((h) => (
								<th
									key={h}
									className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)]"
									style={{ background: "var(--c-surface-2)" }}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((u) => {
							const t = tierColor(u.kycTier);
							const k = kycColor(u.kycStatus);
							const s = statusColor(u.status);
							return (
								<tr
									key={u.id}
									className="cursor-pointer transition-colors hover:bg-[var(--c-surface-2)]"
									style={{ borderBottom: "1px solid var(--c-line)" }}
									onClick={() => setSelected(u)}
								>
									{/* User */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<div
												className="size-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold"
												style={{ background: "var(--c-onyx-700)", color: "var(--c-cream)" }}
											>
												{initials(u.name)}
											</div>
											<div className="min-w-0">
												<div className="font-semibold text-[var(--c-text)] truncate">{u.name}</div>
												<div className="text-[11px] text-[var(--c-text-3)] truncate">{u.email}</div>
											</div>
										</div>
									</td>
									{/* Tier */}
									<td className="px-4 py-3">
										<span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={t}>
											{tierLabel(u.kycTier)}
										</span>
									</td>
									{/* KYC */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-1.5">
											<span
												className="inline-block size-[6px] rounded-full shrink-0"
												style={{ background: k.color }}
											/>
											<span className="capitalize text-[var(--c-text-2)]">{u.kycStatus}</span>
										</div>
									</td>
									{/* Balance */}
									<td className="px-4 py-3 tabular-nums font-medium text-[var(--c-text)] text-right">
										<Num value={formatMoney(u.totalDepositsNgn, "NGN", { decimals: 0, compact: true })} />
									</td>
									{/* Country */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-1.5 text-[var(--c-text-2)]">
											<span>🇳🇬</span>
											{u.country}
										</div>
									</td>
									{/* Joined */}
									<td className="px-4 py-3 text-[var(--c-text-3)]">{relativeTime(u.createdAt)}</td>
									{/* Status */}
									<td className="px-4 py-3">
										<span
											className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize"
											style={s}
										>
											{u.status}
										</span>
									</td>
									{/* Chevron */}
									<td className="px-4 py-3">
										<ChevronRight className="size-4 text-[var(--c-text-3)]" />
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* Pagination footer */}
				<div
					className="flex items-center justify-between px-5 py-3 text-[13px] text-[var(--c-text-3)]"
					style={{ borderTop: "1px solid var(--c-line)" }}
				>
					<span>1–{rows.length} of {(totalUsers).toLocaleString()}</span>
					<div className="flex items-center gap-2">
						<button className="flex items-center gap-1 h-8 px-3 rounded-lg border border-[var(--c-line)] text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors">
							<ChevronLeft className="size-3.5" />Prev
						</button>
						<button className="flex items-center gap-1 h-8 px-3 rounded-lg border border-[var(--c-line)] text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors">
							Next<ChevronRight className="size-3.5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
