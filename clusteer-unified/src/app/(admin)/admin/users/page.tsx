"use client";

import { useState, useEffect } from "react";
import {
	Search, Download, Filter, Plus, MoreHorizontal,
	X, KeyRound, ShieldOff, LogOut, Ban, ArrowUpRight, ArrowDownLeft,
	AlertTriangle,
} from "lucide-react";

/* ─── types ─── */
interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	tier: string;
	status: string;
	kyc: string;
	bvn: string;
	nin: string;
	joined: string;
	bal: number;
	address: string;
	bank: { code: string; name: string };
	acctNo: string;
	risk: number;
	txns30d: number;
	flags: string[];
}

interface Txn {
	id: string;
	type: string;
	amount: number;
	asset: string;
	date: string;
	when: string;
	status: string;
	ngn: number;
}

/* ─── NG banks ─── */
const NG_BANKS = [
	{ code: "044", name: "Access Bank" }, { code: "058", name: "GTBank" },
	{ code: "011", name: "First Bank" }, { code: "033", name: "UBA" },
	{ code: "057", name: "Zenith Bank" }, { code: "232", name: "Sterling Bank" },
	{ code: "070", name: "Fidelity Bank" }, { code: "221", name: "Stanbic IBTC" },
	{ code: "50211", name: "Kuda" }, { code: "100004", name: "Opay" },
	{ code: "50515", name: "Moniepoint" }, { code: "999992", name: "Palmpay" },
];

const ADDRESSES_LAGOS = [
	"12 Adeola Hopewell, Victoria Island", "48 Awolowo Rd, Ikoyi", "32 Adeniran Ogunsanya, Surulere",
	"7 Bode Thomas, Surulere", "19 Allen Avenue, Ikeja", "56 Opebi Rd, Ikeja",
	"23 Admiralty Way, Lekki", "9 Akin Adesola, V/I", "134 Herbert Macaulay, Yaba",
];

const NAMES_NG = [
	"Adaeze Okonkwo", "Tunde Bakare", "Chinedu Eze", "Aisha Mohammed", "Folake Adeyemi",
	"Emeka Nwosu", "Bisi Ajayi", "Yusuf Ibrahim", "Ngozi Obi", "Damilola Owolabi",
	"Kemi Lawal", "Ifeanyi Uche", "Habiba Musa", "Tobi Akinwumi", "Chiamaka Eze",
	"Olumide Salami", "Zainab Bello", "Bola Tinubu", "Hauwa Aliyu", "Segun Onile",
];

