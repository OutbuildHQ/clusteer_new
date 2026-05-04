import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Activity,
	ArrowLeftRight,
	Landmark,
	Link2,
	ShieldCheck,
	CheckCircle2,
	Twitter,
	Clock,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "System Status — Clusteer",
	description:
		"Check the live status of Clusteer systems. Trading engine, bank transfers, blockchain networks, and authentication.",
};

const SERVICES = [
	{
		name: "Trading engine",
		description: "Buy, sell, and swap operations",
		icon: ArrowLeftRight,
		status: "operational" as const,
	},
	{
		name: "Bank transfers",
		description: "NIP instant payouts to Nigerian banks",
		icon: Landmark,
		status: "operational" as const,
	},
	{
		name: "Blockchain networks",
		description: "Tron, BSC, Ethereum, Solana, Polygon",
		icon: Link2,
		status: "operational" as const,
	},
	{
		name: "Authentication",
		description: "Login, signup, and 2FA verification",
		icon: ShieldCheck,
		status: "operational" as const,
	},
];

function StatusBadge({ status }: { status: "operational" | "degraded" | "down" }) {
	const styles = {
		operational: "bg-[#EFFCD0] text-brand-800 border-brand-800/20",
		degraded: "bg-warning-bg text-warning border-warning/20",
		down: "bg-danger-bg text-danger border-danger/20",
	};
	const labels = {
		operational: "Operational",
		degraded: "Degraded",
		down: "Down",
	};
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
		>
			<span
				className={`size-2 rounded-full ${status === "operational" ? "bg-brand-800 live-dot" : status === "degraded" ? "bg-warning" : "bg-danger"}`}
			/>
			{labels[status]}
		</span>
	);
}

export default function StatusPage() {
	return (
		<main>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="max-w-[820px]">
					<div className="font-mono text-[11px] font-semibold text-brand-800 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; SYSTEM STATUS
					</div>
					<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
						<h1 className="font-display text-[clamp(36px,9vw,88px)] sm:text-[clamp(48px,7vw,88px)] font-bold leading-[0.92] tracking-[-0.045em]">
							All systems{" "}
							<span className="lime-highlight">operational.</span>
						</h1>
					</div>
					<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[600px] leading-[1.55]">
						Everything is running smoothly. If you are experiencing issues, reach
						out to{" "}
						<a
							href="mailto:support@clusteer.com"
							className="text-foreground font-semibold hover:underline"
						>
							support@clusteer.com
						</a>
						.
					</p>
				</div>
			</section>

			{/* ─── Overall Status Banner ─── */}
			<section className="pb-8 sm:pb-12 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="bg-light-green border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="size-12 sm:size-14 rounded-full bg-custom-black text-light-green inline-flex items-center justify-center shrink-0">
							<CheckCircle2
								className="size-6 sm:size-7"
								strokeWidth={2.2}
							/>
						</div>
						<div>
							<div className="font-display text-lg sm:text-xl font-bold tracking-[-0.02em]">
								All systems operational
							</div>
							<p className="text-sm text-custom-black/70">
								Last checked: just now
							</p>
						</div>
					</div>
					<div className="inline-flex items-center gap-2 rounded-full border-2 border-custom-black px-3.5 py-1.5 text-xs font-semibold bg-white/50">
						<Activity className="size-3.5" />
						Uptime: 99.9% (last 30 days)
					</div>
				</div>
			</section>

			{/* ─── Service Status Grid ─── */}
			<section className="pb-12 sm:pb-20 lg:pb-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
					{SERVICES.map((service, i) => (
						<div
							key={i}
							className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center shrink-0">
									<service.icon
										className="size-5 sm:size-[22px]"
										strokeWidth={2.4}
									/>
								</div>
								<StatusBadge status={service.status} />
							</div>
							<div>
								<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">
									{service.name}
								</div>
								<p className="mt-1 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
									{service.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ─── Uptime & Response Time ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 bg-warm-beige">
				<div className="max-w-[1280px] mx-auto">
					<div className="mb-8 sm:mb-14 max-w-[720px]">
						<div className="font-mono text-[11px] font-semibold text-brand-800 tracking-[1.5px] mb-3 sm:mb-4">
							&#9670; PERFORMANCE
						</div>
						<h2 className="font-display text-[clamp(28px,7vw,56px)] sm:text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-[-0.04em]">
							Built for reliability.
						</h2>
					</div>
					<div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-custom-black rounded-[16px] sm:rounded-[28px] overflow-hidden bg-background">
						{[
							{
								v: "99.9%",
								l: "uptime, last 30 days",
								bg: "bg-background",
							},
							{
								v: "4:12",
								l: "avg payout time, minutes",
								bg: "bg-light-green",
							},
							{
								v: "<200ms",
								l: "API response time",
								bg: "bg-warm-beige",
							},
							{
								v: "0",
								l: "incidents this month",
								bg: "bg-background",
							},
						].map((s, i) => (
							<div
								key={i}
								className={`${s.bg} p-4 sm:p-7 lg:p-9 flex flex-col gap-1.5 sm:gap-2 ${i < 3 ? "border-r-2 border-custom-black" : ""} ${i < 2 ? "border-b-2 lg:border-b-0 border-custom-black" : ""}`}
							>
								<div className="font-mono text-2xl sm:text-4xl lg:text-[56px] font-semibold leading-[0.95] tracking-[-0.03em] text-custom-black">
									{s.v}
								</div>
								<div className="text-[11px] sm:text-[13px] text-muted-foreground font-medium leading-snug">
									{s.l}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── Stay Updated ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="bg-custom-black border-2 border-custom-black rounded-[22px] sm:rounded-[36px] p-6 sm:p-12 lg:p-16 relative overflow-hidden text-white">
					<div className="absolute -top-20 -right-20 size-64 rounded-full bg-[radial-gradient(circle,rgba(159,232,112,0.2)_0%,transparent_70%)]" />
					<div className="relative max-w-[720px]">
						<div className="font-mono text-[11px] font-semibold text-light-green tracking-[1.5px] mb-3 sm:mb-4">
							&#9670; STAY UPDATED
						</div>
						<h2 className="font-display text-[clamp(28px,8vw,56px)] sm:text-[clamp(36px,6vw,56px)] font-bold leading-[0.95] tracking-[-0.045em]">
							Real-time updates on X.
						</h2>
						<p className="mt-4 sm:mt-6 text-[15px] sm:text-[17px] lg:text-[18px] text-white/70 max-w-[480px] leading-[1.5]">
							Follow{" "}
							<strong className="text-white">@clusteer</strong> on X for
							real-time updates on system status, scheduled maintenance, and
							incident reports.
						</p>
						<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
							<a
								href="https://x.com/clusteer"
								target="_blank"
								rel="noopener noreferrer"
								className="btn-shine inline-flex items-center justify-center gap-2 rounded-full bg-light-green text-custom-black border-2 border-custom-black shadow-brutal h-14 px-8 text-[17px] font-semibold hover:bg-light-green/90 transition-colors w-full sm:w-auto"
							>
								<Twitter className="size-5" />
								Follow @clusteer
							</a>
							<Button
								size="xl"
								variant="outline"
								asChild
								className="border-2 border-white/30 text-white hover:bg-white/10 w-full sm:w-auto text-base sm:text-[17px]"
							>
								<Link href="/contact">
									Report an issue <ArrowRight className="size-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
