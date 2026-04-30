"use client";

import { useState } from "react";
import {
	X,
	DollarSign,
	User,
	Wallet,
	Send,
	Download,
	Calendar,
	FileText,
	AlertTriangle,
	CheckCircle2,
	RefreshCw,
	TrendingUp,
	Search,
	Plus,
} from "lucide-react";

// Manual Top-up Modal
export function ManualTopupModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const [formData, setFormData] = useState({
		userId: "",
		currency: "USDT",
		amount: "",
		reason: "",
		sendNotification: true,
	});

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
			<div className="bg-card rounded-lg max-w-lg w-full p-6 animate-in slide-in-from-bottom duration-300">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
							<Plus className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">Manual Top-up</h3>
							<p className="text-sm text-muted-foreground">Credit user wallet directly</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-muted rounded-lg transition-all hover:scale-110 active:scale-90"
					>
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				<div className="space-y-4">
					{/* User ID or Email */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							User ID or Email <span className="text-danger">*</span>
						</label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<input
								type="text"
								value={formData.userId}
								onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
								placeholder="Enter user ID or email..."
								className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							/>
						</div>
					</div>

					{/* Currency */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Currency <span className="text-danger">*</span>
						</label>
						<select
							value={formData.currency}
							onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
							className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
						>
							<option value="USDT">USDT</option>
							<option value="USDC">USDC</option>
							<option value="Naira">Naira (₦)</option>
						</select>
					</div>

					{/* Amount */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Amount <span className="text-danger">*</span>
						</label>
						<div className="relative">
							<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<input
								type="number"
								value={formData.amount}
								onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
								placeholder="0.00"
								className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							/>
						</div>
					</div>

					{/* Reason */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Reason <span className="text-danger">*</span>
						</label>
						<textarea
							value={formData.reason}
							onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
							placeholder="Enter reason for top-up..."
							className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							rows={3}
						/>
					</div>

					{/* Send Notification */}
					<div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
						<input
							type="checkbox"
							id="sendNotification"
							checked={formData.sendNotification}
							onChange={(e) =>
								setFormData({ ...formData, sendNotification: e.target.checked })
							}
							className="w-4 h-4 rounded border-border text-primary focus:ring-ring"
						/>
						<label htmlFor="sendNotification" className="flex-1">
							<span className="text-sm font-medium text-foreground block">
								Send notification to user
							</span>
							<span className="text-xs text-muted-foreground">
								User will receive email about this top-up
							</span>
						</label>
					</div>
				</div>

				<div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							// Handle top-up logic here
							onClose();
						}}
						className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 font-medium shadow-sm"
					>
						Process Top-up
					</button>
				</div>
			</div>
		</div>
	);
}

