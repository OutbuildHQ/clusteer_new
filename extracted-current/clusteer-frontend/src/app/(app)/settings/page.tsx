"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CURRENT_USER } from "@/lib/mock-data";
import { Smartphone, Key, ShieldCheck, Trash2 } from "lucide-react";

export default function SettingsPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
			<Tabs defaultValue="profile">
				<TabsList>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="payment">Payment methods</TabsTrigger>
					<TabsTrigger value="preferences">Preferences</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="space-y-4">
					<Card>
						<CardHeader><CardTitle>Your profile</CardTitle><CardDescription>Basic information on your account.</CardDescription></CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-4">
								<Avatar className="size-16"><AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">{CURRENT_USER.firstName[0]}</AvatarFallback></Avatar>
								<div>
									<Button variant="outline" size="sm">Upload photo</Button>
									<p className="mt-1 text-xs text-muted-foreground">PNG or JPG, max 5MB</p>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
								<div><Label>First name</Label><Input className="mt-1.5" defaultValue={CURRENT_USER.firstName} /></div>
								<div><Label>Last name</Label><Input className="mt-1.5" defaultValue={CURRENT_USER.lastName} /></div>
								<div><Label>Email</Label><Input className="mt-1.5" defaultValue={CURRENT_USER.email} /></div>
								<div><Label>Phone</Label><Input className="mt-1.5" defaultValue="+234 801 234 5678" /></div>
							</div>
							<div className="flex justify-end"><Button>Save changes</Button></div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="security" className="space-y-4">
					<Card>
						<CardHeader><CardTitle>Sign-in</CardTitle></CardHeader>
						<CardContent className="divide-y divide-border">
							<Row icon={<Key className="size-5" />} title="Password" hint="Last changed 2 months ago" cta={<Button variant="outline" size="sm" asChild><Link href="/reset-password">Change</Link></Button>} />
							<Row icon={<ShieldCheck className="size-5" />} title="Two-factor authentication" hint="Authenticator app · enabled" cta={<Switch defaultChecked />} />
							<Row icon={<Smartphone className="size-5" />} title="Trusted devices" hint="2 devices signed in" cta={<Button variant="outline" size="sm">Manage</Button>} />
						</CardContent>
					</Card>
					<Card>
						<CardHeader><CardTitle className="text-danger">Danger zone</CardTitle></CardHeader>
						<CardContent>
							<Row icon={<Trash2 className="size-5 text-danger" />} title="Delete account" hint="This action is permanent." cta={<Button variant="destructive" size="sm">Delete account</Button>} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="notifications" className="space-y-4">
					<Card>
						<CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
						<CardContent className="divide-y divide-border">
							{[
								["Trade confirmations", "Order filled, failed, or pending"],
								["Deposits & withdrawals", "Crypto in/out of your wallet"],
								["Price alerts", "BTC moves ±5% in 24h"],
								["Security alerts", "New sign-in or 2FA reset"],
								["Product updates", "New features and announcements"],
							].map(([t, h]) => (
								<Row key={t} title={t} hint={h} cta={<Switch defaultChecked />} />
							))}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="payment" className="space-y-4">
					<Card>
						<CardHeader className="flex-row items-center justify-between">
							<div><CardTitle>Payment methods</CardTitle><CardDescription>Bank accounts used for NGN deposit and withdrawal.</CardDescription></div>
							<Button size="sm">Add bank</Button>
						</CardHeader>
						<CardContent className="space-y-3">
							<BankCard name="GTBank" number="•••• 4321" holder={CURRENT_USER.name} primary />
							<BankCard name="Access Bank" number="•••• 9812" holder={CURRENT_USER.name} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="preferences" className="space-y-4">
					<Card>
						<CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
						<CardContent className="divide-y divide-border">
							<Row title="Display currency" hint="NGN is default for fiat pairs" cta={<Button variant="outline" size="sm">NGN</Button>} />
							<Row title="Language" hint="Interface language" cta={<Button variant="outline" size="sm">English</Button>} />
							<Row title="Theme" hint="Follows your system" cta={<Button variant="outline" size="sm">System</Button>} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function Row({ icon, title, hint, cta }: { icon?: React.ReactNode; title: string; hint?: string; cta: React.ReactNode }) {
	return (
		<div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
			{icon && <div className="rounded-lg bg-muted p-2 text-muted-foreground">{icon}</div>}
			<div className="flex-1 min-w-0">
				<div className="font-medium">{title}</div>
				{hint && <div className="text-xs text-muted-foreground">{hint}</div>}
			</div>
			{cta}
		</div>
	);
}

function BankCard({ name, number, holder, primary }: { name: string; number: string; holder: string; primary?: boolean }) {
	return (
		<div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
			<div className="flex items-center gap-4">
				<div className="rounded-lg bg-primary/10 p-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" /></svg></div>
				<div>
					<div className="font-medium">{name} <span className="text-muted-foreground font-normal">{number}</span></div>
					<div className="text-xs text-muted-foreground">{holder}</div>
				</div>
			</div>
			<div className="flex items-center gap-2">
				{primary && <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Primary</span>}
				<Button variant="ghost" size="sm">Edit</Button>
			</div>
		</div>
	);
}
