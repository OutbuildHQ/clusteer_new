"use client";

import { useUser } from "@/store/user";
import {
	TrendingUp,
	Download,
	AlertTriangle,
	CheckCircle2,
	XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Toast } from "@/components/toast";
import {
	getAccountLimits,
	createDataExportRequest,
	getKYCVerification,
	type AccountLimits as APIAccountLimits,
	type KYCVerification,
} from "@/lib/api/settings";

interface LimitData {
	used: number;
	limit: number;
	currency: string;
}

export default function Page() {
	const user = useUser();
	const [isExporting, setIsExporting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [kycStatus, setKycStatus] = useState<KYCVerification | null>(null);
	const [showCloseModal, setShowCloseModal] = useState(false);
	const [accountLimits, setAccountLimits] = useState<{
		dailyWithdrawal: LimitData;
		monthlyWithdrawal: LimitData;
		dailyDeposit: LimitData;
		monthlyDeposit: LimitData;
	}>({
		dailyWithdrawal: {
			used: 0,
			limit: 50000,
			currency: "NGN",
		},
		monthlyWithdrawal: {
			used: 0,
			limit: 500000,
			currency: "NGN",
		},
		dailyDeposit: {
			used: 0,
			limit: 100000,
			currency: "NGN",
		},
		monthlyDeposit: {
			used: 0,
			limit: 1000000,
			currency: "NGN",
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) return;

			try {
				const [limitsData, kycData] = await Promise.all([
					getAccountLimits(user.id),
					getKYCVerification(user.id),
				]);

				setAccountLimits({
					dailyWithdrawal: {
						used: limitsData.daily_withdrawal_used,
						limit: limitsData.daily_withdrawal_limit,
						currency: limitsData.limit_currency,
					},
					monthlyWithdrawal: {
						used: limitsData.monthly_withdrawal_used,
						limit: limitsData.monthly_withdrawal_limit,
						currency: limitsData.limit_currency,
					},
					dailyDeposit: {
						used: limitsData.daily_deposit_used,
						limit: limitsData.daily_deposit_limit,
						currency: limitsData.limit_currency,
					},
					monthlyDeposit: {
						used: limitsData.monthly_deposit_used,
						limit: limitsData.monthly_deposit_limit,
						currency: limitsData.limit_currency,
					},
				});

				setKycStatus(kycData);
			} catch (error) {
				Toast.error("Failed to load account data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [user?.id]);

	const handleExportHistory = async () => {
		if (!user?.id) return;

		setIsExporting(true);
		try {
			await createDataExportRequest(user.id, "transaction_history");
			Toast.success(
				"Transaction history export initiated. Check your email shortly."
			);
		} catch (error) {
			Toast.error("Failed to initiate export");
		} finally {
			setIsExporting(false);
		}
	};

	const handleCloseAccount = async () => {
		setShowCloseModal(false);
		Toast.error(
			"Account closure feature is currently under maintenance. Please contact support."
		);
	};

	const calculatePercentage = (used: number, limit: number) => {
		return Math.min((used / limit) * 100, 100);
	};

	if (isLoading) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
						Account Management
					</h1>
					<p className="text-sm lg:text-base text-muted-foreground mt-2">
						Loading your account information...
					</p>
				</header>
			</section>
		);
	}

	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<header className="mb-6">
				<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
					Account Management
				</h1>
				<p className="text-sm lg:text-base text-muted-foreground mt-2">
					View transaction limits, export history, and manage your account
				</p>
			</header>

			<div className="space-y-6">
				{/* Account Status */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-semibold text-lg text-foreground">
							Account Status
						</h2>
						<span
							className={`inline-flex items-center rounded-full h-7 px-3 py-1 text-xs font-medium ${
								kycStatus?.status === "approved"
									? "text-success bg-success/10"
									: kycStatus?.status === "pending" || kycStatus?.status === "under_review"
									? "text-primary bg-primary/10"
									: kycStatus?.status === "rejected"
									? "text-danger bg-danger/10"
									: "text-orange-700 bg-orange-100"
							}`}
						>
							{kycStatus?.status === "approved" ? (
								<>
									<CheckCircle2 className="w-4 h-4 mr-1" />
									Verified
								</>
							) : kycStatus?.status === "pending" ? (
								<>
									<AlertTriangle className="w-4 h-4 mr-1" />
									Pending Review
								</>
							) : kycStatus?.status === "under_review" ? (
								<>
									<AlertTriangle className="w-4 h-4 mr-1" />
									Under Review
								</>
							) : kycStatus?.status === "rejected" ? (
								<>
									<XCircle className="w-4 h-4 mr-1" />
									Rejected
								</>
							) : (
								<>
									<AlertTriangle className="w-4 h-4 mr-1" />
									Not Verified
								</>
							)}
						</span>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="bg-muted rounded-xl p-4">
							<p className="text-sm text-muted-foreground mb-1">Account Type</p>
							<p className="font-semibold text-lg text-foreground">
								{kycStatus?.status === "approved" ? "Verified Individual" : "Basic"}
							</p>
						</div>
						<div className="bg-muted rounded-xl p-4">
							<p className="text-sm text-muted-foreground mb-1">Member Since</p>
							<p className="font-semibold text-lg text-foreground">
								{user?.dateJoined
									? new Date(user.dateJoined).toLocaleDateString("en-US", {
											month: "long",
											year: "numeric",
									  })
									: "N/A"}
							</p>
						</div>
					</div>

					{kycStatus?.status === "not_submitted" && (
						<div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
								<div className="flex-1">
									<p className="font-medium text-sm text-orange-900 mb-1">
										Complete your verification
									</p>
									<p className="text-sm text-orange-700 mb-3">
										Verify your identity to unlock higher transaction limits and
										full platform features.
									</p>
									<button
										style={{
											background: "var(--c-accent, #9FE870)",
											color: "#fff",
											border: "1px solid rgba(0,0,0,0.05)",
											height: "32px",
											padding: "0 16px",
											borderRadius: "9999px",
											fontWeight: 600,
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Verify Now
									</button>
								</div>
							</div>
						</div>
					)}

					{(kycStatus?.status === "pending" || kycStatus?.status === "under_review") && (
						<div className="mt-4 bg-primary/10 border border-primary/30 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
								<div className="flex-1">
									<p className="font-medium text-sm text-primary mb-1">
										Verification {kycStatus.status === "pending" ? "Pending" : "Under Review"}
									</p>
									<p className="text-sm text-primary">
										Your verification documents have been submitted and are currently being reviewed by our team.
										This typically takes 24-48 hours. We'll notify you once the review is complete.
									</p>
									{kycStatus.submitted_at && (
										<p className="text-xs text-primary mt-2">
											Submitted: {new Date(kycStatus.submitted_at).toLocaleDateString("en-US", {
												month: "long",
												day: "numeric",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit"
											})}
										</p>
									)}
								</div>
							</div>
						</div>
					)}

					{kycStatus?.status === "rejected" && (
						<div className="mt-4 bg-danger/10 border border-danger rounded-xl p-4">
							<div className="flex items-start gap-3">
								<XCircle className="w-5 h-5 text-danger mt-0.5" />
								<div className="flex-1">
									<p className="font-medium text-sm text-danger mb-1">
										Verification Rejected
									</p>
									<p className="text-sm text-danger mb-2">
										{kycStatus.rejection_reason || "Your verification was rejected. Please review your documents and try again."}
									</p>
									<button
										style={{
											background: "var(--c-accent, #9FE870)",
											color: "#fff",
											border: "1px solid rgba(0,0,0,0.05)",
											height: "32px",
											padding: "0 16px",
											borderRadius: "9999px",
											fontWeight: 600,
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Resubmit Documents
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Transaction Limits */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-primary/10 rounded-lg">
							<TrendingUp className="w-5 h-5 text-primary" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Transaction Limits
							</h2>
							<p className="text-sm text-muted-foreground">
								Your current transaction limits
							</p>
						</div>
					</div>

					<div className="space-y-6">
						{/* Daily Withdrawal */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<p className="font-medium text-foreground">
									Daily Withdrawal Limit
								</p>
								<p className="text-sm text-muted-foreground">
									{accountLimits.dailyWithdrawal.used.toLocaleString()}{" "}
									{accountLimits.dailyWithdrawal.currency} /{" "}
									{accountLimits.dailyWithdrawal.limit.toLocaleString()}{" "}
									{accountLimits.dailyWithdrawal.currency}
								</p>
							</div>
							<div className="w-full bg-[#F2F2F0] rounded-full h-2">
								<div
									className="bg-light-green h-2 rounded-full transition-all"
									style={{
										width: `${calculatePercentage(
											accountLimits.dailyWithdrawal.used,
											accountLimits.dailyWithdrawal.limit
										)}%`,
									}}
								/>
							</div>
						</div>

						{/* Monthly Withdrawal */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<p className="font-medium text-foreground">
									Monthly Withdrawal Limit
								</p>
								<p className="text-sm text-muted-foreground">
									{accountLimits.monthlyWithdrawal.used.toLocaleString()}{" "}
									{accountLimits.monthlyWithdrawal.currency} /{" "}
									{accountLimits.monthlyWithdrawal.limit.toLocaleString()}{" "}
									{accountLimits.monthlyWithdrawal.currency}
								</p>
							</div>
							<div className="w-full bg-[#F2F2F0] rounded-full h-2">
								<div
									className="bg-light-green h-2 rounded-full transition-all"
									style={{
										width: `${calculatePercentage(
											accountLimits.monthlyWithdrawal.used,
											accountLimits.monthlyWithdrawal.limit
										)}%`,
									}}
								/>
							</div>
						</div>

						{/* Daily Deposit */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<p className="font-medium text-foreground">Daily Deposit Limit</p>
								<p className="text-sm text-muted-foreground">
									{accountLimits.dailyDeposit.used.toLocaleString()}{" "}
									{accountLimits.dailyDeposit.currency} /{" "}
									{accountLimits.dailyDeposit.limit.toLocaleString()}{" "}
									{accountLimits.dailyDeposit.currency}
								</p>
							</div>
							<div className="w-full bg-[#F2F2F0] rounded-full h-2">
								<div
									className="bg-light-green h-2 rounded-full transition-all"
									style={{
										width: `${calculatePercentage(
											accountLimits.dailyDeposit.used,
											accountLimits.dailyDeposit.limit
										)}%`,
									}}
								/>
							</div>
						</div>
					</div>

					<div className="mt-4 bg-muted rounded-xl p-4">
						<p className="text-sm text-muted-foreground">
							Limits reset daily at 00:00 UTC. To increase your limits,
							complete identity verification or contact support.
						</p>
					</div>
				</div>

				{/* Export Transaction History */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Download className="w-5 h-5 text-primary" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Export Transaction History
							</h2>
							<p className="text-sm text-muted-foreground">
								Download your complete transaction history
							</p>
						</div>
					</div>

					<div className="bg-muted rounded-xl border border-border p-4 mb-4">
						<p className="text-sm text-muted-foreground">
							You can export your complete transaction history as a CSV file.
							The export will include all transactions from your account
							creation date to today. This file will be sent to your registered
							email address.
						</p>
					</div>

					<button
						onClick={handleExportHistory}
						disabled={isExporting}
						style={{
							background: "transparent",
							color: "var(--c-fg, inherit)",
							border: "1px solid var(--c-border, #e5e5e5)",
							height: "40px",
							padding: "0 24px",
							borderRadius: "9999px",
							fontWeight: 600,
							fontSize: "14px",
							cursor: isExporting ? "not-allowed" : "pointer",
							opacity: isExporting ? 0.5 : 1,
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<Download className="w-4 h-4" />
						{isExporting ? "Processing..." : "Export as CSV"}
					</button>
				</div>

				{/* Close Account */}
				<div className="bg-card rounded-2xl border border-danger p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-danger/10 rounded-lg">
							<XCircle className="w-5 h-5 text-danger" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Close Account
							</h2>
							<p className="text-sm text-muted-foreground">
								Permanently delete your Clusteer account
							</p>
						</div>
					</div>

					<div className="bg-danger/10 rounded-xl border border-danger p-4 mb-4">
						<p className="text-sm text-danger font-medium mb-2">
							Warning: This action cannot be undone
						</p>
						<ul className="text-sm text-danger space-y-1 list-disc list-inside">
							<li>All your data will be permanently deleted</li>
							<li>You will lose access to all funds in your account</li>
							<li>You cannot reuse this email or username</li>
							<li>Pending transactions must be completed first</li>
						</ul>
					</div>

					<button
						onClick={() => setShowCloseModal(true)}
						style={{
							background: "var(--c-danger, #ef4444)",
							color: "#fff",
							border: "none",
							height: "40px",
							padding: "0 24px",
							borderRadius: "9999px",
							fontWeight: 600,
							fontSize: "14px",
							cursor: "pointer",
						}}
					>
						Close My Account
					</button>
				</div>
			</div>

			{/* Close Account Modal */}
			{showCloseModal && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 50,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: "rgba(0,0,0,0.5)",
					}}
					onClick={() => setShowCloseModal(false)}
				>
					<div
						style={{
							background: "var(--c-surface, #fff)",
							borderRadius: "16px",
							padding: "24px",
							maxWidth: "480px",
							width: "90%",
							boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
							Are you absolutely sure?
						</h3>
						<p style={{ fontSize: "14px", color: "var(--c-muted, #6b7280)", marginBottom: "24px" }}>
							This action cannot be undone. This will permanently delete your
							account and remove all your data from our servers. Please
							ensure you have withdrawn all funds before proceeding.
						</p>
						<div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
							<button
								onClick={() => setShowCloseModal(false)}
								style={{
									background: "transparent",
									color: "var(--c-fg, inherit)",
									border: "1px solid var(--c-border, #e5e5e5)",
									height: "40px",
									padding: "0 16px",
									borderRadius: "8px",
									fontWeight: 500,
									fontSize: "14px",
									cursor: "pointer",
								}}
							>
								Cancel
							</button>
							<button
								onClick={handleCloseAccount}
								style={{
									background: "var(--c-danger, #ef4444)",
									color: "#fff",
									border: "none",
									height: "40px",
									padding: "0 16px",
									borderRadius: "8px",
									fontWeight: 500,
									fontSize: "14px",
									cursor: "pointer",
								}}
							>
								Yes, Close My Account
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
