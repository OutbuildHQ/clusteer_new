"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/utils";
import { Num } from "@/components/primitives/num";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FIAT_BALANCE } from "@/lib/mock-data";

/* ── Nigerian banks (inline) ── */
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

const QUICK_FILLS: { label: string; value: number | "MAX" }[] = [
	{ label: "\u20A650K", value: 50_000 },
	{ label: "\u20A6100K", value: 100_000 },
	{ label: "\u20A6500K", value: 500_000 },
	{ label: "MAX", value: "MAX" },
];

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
			// TODO: wire to real bank-lookup API
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
			toast.success(`\u20A6${amtNum.toLocaleString("en-NG")} withdrawal submitted`);
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
		<div className="w-full max-w-[560px] mx-auto flex flex-col gap-5 lg:gap-6 px-4 lg:px-0">
			{/* Title */}
			<h1 className="text-[22px] lg:text-[32px]" style={{ fontWeight: 600, letterSpacing: "-0.03em", color: "var(--c-text)" }}>
				Withdraw to Nigerian bank
			</h1>

			{/* Dark balance card */}
			<div
				className="px-4 py-5 lg:px-6 lg:py-5"
				style={{
					background: "var(--c-onyx-900)",
					color: "var(--c-cream)",
					border: "none",
					borderRadius: 14,
				}}
			>
				<div
					style={{
						color: "rgba(244,241,234,0.6)",
						fontSize: 11,
						textTransform: "uppercase",
						letterSpacing: "0.06em",
					}}
				>
					Available NGN
				</div>
				<div
					className="tabular-nums text-[28px] lg:text-[36px]"
					style={{
						fontWeight: 600,
						fontFamily: "var(--f-display)",
						marginTop: 4,
					}}
				>
					{"\u20A6"}{available.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
				</div>
			</div>

			{/* Form card */}
			<div className="ds-card p-4 lg:p-5">
				<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					{/* Bank selector */}
					<div>
						<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 6 }}>Bank</label>
						<select
							value={bank}
							onChange={(e) => setBank(e.target.value)}
							style={{
								width: "100%",
								height: 40,
								padding: "0 12px",
								borderRadius: 10,
								border: "1px solid var(--c-line)",
								background: "var(--c-surface)",
								color: "var(--c-text)",
								fontSize: 13.5,
								outline: "none",
								cursor: "pointer",
							}}
						>
							{NG_BANKS.map((b) => (
								<option key={b.code} value={b.code}>
									{b.name}
								</option>
							))}
						</select>
					</div>

					{/* Account number */}
					<div>
						<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 6 }}>
							Account number
						</label>
						<input
							inputMode="numeric"
							maxLength={10}
							placeholder="0123456789"
							value={acctNo}
							onChange={(e) => handleAcctNo(e.target.value)}
							className="tabular-nums"
							style={{
								width: "100%",
								height: 40,
								padding: "0 12px",
								borderRadius: 10,
								border: "1px solid var(--c-line)",
								background: "var(--c-surface)",
								color: "var(--c-text)",
								fontSize: 13.5,
								outline: "none",
							}}
						/>
						{lookingUp && (
							<p style={{ marginTop: 6, fontSize: 12, color: "var(--c-text-3)", display: "flex", alignItems: "center", gap: 6 }}>
								<Loader2 className="size-3 animate-spin" />
								Looking up account...
							</p>
						)}
						{acctName && (
							<div
								style={{
									marginTop: 6,
									display: "flex",
									alignItems: "center",
									gap: 8,
									fontSize: 12,
									color: "var(--c-up)",
								}}
							>
								<CheckCircle className="size-4 shrink-0" />
								<span>{acctName}</span>
							</div>
						)}
					</div>

					{/* Amount */}
					<div>
						<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 6 }}>Amount</label>
						<input
							inputMode="decimal"
							placeholder={"\u20A60.00"}
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="tabular-nums"
							style={{
								width: "100%",
								height: 56,
								fontSize: 24,
								fontWeight: 600,
								textAlign: "center",
								borderRadius: 10,
								border: "1px solid var(--c-line)",
								background: "var(--c-surface)",
								color: "var(--c-text)",
								fontFamily: "var(--f-display)",
								outline: "none",
							}}
						/>
						{/* Quick-fill buttons */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(4, 1fr)",
								gap: 6,
								marginTop: 8,
							}}
						>
							{QUICK_FILLS.map((q) => (
								<button
									key={q.label}
									onClick={() =>
										setAmount(
											q.value === "MAX"
												? available.toString()
												: q.value.toString()
										)
									}
									style={{
										height: 32,
										borderRadius: 10,
										border: "1px solid var(--c-line)",
										background: "transparent",
										color: "var(--c-text-2)",
										fontSize: 12,
										fontWeight: 500,
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										transition: "background 150ms ease",
									}}
									onMouseEnter={(e) => (e.currentTarget.style.background = "var(--c-surface-2)")}
									onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
								>
									{q.label}
								</button>
							))}
						</div>
					</div>

					{/* Fee summary card */}
					<div
						style={{
							background: "var(--c-surface-2)",
							borderRadius: 12,
							padding: 14,
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
							<span style={{ color: "var(--c-text-3)" }}>Fee</span>
							<span className="tabular-nums" style={{ color: "var(--c-text)" }}>
								{"\u20A6"}100.00
							</span>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 6 }}>
							<span style={{ color: "var(--c-text-3)" }}>Arrives</span>
							<span style={{ color: "var(--c-text)" }}>Instantly via NIBSS</span>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: 13.5,
								marginTop: 8,
								borderTop: "1px solid var(--c-line)",
								paddingTop: 8,
							}}
						>
							<span style={{ fontWeight: 600, color: "var(--c-text)" }}>You receive</span>
							<Num
								className="tabular-nums font-semibold"
								value={receive > 0 ? formatMoney(receive, "NGN", { decimals: 0 }) : "\u2014"}
							/>
						</div>
					</div>

					{/* Withdraw button */}
					<button
						onClick={handleWithdraw}
						disabled={!isValid || submitting}
						className="h-[50px] lg:h-12"
						style={{
							width: "100%",
							borderRadius: 10,
							border: "none",
							fontSize: 15,
							fontWeight: 600,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: isValid && !submitting ? "pointer" : "not-allowed",
							transition: "all 150ms ease",
							background: isValid && !submitting ? "var(--c-lime-500)" : "var(--c-surface-3)",
							color: isValid && !submitting ? "var(--c-onyx-900)" : "var(--c-text-3)",
						}}
					>
						{submitting ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							`Withdraw ${amtNum > 0 ? formatMoney(amtNum, "NGN", { decimals: 0 }) : ""}`
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