/* ─── deterministic random ─── */
function rand(seed: number) {
	let s = seed;
	return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

/* ─── generate 20 users ─── */
const USERS: User[] = NAMES_NG.map((n, i) => {
	const r = rand(i + 1);
	const tier = ["Tier 1", "Tier 2", "Tier 3"][Math.floor(r() * 3)];
	const status = ["Active", "Active", "Active", "Suspended", "Pending"][Math.floor(r() * 5)];
	return {
		id: `USR-${10042 + i}`,
		name: n,
		email: n.toLowerCase().replace(/\s/g, ".") + "@" + (["gmail", "yahoo", "outlook"][i % 3]) + ".com",
		phone: `+234 ${800 + i} ${100 + i * 7} ${1000 + i * 13}`,
		tier, status,
		kyc: tier === "Tier 3" ? "Verified" : (i % 4 === 0 ? "Pending" : (i % 5 === 0 ? "Rejected" : "Verified")),
		bvn: `2210${String(100000 + i * 1117).slice(-7)}`,
		nin: `121${String(20000000 + i * 1991).slice(-8)}`,
		joined: `Mar ${(i % 28) + 1}, 2026`,
		bal: Math.floor(50000 + r() * 8000000),
		address: ADDRESSES_LAGOS[i % ADDRESSES_LAGOS.length],
		bank: NG_BANKS[i % NG_BANKS.length],
		acctNo: `${1000000000 + Math.floor(r() * 8999999999)}`,
		risk: Math.floor(r() * 100),
		txns30d: Math.floor(r() * 120) + 5,
		flags: i % 6 === 0 ? ["High velocity"] : (i % 9 === 0 ? ["Sanctions match (cleared)"] : []),
	};
});

/* ─── mock txns for user drawer ─── */
const ASSETS_LIST = ["USDT", "USDC", "BTC", "ETH", "BNB", "SOL", "NGN"];
const TX_TYPES = ["Buy", "Sell", "Send", "Receive", "Swap", "Withdraw", "Deposit"];
const TX_STATUSES = ["Completed", "Completed", "Completed", "Pending", "Failed"];
const RECENT_TXNS: Txn[] = Array.from({ length: 12 }).map((_, i) => {
	const r = rand(i + 100);
	const amount = +(0.01 + r() * 500).toFixed(4);
	return {
		id: `TX-${838201 - i * 7}`,
		type: TX_TYPES[Math.floor(r() * TX_TYPES.length)],
		amount,
		asset: ASSETS_LIST[Math.floor(r() * ASSETS_LIST.length)],
		date: ["Today", "Today", "Yesterday", "Mar 14", "Mar 13"][Math.floor(r() * 5)],
		when: `${Math.floor(r() * 23)}:${String(Math.floor(r() * 59)).padStart(2, "0")}`,
		status: TX_STATUSES[Math.floor(r() * TX_STATUSES.length)],
		ngn: Math.floor(amount * (1500 + r() * 3000)),
	};
});

/* ─── mock wallet assets ─── */
const WALLET_ASSETS = [
	{ sym: "NGN", name: "Naira", priceNgn: 1 },
	{ sym: "USDT", name: "Tether", priceNgn: 1650 },
	{ sym: "USDC", name: "USD Coin", priceNgn: 1645 },
	{ sym: "BTC", name: "Bitcoin", priceNgn: 110000000 },
];

/* ─── color helpers ─── */
function statusStyle(s: string) {
	const sl = s.toLowerCase();
	return sl === "active" || sl === "verified" || sl === "completed"
		? { background: "var(--c-up-soft)", color: "var(--c-up)" }
		: sl === "suspended" || sl === "rejected" || sl === "failed"
		? { background: "var(--c-down-soft)", color: "var(--c-down)" }
		: { background: "var(--c-warn-soft)", color: "var(--c-warn)" };
}

function riskColor(r: number) {
	return r > 70 ? "var(--c-down)" : r > 40 ? "var(--c-warn)" : "var(--c-up)";
}

function initials(name: string) {
	return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function fmtNgn(n: number) {
	return "\u20A6" + n.toLocaleString("en-NG");
}

/* ─── tier tabs ─── */
const TIER_TABS = ["All", "Tier 1", "Tier 2", "Tier 3"];

/* ─── stat cards ─── */
const STATS = [
	{ label: "Total users", value: "12,481", sub: "+248 this week" },
	{ label: "Active 24h", value: "8,421", sub: "67% of base" },
	{ label: "Verified", value: "11,294", sub: "90.5% verified" },
	{ label: "Suspended", value: "37", sub: "3 new today" },
];

/* ─── drawer tab list ─── */
const DRAWER_TABS = ["Overview", "Wallets", "Transactions", "Activity", "Notes"] as const;
type DrawerTab = typeof DRAWER_TABS[number];

/* ================================================================
   TIMELINE COMPONENT
   ================================================================ */
function Timeline({ steps }: { steps: { label: string; time?: string; note?: string; done: boolean; active?: boolean }[] }) {
	return (
		<div className="flex flex-col">
			{steps.map((s, i) => (
				<div key={i} className="flex gap-3" style={{ alignItems: "flex-start", paddingBottom: i < steps.length - 1 ? 14 : 0 }}>
					<div className="flex flex-col items-center" style={{ position: "relative" }}>
						<div
							className="flex items-center justify-center shrink-0 rounded-full text-[10px]"
							style={{
								width: 18,
								height: 18,
								background: s.done ? "var(--c-up)" : s.active ? "var(--c-lime-500)" : "var(--c-surface-2)",
								border: "2px solid var(--c-surface)",
								boxShadow: s.active ? "0 0 0 3px color-mix(in oklab, var(--c-lime-500) 25%, transparent)" : "none",
								color: "#fff",
							}}
						>
							{s.done && "\u2713"}
						</div>
						{i < steps.length - 1 && (
							<div
								style={{
									width: 2,
									flex: 1,
									minHeight: 24,
									background: s.done ? "var(--c-up)" : "var(--c-line)",
									marginTop: 2,
								}}
							/>
						)}
					</div>
					<div className="flex-1" style={{ paddingTop: 1 }}>
						<div
							className="text-[13.5px] font-medium"
							style={{ color: s.done || s.active ? "var(--c-text)" : "var(--c-text-3)" }}
						>
							{s.label}
						</div>
						{s.time && <div className="text-[11px] font-mono text-[var(--c-text-3)] mt-0.5">{s.time}</div>}
						{s.note && <div className="text-[12px] text-[var(--c-text-3)] mt-0.5">{s.note}</div>}
					</div>
				</div>
			))}
		</div>
	);
}

/* ================================================================
   USER PROFILE DRAWER
   ================================================================ */
function UserProfileDrawer({
	user,
	onClose,
	onSuspend,
}: {
	user: User;
	onClose: () => void;
	onSuspend: (user: User) => void;
}) {
	const [tab, setTab] = useState<DrawerTab>("Overview");

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	const dailyLimit = user.tier === "Tier 3" ? "\u20A650,000,000" : user.tier === "Tier 2" ? "\u20A65,000,000" : "\u20A6300,000";

	return (
		<div
			className="fixed inset-0 z-50 flex justify-end"
			style={{ background: "rgba(0,0,0,0.45)", padding: 0 }}
			onClick={onClose}
		>
			<div
				className="flex flex-col h-full bg-[var(--c-surface)] overflow-hidden"
				style={{
					width: 780,
					maxWidth: "100vw",
					borderRadius: "20px 0 0 20px",
					animation: "drawerIn .22s cubic-bezier(.2,.7,.2,1)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div
					className="flex items-center justify-between shrink-0 px-6 py-4"
					style={{ borderBottom: "1px solid var(--c-line)" }}
				>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">{user.name}</div>
					<button
						className="flex items-center justify-center size-8 rounded-md hover:bg-[var(--c-surface-3)] transition-colors"
						onClick={onClose}
					>
						<X className="size-4 text-[var(--c-text-3)]" />
					</button>
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
					{/* Avatar + name + email + phone + badges */}
					<div className="flex items-center gap-3">
						<div
							className="flex items-center justify-center shrink-0 rounded-full text-[20px] font-bold"
							style={{ width: 56, height: 56, background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
						>
							{initials(user.name)}
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-[18px] font-semibold text-[var(--c-text)]">{user.name}</div>
							<div className="text-[13px] text-[var(--c-text-3)]">{user.email} &middot; {user.phone}</div>
							<div className="flex items-center gap-2 flex-wrap mt-1.5">
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize" style={statusStyle(user.status)}>
									<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle(user.status).color }} />
									{user.status}
								</span>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "var(--c-surface-3)", color: "var(--c-text-2)" }}>
									{user.tier}
								</span>
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize" style={statusStyle(user.kyc)}>
									<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle(user.kyc).color }} />
									{user.kyc}
								</span>
								{user.flags.map((f) => (
									<span key={f} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}>
										{f}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Tabs */}
					<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
						{DRAWER_TABS.map((t) => (
							<button
								key={t}
								onClick={() => setTab(t)}
								className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap"
								style={
									tab === t
										? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" }
										: { color: "var(--c-text-2)" }
								}
							>
								{t}
							</button>
						))}
					</div>

					{/* ─── Overview Tab ─── */}
					{tab === "Overview" && (
						<>
							{/* 3 KPI cards */}
							<div className="grid grid-cols-3 gap-3">
								<div className="ds-card p-4">
									<div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">Total balance</div>
									<div className="text-[22px] font-semibold tabular-nums text-[var(--c-text)] mt-1.5">{fmtNgn(user.bal)}</div>
								</div>
								<div className="ds-card p-4">
									<div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">Lifetime volume</div>
									<div className="text-[22px] font-semibold tabular-nums text-[var(--c-text)] mt-1.5">{fmtNgn(Math.floor(user.bal * 4.2))}</div>
								</div>
								<div className="ds-card p-4">
									<div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">Joined</div>
									<div className="text-[14px] font-medium text-[var(--c-text)] mt-2">{user.joined}</div>
								</div>
							</div>

							{/* Detail rows */}
							<div className="ds-card overflow-hidden" style={{ padding: "4px 14px" }}>
								{([
									["BVN", user.bvn, true],
									["NIN", user.nin, true],
									["Bank", `${user.bank.name} \u00B7 ${user.acctNo}`, true],
									["Address", user.address, false],
									["Daily limit", dailyLimit, true],
								] as [string, string, boolean][]).map(([k, v, mono]) => (
									<div key={k} className="flex items-center justify-between py-2.5 text-[13px]" style={{ borderBottom: "1px solid var(--c-line)" }}>
										<span className="text-[var(--c-text-3)]">{k}</span>
										<span className={`text-[var(--c-text)] ${mono ? "tabular-nums font-mono" : ""}`}>{v}</span>
									</div>
								))}
							</div>
						</>
					)}

					{/* ─── Wallets Tab ─── */}
					{tab === "Wallets" && (
						<div className="ds-card overflow-hidden">
							<table className="w-full text-[13px] border-collapse">
								<thead>
									<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
										{["Asset", "Balance", "NGN value", "Address"].map((h) => (
											<th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)]" style={{ background: "var(--c-surface-2)" }}>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{WALLET_ASSETS.map((a) => {
										const balance = user.bal / a.priceNgn * 0.4;
										const ngnVal = Math.floor(balance * a.priceNgn);
										return (
											<tr key={a.sym} style={{ borderBottom: "1px solid var(--c-line)" }}>
												<td className="px-4 py-3">
													<div className="flex items-center gap-2">
														<span
															className="flex items-center justify-center rounded-full text-[11px] font-bold"
															style={{ width: 24, height: 24, background: "var(--c-surface-3)", color: "var(--c-text)" }}
														>
															{a.sym[0]}
														</span>
														<span className="text-[var(--c-text)]">{a.sym}</span>
													</div>
												</td>
												<td className="px-4 py-3 tabular-nums font-mono text-[var(--c-text)]">
													{balance.toFixed(a.sym === "BTC" ? 6 : 2)}
												</td>
												<td className="px-4 py-3 tabular-nums text-[var(--c-text)]">{fmtNgn(ngnVal)}</td>
												<td className="px-4 py-3 font-mono text-[11px] text-[var(--c-text-3)]">
													{a.sym === "NGN" ? "\u2014" : "0x4f...8a2c"}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}

					{/* ─── Transactions Tab ─── */}
					{tab === "Transactions" && (
						<div className="ds-card overflow-hidden">
							<table className="w-full text-[13px] border-collapse">
								<thead>
									<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
										{["Date", "Type", "Asset", "Amount", "NGN", "Status"].map((h) => (
											<th
												key={h}
												className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)]"
												style={{
													background: "var(--c-surface-2)",
													textAlign: h === "Amount" || h === "NGN" ? "right" : "left",
												}}
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{RECENT_TXNS.map((t) => (
										<tr key={t.id} style={{ borderBottom: "1px solid var(--c-line)" }}>
											<td className="px-4 py-3 font-mono text-[11px] text-[var(--c-text-3)]">
												{t.date}<br />{t.when}
											</td>
											<td className="px-4 py-3 text-[var(--c-text)]">{t.type}</td>
											<td className="px-4 py-3 text-[var(--c-text)]">{t.asset}</td>
											<td className="px-4 py-3 tabular-nums font-mono text-right text-[var(--c-text)]">{t.amount.toFixed(2)}</td>
											<td className="px-4 py-3 tabular-nums text-right text-[var(--c-text)]">{fmtNgn(t.ngn)}</td>
											<td className="px-4 py-3">
												<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={statusStyle(t.status)}>
													<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle(t.status).color }} />
													{t.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* ─── Activity Tab ─── */}
					{tab === "Activity" && (
						<div className="ds-card p-5">
							<Timeline steps={[
								{ label: "Logged in", time: `Today 10:42 \u00B7 Lagos, NG \u00B7 iPhone 15`, done: true },
								{ label: "Completed Buy 250 USDT", time: "Today 10:38", done: true },
								{ label: "Updated bank account", time: "Yesterday 16:12", done: true, note: `Changed default to GTBank \u2022\u2022\u2022 2847` },
								{ label: "2FA enabled", time: "14 Apr 2026", done: true },
								{ label: `KYC approved \u2192 Tier 2`, time: "8 Apr 2026", done: true },
								{ label: "Account created", time: user.joined, done: true },
							]} />
						</div>
					)}

					{/* ─── Notes Tab ─── */}
					{tab === "Notes" && (
						<div className="ds-card p-5 space-y-3">
							{/* Existing note */}
							<div className="p-4 rounded-lg" style={{ background: "var(--c-surface-2)" }}>
								<div className="flex items-center justify-between">
									<div className="text-[12px] font-semibold text-[var(--c-text)]">Bisi &middot; Compliance</div>
									<div className="text-[11px] text-[var(--c-text-3)]">2 days ago</div>
								</div>
								<div className="text-[13px] text-[var(--c-text)] mt-1.5">
									Reviewed monthly volume -- within expected range for Tier 2 trader. No action needed.
								</div>
							</div>

							{/* Add note */}
							<textarea
								placeholder="Add internal note..."
								className="w-full rounded-lg border border-[var(--c-line)] bg-[var(--c-bg)] px-3 py-2.5 text-[13px] text-[var(--c-text)] placeholder:text-[var(--c-text-3)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent resize-y"
								style={{ minHeight: 70, fontFamily: "inherit" }}
							/>
							<button
								className="flex items-center h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors"
								style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
							>
								Add note
							</button>
						</div>
					)}
				</div>

				{/* Footer */}
				<div
					className="flex items-center justify-end gap-2 shrink-0 px-6 py-4"
					style={{ borderTop: "1px solid var(--c-line)" }}
				>
					<button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
						<KeyRound className="size-3.5 text-[var(--c-text-3)]" />Reset password
					</button>
					<button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
						<ShieldOff className="size-3.5 text-[var(--c-text-3)]" />Reset 2FA
					</button>
					<button
						className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium hover:bg-[var(--c-down-soft)] transition-colors"
						style={{ color: "var(--c-down)" }}
						onClick={() => onSuspend(user)}
					>
						<Ban className="size-3.5" />Suspend
					</button>
				</div>
			</div>
		</div>
	);
}

/* ================================================================
   FREEZE USER MODAL
   ================================================================ */
function FreezeUserModal({
	user,
	onClose,
	onConfirm,
}: {
	user: User;
	onClose: () => void;
	onConfirm: (data: { reason: string; duration: string }) => void;
}) {
	const [reason, setReason] = useState("Suspicious activity");
	const [duration, setDuration] = useState("24h");

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	const DURATIONS = ["24h", "7d", "30d", "Indefinite"];
	const REASONS = ["Suspicious activity", "Compliance review", "User request", "Failed verification", "Charge-back", "Other"];

	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center"
			style={{ background: "rgba(0,0,0,0.5)" }}
			onClick={onClose}
		>
			<div
				className="flex flex-col bg-[var(--c-surface)] rounded-2xl overflow-hidden"
				style={{
					maxWidth: 460,
					width: "100%",
					animation: "modalIn .22s cubic-bezier(.2,.7,.2,1)",
					border: "1px solid var(--c-line)",
					boxShadow: "var(--sh-3)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">Freeze account</div>
					<button className="flex items-center justify-center size-8 rounded-md hover:bg-[var(--c-surface-3)] transition-colors" onClick={onClose}>
						<X className="size-4 text-[var(--c-text-3)]" />
					</button>
				</div>

				{/* Body */}
				<div className="px-5 py-5 space-y-4">
					{/* Warning banner */}
					<div
						className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px]"
						style={{ background: "color-mix(in oklab, var(--c-down) 8%, transparent)", color: "var(--c-down)" }}
					>
						<AlertTriangle className="size-4 shrink-0" />
						<span>User will be logged out and unable to transact until unfrozen.</span>
					</div>

					{/* Avatar + name */}
					<div className="flex items-center gap-3">
						<div
							className="flex items-center justify-center shrink-0 rounded-full text-[14px] font-bold"
							style={{ width: 40, height: 40, background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
						>
							{initials(user.name)}
						</div>
						<div>
							<div className="text-[14px] font-semibold text-[var(--c-text)]">{user.name}</div>
							<div className="text-[12px] text-[var(--c-text-3)]">{user.email} &middot; {user.tier}</div>
						</div>
					</div>

					{/* Duration selector */}
					<div>
						<div className="text-[12px] text-[var(--c-text-3)] mb-1.5">Duration</div>
						<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
							{DURATIONS.map((d) => (
								<button
									key={d}
									onClick={() => setDuration(d)}
									className="flex-1 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors text-center"
									style={
										duration === d
											? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" }
											: { color: "var(--c-text-2)" }
									}
								>
									{d}
								</button>
							))}
						</div>
					</div>

					{/* Reason dropdown */}
					<div>
						<div className="text-[12px] text-[var(--c-text-3)] mb-1.5">Reason</div>
						<select
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							className="w-full rounded-lg border border-[var(--c-line)] bg-[var(--c-bg)] px-3 py-2.5 text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent"
						>
							{REASONS.map((r) => (
								<option key={r} value={r}>{r}</option>
							))}
						</select>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--c-line)" }}>
					<button
						className="flex items-center h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="flex items-center h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors"
						style={{ background: "var(--c-down)", color: "#fff" }}
						onClick={() => {
							onConfirm({ reason, duration });
							onClose();
						}}
					>
						Freeze account
					</button>
				</div>
			</div>
		</div>
	);
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function AdminUsersPage() {
	const [tier, setTier] = useState("All");
	const [q, setQ] = useState("");
	const [drawerUser, setDrawerUser] = useState<User | null>(null);
	const [freezeUser, setFreezeUser] = useState<User | null>(null);

	const list = USERS.filter(
		(u) =>
			(tier === "All" || u.tier === tier) &&
			(!q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())),
	);

	return (
		<div className="space-y-5">
			{/* ─── Header ─── */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">Users</h1>
				<div className="flex items-center gap-2">
					<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
						<Filter className="size-3.5 text-[var(--c-text-3)]" />Filters
					</button>
					<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
						<Download className="size-3.5 text-[var(--c-text-3)]" />Export CSV
					</button>
					<button
						className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors"
						style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
					>
						<Plus className="size-3.5" />New user
					</button>
				</div>
			</div>

			{/* ─── Search + Tier tabs ─── */}
			<div className="flex items-center gap-3 flex-wrap">
				<div
					className="relative flex items-center flex-1"
					style={{ maxWidth: 340, height: 36, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", paddingLeft: 12, paddingRight: 12 }}
				>
					<Search className="size-4 shrink-0 text-[var(--c-text-3)]" />
					<input
						className="h-[34px] w-full border-none bg-transparent pl-2 text-[13px] text-[var(--c-text)] outline-none placeholder:text-[var(--c-text-3)]"
						placeholder="Search users..."
						value={q}
						onChange={(e) => setQ(e.target.value)}
					/>
				</div>
				<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
					{TIER_TABS.map((t) => (
						<button
							key={t}
							onClick={() => setTier(t)}
							className="px-3 py-1 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap"
							style={
								tier === t
									? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" }
									: { color: "var(--c-text-2)" }
							}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			{/* ─── Stat cards ─── */}
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				{STATS.map((s) => (
					<div key={s.label} className="ds-card p-5">
						<div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">{s.label}</div>
						<div className="mt-1.5 text-[24px] font-semibold tabular-nums text-[var(--c-text)]">{s.value}</div>
						<div className="mt-0.5 text-[12px] text-[var(--c-text-3)]">{s.sub}</div>
					</div>
				))}
			</div>

			{/* ─── Users table ─── */}
			<div className="ds-card overflow-hidden">
				<table className="w-full text-[13px] border-collapse">
					<thead>
						<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
							{["User", "Tier", "Status", "KYC", "Balance", "30d txns", "Risk", "Joined", ""].map((h) => (
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
						{list.length === 0 && (
							<tr>
								<td colSpan={9} className="py-12 text-center text-[13px] text-[var(--c-text-3)]">No users found.</td>
							</tr>
						)}
						{list.map((u) => (
							<tr
								key={u.id}
								className="transition-colors hover:bg-[var(--c-surface-2)] cursor-pointer"
								style={{ borderBottom: "1px solid var(--c-line)" }}
								onClick={() => setDrawerUser(u)}
							>
								{/* User */}
								<td className="px-4 py-3">
									<div className="flex items-center gap-3">
										<div
											className="flex items-center justify-center shrink-0 rounded-full text-[11px] font-bold"
											style={{ width: 34, height: 34, background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
										>
											{initials(u.name)}
										</div>
										<div className="min-w-0">
											<div className="font-semibold text-[13px] text-[var(--c-text)] truncate">{u.name}</div>
											<div className="text-[11px] text-[var(--c-text-3)] truncate">{u.email}</div>
										</div>
									</div>
								</td>
								{/* Tier */}
								<td className="px-4 py-3">
									<span
										className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
										style={{ background: "var(--c-surface-3)", color: "var(--c-text-2)" }}
									>
										{u.tier}
									</span>
								</td>
								{/* Status */}
								<td className="px-4 py-3">
									<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize" style={statusStyle(u.status)}>
										<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle(u.status).color }} />
										{u.status}
									</span>
								</td>
								{/* KYC */}
								<td className="px-4 py-3">
									<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize" style={statusStyle(u.kyc)}>
										<span className="size-[5px] rounded-full shrink-0" style={{ background: statusStyle(u.kyc).color }} />
										{u.kyc}
									</span>
								</td>
								{/* Balance */}
								<td className="px-4 py-3 tabular-nums text-right font-semibold text-[var(--c-text)]">{fmtNgn(u.bal)}</td>
								{/* 30d txns */}
								<td className="px-4 py-3 tabular-nums text-center text-[var(--c-text)]">{u.txns30d}</td>
								{/* Risk */}
								<td className="px-4 py-3">
									<div className="flex items-center gap-2">
										<div className="relative h-[5px] flex-1 rounded-full overflow-hidden" style={{ maxWidth: 60, background: "var(--c-surface-3)" }}>
											<div
												className="absolute inset-y-0 left-0 rounded-full"
												style={{ width: `${u.risk}%`, background: riskColor(u.risk) }}
											/>
										</div>
										<span className="tabular-nums text-[11px] text-[var(--c-text-3)]">{u.risk}</span>
									</div>
								</td>
								{/* Joined */}
								<td className="px-4 py-3 text-[var(--c-text-3)]">{u.joined}</td>
								{/* Actions */}
								<td className="px-4 py-3">
									<button
										className="flex items-center justify-center size-7 rounded-md hover:bg-[var(--c-surface-3)] transition-colors"
										onClick={(e) => e.stopPropagation()}
									>
										<MoreHorizontal className="size-4 text-[var(--c-text-3)]" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Footer */}
				<div className="flex items-center justify-between px-5 py-3 text-[13px] text-[var(--c-text-3)]" style={{ borderTop: "1px solid var(--c-line)" }}>
					<span>1&ndash;{list.length} of {USERS.length}</span>
				</div>
			</div>

			{/* ─── User Profile Drawer ─── */}
			{drawerUser && (
				<UserProfileDrawer
					user={drawerUser}
					onClose={() => setDrawerUser(null)}
					onSuspend={(user) => {
						setDrawerUser(null);
						setFreezeUser(user);
					}}
				/>
			)}

			{/* ─── Freeze User Modal ─── */}
			{freezeUser && (
				<FreezeUserModal
					user={freezeUser}
					onClose={() => setFreezeUser(null)}
					onConfirm={(data) => {
						// eslint-disable-next-line no-console
						console.log("User frozen:", freezeUser.name, data);
						setFreezeUser(null);
					}}
				/>
			)}
		</div>
	);
}
