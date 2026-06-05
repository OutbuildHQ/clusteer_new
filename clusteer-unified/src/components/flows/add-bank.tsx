"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle } from "lucide-react";

const BANKS = [
	{ code: "058", name: "GTBank" }, { code: "044", name: "Access Bank" },
	{ code: "057", name: "Zenith Bank" }, { code: "033", name: "UBA" },
	{ code: "011", name: "First Bank" }, { code: "090267", name: "Kuda" },
	{ code: "100004", name: "OPay" }, { code: "100033", name: "PalmPay" },
	{ code: "221", name: "Stanbic IBTC" }, { code: "214", name: "FCMB" },
];

export function AddBankFlow({ onClose }: { onClose: () => void }) {
	const [bankCode, setBankCode] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [resolved, setResolved] = useState<string | null>(null);
	const [primary, setPrimary] = useState(false);
	const [done, setDone] = useState(false);

	const bank = BANKS.find((b) => b.code === bankCode);

	const { isFetching } = useQuery({
		queryKey: ["resolve-bank", bankCode, accountNumber],
		queryFn: async () => {
			const res = await fetch(`/api/bank/verify-account?bankCode=${bankCode}&accountNumber=${accountNumber}`);
			const d = await res.json();
			if (d.data?.accountName) setResolved(d.data.accountName);
			else setResolved(null);
			return d;
		},
		enabled: bankCode.length > 0 && accountNumber.length === 10,
		staleTime: 60_000,
	});

	const submit = async () => {
		toast.success("Bank account added");
		setDone(true);
	};

	if (done) {
		return (
			<div style={{ textAlign: "center", padding: "20px 0" }}>
				<CheckCircle size={48} style={{ color: "var(--c-up)", margin: "0 auto 16px" }} />
				<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Bank account linked</h3>
				<p style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 8 }}>{bank?.name} · ••{accountNumber.slice(-4)} · {resolved}</p>
				<Button onClick={onClose} className="mt-4" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 600 }}>Done</Button>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Add bank account</h3>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>Bank</label>
				<select value={bankCode} onChange={(e) => { setBankCode(e.target.value); setResolved(null); }}
					style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--c-line)", padding: "0 12px", fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)" }}>
					<option value="">Select bank</option>
					{BANKS.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
				</select>
			</div>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>Account number</label>
				<input type="text" inputMode="numeric" maxLength={10} value={accountNumber}
					onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, "")); setResolved(null); }}
					placeholder="0123456789"
					style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--c-line)", padding: "0 12px", fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)", fontVariantNumeric: "tabular-nums" }} />
				<p style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 4 }}>10-digit NUBAN account number</p>
			</div>

			{isFetching && (
				<p style={{ fontSize: 13, color: "var(--c-text-2)" }}>Resolving account name...</p>
			)}

			{resolved && (
				<div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 10, background: "var(--c-up-soft)", border: "1px solid var(--c-up)" }}>
					<CheckCircle size={16} style={{ color: "var(--c-up)" }} />
					<span style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>{resolved}</span>
				</div>
			)}

			<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--c-text-2)" }}>
				<input type="checkbox" checked={primary} onChange={(e) => setPrimary(e.target.checked)} />
				Set as primary payout account
			</label>

			<Button onClick={submit} disabled={!resolved}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 44 }}>
				Add bank account
			</Button>
		</div>
	);
}