// Export Transactions Modal
export function ExportTransactionsModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const [exportConfig, setExportConfig] = useState({
		format: "CSV",
		dateRange: "last30days",
		includeFilters: true,
		customStartDate: "",
		customEndDate: "",
	});

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
			<div className="bg-card rounded-lg max-w-lg w-full p-6 animate-in slide-in-from-bottom duration-300">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
							<Download className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">Export Transactions</h3>
							<p className="text-sm text-muted-foreground">Download transaction data</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-muted rounded-lg transition-all hover:scale-110 active:scale-90"
					>
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				<div className="space-y-4">
					{/* Export Format */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">Export Format</label>
						<div className="grid grid-cols-2 gap-3">
							{["CSV", "PDF"].map((format) => (
								<button
									key={format}
									onClick={() => setExportConfig({ ...exportConfig, format })}
									className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
										exportConfig.format === format
											? "border-primary bg-primary/10 text-primary"
											: "border-border bg-card text-muted-foreground hover:bg-background"
									}`}
								>
									<FileText className="w-5 h-5 mx-auto mb-1" />
									{format}
								</button>
							))}
						</div>
					</div>

					{/* Date Range */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">Date Range</label>
						<select
							value={exportConfig.dateRange}
							onChange={(e) => setExportConfig({ ...exportConfig, dateRange: e.target.value })}
							className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
						>
							<option value="today">Today</option>
							<option value="last7days">Last 7 Days</option>
							<option value="last30days">Last 30 Days</option>
							<option value="last90days">Last 90 Days</option>
							<option value="thisMonth">This Month</option>
							<option value="lastMonth">Last Month</option>
							<option value="custom">Custom Range</option>
						</select>
					</div>

					{exportConfig.dateRange === "custom" && (
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-sm font-medium text-muted-foreground mb-2">Start Date</label>
								<input
									type="date"
									value={exportConfig.customStartDate}
									onChange={(e) =>
										setExportConfig({ ...exportConfig, customStartDate: e.target.value })
									}
									className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-muted-foreground mb-2">End Date</label>
								<input
									type="date"
									value={exportConfig.customEndDate}
									onChange={(e) =>
										setExportConfig({ ...exportConfig, customEndDate: e.target.value })
									}
									className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
								/>
							</div>
						</div>
					)}

					{/* Include Current Filters */}
					<div className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg">
						<input
							type="checkbox"
							id="includeFilters"
							checked={exportConfig.includeFilters}
							onChange={(e) =>
								setExportConfig({ ...exportConfig, includeFilters: e.target.checked })
							}
							className="w-4 h-4 rounded border-border text-primary focus:ring-ring"
						/>
						<label htmlFor="includeFilters" className="flex-1">
							<span className="text-sm font-medium text-foreground block">
								Apply current filters
							</span>
							<span className="text-xs text-muted-foreground">
								Export only transactions matching current filters
							</span>
						</label>
					</div>

					{/* Summary */}
					<div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
						<div className="flex items-center gap-2 text-sm text-primary">
							<CheckCircle2 className="w-4 h-4" />
							<span className="font-medium">Ready to export</span>
						</div>
						<p className="text-xs text-primary mt-1">
							Estimated: ~1,234 transactions • File size: ~250 KB
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							// Handle export logic here
							onClose();
						}}
						className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 font-medium shadow-sm flex items-center justify-center gap-2"
					>
						<Download className="w-4 h-4" />
						Export Now
					</button>
				</div>
			</div>
		</div>
	);
}

// Transfer USDT/USDC Modal
export function TransferModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	const [formData, setFormData] = useState({
		currency: "USDT",
		network: "TRC20",
		toAddress: "",
		amount: "",
		purpose: "",
		twoFACode: "",
	});

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
			<div className="bg-card rounded-lg max-w-lg w-full p-6 animate-in slide-in-from-bottom duration-300">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-brand-800 to-light-green rounded-full flex items-center justify-center">
							<Send className="w-6 h-6 text-white" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">Transfer USDT/USDC</h3>
							<p className="text-sm text-muted-foreground">Send funds to external wallet</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-muted rounded-lg transition-all hover:scale-110 active:scale-90"
					>
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				<div className="space-y-4">
					{/* Currency & Network */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-medium text-muted-foreground mb-2">Currency</label>
							<select
								value={formData.currency}
								onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
								className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							>
								<option value="USDT">USDT</option>
								<option value="USDC">USDC</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-muted-foreground mb-2">Network</label>
							<select
								value={formData.network}
								onChange={(e) => setFormData({ ...formData, network: e.target.value })}
								className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							>
								<option value="TRC20">TRC20</option>
								<option value="BEP20">BEP20</option>
								<option value="SOL">Solana</option>
							</select>
						</div>
					</div>

					{/* To Address */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							To Address <span className="text-danger">*</span>
						</label>
						<input
							type="text"
							value={formData.toAddress}
							onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
							placeholder="Enter wallet address..."
							className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono"
						/>
					</div>

					{/* Amount */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Amount <span className="text-danger">*</span>
						</label>
						<div className="relative">
							<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<input
								type="number"
								value={formData.amount}
								onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
								placeholder="0.00"
								className="w-full pl-10 pr-20 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
								Available: $15,200
							</span>
						</div>
					</div>

					{/* Purpose */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">Purpose</label>
						<textarea
							value={formData.purpose}
							onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
							placeholder="Enter purpose for transfer..."
							className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							rows={2}
						/>
					</div>

					{/* 2FA Code */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							2FA Code <span className="text-danger">*</span>
						</label>
						<input
							type="text"
							value={formData.twoFACode}
							onChange={(e) => setFormData({ ...formData, twoFACode: e.target.value })}
							placeholder="Enter 6-digit code"
							maxLength={6}
							className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-center text-2xl tracking-widest font-mono"
						/>
					</div>

					{/* Warning */}
					<div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
						<AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
						<div className="flex-1">
							<p className="text-sm font-medium text-orange-900">Transfer cannot be reversed</p>
							<p className="text-xs text-orange-700 mt-1">
								Please verify the address and network before confirming
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							// Handle transfer logic here
							onClose();
						}}
						className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 font-medium shadow-sm flex items-center justify-center gap-2"
					>
						<Send className="w-4 h-4" />
						Confirm Transfer
					</button>
				</div>
			</div>
		</div>
	);
}

// Reconcile Bank Float Modal
export function ReconcileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	const [reconcileData, setReconcileData] = useState({
		bankBalance: "",
		systemBalance: "15200000",
		notes: "",
	});

	if (!isOpen) return null;

	const difference =
		parseFloat(reconcileData.bankBalance || "0") - parseFloat(reconcileData.systemBalance);

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
			<div className="bg-card rounded-lg max-w-lg w-full p-6 animate-in slide-in-from-bottom duration-300">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
							<RefreshCw className="w-6 h-6 text-purple-600" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">Reconcile Bank Float</h3>
							<p className="text-sm text-muted-foreground">Match bank balance with system</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-muted rounded-lg transition-all hover:scale-110 active:scale-90"
					>
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				<div className="space-y-4">
					{/* System Balance (Read-only) */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							System Balance (Current)
						</label>
						<div className="px-4 py-3 bg-background border border-border rounded-lg">
							<p className="text-2xl font-bold text-foreground">
								₦{parseFloat(reconcileData.systemBalance).toLocaleString()}
							</p>
						</div>
					</div>

					{/* Bank Balance (Input) */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Actual Bank Balance <span className="text-danger">*</span>
						</label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
								₦
							</span>
							<input
								type="number"
								value={reconcileData.bankBalance}
								onChange={(e) =>
									setReconcileData({ ...reconcileData, bankBalance: e.target.value })
								}
								placeholder="0.00"
								className="w-full pl-8 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							/>
						</div>
					</div>

					{/* Difference Indicator */}
					{reconcileData.bankBalance && (
						<div
							className={`p-4 rounded-lg border-2 ${
								Math.abs(difference) < 1
									? "bg-success/10 border-success"
									: "bg-orange-50 border-orange-200"
							}`}
						>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-muted-foreground">Difference</span>
								<span
									className={`text-2xl font-bold ${
										difference === 0
											? "text-success"
											: difference > 0
											? "text-orange-700"
											: "text-danger"
									}`}
								>
									{difference >= 0 ? "+" : ""}₦{Math.abs(difference).toLocaleString()}
								</span>
							</div>
							<p className="text-xs text-muted-foreground mt-2">
								{Math.abs(difference) < 1
									? "✓ Balances match"
									: difference > 0
									? "Bank balance is higher than system"
									: "System balance is higher than bank"}
							</p>
						</div>
					)}

					{/* Notes */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Reconciliation Notes
						</label>
						<textarea
							value={reconcileData.notes}
							onChange={(e) => setReconcileData({ ...reconcileData, notes: e.target.value })}
							placeholder="Add notes about this reconciliation..."
							className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							rows={3}
						/>
					</div>
				</div>

				<div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							// Handle reconciliation logic here
							onClose();
						}}
						disabled={!reconcileData.bankBalance}
						className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Complete Reconciliation
					</button>
				</div>
			</div>
		</div>
	);
}
