"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Megaphone, FileText, Info, AlertTriangle } from "lucide-react";

export default function AdminCms() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl font-bold tracking-tight">CMS & alerts</h1>
				<p className="text-sm text-muted-foreground">System-wide messages, maintenance notices, and marketing banners.</p>
			</div>

			<Tabs defaultValue="banner">
				<TabsList>
					<TabsTrigger value="banner">System banner</TabsTrigger>
					<TabsTrigger value="notices">Maintenance</TabsTrigger>
					<TabsTrigger value="articles">Help articles</TabsTrigger>
				</TabsList>

				<TabsContent value="banner">
					<BannerEditor />
				</TabsContent>

				<TabsContent value="notices">
					<Card>
						<CardHeader>
							<CardTitle>Scheduled maintenance</CardTitle>
							<CardDescription>Plan windows when deposits/withdrawals may be paused.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{[
								{ title: "Tron network upgrade", when: "Apr 28, 02:00–03:00 UTC", status: "scheduled" },
								{ title: "Core API migration", when: "Apr 12, 01:30–02:15 UTC", status: "completed" },
							].map((n) => (
								<div key={n.title} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
									<div>
										<div className="font-medium">{n.title}</div>
										<div className="text-xs text-muted-foreground">{n.when}</div>
									</div>
									<Badge variant={n.status === "scheduled" ? "warning" : "secondary"} className="capitalize">{n.status}</Badge>
								</div>
							))}
							<Button variant="outline" className="w-full">+ New maintenance window</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="articles">
					<Card>
						<CardHeader>
							<CardTitle>Help center articles</CardTitle>
							<CardDescription>Public FAQs and support content.</CardDescription>
						</CardHeader>
						<CardContent className="divide-y divide-border p-0">
							{["How long do crypto deposits take?", "What are your trading fees?", "How do I upgrade to Tier 2?", "Can I withdraw to my Nigerian bank?"].map((t) => (
								<div key={t} className="flex items-center gap-4 p-4">
									<FileText className="size-4 text-muted-foreground" />
									<div className="flex-1 font-medium">{t}</div>
									<Badge variant="success">Published</Badge>
									<Button variant="ghost" size="sm">Edit</Button>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function BannerEditor() {
	const [enabled, setEnabled] = useState(true);
	const [message, setMessage] = useState("New: ETH withdrawals now route automatically across Ethereum and Polygon.");
	const [tone, setTone] = useState("info");
	const icon = tone === "info" ? <Info className="size-4" /> : tone === "warn" ? <AlertTriangle className="size-4" /> : <Megaphone className="size-4" />;
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div><CardTitle>System banner</CardTitle><CardDescription>Shown to all logged-in customers</CardDescription></div>
					<Switch checked={enabled} onCheckedChange={setEnabled} />
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
					<div>
						<Label>Message</Label>
						<Input className="mt-1.5" value={message} onChange={(e) => setMessage(e.target.value)} />
					</div>
					<div>
						<Label>Tone</Label>
						<Select value={tone} onValueChange={setTone}>
							<SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="info">Info</SelectItem>
								<SelectItem value="warn">Warning</SelectItem>
								<SelectItem value="promo">Promo</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div>
					<Label className="text-xs uppercase tracking-wide text-muted-foreground">Preview</Label>
					{enabled ? (
						<div className={`mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${tone === "warn" ? "bg-warning-bg text-warning" : tone === "promo" ? "bg-brand-50 text-brand-700" : "bg-info-bg text-info"}`}>
							{icon}{message}
						</div>
					) : (
						<div className="mt-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">Banner disabled</div>
					)}
				</div>
				<div className="flex justify-end"><Button onClick={() => toast.success("Banner published")}>Publish</Button></div>
			</CardContent>
		</Card>
	);
}
