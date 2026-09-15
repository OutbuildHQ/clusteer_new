"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	LayoutDashboard,
	ArrowLeftRight,
	BookOpen,
	ShieldCheck,
	Settings,
	HelpCircle,
	ArrowUpRight,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CustomerOverview } from "@/components/brand/customer-overview";
import { TransactionWorkspace } from "@/components/brand/transaction-workspace";
import { TradeWizard } from "@/components/trade/trade-wizard";
import type { QxOrder } from "@/lib/types";
const exampleOrders: QxOrder[] = [
	{
		id: "PREVIEW-1048",
		side: "sell",
		asset: "USDT",
		channel: "TRC20",
		amountUsdt: 1000,
		amountNgn: 1450000,
		rate: 1450,
		fee: 10875,
		status: "confirming",
		createdAt: "2026-09-14T14:20:00Z",
	},
	{
		id: "PREVIEW-1042",
		side: "sell",
		asset: "USDT",
		channel: "BEP20",
		amountUsdt: 250,
		amountNgn: 362500,
		rate: 1450,
		fee: 2718.75,
		status: "completed",
		createdAt: "2026-09-13T09:00:00Z",
	},
	{
		id: "PREVIEW-1037",
		side: "buy",
		asset: "USDT",
		channel: "TRC20",
		amountUsdt: 100,
		amountNgn: 145000,
		rate: 1450,
		fee: 1087.5,
		status: "completed",
		createdAt: "2026-09-12T15:00:00Z",
	},
];
export function DesignPreview() {
	const [tab, setTab] = useState("customer");
	const [dark, setDark] = useState(false);
	const [client] = useState(() => {
		const q = new QueryClient({
			defaultOptions: { queries: { enabled: false, retry: false, staleTime: Infinity } },
		});
		for (const side of ["sell", "buy"]) {
			q.setQueryData(["exchange-rate", side], {
				buyRate: 1450,
				sellRate: 1450,
				feePercent: 0.75,
				source: "preview",
			});
		}
		q.setQueryData(
			["banks"],
			[{ bankName: "Example Bank", bankCode: "DEMO", accountNumber: "0000000000" }]
		);
		return q;
	});
	useEffect(() => {
		const update = () => {
			if (window.location.hash === "#preview-conversion") setTab("conversion");
		};
		update();
		window.addEventListener("hashchange", update);
		return () => window.removeEventListener("hashchange", update);
	}, []);
	function changeTab(next: string) {
		setTab(next);
		window.history.replaceState(
			null,
			"",
			next === "conversion" ? "#preview-conversion" : window.location.pathname
		);
	}
	const nav = [
		[LayoutDashboard, "Overview"],
		[ArrowLeftRight, "Buy / Sell"],
		[BookOpen, "Orders"],
		[ShieldCheck, "Verification"],
		[Settings, "Settings"],
		[HelpCircle, "Support"],
	] as const;
	return (
		<ThemeProvider forcedTheme={dark ? "dark" : "light"}>
			<QueryClientProvider client={client}>
				<div className="cl-review-bar">
					<div>
						<strong className="text-sm">Clusteer · Local design review</strong>
						<p className="text-[10px] mt-1 text-white/75">
							Illustrative data. No live account access or money movement.
						</p>
					</div>
					<nav aria-label="Design review surfaces">
						{[
							["customer", "Customer overview"],
							["conversion", "Conversion flow"],
							["admin", "Admin transaction"],
						].map(([id, label]) => (
							<button key={id} aria-pressed={tab === id} onClick={() => changeTab(id)}>
								{label}
							</button>
						))}
						<button onClick={() => setDark(!dark)}>{dark ? "Light" : "Dark"} theme</button>
						<Link href="/" className="inline-flex items-center gap-1 px-2 text-xs">
							Website <ArrowUpRight size={12} />
						</Link>
					</nav>
				</div>
				<div className="cl-review-shell">
					<aside className="cl-review-sidebar">
						<Logo />
						<ul>
							{nav.map(([Icon, label], i) => (
								<li
									key={label}
									data-active={tab === "conversion" ? i === 1 : tab === "admin" ? i === 2 : i === 0}
								>
									<Icon size={16} />
									{label}
								</li>
							))}
						</ul>
						<small>
							Navigation shown for context.
							<br />
							Use the review controls above to switch surfaces.
						</small>
					</aside>
					<main className="cl-review-content">
						{tab === "customer" ? (
							<CustomerOverview
								name="Ada"
								orders={exampleOrders}
								rate={1450}
								preview
								tradeHref="#preview-conversion"
							/>
						) : tab === "conversion" ? (
							<TradeWizard initialSide="sell" />
						) : (
							<TransactionWorkspace />
						)}
					</main>
				</div>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
