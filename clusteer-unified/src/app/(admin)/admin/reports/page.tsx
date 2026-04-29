import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateAreaSeries } from "@/lib/mock-data";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";
import { Num } from "@/components/primitives/num";
import { Download, FileBarChart2, Banknote, Users, ShieldCheck } from "lucide-react";

const REPORTS = [
	{ icon: Banknote, title: "Trading volume & fees", desc: "Daily, weekly, monthly breakdown by asset." },
	{ icon: Users, title: "User acquisition", desc: "New signups, activation, retention cohorts." },
	{ icon: ShieldCheck, title: "KYC throughput", desc: "Submissions, approval time, rejection reasons." },
	{ icon: FileBarChart2, title: "Regulatory filings", desc: "SEC & EFCC compliance exports." },
];

export default function AdminReports() {
	const vol = generateAreaSeries(30, 180_000_000);
	const users = generateAreaSeries(30, 8_000).map(p => ({ ...p, v: Math.abs(p.v / 1000) }));
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-display text-2xl font-bold tracking-tight">Reports</h1>
					<p className="text-sm text-muted-foreground">Operational and regulatory data exports.</p>
				</div>
				<Button variant="outline"><Download className="size-4" />Download all (CSV)</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Volume — NGN</CardTitle>
						<CardDescription>30d trailing · ₦{(30 * 180_000_000).toLocaleString()} total</CardDescription>
					</CardHeader>
					<CardContent><PriceAreaChart data={vol} currency="NGN" height={200} /></CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Signups</CardTitle>
						<CardDescription>Daily acquisition</CardDescription>
					</CardHeader>
					<CardContent><PriceAreaChart data={users} currency="NGN" height={200} /></CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				{REPORTS.map((r) => (
					<Card key={r.title} className="group cursor-pointer transition hover:border-primary/50">
						<CardContent className="flex items-center gap-4 p-5">
							<div className="rounded-lg bg-primary/10 p-3 text-primary"><r.icon className="size-5" /></div>
							<div className="flex-1">
								<div className="font-semibold">{r.title}</div>
								<div className="text-xs text-muted-foreground">{r.desc}</div>
							</div>
							<Button variant="outline" size="sm"><Download className="size-4" />Export</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
