"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, RefreshCw, AlertTriangle } from "lucide-react";

const INITIAL = {
	buyMarkup: "0.75",
	sellMarkdown: "0.75",
	withdrawalFeeUsdt: "1.00",
	withdrawalFeeUsdc: "1.00",
	vatRate: "7.5",
	minBuyNgn: "5000",
	maxBuyNgn: "100000000",
	minSellUsdt: "5",
	maxSellUsdt: "100000",
	internalSendFee: "0",
	rateRefreshSeconds: "10",
	maintenanceMode: false,
	newUserRegistration: true,
	kycRequired: true,
};

function Toggle({
	checked,
	onChange,
}: {
	checked: boolean;
	onChange: (v: boolean) => void;
}) {
	return (
		<button
			role="switch"
			aria-checked={checked}
			onClick={() => onChange(!checked)}
			className="relative inline-flex w-[42px] h-6 rounded-full transition-colors duration-200 shrink-0"
			style={{ background: checked ? "var(--c-lime-500)" : "var(--c-surface-3)" }}
		>
			<span
				className="absolute top-[3px] left-[3px] size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200"
				style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }}
			/>
		</button>
	);
}

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
	return (
		<div className="space-y-1.5">
			<div className="text-[11px] font-medium text-[var(--c-text-3)]">{label}</div>
			{children}
			{hint && <p className="text-[11px] text-[var(--c-text-3)]">{hint}</p>}
		</div>
	);
}

function NumInput({ value, onChange, step = "0.01" }: { value: string; onChange: (v: string) => void; step?: string }) {
	return (
		<input
			type="number"
			step={step}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="w-full h-9 px-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent"
		/>
	);
}

