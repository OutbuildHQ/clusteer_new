"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Smartphone, Key, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { useUser } from "@/store/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getNotificationPreferences,
	updateNotificationPreferences,
	getBankAccounts,
	createBankAccount,
	deleteBankAccount,
	type NotificationPreferences,
	type BankAccount,
} from "@/lib/api/settings";

/* ------------------------------------------------------------------ */
/*  Notification rows – maps UI labels to API field keys               */
/* ------------------------------------------------------------------ */
const NOTIF_ROWS: { label: string; hint: string; key: keyof NotificationPreferences }[] = [
	{ label: "Trade confirmations", hint: "Order filled, failed, or pending", key: "push_transactions" },
	{ label: "Deposits & withdrawals", hint: "Stablecoins in/out of your wallet", key: "email_transactions" },
	{ label: "Rate alerts", hint: "USDT/NGN rate moves ±2%", key: "push_price_alerts" },
	{ label: "Security alerts", hint: "New sign-in or 2FA reset", key: "email_security" },
	{ label: "Product updates", hint: "New features and announcements", key: "email_marketing" },
];

export default function SettingsPage() {
	const user = useUser();
	const queryClient = useQueryClient();

	/* ---- Add-bank form state ---- */
	const [showAddBank, setShowAddBank] = useState(false);
	const [newBank, setNewBank] = useState({ bank_name: "", account_number: "", account_name: "" });

	/* ---- Notifications query ---- */
	const notifQuery = useQuery({
		queryKey: ["notif-prefs", user?.id],
		queryFn: () => getNotificationPreferences(user!.id),
		enabled: !!user?.id,
	});

	const notifMutation = useMutation({
		mutationFn: (prefs: Partial<NotificationPreferences>) =>
			updateNotificationPreferences(user!.id, prefs),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notif-prefs", user?.id] }),
	});

	/* ---- Bank accounts query ---- */
	const banksQuery = useQuery({
		queryKey: ["bank-accounts", user?.id],
		queryFn: () => getBankAccounts(user!.id),
		enabled: !!user?.id,
	});

	const addBankMutation = useMutation({
		mutationFn: (data: { bank_name: string; account_number: string; account_name: string }) =>
			createBankAccount(user!.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bank-accounts", user?.id] });
			setShowAddBank(false);
			setNewBank({ bank_name: "", account_number: "", account_name: "" });
		},
	});

	const deleteBankMutation = useMutation({
		mutationFn: (accountId: number) => deleteBankAccount(user!.id, accountId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bank-accounts", user?.id] }),
	});

	/* ---- Derived values ---- */
	const firstName = user?.firstName ?? user?.username ?? "";
	const lastName = user?.lastName ?? "";
	const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";
	const email = user?.email ?? "";
	const phone = user?.phone ?? "";

	return (
		<div className="space-y-6">
			<h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
			<Tabs defaultValue="profile">
				<TabsList className="w-full overflow-x-auto flex-nowrap justify-start no-scrollbar">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="payment">Payment methods</TabsTrigger>
					<TabsTrigger value="preferences">Preferences</TabsTrigger>
				</TabsList>

				{/* ===================== PROFILE TAB ===================== */}
				<TabsContent value="profile" className="space-y-4">
					<Card>
						<CardHeader><CardTitle>Your profile</CardTitle><CardDescription>Basic information on your account.</CardDescription></CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-4">
								<Avatar className="size-16"><AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">{firstName?.[0] ?? "?"}</AvatarFallback></Avatar>
								<div>
									<Button variant="outline" size="sm">Upload photo</Button>
									<p className="mt-1 text-xs text-muted-foreground">PNG or JPG, max 5MB</p>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
								<div><Label>First name</Label><Input className="mt-1.5" defaultValue={firstName} /></div>
								<div><Label>Last name</Label><Input className="mt-1.5" defaultValue={lastName} /></div>
								<div><Label>Email</Label><Input className="mt-1.5" defaultValue={email} /></div>
								<div><Label>Phone</Label><Input className="mt-1.5" defaultValue={phone} /></div>
							</div>
							<div className="flex justify-end"><Button>Save changes</Button></div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* ===================== SECURITY TAB ===================== */}
				<TabsContent value="security" className="space-y-4">
					<Card>
						<CardHeader><CardTitle>Sign-in</CardTitle></CardHeader>
						<CardContent className="divide-y divide-border">
							<Row icon={<Key className="size-5" />} title="Password" hint="Last changed 2 months ago" cta={<Button variant="outline" size="sm" asChild><Link href="/forgot-password">Change</Link></Button>} />
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

				{/* ===================== NOTIFICATIONS TAB ===================== */}
				<TabsContent value="notifications" className="space-y-4">
					<Card>
						<CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
						<CardContent className="divide-y divide-border">
							{notifQuery.isLoading && (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="size-5 animate-spin text-muted-foreground" />
									<span className="ml-2 text-sm text-muted-foreground">Loading preferences...</span>
								</div>
							)}
							{notifQuery.isError && (
								<div className="py-4 text-sm text-danger">
									Failed to load notification preferences.{" "}
									<button className="underline" onClick={() => notifQuery.refetch()}>Retry</button>
								</div>
							)}
							{notifQuery.isSuccess &&
								NOTIF_ROWS.map(({ label, hint, key }) => (
									<Row
										key={key}
										title={label}
										hint={hint}
										cta={
											<Switch
												checked={notifQuery.data?.[key] ?? false}
												disabled={notifMutation.isPending}
												onCheckedChange={(checked) =>
													notifMutation.mutate({ [key]: checked })
												}
											/>
										}
									/>
								))}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ===================== PAYMENT METHODS TAB ===================== */}
				<TabsContent value="payment" className="space-y-4">
					<Card>
						<CardHeader className="flex-row items-center justify-between">
							<div><CardTitle>Payment methods</CardTitle><CardDescription>Bank accounts used for NGN deposit and withdrawal.</CardDescription></div>
							<Button size="sm" onClick={() => setShowAddBank(true)}>Add bank</Button>
						</CardHeader>
						<CardContent className="space-y-3">
							{banksQuery.isLoading && (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="size-5 animate-spin text-muted-foreground" />
									<span className="ml-2 text-sm text-muted-foreground">Loading bank accounts...</span>
								</div>
							)}
							{banksQuery.isError && (
								<div className="py-4 text-sm text-danger">
									Failed to load bank accounts.{" "}
									<button className="underline" onClick={() => banksQuery.refetch()}>Retry</button>
								</div>
							)}
							{banksQuery.isSuccess && banksQuery.data.length === 0 && (
								<p className="py-4 text-sm text-muted-foreground">No bank accounts added yet.</p>
							)}
							{banksQuery.isSuccess &&
								banksQuery.data.map((acct) => (
									<BankCard
										key={acct.id}
										name={acct.bank_name}
										number={`•••• ${acct.account_number.slice(-4)}`}
										holder={acct.account_name}
										primary={acct.is_default}
										onDelete={() => deleteBankMutation.mutate(acct.id)}
										deleting={deleteBankMutation.isPending}
									/>
								))}

							{/* ---- Inline add-bank form ---- */}
							{showAddBank && (
								<div className="rounded-lg border border-border bg-card p-4 space-y-3">
									<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
										<div><Label>Bank name</Label><Input className="mt-1.5" placeholder="GTBank" value={newBank.bank_name} onChange={(e) => setNewBank({ ...newBank, bank_name: e.target.value })} /></div>
										<div><Label>Account number</Label><Input className="mt-1.5" placeholder="0123456789" value={newBank.account_number} onChange={(e) => setNewBank({ ...newBank, account_number: e.target.value.replace(/\D/g, "") })} /></div>
										<div><Label>Account name</Label><Input className="mt-1.5" placeholder="John Doe" value={newBank.account_name} onChange={(e) => setNewBank({ ...newBank, account_name: e.target.value })} /></div>
									</div>
									<div className="flex justify-end gap-2">
										<Button variant="outline" size="sm" onClick={() => { setShowAddBank(false); setNewBank({ bank_name: "", account_number: "", account_name: "" }); }}>Cancel</Button>
										<Button size="sm" disabled={addBankMutation.isPending || !newBank.bank_name || !newBank.account_number || !newBank.account_name} onClick={() => addBankMutation.mutate(newBank)}>
											{addBankMutation.isPending ? <><Loader2 className="size-4 animate-spin mr-1" />Saving...</> : "Save"}
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ===================== PREFERENCES TAB ===================== */}
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

function BankCard({ name, number, holder, primary, onDelete, deleting }: { name: string; number: string; holder: string; primary?: boolean; onDelete: () => void; deleting: boolean }) {
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
				<Button variant="ghost" size="sm" onClick={onDelete} disabled={deleting}>
					{deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
				</Button>
			</div>
		</div>
	);
}
