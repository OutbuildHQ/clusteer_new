"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/utils";
import { Num } from "@/components/primitives/num";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FIAT_BALANCE } from "@/lib/mock-data";

const NG_BANKS = [
	{ code: "058", name: "Guaranty Trust Bank (GTBank)" },
	{ code: "011", name: "First Bank of Nigeria" },
	{ code: "044", name: "Access Bank" },
	{ code: "063", name: "Access Bank (Diamond)" },
	{ code: "057", name: "Zenith Bank" },
	{ code: "033", name: "United Bank for Africa (UBA)" },
	{ code: "032", name: "Union Bank" },
	{ code: "070", name: "Fidelity Bank" },
	{ code: "214", name: "First City Monument Bank (FCMB)" },
	{ code: "050", name: "Ecobank Nigeria" },
	{ code: "076", name: "Polaris Bank" },
	{ code: "035", name: "Wema Bank" },
	{ code: "221", name: "Stanbic IBTC Bank" },
	{ code: "068", name: "Standard Chartered" },
	{ code: "315", name: "OPay (Digital Bank)" },
	{ code: "090175", name: "Moniepoint" },
	{ code: "090405", name: "Kuda Bank" },
	{ code: "090267", name: "Palmpay" },
];

const QUICK_AMOUNTS = [50_000, 100_000, 500_000] as const;
const FEE = 100;

