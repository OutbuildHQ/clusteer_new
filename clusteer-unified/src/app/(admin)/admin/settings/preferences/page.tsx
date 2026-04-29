"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, RefreshCw, AlertTriangle } from "lucide-react";

const INITIAL = {
	buyMarkup: "0.75",
	sellMarkdown: "0.75",
	withdrawalFeeUsdt: "1.00",
	withdrawalFeeUsdc: "1.00",
	vatRate: "7.5",
	minBuyNgn: "5000",
	maxBuyNgn: "100000000",
	minSellUsdt: "5",
	maxSellUsdt: "100000",
	internalSendFee: "0",
	rateRefreshSeconds: "10",
	maintenanceMode: false,
	newUserRegistration: true,
	kycRequired: true,
};

export default function SystemPreferencesPage() {
	const [config, setConfig] = useState(INITIAL);
	const [saving, setSaving] = useState(false);

	const update = (key: string, value: string | boolean) =>
		setConfig((prev) => ({ ...prev, [key]: value }));

	async function handleSave() {
		setSaving(true);
		await new Promise((r) => setTimeout(r, 800));
		setSaving(false);
		toast.success("System preferences saved");
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">System Preferences</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Configure fees, limits, and platform behaviour. Changes take effect immediately.
					</p>
				</div>
				<Button onClick={handleSave} disabled={saving}>
					{saving ? <RefreshCw className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
					{saving ? "Saving..." : "Save changes"}
				</Button>
			</div>

			{/* Fee Structure */}
			<Card>
				<CardHeader>
					<CardTitle>Fee Structure</CardTitle>
					<CardDescription>Trading fees applied to buy/sell stablecoin orders. Displayed to users before confirmation.</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label>Buy markup (%)</Label>
						<Input type="number" step="0.01" value={config.buyMarkup} onChange={(e) => update("buyMarkup", e.target.value)} />
						<p className="text-xs text-muted-foreground">Added to mid-market rate when user buys USDT/USDC</p>
					</div>
					<div className="space-y-2">
						<Label>Sell markdown (%)</Label>
						<Input type="number" step="0.01" value={config.sellMarkdown} onChange={(e) => update("sellMarkdown", e.target.value)} />
						<p className="text-xs text-muted-foreground">Deducted from mid-market rate when user sells</p>
					</div>
					<div className="space-y-2">
						<Label>USDT withdrawal fee</Label>
						<Input type="number" step="0.1" value={config.withdrawalFeeUsdt} onChange={(e) => update("withdrawalFeeUsdt", e.target.value)} />
						<p className="text-xs text-muted-foreground">Flat fee in USDT for external withdrawals</p>
					</div>
					<div className="space-y-2">
						<Label>USDC withdrawal fee</Label>
						<Input type="number" step="0.1" value={config.withdrawalFeeUsdc} onChange={(e) => update("withdrawalFeeUsdc", e.target.value)} />
						<p className="text-xs text-muted-foreground">Flat fee in USDC for external withdrawals</p>
					</div>
					<div className="space-y-2">
						<Label>Internal send fee</Label>
						<div className="flex items-center gap-2">
							<Input type="number" step="0.01" value={config.internalSendFee} onChange={(e) => update("internalSendFee", e.target.value)} />
							{config.internalSendFee === "0" && <Badge variant="secondary" className="shrink-0">Free</Badge>}
						</div>
						<p className="text-xs text-muted-foreground">Fee for Clusteer-to-Clusteer transfers (0 = free)</p>
					</div>
					<div className="space-y-2">
						<Label>VAT rate (%)</Label>
						<Input type="number" step="0.1" value={config.vatRate} onChange={(e) => update("vatRate", e.target.value)} />
						<p className="text-xs text-muted-foreground">Value Added Tax applied to fees (Nigerian FIRS requirement)</p>
					</div>
				</CardContent>
			</Card>

			{/* Transaction Limits */}
			<Card>
				<CardHeader>
					<CardTitle>Transaction Limits</CardTitle>
					<CardDescription>Min/max per transaction. KYC tier-specific limits are managed separately per user.</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label>Min buy amount (NGN)</Label>
						<Input type="number" value={config.minBuyNgn} onChange={(e) => update("minBuyNgn", e.target.value)} />
					</div>
					<div className="space-y-2">
						<Label>Max buy amount (NGN)</Label>
						<Input type="number" value={config.maxBuyNgn} onChange={(e) => update("maxBuyNgn", e.target.value)} />
					</div>
					<div className="space-y-2">
						<Label>Min sell amount (USDT)</Label>
						<Input type="number" value={config.minSellUsdt} onChange={(e) => update("minSellUsdt", e.target.value)} />
					</div>
					<div className="space-y-2">
						<Label>Max sell amount (USDT)</Label>
						<Input type="number" value={config.maxSellUsdt} onChange={(e) => update("maxSellUsdt", e.target.value)} />
					</div>
				</CardContent>
			</Card>

			{/* Platform Behaviour */}
			<Card>
				<CardHeader>
					<CardTitle>Platform Behaviour</CardTitle>
					<CardDescription>Global toggles that affect all users.</CardDescription>
				</CardHeader>
				<CardContent className="divide-y divide-border">
					<div className="flex items-center justify-between py-4">
						<div>
							<p className="text-sm font-medium">Rate refresh interval</p>
							<p className="text-xs text-muted-foreground">How often the exchange rate quote refreshes (seconds)</p>
						</div>
						<Input type="number" className="w-20" value={config.rateRefreshSeconds} onChange={(e) => update("rateRefreshSeconds", e.target.value)} />
					</div>
					<div className="flex items-center justify-between py-4">
						<div>
							<p className="text-sm font-medium">New user registration</p>
							<p className="text-xs text-muted-foreground">Allow new users to create accounts</p>
						</div>
						<Switch checked={config.newUserRegistration} onCheckedChange={(v) => update("newUserRegistration", v)} />
					</div>
					<div className="flex items-center justify-between py-4">
						<div>
							<p className="text-sm font-medium">KYC required for trading</p>
							<p className="text-xs text-muted-foreground">Require Tier 1+ KYC before allowing buy/sell</p>
						</div>
						<Switch checked={config.kycRequired} onCheckedChange={(v) => update("kycRequired", v)} />
					</div>
					<div className="flex items-center justify-between py-4">
						<div className="flex items-center gap-2">
							<AlertTriangle className="size-4 text-warning" />
							<div>
								<p className="text-sm font-medium text-warning">Maintenance mode</p>
								<p className="text-xs text-muted-foreground">Disables all trading. Users see a maintenance banner.</p>
							</div>
						</div>
						<Switch checked={config.maintenanceMode} onCheckedChange={(v) => update("maintenanceMode", v)} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
