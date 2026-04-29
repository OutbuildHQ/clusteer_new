import { AUDIT } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminAudit() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl font-bold tracking-tight">Audit log</h1>
				<p className="text-sm text-muted-foreground">Immutable log of all administrative actions.</p>
			</div>
			<Card>
				<CardHeader><CardTitle>Recent activity</CardTitle><CardDescription>Last 24 hours</CardDescription></CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Severity</TableHead>
								<TableHead>Action</TableHead>
								<TableHead>Target</TableHead>
								<TableHead>Actor</TableHead>
								<TableHead>IP</TableHead>
								<TableHead className="text-right">When</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{AUDIT.map((a) => (
								<TableRow key={a.id}>
									<TableCell>
										<Badge variant={a.severity === "critical" ? "danger" : a.severity === "warn" ? "warning" : "info"} className="capitalize">{a.severity}</Badge>
									</TableCell>
									<TableCell className="font-medium">{a.action}</TableCell>
									<TableCell><code className="mono text-xs text-muted-foreground">{a.target || "—"}</code></TableCell>
									<TableCell>
										<div className="text-sm">{a.actor}</div>
										<div className="text-xs text-muted-foreground capitalize">{a.actorRole}</div>
									</TableCell>
									<TableCell><code className="mono text-xs text-muted-foreground">{a.ip}</code></TableCell>
									<TableCell className="text-right text-sm text-muted-foreground">{relativeTime(a.timestamp)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
