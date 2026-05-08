"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useUserId } from "@/hooks/use-user-id";

function StatusBadge({ s }: { s: string }) {
	const style = s === "Completed" || s === "Verified"
		? { background: "var(--c-up-soft)", color: "var(--c-up)" }
		: s === "Pending"
		? { background: "var(--c-warn-soft)", color: "var(--c-warn)" }
		: { background: "var(--c-surface-2)", color: "var(--c-text-2)", border: "1px solid var(--c-line)" };
	const icon = s === "Completed" || s === "Verified" ? "✓" : s === "Pending" ? "◐" : "—";
	return (
		<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={style}>
			<span className="text-[9px]">{icon}</span>{s}
		</span>
	);
}

const MOCK_REFERRALS = [
	{ name: "Tunde Bakare", joined: "Mar 14, 2026", kyc: "Verified", traded: true },
	{ name: "Chinedu Eze", joined: "Mar 12, 2026", kyc: "Verified", traded: true },
	{ name: "Aisha Mohammed", joined: "Mar 10, 2026", kyc: "Pending", traded: false },
	{ name: "Folake Adeyemi", joined: "Mar 8, 2026", kyc: "Verified", traded: true },
	{ name: "Emeka Nwosu", joined: "Mar 5, 2026", kyc: "Verified", traded: false },
	{ name: "Bisi Ajayi", joined: "Mar 2, 2026", kyc: "Verified", traded: true },
	{ name: "Yusuf Ibrahim", joined: "Feb 28, 2026", kyc: "Verified", traded: true },
	{ name: "Ngozi Obi", joined: "Feb 25, 2026", kyc: "Pending", traded: false },
];

export default function ReferralsPage() {
	const userId = useUserId();
	const referralLink = `https://clusteer.io/join?ref=${userId ?? "ADAEZE2K"}`;

	const handleCopy = () => {
		navigator.clipboard.writeText(referralLink);
		toast.success("Referral link copied!");
	};

	const { data: referralData } = useQuery({
		queryKey: ["referrals", userId],
		queryFn: async () => {
			const res = await fetch("/api/referrals");
			if (!res.ok) throw new Error("Failed to fetch referrals");
			return res.json();
		},
		enabled: !!userId,
		staleTime: 60_000,
	});

	// Fall back to mock data when the API returns null (stub) or errors
	const REFERRALS = referralData?.data ?? MOCK_REFERRALS;

	return (
		<div className="space-y-6">
			<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Referrals &amp; rewards</h1>

			<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
				{/* Hero card */}
				<div className="rounded-[14px] p-5 lg:p-8 relative overflow-hidden" style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)", border: "none" }}>
					<div className="text-[13px] uppercase tracking-[0.08em]" style={{ opacity: 0.7, fontFamily: "var(--f-display)" }}>Earn ₦2,000 per referral</div>
					<div className="text-[28px] lg:text-[42px] font-semibold leading-[1] mt-2" style={{ fontFamily: "var(--f-display)", letterSpacing: "-0.025em" }}>
						Invite friends.<br />Both get rewarded.
					</div>
					<div className="mt-6 rounded-[14px] p-3.5" style={{ background: "var(--c-onyx-700)", border: "1px dashed rgba(244,241,234,0.2)" }}>
						<div className="text-[11px] uppercase" style={{ color: "rgba(244,241,234,0.5)" }}>Your referral link</div>
						<div className="flex items-center gap-2 mt-1.5">
							<div className="flex-1 tabular-nums text-[13px] truncate" style={{ fontFamily: "var(--f-mono)" }}>{referralLink}</div>
							<button
								onClick={handleCopy}
								className="inline-flex items-center gap-2 h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium shrink-0"
								style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
							>
								<Copy className="size-3.5" />Copy
							</button>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="space-y-3">
					{[["Total referred", "24"], ["Reward earned", "₦48,000"], ["Pending payout", "₦4,000"]].map(([k, v]) => (
						<div key={k} className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<div className="text-[12px]" style={{ color: "var(--c-text-3)" }}>{k}</div>
							<div className="tabular-nums text-[28px] font-semibold leading-none mt-1" style={{ fontFamily: "var(--f-display)", color: "var(--c-text)", letterSpacing: "-0.025em" }}>{v}</div>
						</div>
					))}
				</div>
			</div>

			{/* Referrals table (desktop) */}
			<div className="hidden lg:block rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
				<div className="px-[var(--pad)] py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<h3 className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>Referrals</h3>
				</div>
				<table className="w-full border-collapse text-[13px]">
					<thead>
						<tr>
							{["Friend", "Joined", "KYC", "First trade", "Reward"].map((h, i) => (
								<th key={h} className={`font-medium text-[11.5px] uppercase tracking-[0.05em] px-3.5 py-2.5 ${i === 4 ? "text-right" : "text-left"}`}
									style={{ color: "var(--c-text-3)", borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{REFERRALS.map((u: typeof MOCK_REFERRALS[number]) => (
							<tr key={u.name} className="transition-colors hover:bg-[var(--c-surface-2)]">
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
									<div className="flex items-center gap-2.5">
										<div className="size-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0" style={{ background: "linear-gradient(135deg, var(--c-lime-500), var(--c-onyx-700))", color: "var(--c-onyx-900)" }}>
											{u.name.split(" ").map((n) => n[0]).join("")}
										</div>
										<span style={{ color: "var(--c-text)" }}>{u.name}</span>
									</div>
								</td>
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", color: "var(--c-text)" }}>{u.joined}</td>
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}><StatusBadge s={u.kyc} /></td>
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>{u.traded ? <StatusBadge s="Completed" /> : "—"}</td>
								<td className="px-3.5 py-3 text-right tabular-nums font-semibold" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
									{u.traded ? "₦2,000" : "—"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Referrals card list (mobile) */}
			<div className="lg:hidden space-y-2">
				<h3 className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>Referrals</h3>
				{REFERRALS.map((u: typeof MOCK_REFERRALS[number]) => (
					<div key={u.name} className="rounded-[12px] p-3" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<div className="size-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0" style={{ background: "linear-gradient(135deg, var(--c-lime-500), var(--c-onyx-700))", color: "var(--c-onyx-900)" }}>
									{u.name.split(" ").map((n: string) => n[0]).join("")}
								</div>
								<div>
									<div className="text-[13px] font-semibold" style={{ color: "var(--c-text)" }}>{u.name}</div>
									<div className="text-[11px]" style={{ color: "var(--c-text-3)" }}>{u.joined}</div>
								</div>
							</div>
							<div className="text-right tabular-nums text-[13px] font-semibold" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
								{u.traded ? "₦2,000" : "—"}
							</div>
						</div>
						<div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: "1px solid var(--c-line)" }}>
							<StatusBadge s={u.kyc} />
							{u.traded ? <StatusBadge s="Completed" /> : <span className="text-[11px]" style={{ color: "var(--c-text-3)" }}>No trade yet</span>}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
