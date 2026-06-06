"use client";

import { useState } from "react";
import { Check, ChevronRight, Plus, Landmark, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/primitives/empty-state";

type Tab = "Profile" | "Security" | "Limits" | "Payment methods" | "Notifications" | "Privacy" | "API keys";
const TABS: Tab[] = ["Profile", "Security", "Limits", "Payment methods", "Notifications", "Privacy", "API keys"];

function Toggle({ on, onClick }: { on: boolean; onClick?: () => void }) {
	return (
		<button
			type="button" role="switch" aria-checked={on} onClick={onClick}
			className={`w-[42px] h-6 shrink-0 rounded-full border-none cursor-pointer relative p-0 transition-colors duration-150 ${on ? "bg-lime-500" : "bg-ds-surface-3"}`}
		>
			<span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] duration-150 ${on ? "left-5" : "left-0.5"}`} />
		</button>
	);
}

function StatusBadge({ s }: { s: string }) {
	return (
		<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium bg-up-soft text-up">
			<Check size={10} />{s}
		</span>
	);
}

export default function SettingsPage() {
	const [tab, setTab] = useState<Tab>("Profile");
	const [channels, setChannels] = useState<Record<string, boolean>>({ Email: true, Push: true, SMS: true });
	const [privacy, setPrivacy] = useState<Record<string, boolean>>({ "Hide balances by default": true, "Allow analytics": true, "Receive product updates": true, "Allow marketing": false });

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">Settings</h1>

			<div className="flex flex-col lg:flex-row gap-6 items-start">
				{/* Tab nav */}
				<div className="w-full lg:w-[200px] shrink-0 overflow-x-auto">
					<div className="flex lg:flex-col gap-0.5">
						{TABS.map((t) => (
							<button
								key={t} onClick={() => setTab(t)}
								className={`flex items-center px-3 py-2 rounded-[10px] text-[13.5px] font-medium cursor-pointer border-none whitespace-nowrap text-left ${
									tab === t
										? "bg-onyx-900 text-cream dark:bg-cream dark:text-onyx-900"
										: "bg-transparent text-ds-text-2 hover:bg-ds-surface-2"
								}`}
							>
								{t}
							</button>
						))}
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0 w-full">
					{tab === "Profile" && (
						<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
							<div className="px-5 py-4 border-b border-ds-line">
								<h3 className="text-[15px] font-semibold text-ds-text m-0">Profile</h3>
							</div>
							<div className="p-5 flex flex-col gap-4">
								<div className="flex items-center gap-4">
									<div className="w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-semibold bg-ds-surface-3 text-ds-text">AO</div>
									<button className="inline-flex items-center h-[36px] px-3.5 rounded-[10px] text-[13.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer" onClick={() => toast("Photo upload opened")}>
										Change photo
									</button>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{[["Full name", "Adaeze Okonkwo"], ["Email", "adaeze@gmail.com"], ["Phone", "+234 803 421 8867"], ["Country", "Nigeria"], ["Date of birth", "12 Mar 1994"], ["Address", "12 Adeola Hopewell, V/I"]].map(([k, v]) => (
										<div key={k}>
											<label className="text-[12px] text-ds-text-3">{k}</label>
											<input className="mt-1 flex items-center w-full h-[38px] px-3 rounded-[10px] text-[13.5px] border border-ds-line bg-ds-surface text-ds-text outline-none" defaultValue={v} />
										</div>
									))}
								</div>
								<button className="self-start inline-flex items-center h-[36px] px-3.5 rounded-[10px] text-[13.5px] font-medium bg-lime-500 text-onyx-900 border-none cursor-pointer" onClick={() => toast.success("Profile saved")}>
									Save changes
								</button>
							</div>
						</div>
					)}

					{tab === "Security" && (
						<div className="flex flex-col gap-4">
							{/* 2FA */}
							<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
								<div className="px-5 py-4 border-b border-ds-line">
									<h3 className="text-[15px] font-semibold text-ds-text m-0">Two-factor authentication</h3>
								</div>
								<div className="p-5 flex items-center justify-between">
									<div>
										<div className="font-semibold text-ds-text">Authenticator app</div>
										<div className="text-[12px] text-ds-text-3">Google Authenticator · added Mar 8</div>
									</div>
									<div className="flex items-center gap-2">
										<StatusBadge s="Active" />
										<button onClick={() => window.openFlow("twoFa")} className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer">Manage</button>
									</div>
								</div>
							</div>

							{/* Sessions */}
							<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
								<div className="px-5 py-4 border-b border-ds-line">
									<h3 className="text-[15px] font-semibold text-ds-text m-0">Sessions</h3>
								</div>
								<div className="p-5 flex flex-col gap-3">
									{[["iPhone 15 · Lagos", "Current", "iOS 17"], ["MacBook Pro · Lagos", "2 hours ago", "Chrome"], ["Pixel 7 · Abuja", "Yesterday", "Android"]].map(([d, t, b]) => (
										<div key={d} className="flex items-center justify-between">
											<div>
												<div className="font-semibold text-[13px] text-ds-text">{d}</div>
												<div className="text-[11px] text-ds-text-3">{b} · {t}</div>
											</div>
											{t === "Current" ? <StatusBadge s="Active" /> : (
												<button onClick={() => window.openFlow("confirm", { title: "Revoke session?", message: `End the session on ${d}? They'll need to sign in again.`, confirmLabel: "Revoke", danger: true, onConfirm: () => toast.success("Session revoked") })} className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer">Revoke</button>
											)}
										</div>
									))}
								</div>
							</div>

							{/* Password & passkeys */}
							<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
								<div className="px-5 py-4 border-b border-ds-line">
									<h3 className="text-[15px] font-semibold text-ds-text m-0">Password &amp; passkeys</h3>
								</div>
								<div className="p-5 flex flex-col gap-3">
									{([
									["Change password", () => window.openFlow("changePassword")],
									["Change email", () => window.openFlow("changeEmail")],
									["Add passkey", () => toast("Passkey support coming soon")],
								] as const).map(([label, onClick]) => (
									<button key={label} onClick={onClick} className="flex items-center justify-between w-full h-[36px] px-3.5 rounded-[10px] text-[13.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer">
										{label}<ChevronRight size={14} />
									</button>
								))}
								</div>
							</div>
						</div>
					)}

					{tab === "Limits" && (
						<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
							<div className="px-5 py-4 border-b border-ds-line">
								<h3 className="text-[15px] font-semibold text-ds-text m-0">Transaction limits</h3>
							</div>
							<div className="p-5 flex flex-col gap-5">
								{[["Daily limit", "₦5,000,000", "₦2,134,500", "40%"], ["Monthly limit", "₦150,000,000", "₦42,300,000", "28%"], ["Single order", "₦5,000,000", "—", "0%"]].map(([k, m, u, pct]) => (
									<div key={k}>
										<div className="flex items-center justify-between">
											<span className="font-semibold text-ds-text">{k}</span>
											<span className="font-mono tabular-nums text-[13px] text-ds-text-2">{u} of {m}</span>
										</div>
										<div className="mt-1.5 h-[6px] rounded-full overflow-hidden bg-ds-surface-3">
											<div className="h-full rounded-full bg-lime-500" style={{ width: pct }} />
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{tab === "Payment methods" && (
						<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
							<div className="px-5 py-4 border-b border-ds-line">
								<h3 className="text-[15px] font-semibold text-ds-text m-0">Linked banks &amp; cards</h3>
							</div>
							<div className="p-5 flex flex-col gap-3">
								{([["GTBank", "0234567890", "Primary", "bank"], ["Access Bank", "0123987654", "—", "bank"], ["Visa ••• 4521", "Expires 09/27", "—", "card"]] as const).map(([n, d, t, kind]) => (
									<div key={n} className="flex items-center justify-between p-3.5 rounded-[10px] border border-ds-line">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-lg flex items-center justify-center bg-ds-surface-2 text-ds-text">
												{kind === "card" ? <CreditCard size={18} /> : <Landmark size={18} />}
											</div>
											<div>
												<div className="font-semibold text-[13px] text-ds-text">{n}</div>
												<div className="font-mono tabular-nums text-[12px] text-ds-text-3">{d}</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											{t === "Primary" && <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium bg-lime-500 text-onyx-900">Primary</span>}
											<button onClick={() => window.openFlow("confirm", { title: "Remove payment method?", message: `Remove ${n} from your linked accounts?`, confirmLabel: "Remove", danger: true, onConfirm: () => toast.success(`${n} removed`) })} className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer">Remove</button>
										</div>
									</div>
								))}
								<button onClick={() => window.openFlow("addBank")} className="self-start inline-flex items-center gap-2 h-[36px] px-3.5 rounded-[10px] text-[13.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer">
									<Plus size={14} />Add new
								</button>
							</div>
						</div>
					)}

					{tab === "Notifications" && (
						<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
							<div className="px-5 py-4 border-b border-ds-line">
								<h3 className="text-[15px] font-semibold text-ds-text m-0">Channels</h3>
							</div>
							<div className="p-5 flex flex-col gap-3">
								{[["Email", "Transactions, security, news"], ["Push", "Real-time alerts on this device"], ["SMS", "Critical security only"]].map(([k, d]) => (
									<div key={k} className="flex items-center justify-between">
										<div>
											<div className="font-semibold text-ds-text">{k}</div>
											<div className="text-[12px] text-ds-text-3">{d}</div>
										</div>
										<Toggle on={channels[k]} onClick={() => setChannels((s) => ({ ...s, [k]: !s[k] }))} />
									</div>
								))}
							</div>
						</div>
					)}

					{tab === "Privacy" && (
						<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
							<div className="px-5 py-4 border-b border-ds-line">
								<h3 className="text-[15px] font-semibold text-ds-text m-0">Privacy</h3>
							</div>
							<div className="p-5 flex flex-col gap-3">
								{["Hide balances by default", "Allow analytics", "Receive product updates", "Allow marketing"].map((k) => (
									<div key={k} className="flex items-center justify-between">
										<span className="text-ds-text">{k}</span>
										<Toggle on={privacy[k]} onClick={() => setPrivacy((s) => ({ ...s, [k]: !s[k] }))} />
									</div>
								))}
							</div>
						</div>
					)}

					{tab === "API keys" && (
						<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
							<div className="px-5 py-4 border-b border-ds-line">
								<h3 className="text-[15px] font-semibold text-ds-text m-0">API keys</h3>
							</div>
							<div className="p-5">
								<EmptyState
									icon={Plus}
									variant="branded"
									title="No API keys yet"
									description="Create an API key to integrate Clusteer into your applications."
									action={{ label: "Create new key", onClick: () => window.openFlow("createApiKey") }}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
