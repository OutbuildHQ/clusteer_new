import { WALLETS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { CopyButton } from "@/components/primitives/copy-button";
import { Snowflake, Flame, Shield, Thermometer } from "lucide-react";

const TYPE_META: Record<string, { icon: React.ElementType; label: string; variant: "secondary" | "warning" | "info" | "success" }> = {
	hot: { icon: Flame, label: "Hot", variant: "warning" },
	warm: { icon: Thermometer, label: "Warm", variant: "secondary" },
	cold: { icon: Snowflake, label: "Cold", variant: "info" },
	"multi-sig": { icon: Shield, label: "Multi-sig", variant: "success" },
};

export default function AdminWallets() {
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-display text-2xl font-bold tracking-tight">Wallets</h1>
					<p className="text-sm text-muted-foreground">Custody pools, thresholds, and rebalancing.</p>
				</div>
				<Button>Trigger rebalance</Button>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{WALLETS.map((w) => {
					const meta = TYPE_META[w.type];
					const inRange = !w.threshold || (w.balance >= w.threshold.min && w.balance <= w.threshold.max);
					const pct = w.threshold ? Math.min(100, (w.balance / w.threshold.max) * 100) : 60;
					return (
						<Card key={w.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<AssetLogo symbol={w.asset} size="md" />
										<div>
											<CardTitle className="text-base">{w.asset} <span className="text-muted-foreground font-normal">on {w.chain}</span></CardTitle>
											<CardDescription className="flex items-center gap-1.5 text-xs"><meta.icon className="size-3" />{meta.label} wallet</CardDescription>
										</div>
									</div>
									<Badge variant={meta.variant}>{meta.label}</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								<div>
									<Num as="div" className="font-display text-2xl font-bold" value={w.balance.toLocaleString() + " " + w.asset} />
									<Num as="div" tone="muted" className="text-xs" value={"$" + w.balanceUsd.toLocaleString()} />
								</div>
								{w.threshold && (
									<div>
										<div className="h-2 rounded-full bg-muted">
											<div className={`h-full rounded-full ${inRange ? "bg-success" : "bg-warning"}`} style={{ width: `${pct}%` }} />
										</div>
										<div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
											<span>min {w.threshold.min.toLocaleString()}</span>
											<span>max {w.threshold.max.toLocaleString()}</span>
										</div>
									</div>
								)}
								{w.signers && (
									<div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
										<Shield className="size-3.5 text-success" />
										<span className="font-medium">{w.required}-of-{w.signers}</span>
										<span className="text-muted-foreground">signers required</span>
									</div>
								)}
								<div>
									<div className="text-[11px] uppercase tracking-wide text-muted-foreground">Address</div>
									<div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-muted/30 p-2">
										<code className="mono flex-1 truncate text-xs">{w.address}</code>
										<CopyButton value={w.address} />
									</div>
								</div>
								<ChainBadge chain={w.chain} />
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
