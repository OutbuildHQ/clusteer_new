"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
						used: parseFloat(limitsData.daily_withdrawal_used),
						limit: parseFloat(limitsData.daily_withdrawal_limit),
						currency: limitsData.limit_currency,
					},
					monthlyWithdrawal: {
						used: parseFloat(limitsData.monthly_withdrawal_used),
						limit: parseFloat(limitsData.monthly_withdrawal_limit),
						currency: limitsData.limit_currency,
					},
					dailyDeposit: {
						used: parseFloat(limitsData.daily_deposit_used),
						limit: parseFloat(limitsData.daily_deposit_limit),
						currency: limitsData.limit_currency,
					},
					monthlyDeposit: {
						used: parseFloat(limitsData.monthly_deposit_used),
						limit: parseFloat(limitsData.monthly_deposit_limit),
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
					<h1 className="text-[#181D27] font-semibold text-xl lg:text-2xl">
						Account Management
					</h1>
					<p className="text-sm lg:text-base text-[#667085] mt-2">
						Loading your account information...
					</p>
				</header>
			</section>
		);
	}

	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<header className="mb-6">
				<h1 className="text-[#181D27] font-semibold text-xl lg:text-2xl">
					Account Management
				</h1>
				<p className="text-sm lg:text-base text-[#667085] mt-2">
					View transaction limits, export history, and manage your account
				</p>
			</header>

			<div className="space-y-6">
				{/* Account Status */}
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-semibold text-lg text-[#0D0D0D]">
							Account Status
						</h2>
						<Badge
							variant="secondary"
							className={`rounded-full h-7 py-1 ${
								kycStatus?.status === "approved"
									? "text-green-700 bg-green-100"
									: kycStatus?.status === "pending" || kycStatus?.status === "under_review"
									? "text-blue-700 bg-blue-100"
									: kycStatus?.status === "rejected"
									? "text-red-700 bg-red-100"
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
						</Badge>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="bg-[#F9FAFB] rounded-xl p-4">
							<p className="text-sm text-[#667085] mb-1">Account Type</p>
							<p className="font-semibold text-lg text-[#0D0D0D]">
								{kycStatus?.status === "approved" ? "Verified Individual" : "Basic"}
							</p>
						</div>
						<div className="bg-[#F9FAFB] rounded-xl p-4">
							<p className="text-sm text-[#667085] mb-1">Member Since</p>
							<p className="font-semibold text-lg text-[#0D0D0D]">
								{user?.user?.dateJoined
									? new Date(user.user.dateJoined).toLocaleDateString("en-US", {
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
									<Button
										size="sm"
										className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-8 px-4 rounded-full font-semibold"
									>
										Verify Now
									</Button>
								</div>
							</div>
						</div>
					)}

					{(kycStatus?.status === "pending" || kycStatus?.status === "under_review") && (
						<div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
								<div className="flex-1">
									<p className="font-medium text-sm text-blue-900 mb-1">
										Verification {kycStatus.status === "pending" ? "Pending" : "Under Review"}
									</p>
									<p className="text-sm text-blue-700">
										Your verification documents have been submitted and are currently being reviewed by our team.
										This typically takes 24-48 hours. We'll notify you once the review is complete.
									</p>
									{kycStatus.submitted_at && (
										<p className="text-xs text-blue-600 mt-2">
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
						<div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<XCircle className="w-5 h-5 text-red-600 mt-0.5" />
								<div className="flex-1">
									<p className="font-medium text-sm text-red-900 mb-1">
										Verification Rejected
									</p>
									<p className="text-sm text-red-700 mb-2">
										{kycStatus.rejection_reason || "Your verification was rejected. Please review your documents and try again."}
									</p>
									<Button
										size="sm"
										className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-8 px-4 rounded-full font-semibold"
									>
										Resubmit Documents
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Transaction Limits */}
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[#E7F6EC] rounded-lg">
							<TrendingUp className="w-5 h-5 text-[#0D4222]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-[#0D0D0D]">
								Transaction Limits
							</h2>
							<p className="text-sm text-[#667085]">
								Your current transaction limits
							</p>
						</div>
					</div>

					<div className="space-y-6">
						{/* Daily Withdrawal */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<p className="font-medium text-[#0D0D0D]">
									Daily Withdrawal Limit
								</p>
								<p className="text-sm text-[#667085]">
									{accountLimits.dailyWithdrawal.used.toLocaleString()}{" "}
									{accountLimits.dailyWithdrawal.currency} /{" "}
									{accountLimits.dailyWithdrawal.limit.toLocaleString()}{" "}
									{accountLimits.dailyWithdrawal.currency}
								</p>
							</div>
							<div className="w-full bg-[#F2F2F0] rounded-full h-2">
								<div
									className="bg-[#9FE870] h-2 rounded-full transition-all"
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
								<p className="font-medium text-[#0D0D0D]">
									Monthly Withdrawal Limit
								</p>
								<p className="text-sm text-[#667085]">
									{accountLimits.monthlyWithdrawal.used.toLocaleString()}{" "}
									{accountLimits.monthlyWithdrawal.currency} /{" "}
									{accountLimits.monthlyWithdrawal.limit.toLocaleString()}{" "}
									{accountLimits.monthlyWithdrawal.currency}
								</p>
							</div>
							<div className="w-full bg-[#F2F2F0] rounded-full h-2">
								<div
									className="bg-[#9FE870] h-2 rounded-full transition-all"
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
								<p className="font-medium text-[#0D0D0D]">Daily Deposit Limit</p>
								<p className="text-sm text-[#667085]">
									{accountLimits.dailyDeposit.used.toLocaleString()}{" "}
									{accountLimits.dailyDeposit.currency} /{" "}
									{accountLimits.dailyDeposit.limit.toLocaleString()}{" "}
									{accountLimits.dailyDeposit.currency}
								</p>
							</div>
							<div className="w-full bg-[#F2F2F0] rounded-full h-2">
								<div
									className="bg-[#9FE870] h-2 rounded-full transition-all"
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

					<div className="mt-4 bg-[#F9FAFB] rounded-xl p-4">
						<p className="text-sm text-[#667085]">
							Limits reset daily at 00:00 UTC. To increase your limits,
							complete identity verification or contact support.
						</p>
					</div>
				</div>

				{/* Export Transaction History */}
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-[#E7F6EC] rounded-lg">
							<Download className="w-5 h-5 text-[#0D4222]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-[#0D0D0D]">
								Export Transaction History
							</h2>
							<p className="text-sm text-[#667085]">
								Download your complete transaction history
							</p>
						</div>
					</div>

					<div className="bg-[#F9FAFB] rounded-xl border border-[#E9EAEB] p-4 mb-4">
						<p className="text-sm text-[#667085]">
							You can export your complete transaction history as a CSV file.
							The export will include all transactions from your account
							creation date to today. This file will be sent to your registered
							email address.
						</p>
					</div>

					<Button
						onClick={handleExportHistory}
						disabled={isExporting}
						variant="outline"
						className="w-full lg:w-auto border-[#D5D7DA] h-10 px-6 rounded-full font-semibold"
					>
						<Download className="w-4 h-4 mr-2" />
						{isExporting ? "Processing..." : "Export as CSV"}
					</Button>
				</div>

				{/* Close Account */}
				<div className="bg-white rounded-2xl border border-red-200 p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-red-50 rounded-lg">
							<XCircle className="w-5 h-5 text-red-600" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-[#0D0D0D]">
								Close Account
							</h2>
							<p className="text-sm text-[#667085]">
								Permanently delete your Clusteer account
							</p>
						</div>
					</div>

					<div className="bg-red-50 rounded-xl border border-red-200 p-4 mb-4">
						<p className="text-sm text-red-900 font-medium mb-2">
							Warning: This action cannot be undone
						</p>
						<ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
							<li>All your data will be permanently deleted</li>
							<li>You will lose access to all funds in your account</li>
							<li>You cannot reuse this email or username</li>
							<li>Pending transactions must be completed first</li>
						</ul>
					</div>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="destructive"
								className="w-full lg:w-auto h-10 px-6 rounded-full font-semibold"
							>
								Close My Account
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your
									account and remove all your data from our servers. Please
									ensure you have withdrawn all funds before proceeding.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleCloseAccount}
									className="bg-red-600 hover:bg-red-700"
								>
									Yes, Close My Account
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</section>
	);
}
