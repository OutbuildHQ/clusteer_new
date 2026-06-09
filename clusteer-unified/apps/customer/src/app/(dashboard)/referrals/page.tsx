"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useUserId } from "@/hooks/use-user-id";

const STATUS_CLASSES: Record<string, string> = {
	Verified: "bg-up-soft text-up",
	Completed: "bg-up-soft text-up",
	Pending: "bg-warn-soft text-warn",
};

function StatusBadge({ s }: { s: string }) {
	const cls = STATUS_CLASSES[s] ?? "bg-ds-surface-2 text-ds-text-2 border border-ds-line";
	const icon = s === "Completed" || s === "Verified" ? "✓" : s === "Pending" ? "◐" : "—";
	return (
		<span className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium ${cls}`}>
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
	const referralLink = `clusteer.ng/r/${userId ?? "ADAEZE2K"}`;

	const handleCopy = () => {
		navigator.clipboard.writeText("https://" + referralLink);
		toast.success("Referral link copied");
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

	const REFERRALS = referralData?.data ?? MOCK_REFERRALS;

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">
				Referrals &amp; rewards
			</h1>

			{/* Hero + Stats grid */}
			<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
				{/* Hero card */}
				<div className="bg-onyx-900 text-cream rounded-[14px] border-none p-8">
					<div className="font-display text-[13px] opacity-70 uppercase tracking-[0.08em]">
						Earn ₦2,000 per referral
					</div>
					<div className="font-display text-[42px] font-semibold leading-none mt-2 tracking-[-0.025em]">
						Invite friends.<br />Both get rewarded.
					</div>
					<div className="mt-6 rounded-[14px] p-3.5 bg-[var(--c-onyx-700)] border border-dashed border-cream/20">
						<div className="text-[11px] uppercase text-cream/50">Your referral link</div>
						<div className="flex items-center gap-2 mt-1.5">
							<div className="flex-1 font-mono text-[13px] truncate tabular-nums">{referralLink}</div>
							<button
								onClick={handleCopy}
								className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium shrink-0 bg-lime-500 text-onyx-900 border-none cursor-pointer"
							>
								<Copy size={14} />Copy
							</button>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="flex flex-col gap-3">
					{[["Total referred", "24"], ["Reward earned", "₦48,000"], ["Pending payout", "₦4,000"]].map(([k, v]) => (
						<div key={k} className="bg-ds-surface border border-ds-line rounded-[14px] p-5">
							<div className="text-[12px] text-ds-text-3">{k}</div>
							<div className="font-mono tabular-nums text-[28px] font-semibold text-ds-text mt-1">{v}</div>
						</div>
					))}
				</div>
			</div>

			{/* Referrals table */}
			<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
				<div className="px-5 py-4 border-b border-ds-line">
					<h3 className="text-[15px] font-semibold text-ds-text m-0">Referrals</h3>
				</div>

				{/* Desktop table */}
				<table className="w-full border-collapse text-[13px] hidden lg:table">
					<thead>
						<tr>
							{["Friend", "Joined", "KYC", "First trade", "Reward"].map((h, i) => (
								<th
									key={h}
									className={`${i === 4 ? "text-right" : "text-left"} font-medium text-ds-text-3 text-[11.5px] uppercase tracking-[0.05em] px-3.5 py-2.5 border-b border-ds-line bg-ds-surface-2`}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{REFERRALS.map((u: typeof MOCK_REFERRALS[number]) => (
							<tr key={u.name} className="hover:bg-ds-surface-2">
								<td className="px-3.5 py-3 border-b border-ds-line">
									<div className="flex items-center gap-2">
										<div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 bg-ds-surface-3 text-ds-text">
											{u.name.split(" ").map((n) => n[0]).join("")}
										</div>
										<span className="text-ds-text">{u.name}</span>
									</div>
								</td>
								<td className="px-3.5 py-3 border-b border-ds-line text-ds-text">{u.joined}</td>
								<td className="px-3.5 py-3 border-b border-ds-line"><StatusBadge s={u.kyc} /></td>
								<td className="px-3.5 py-3 border-b border-ds-line">{u.traded ? <StatusBadge s="Completed" /> : <span className="text-ds-text-3">—</span>}</td>
								<td className="px-3.5 py-3 border-b border-ds-line text-right font-semibold font-mono tabular-nums text-ds-text">
									{u.traded ? "₦2,000" : "—"}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Mobile card list */}
				<div className="lg:hidden flex flex-col">
					{REFERRALS.map((u: typeof MOCK_REFERRALS[number], i: number) => (
						<div key={u.name} className={`flex items-center justify-between px-5 py-3.5 ${i < REFERRALS.length - 1 ? "border-b border-ds-line" : ""}`}>
							<div className="flex items-center gap-2.5">
								<div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 bg-ds-surface-3 text-ds-text">
									{u.name.split(" ").map((n: string) => n[0]).join("")}
								</div>
								<div>
									<div className="text-[13px] font-semibold text-ds-text">{u.name}</div>
									<div className="text-[11px] text-ds-text-3">{u.joined}</div>
								</div>
							</div>
							<div className="text-right font-mono tabular-nums text-[13px] font-semibold text-ds-text">
								{u.traded ? "₦2,000" : "—"}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