export default function WithdrawPage() {
	const [bank, setBank] = useState("058");
	const [acctNo, setAcctNo] = useState("");
	const [acctName, setAcctName] = useState("");
	const [lookingUp, setLookingUp] = useState(false);
	const [amount, setAmount] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const available = FIAT_BALANCE.balance;
	const amtNum = parseFloat(amount) || 0;
	const receive = Math.max(0, amtNum - FEE);
	const isValid = acctNo.length === 10 && amtNum > FEE && amtNum <= available;

	function handleAcctNo(v: string) {
		const digits = v.replace(/\D/g, "").slice(0, 10);
		setAcctNo(digits);
		setAcctName("");
		if (digits.length === 10) {
			setLookingUp(true);
			// Simulate bank lookup
			setTimeout(() => {
				setAcctName("ADAEZE OKONKWO");
				setLookingUp(false);
			}, 700);
		}
	}

	async function handleWithdraw() {
		if (!isValid) return;
		setSubmitting(true);
		try {
			await new Promise((r) => setTimeout(r, 1200)); // TODO: wire to real API
			toast.success(`₦${amtNum.toLocaleString("en-NG")} withdrawal submitted`);
			setAmount("");
			setAcctNo("");
			setAcctName("");
		} catch {
			toast.error("Withdrawal failed. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="max-w-[520px] mx-auto space-y-5">
			<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">Withdraw to Nigerian bank</h1>

			{/* Available balance card */}
			<div
				className="relative overflow-hidden rounded-[18px] px-6 py-5"
				style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
			>
				<div aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-[140px] w-[140px] rounded-full" style={{ background: "var(--c-lime-500)", opacity: 0.1 }} />
				<div className="text-[11px] font-medium uppercase tracking-[0.06em] opacity-60">Available NGN</div>
				<div className="mt-1.5 font-display tabular-nums text-[36px] font-semibold leading-none">
					₦{available.toLocaleString("en-NG")}
				</div>
			</div>

			{/* Form */}
			<div className="ds-card p-5 space-y-4">
				{/* Bank picker */}
				<div>
					<label className="block text-[12px] font-medium text-[var(--c-text-3)] mb-1.5">Bank</label>
					<Select value={bank} onValueChange={setBank}>
						<SelectTrigger className="h-10 rounded-lg border-[var(--c-line)] text-[var(--c-text)] text-[13.5px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="max-h-[240px]">
							{NG_BANKS.map((b) => (
								<SelectItem key={b.code} value={b.code} className="text-[13px]">
									{b.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Account number */}
				<div>
					<label className="block text-[12px] font-medium text-[var(--c-text-3)] mb-1.5">Account number</label>
					<input
						className="w-full h-10 px-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[var(--c-text)] tabular-nums text-[13.5px] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent"
						inputMode="numeric"
						maxLength={10}
						placeholder="0123456789"
						value={acctNo}
						onChange={(e) => handleAcctNo(e.target.value)}
					/>
					{lookingUp && (
						<p className="mt-1.5 text-[12px] text-[var(--c-text-3)] flex items-center gap-1.5">
							<Loader2 className="size-3 animate-spin" />Looking up account...
						</p>
					)}
					{acctName && (
						<div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium" style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}>
							<CheckCircle className="size-4 shrink-0" />
							{acctName}
						</div>
					)}
				</div>

				{/* Amount */}
				<div>
					<label className="block text-[12px] font-medium text-[var(--c-text-3)] mb-1.5">Amount</label>
					<div
						className="flex items-center gap-3 px-4 rounded-[14px] focus-within:ring-2 focus-within:ring-[var(--c-lime-500)]"
						style={{ height: 60, border: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}
					>
						<span className="text-[var(--c-text-3)] font-medium text-[18px]">₦</span>
						<input
							className="flex-1 bg-transparent outline-none font-display tabular-nums text-[26px] font-semibold text-[var(--c-text)] placeholder:text-[var(--c-text-3)]"
							inputMode="decimal"
							placeholder="0.00"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>

					{/* Quick fill buttons */}
					<div className="grid grid-cols-4 gap-2 mt-2">
						{QUICK_AMOUNTS.map((q) => (
							<button
								key={q}
								onClick={() => setAmount(q.toString())}
								className="h-8 rounded-lg border border-[var(--c-line)] text-[12px] font-medium text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors"
							>
								₦{q >= 1_000_000 ? q / 1_000_000 + "M" : q / 1_000 + "K"}
							</button>
						))}
						<button
							onClick={() => setAmount(Math.max(0, available - FEE).toString())}
							className="h-8 rounded-lg border border-[var(--c-line)] text-[12px] font-semibold text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
						>
							MAX
						</button>
					</div>
				</div>

				{/* Fee summary */}
				<div className="rounded-[12px] p-4 space-y-2 text-[13px]" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
					<div className="flex justify-between text-[var(--c-text-3)]">
						<span>Fee</span>
						<span className="tabular-nums">{formatMoney(FEE, "NGN", { decimals: 0 })}</span>
					</div>
					<div className="flex justify-between text-[var(--c-text-3)]">
						<span>Arrives</span>
						<span>Instantly via NIBSS</span>
					</div>
					<div className="flex justify-between font-semibold pt-2 border-t border-[var(--c-line)] text-[var(--c-text)]">
						<span>You receive</span>
						<Num className="tabular-nums font-display text-[15px]" value={receive > 0 ? formatMoney(receive, "NGN", { decimals: 0 }) : "—"} />
					</div>
				</div>

				{/* Network warning */}
				<div className="flex items-start gap-2.5 rounded-[10px] px-3 py-3 text-[12px]" style={{ background: "var(--c-warn-soft)", border: "1px solid var(--c-warn)", color: "var(--c-warn)" }}>
					<AlertTriangle className="size-4 shrink-0 mt-0.5" />
					<span>Bank withdrawals are irreversible. Verify your account number before confirming.</span>
				</div>

				{/* Submit */}
				<button
					onClick={handleWithdraw}
					disabled={!isValid || submitting}
					className="w-full h-12 rounded-lg text-[15px] font-semibold transition-all"
					style={isValid && !submitting
						? { background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer" }
						: { background: "var(--c-surface-3)", color: "var(--c-text-3)", cursor: "not-allowed" }
					}
				>
					{submitting
						? <Loader2 className="size-4 animate-spin mx-auto" />
						: `Withdraw ${amtNum > 0 ? formatMoney(amtNum, "NGN", { decimals: 0 }) : ""}`
					}
				</button>
			</div>
		</div>
	);
}
