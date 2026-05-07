"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

type Tab = "Profile" | "Security" | "Limits" | "Payment methods" | "Notifications" | "Privacy" | "API keys";
const TABS: Tab[] = ["Profile", "Security", "Limits", "Payment methods", "Notifications", "Privacy", "API keys"];

function Toggle({ on }: { on: boolean }) {
	return (
		<div className="relative shrink-0" style={{ width: 42, height: 24, background: on ? "var(--c-lime-500)" : "var(--c-surface-3)", borderRadius: 999, cursor: "pointer" }}>
			<div className="absolute top-[2px] rounded-full bg-white" style={{ width: 20, height: 20, left: on ? 20 : 2, transition: "left .15s" }} />
		</div>
	);
}

function StatusBadge({ s }: { s: string }) {
	return (
		<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium"
			style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}>
			<span className="text-[9px]">✓</span>{s}
		</span>
	);
}

export default function SettingsPage() {
	const [tab, setTab] = useState<Tab>("Profile");

	return (
		<div className="space-y-6">
			<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Settings</h1>
			<div className="flex flex-col lg:flex-row gap-4 lg:gap-6" style={{ alignItems: "flex-start" }}>
				{/* Sidebar nav */}
				<div className="w-full lg:w-[200px] shrink-0 overflow-x-auto">
					<div className="flex lg:flex-col gap-0.5">
						{TABS.map((t) => (
							<div key={t} onClick={() => setTab(t)}
								className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium cursor-pointer transition-colors whitespace-nowrap"
								style={tab === t ? { background: "var(--c-onyx-900)", color: "var(--c-cream)" } : { color: "var(--c-text-2)" }}>
								{t}
							</div>
						))}
					</div>
				</div>

				<div className="flex-1 min-w-0 w-full">
					{tab === "Profile" && (
						<div className="rounded-[14px] p-[var(--pad)] space-y-4" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<h3 className="text-[17px] font-semibold" style={{ color: "var(--c-text)" }}>Profile</h3>
							<div className="flex items-center gap-4">
								<div className="size-16 rounded-full flex items-center justify-center text-[22px] font-semibold" style={{ background: "linear-gradient(135deg, var(--c-lime-500), var(--c-onyx-700))", color: "var(--c-onyx-900)" }}>AO</div>
								<button className="inline-flex items-center h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>Change photo</button>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{[["Full name", "Adaeze Okonkwo"], ["Email", "adaeze@gmail.com"], ["Phone", "+234 803 421 8867"], ["Country", "Nigeria 🇳🇬"], ["Date of birth", "12 Mar 1994"], ["Address", "12 Adeola Hopewell, V/I"]].map(([k, v]) => (
									<div key={k}>
										<label className="text-[12px]" style={{ color: "var(--c-text-3)" }}>{k}</label>
										<input className="mt-1 flex items-center w-full h-[38px] px-3 rounded-[10px] text-[13.5px] outline-none" style={{ border: "1px solid var(--c-line)", background: "var(--c-surface)", color: "var(--c-text)" }} defaultValue={v} />
									</div>
								))}
							</div>
							<button className="inline-flex items-center h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>Save changes</button>
						</div>
					)}

					{tab === "Security" && (
						<div className="space-y-4">
							<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
								<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>Two-factor authentication</h3>
								<div className="flex items-center justify-between">
									<div><div className="font-semibold text-[14px]" style={{ color: "var(--c-text)" }}>Authenticator app</div><div className="text-[12px]" style={{ color: "var(--c-text-3)" }}>Google Authenticator · added Mar 8</div></div>
									<StatusBadge s="Active" />
								</div>
							</div>
							<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
								<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>Sessions</h3>
								<div className="space-y-3">
									{[["iPhone 15 · Lagos", "Current", "iOS 17"], ["MacBook Pro · Lagos", "2 hours ago", "Chrome"], ["Pixel 7 · Abuja", "Yesterday", "Android"]].map(([d, t, b]) => (
										<div key={d} className="flex items-center justify-between">
											<div><div className="font-semibold text-[13px]" style={{ color: "var(--c-text)" }}>{d}</div><div className="text-[11px]" style={{ color: "var(--c-text-3)" }}>{b} · {t}</div></div>
											{t === "Current" ? <StatusBadge s="Active" /> : <button className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>Revoke</button>}
										</div>
									))}
								</div>
							</div>
							<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
								<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>Password &amp; passkeys</h3>
								<div className="space-y-3">
									<button className="flex items-center justify-between w-full h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>Change password<ChevronRight className="size-4" /></button>
									<button className="flex items-center justify-between w-full h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>Add passkey<ChevronRight className="size-4" /></button>
								</div>
							</div>
						</div>
					)}

					{tab === "Limits" && (
						<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>Transaction limits</h3>
							<div className="space-y-5">
								{[["Daily withdrawal", "₦5,000,000", "₦2,134,500", "40%"], ["Monthly withdrawal", "₦150,000,000", "₦42,300,000", "28%"], ["Single transaction", "₦5,000,000", "—", "0%"]].map(([k, m, u, pct]) => (
									<div key={k}>
										<div className="flex items-center justify-between"><span className="font-semibold text-[14px]" style={{ color: "var(--c-text)" }}>{k}</span><span className="tabular-nums text-[13px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-2)" }}>{u} of {m}</span></div>
										<div className="mt-1.5 h-[6px] rounded-full overflow-hidden" style={{ background: "var(--c-surface-3)" }}>
											<div className="h-full rounded-full" style={{ width: pct, background: "var(--c-lime-500)" }} />
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{tab === "Payment methods" && (
						<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>Linked banks &amp; cards</h3>
							<div className="space-y-3">
								{[["GTBank", "0234567890", "Primary"], ["Access Bank", "0123987654", "—"], ["Visa ••• 4521", "Expires 09/27", "—"]].map(([n, d, t]) => (
									<div key={n} className="flex items-center justify-between p-3.5 rounded-[10px]" style={{ border: "1px solid var(--c-line)" }}>
										<div className="flex items-center gap-3">
											<div className="size-10 rounded-lg flex items-center justify-center" style={{ background: "var(--c-surface-2)" }}>🏦</div>
											<div><div className="font-semibold text-[13px]" style={{ color: "var(--c-text)" }}>{n}</div><div className="tabular-nums text-[12px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>{d}</div></div>
										</div>
										<div className="flex items-center gap-2">
											{t === "Primary" && <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>Primary</span>}
											<button className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>Remove</button>
										</div>
									</div>
								))}
								<button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>+ Add new</button>
							</div>
						</div>
					)}

					{tab === "Notifications" && (
						<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>Channels</h3>
							<div className="space-y-3">
								{[["Email", "Transactions, security, news"], ["Push", "Real-time alerts on this device"], ["SMS", "Critical security only"]].map(([k, d]) => (
									<div key={k} className="flex items-center justify-between">
										<div><div className="font-semibold text-[14px]" style={{ color: "var(--c-text)" }}>{k}</div><div className="text-[12px]" style={{ color: "var(--c-text-3)" }}>{d}</div></div>
										<Toggle on={true} />
									</div>
								))}
							</div>
						</div>
					)}

					{tab === "Privacy" && (
						<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>Privacy</h3>
							<div className="space-y-3">
								{["Hide balances by default", "Allow analytics", "Receive product updates", "Allow marketing"].map((k) => (
									<div key={k} className="flex items-center justify-between">
										<span className="text-[14px]" style={{ color: "var(--c-text)" }}>{k}</span>
										<Toggle on={k !== "Allow marketing"} />
									</div>
								))}
							</div>
						</div>
					)}

					{tab === "API keys" && (
						<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>API keys</h3>
							<div className="text-center py-12" style={{ color: "var(--c-text-3)" }}>
								No API keys yet.<br />
								<button className="mt-3.5 inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>+ Create new key</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
