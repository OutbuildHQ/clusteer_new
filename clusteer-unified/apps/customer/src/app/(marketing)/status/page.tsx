import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Activity,
	ArrowLeftRight,
	Database,
	Link2,
	ShieldCheck,
	CheckCircle2,
	AlertTriangle,
	Twitter,
	Globe,
} from "lucide-react";
import type { Metadata } from "next";
import { getSystemStatus, type ServiceStatus } from "@/lib/system-status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "System Status — Clusteer",
	description:
		"Live status of Clusteer systems — the web platform, authentication, database, blockchain networks, and trading.",
};

const ICONS: Record<string, typeof Globe> = {
	web: Globe,
	auth: ShieldCheck,
	database: Database,
	chain: Link2,
	backend: ArrowLeftRight,
};

const OVERALL = {
	operational: { word: "operational.", title: "All systems operational", icon: CheckCircle2, banner: "bg-light-green", chip: "bg-white/50" },
	degraded: { word: "degraded.", title: "Some systems degraded", icon: AlertTriangle, banner: "bg-warning-bg", chip: "bg-white/60" },
	down: { word: "down.", title: "We're investigating an issue", icon: AlertTriangle, banner: "bg-danger-bg", chip: "bg-white/60" },
} as const;

function StatusBadge({ status }: { status: ServiceStatus }) {
	const styles: Record<ServiceStatus, string> = {
		operational: "bg-[#EFFCD0] text-custom-black/70 border-light-green/20",
		degraded: "bg-warning-bg text-warning border-warning/20",
		down: "bg-danger-bg text-danger border-danger/20",
		"pre-launch": "bg-custom-black/[0.06] text-custom-black/55 border-custom-black/15",
	};
	const labels: Record<ServiceStatus, string> = {
		operational: "Operational",
		degraded: "Degraded",
		down: "Down",
		"pre-launch": "Pre-launch",
	};
	const dot =
		status === "operational"
			? "bg-light-green live-dot"
			: status === "degraded"
				? "bg-warning"
				: status === "down"
					? "bg-danger"
					: "bg-custom-black/30";
	return (
		<span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>
			<span className={`size-2 rounded-full ${dot}`} />
			{labels[status]}
		</span>
	);
}

export default async function StatusPage() {
	const status = await getSystemStatus();
	const o = OVERALL[status.overall];
	const OverallIcon = o.icon;
	const checkedTime = new Date(status.checkedAt).toLocaleTimeString("en-GB", {
		timeZone: "Africa/Lagos",
		hour: "2-digit",
		minute: "2-digit",
	});

	const stats = [
		{ v: `${status.operationalCount}/${status.monitoredCount}`, l: "services operational", bg: "bg-background" },
		{ v: status.apiLatencyMs != null ? `${status.apiLatencyMs}ms` : "—", l: "median response time", bg: "bg-light-green" },
		{ v: "—", l: "avg payout · awaiting launch", bg: "bg-warm-beige" },
		{ v: "0", l: "incidents logged", bg: "bg-background" },
	];

	return (
		<main>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="max-w-[820px]">
					<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; SYSTEM STATUS
					</div>
					<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
						<h1 className="font-display text-[clamp(36px,9vw,88px)] sm:text-[clamp(48px,7vw,88px)] font-bold leading-[0.92] tracking-[-0.045em]">
							{status.overall === "operational" ? "All systems" : status.overall === "degraded" ? "Some systems" : "Systems"}{" "}
							<span className="lime-highlight">{o.word}</span>
						</h1>
					</div>
					<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[600px] leading-[1.55]">
						Live reachability of every Clusteer service, re-checked continuously.
						If you are experiencing issues, reach out to{" "}
						<a href="mailto:support@clusteer.com" className="text-foreground font-semibold hover:underline">
							support@clusteer.com
						</a>
						.
					</p>
				</div>
			</section>

			{/* ─── Overall Status Banner ─── */}
			<section className="pb-8 sm:pb-12 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className={`${o.banner} border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
					<div className="flex items-center gap-4">
						<div className="size-12 sm:size-14 rounded-full bg-custom-black text-light-green inline-flex items-center justify-center shrink-0">
							<OverallIcon className="size-6 sm:size-7" strokeWidth={2.2} />
						</div>
						<div>
							<div className="font-display text-lg sm:text-xl font-bold tracking-[-0.02em]">{o.title}</div>
							<p className="text-sm text-custom-black/70">Last checked: {checkedTime} WAT</p>
						</div>
					</div>
					<div className={`inline-flex items-center gap-2 rounded-full border-2 border-custom-black px-3.5 py-1.5 text-xs font-semibold ${o.chip}`}>
						<Activity className="size-3.5" />
						{status.operationalCount}/{status.monitoredCount} operational
					</div>
				</div>
			</section>

			{/* ─── Service Status Grid ─── */}
			<section className="pb-12 sm:pb-20 lg:pb-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
					{status.services.map((service) => {
						const Icon = ICONS[service.key] ?? Globe;
						return (
							<div key={service.key} className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4">
								<div className="flex items-start justify-between gap-3">
									<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center shrink-0">
										<Icon className="size-5 sm:size-[22px]" strokeWidth={2.4} />
									</div>
									<StatusBadge status={service.status} />
								</div>
								<div>
									<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">{service.name}</div>
									<p className="mt-1 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">{service.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* ─── Uptime & Response Time ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 bg-warm-beige">
				<div className="max-w-[1280px] mx-auto">
					<div className="mb-8 sm:mb-14 max-w-[720px]">
						<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
							&#9670; PERFORMANCE
						</div>
						<h2 className="font-display text-[clamp(28px,7vw,56px)] sm:text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-[-0.04em]">
							Built for reliability.
						</h2>
					</div>
					<div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-custom-black rounded-[16px] sm:rounded-[28px] overflow-hidden bg-background">
						{stats.map((s, i) => (
							<div
								key={i}
								className={`${s.bg} p-4 sm:p-7 lg:p-9 flex flex-col gap-1.5 sm:gap-2 ${i < 3 ? "border-r-2 border-custom-black" : ""} ${i < 2 ? "border-b-2 lg:border-b-0 border-custom-black" : ""}`}
							>
								<div className="font-mono text-2xl sm:text-4xl lg:text-[56px] font-semibold leading-[0.95] tracking-[-0.03em] text-custom-black">{s.v}</div>
								<div className="text-[11px] sm:text-[13px] text-muted-foreground font-medium leading-snug">{s.l}</div>
							</div>
						))}
					</div>
					<p className="mt-4 text-[12.5px] text-custom-black/55 max-w-[720px] leading-snug">
						Status reflects live reachability of each service. 30-day uptime and
						payout timings will appear here once continuous monitoring and the
						first orders are in place.
					</p>
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
							Follow <strong className="text-white">@clusteer</strong> on X for
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
							<Button size="xl" variant="outline" asChild className="border-2 border-white/30 text-white hover:bg-white/10 w-full sm:w-auto text-base sm:text-[17px]">
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