export default function SystemPreferencesPage() {
	const [config, setConfig] = useState(INITIAL);
	const [saving, setSaving] = useState(false);

	const update = (key: string, value: string | boolean) =>
		setConfig((prev) => ({ ...prev, [key]: value }));

	async function handleSave() {
		setSaving(true);
		await new Promise((r) => setTimeout(r, 800));
		setSaving(false);
		toast.success("System preferences saved");
	}

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">System preferences</h1>
					<p className="text-[13px] text-[var(--c-text-3)] mt-0.5">
						Configure fees, limits, and platform behaviour. Changes take effect immediately.
					</p>
				</div>
				<button
					onClick={handleSave}
					disabled={saving}
					className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-semibold disabled:opacity-60 transition-colors"
					style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
				>
					{saving ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
					{saving ? "Saving..." : "Save changes"}
				</button>
			</div>

			{/* Fee Structure */}
			<div className="ds-card overflow-hidden">
				<div className="px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">Fee structure</div>
					<div className="text-[12px] text-[var(--c-text-3)] mt-0.5">
						Trading fees applied to buy/sell stablecoin orders. Displayed to users before confirmation.
					</div>
				</div>
				<div className="p-5 grid gap-5 sm:grid-cols-2">
					<FieldGroup label="Buy markup (%)" hint="Added to mid-market rate when user buys USDT/USDC">
						<NumInput value={config.buyMarkup} onChange={(v) => update("buyMarkup", v)} />
					</FieldGroup>
					<FieldGroup label="Sell markdown (%)" hint="Deducted from mid-market rate when user sells">
						<NumInput value={config.sellMarkdown} onChange={(v) => update("sellMarkdown", v)} />
					</FieldGroup>
					<FieldGroup label="USDT withdrawal fee" hint="Flat fee in USDT for external withdrawals">
						<NumInput value={config.withdrawalFeeUsdt} step="0.1" onChange={(v) => update("withdrawalFeeUsdt", v)} />
					</FieldGroup>
					<FieldGroup label="USDC withdrawal fee" hint="Flat fee in USDC for external withdrawals">
						<NumInput value={config.withdrawalFeeUsdc} step="0.1" onChange={(v) => update("withdrawalFeeUsdc", v)} />
					</FieldGroup>
					<FieldGroup label="Internal send fee" hint="Fee for Clusteer-to-Clusteer transfers (0 = free)">
						<div className="flex items-center gap-2">
							<NumInput value={config.internalSendFee} onChange={(v) => update("internalSendFee", v)} />
							{config.internalSendFee === "0" && (
								<span
									className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0"
									style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}
								>
									Free
								</span>
							)}
						</div>
					</FieldGroup>
					<FieldGroup label="VAT rate (%)" hint="Value Added Tax applied to fees (Nigerian FIRS requirement)">
						<NumInput value={config.vatRate} step="0.1" onChange={(v) => update("vatRate", v)} />
					</FieldGroup>
				</div>
			</div>

			{/* Transaction Limits */}
			<div className="ds-card overflow-hidden">
				<div className="px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">Transaction limits</div>
					<div className="text-[12px] text-[var(--c-text-3)] mt-0.5">
						Min/max per transaction. KYC tier-specific limits are managed separately per user.
					</div>
				</div>
				<div className="p-5 grid gap-5 sm:grid-cols-2">
					<FieldGroup label="Min buy amount (NGN)">
						<NumInput value={config.minBuyNgn} step="100" onChange={(v) => update("minBuyNgn", v)} />
					</FieldGroup>
					<FieldGroup label="Max buy amount (NGN)">
						<NumInput value={config.maxBuyNgn} step="1000" onChange={(v) => update("maxBuyNgn", v)} />
					</FieldGroup>
					<FieldGroup label="Min sell amount (USDT)">
						<NumInput value={config.minSellUsdt} step="1" onChange={(v) => update("minSellUsdt", v)} />
					</FieldGroup>
					<FieldGroup label="Max sell amount (USDT)">
						<NumInput value={config.maxSellUsdt} step="100" onChange={(v) => update("maxSellUsdt", v)} />
					</FieldGroup>
				</div>
			</div>

			{/* Platform Behaviour */}
			<div className="ds-card overflow-hidden">
				<div className="px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">Platform behaviour</div>
					<div className="text-[12px] text-[var(--c-text-3)] mt-0.5">Global toggles that affect all users.</div>
				</div>
				<div>
					{/* Rate refresh */}
					<div className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
						<div>
							<div className="text-[13.5px] font-medium text-[var(--c-text)]">Rate refresh interval</div>
							<div className="text-[12px] text-[var(--c-text-3)]">How often the exchange rate quote refreshes (seconds)</div>
						</div>
						<input
							type="number"
							className="w-20 h-9 px-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent text-center"
							value={config.rateRefreshSeconds}
							onChange={(e) => update("rateRefreshSeconds", e.target.value)}
						/>
					</div>
					{/* New user registration */}
					<div className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
						<div>
							<div className="text-[13.5px] font-medium text-[var(--c-text)]">New user registration</div>
							<div className="text-[12px] text-[var(--c-text-3)]">Allow new users to create accounts</div>
						</div>
						<Toggle checked={config.newUserRegistration} onChange={(v) => update("newUserRegistration", v)} />
					</div>
					{/* KYC required */}
					<div className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
						<div>
							<div className="text-[13.5px] font-medium text-[var(--c-text)]">KYC required for trading</div>
							<div className="text-[12px] text-[var(--c-text-3)]">Require Tier 1+ KYC before allowing buy/sell</div>
						</div>
						<Toggle checked={config.kycRequired} onChange={(v) => update("kycRequired", v)} />
					</div>
					{/* Maintenance mode */}
					<div className="flex items-center justify-between gap-4 px-5 py-4">
						<div className="flex items-center gap-2">
							<AlertTriangle className="size-4 text-[var(--c-warn)] shrink-0" />
							<div>
								<div className="text-[13.5px] font-medium text-[var(--c-warn)]">Maintenance mode</div>
								<div className="text-[12px] text-[var(--c-text-3)]">Disables all trading. Users see a maintenance banner.</div>
							</div>
						</div>
						<Toggle checked={config.maintenanceMode} onChange={(v) => update("maintenanceMode", v)} />
					</div>
				</div>
			</div>
		</div>
	);
}
