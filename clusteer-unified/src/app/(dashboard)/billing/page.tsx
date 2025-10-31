"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/user";
import {
	CreditCard,
	Plus,
	MoreVertical,
	DollarSign,
	ArrowUpRight,
	ArrowDownLeft,
	Download,
	Calendar,
	XCircle,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - Set to empty arrays to show empty states, or use sample data
// TODO: Replace with actual API calls
const PAYMENT_METHODS: Array<{
	id: number;
	type: string;
	last4: string;
	brand: string;
	expiryMonth: number;
	expiryYear: number;
	isDefault: boolean;
}> = []; // Empty for demonstration - change to sample data as needed

const TRANSACTIONS: Array<{
	id: number;
	type: "deposit" | "withdrawal" | "fee";
	amount: number;
	currency: string;
	description: string;
	date: string;
	status: "completed" | "pending";
	method: string;
}> = []; // Empty for demonstration - change to sample data as needed

export default function BillingPage() {
	const router = useRouter();
	const user = useUser();
	const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
	const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
	const [cardDetails, setCardDetails] = useState({
		cardNumber: "",
		cardName: "",
		expiryDate: "",
		cvv: "",
	});
	const [isProcessing, setIsProcessing] = useState(false);

	const filteredTransactions = TRANSACTIONS.filter((transaction) => {
		if (filterStatus === "all") return true;
		return transaction.status === filterStatus;
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: currency,
		}).format(amount);
	};

	const formatCardNumber = (value: string) => {
		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		const matches = v.match(/\d{4,16}/g);
		const match = (matches && matches[0]) || "";
		const parts = [];

		for (let i = 0, len = match.length; i < len; i += 4) {
			parts.push(match.substring(i, i + 4));
		}

		if (parts.length) {
			return parts.join(" ");
		} else {
			return value;
		}
	};

	const formatExpiryDate = (value: string) => {
		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		if (v.length >= 2) {
			return v.slice(0, 2) + " / " + v.slice(2, 4);
		}
		return v;
	};

	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatCardNumber(e.target.value);
		if (formatted.replace(/\s/g, "").length <= 16) {
			setCardDetails({ ...cardDetails, cardNumber: formatted });
		}
	};

	const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatExpiryDate(e.target.value);
		if (formatted.replace(/\s|\//g, "").length <= 4) {
			setCardDetails({ ...cardDetails, expiryDate: formatted });
		}
	};

	const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/gi, "");
		if (value.length <= 4) {
			setCardDetails({ ...cardDetails, cvv: value });
		}
	};

	const handleAddCard = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsProcessing(true);

		// Simulate API call
		setTimeout(() => {
			setIsProcessing(false);
			setShowAddPaymentMethod(false);
			setCardDetails({
				cardNumber: "",
				cardName: "",
				expiryDate: "",
				cvv: "",
			});
			// Here you would call your payment provider API
			console.log("Card added:", cardDetails);
		}, 2000);
	};

	const handleExportTransactions = () => {
		// Export filtered transactions as CSV
		const csvContent = [
			["Transaction", "Type", "Amount", "Currency", "Method", "Date", "Status"],
			...filteredTransactions.map((t) => [
				t.description,
				t.type,
				t.amount.toString(),
				t.currency,
				t.method,
				t.date,
				t.status,
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const handleSetDefaultCard = (cardId: number) => {
		// TODO: Implement API call to set default card
		console.log("Setting card as default:", cardId);
		// This would update the PAYMENT_METHODS array
	};

	const handleEditCard = (cardId: number) => {
		// TODO: Implement edit card functionality
		console.log("Editing card:", cardId);
		// This could open a modal similar to add card
	};

	const handleRemoveCard = (cardId: number) => {
		// TODO: Implement API call to remove card
		if (confirm("Are you sure you want to remove this payment method?")) {
			console.log("Removing card:", cardId);
			// This would call API to remove the card
		}
	};

	return (
		<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[1200px]">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-[#181D27] font-semibold text-2xl mb-2">Billing</h1>
				<p className="text-[#667085] text-sm">
					Manage your payment methods and view transaction history
				</p>
			</div>

			{/* Payment Methods Section */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-[#0D0D0D]">Payment Methods</h2>
					<Button
						onClick={() => setShowAddPaymentMethod(true)}
						className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-10 px-4 rounded-full font-semibold"
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Payment Method
					</Button>
				</div>

				{PAYMENT_METHODS.length === 0 ? (
					/* Empty State for Payment Methods */
					<div className="bg-white border border-[#E9EAEB] rounded-xl p-12">
						<div className="max-w-md mx-auto text-center">
							<div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-4">
								<CreditCard className="w-8 h-8 text-[#667085]" />
							</div>
							<h3 className="font-semibold text-lg text-[#0D0D0D] mb-2">
								No payment methods yet
							</h3>
							<p className="text-sm text-[#667085] mb-6">
								Add a payment method to fund your wallet and make transactions faster and easier
							</p>
							<Button
								onClick={() => setShowAddPaymentMethod(true)}
								className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-11 px-6 rounded-full font-semibold"
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Your First Payment Method
							</Button>
							<div className="mt-6 flex items-center justify-center gap-4">
								<div className="flex items-center gap-2">
									<div className="w-10 h-6 bg-[#1434CB] rounded flex items-center justify-center text-white text-[10px] font-bold">
										VISA
									</div>
									<span className="text-xs text-[#667085]">Visa</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-10 h-6 bg-[#EB001B] rounded flex items-center justify-center">
										<div className="w-2 h-2 bg-white rounded-full"></div>
									</div>
									<span className="text-xs text-[#667085]">Mastercard</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-10 h-6 bg-[#0079C1] rounded flex items-center justify-center text-white text-[8px] font-bold">
										AMEX
									</div>
									<span className="text-xs text-[#667085]">Amex</span>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{PAYMENT_METHODS.map((method) => (
							<div
								key={method.id}
								className="bg-white border border-[#E9EAEB] rounded-xl p-6 relative"
							>
								{method.isDefault && (
									<Badge className="absolute top-4 right-4 bg-[#E7F6EC] text-[#0D4222] border-[#0D4222]/10">
										Default
									</Badge>
								)}
								<div className="flex items-start gap-3 mb-4">
									<div className="w-12 h-12 bg-[#F9FAFB] rounded-lg flex items-center justify-center">
										<CreditCard className="w-6 h-6 text-[#667085]" />
									</div>
									<div className="flex-1">
										<p className="font-semibold text-[#0D0D0D]">{method.brand}</p>
										<p className="text-sm text-[#667085]">•••• •••• •••• {method.last4}</p>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<p className="text-xs text-[#667085]">
										Expires {method.expiryMonth}/{method.expiryYear}
									</p>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
											>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											{!method.isDefault && (
												<DropdownMenuItem onClick={() => handleSetDefaultCard(method.id)}>
													Set as Default
												</DropdownMenuItem>
											)}
											<DropdownMenuItem onClick={() => handleEditCard(method.id)}>
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-red-600"
												onClick={() => handleRemoveCard(method.id)}
											>
												Remove
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))}

						{/* Add Payment Method Placeholder */}
						<button
							onClick={() => setShowAddPaymentMethod(true)}
							className="bg-white border-2 border-dashed border-[#E9EAEB] rounded-xl p-6 flex flex-col items-center justify-center min-h-[160px] hover:border-[#11C211] hover:bg-[#F9FAFB] transition-colors"
						>
							<div className="w-12 h-12 bg-[#F9FAFB] rounded-lg flex items-center justify-center mb-3">
								<Plus className="w-6 h-6 text-[#667085]" />
							</div>
							<p className="font-semibold text-[#0D0D0D]">Add Payment Method</p>
							<p className="text-sm text-[#667085]">Card, Bank Account</p>
						</button>
					</div>
				)}
			</div>

			{/* Transaction History Section */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-[#0D0D0D]">Transaction History</h2>
					{TRANSACTIONS.length > 0 && (
						<div className="flex items-center gap-2">
							<select
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value as any)}
								className="px-4 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:ring-2 focus:ring-[#11C211] focus:border-transparent"
							>
								<option value="all">All Transactions</option>
								<option value="completed">Completed</option>
								<option value="pending">Pending</option>
							</select>
							<Button
								onClick={handleExportTransactions}
								variant="outline"
								className="border-[#D5D7DA] h-10 px-4 rounded-lg font-semibold"
							>
								<Download className="w-4 h-4 mr-2" />
								Export
							</Button>
						</div>
					)}
				</div>

				{TRANSACTIONS.length === 0 ? (
					/* Empty State for Transactions */
					<div className="bg-white border border-[#E9EAEB] rounded-xl p-12">
						<div className="max-w-md mx-auto text-center">
							<div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-4">
								<DollarSign className="w-8 h-8 text-[#667085]" />
							</div>
							<h3 className="font-semibold text-lg text-[#0D0D0D] mb-2">
								No transactions yet
							</h3>
							<p className="text-sm text-[#667085] mb-6">
								Your billing transactions will appear here. Start by funding your wallet or making your first trade.
							</p>
							<div className="flex flex-col sm:flex-row gap-3 justify-center">
								<Button
									onClick={() => router.push('/assets')}
									className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-11 px-6 rounded-full font-semibold"
								>
									Fund Wallet
								</Button>
								<Button
									onClick={() => router.push('/trade')}
									variant="outline"
									className="border-[#D5D7DA] h-11 px-6 rounded-full font-semibold"
								>
									Start Trading
								</Button>
							</div>
							<div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-[#E9EAEB]">
								<div className="text-center">
									<div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
										<ArrowDownLeft className="w-6 h-6 text-green-600" />
									</div>
									<p className="text-xs text-[#667085]">Deposits</p>
								</div>
								<div className="text-center">
									<div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
										<ArrowUpRight className="w-6 h-6 text-orange-600" />
									</div>
									<p className="text-xs text-[#667085]">Withdrawals</p>
								</div>
								<div className="text-center">
									<div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-2">
										<DollarSign className="w-6 h-6 text-gray-600" />
									</div>
									<p className="text-xs text-[#667085]">Fees</p>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="bg-white border border-[#E9EAEB] rounded-xl overflow-hidden">
						{filteredTransactions.length === 0 ? (
							/* Empty State for Filtered Transactions */
							<div className="py-12 text-center">
								<DollarSign className="w-12 h-12 mx-auto text-[#667085] mb-4" />
								<h3 className="font-semibold text-lg text-[#0D0D0D] mb-2">
									No {filterStatus} transactions found
								</h3>
								<p className="text-sm text-[#667085] mb-4">
									Try selecting a different filter or check back later
								</p>
								<Button
									onClick={() => setFilterStatus("all")}
									variant="outline"
									className="border-[#D5D7DA] h-10 px-6 rounded-full font-semibold"
								>
									View All Transactions
								</Button>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-[#F9FAFB] border-b border-[#E9EAEB]">
										<tr>
											<th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
												Transaction
											</th>
											<th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
												Amount
											</th>
											<th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
												Method
											</th>
											<th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
												Date
											</th>
											<th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-[#E9EAEB]">
										{filteredTransactions.map((transaction) => (
											<tr key={transaction.id} className="hover:bg-[#F9FAFB] transition-colors">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
															transaction.type === "deposit"
																? "bg-green-50"
																: transaction.type === "withdrawal"
																? "bg-orange-50"
																: "bg-gray-50"
														}`}>
															{transaction.type === "deposit" ? (
																<ArrowDownLeft className="w-5 h-5 text-green-600" />
															) : transaction.type === "withdrawal" ? (
																<ArrowUpRight className="w-5 h-5 text-orange-600" />
															) : (
																<DollarSign className="w-5 h-5 text-gray-600" />
															)}
														</div>
														<div>
															<p className="font-medium text-[#0D0D0D]">{transaction.description}</p>
															<p className="text-sm text-[#667085] capitalize">{transaction.type}</p>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<p className={`font-semibold ${
														transaction.type === "deposit"
															? "text-green-600"
															: transaction.type === "withdrawal"
															? "text-orange-600"
															: "text-gray-600"
													}`}>
														{transaction.type === "deposit" ? "+" : "-"}
														{formatCurrency(transaction.amount, transaction.currency)}
													</p>
												</td>
												<td className="px-6 py-4">
													<p className="text-sm text-[#667085]">{transaction.method}</p>
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center gap-2">
														<Calendar className="w-4 h-4 text-[#667085]" />
														<p className="text-sm text-[#667085]">{formatDate(transaction.date)}</p>
													</div>
												</td>
												<td className="px-6 py-4">
													<Badge
														className={`${
															transaction.status === "completed"
																? "bg-green-100 text-green-800 border-green-200"
																: "bg-orange-100 text-orange-800 border-orange-200"
														}`}
													>
														{transaction.status}
													</Badge>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Add Payment Method Modal */}
			{showAddPaymentMethod && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-6">
							<h3 className="font-semibold text-xl text-[#0D0D0D]">Add Payment Method</h3>
							<button
								onClick={() => {
									setShowAddPaymentMethod(false);
									setCardDetails({
										cardNumber: "",
										cardName: "",
										expiryDate: "",
										cvv: "",
									});
								}}
								className="text-[#667085] hover:text-[#0D0D0D]"
							>
								<XCircle className="w-6 h-6" />
							</button>
						</div>

						{/* Card Preview */}
						<div className="mb-6 bg-gradient-to-br from-[#0D4222] to-[#11C211] rounded-xl p-6 text-white relative overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
							<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
							<div className="relative z-10">
								<div className="flex justify-between items-start mb-8">
									<div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></div>
									<span className="text-xs opacity-80">DEBIT</span>
								</div>
								<div className="mb-6">
									<p className="text-xl tracking-wider font-mono">
										{cardDetails.cardNumber || "•••• •••• •••• ••••"}
									</p>
								</div>
								<div className="flex justify-between items-end">
									<div>
										<p className="text-xs opacity-80 mb-1">CARD HOLDER</p>
										<p className="font-semibold">
											{cardDetails.cardName || "YOUR NAME"}
										</p>
									</div>
									<div>
										<p className="text-xs opacity-80 mb-1">EXPIRES</p>
										<p className="font-semibold">
											{cardDetails.expiryDate || "MM / YY"}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Card Form */}
						<form onSubmit={handleAddCard} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-[#0D0D0D] mb-2">
									Card Number *
								</label>
								<input
									type="text"
									value={cardDetails.cardNumber}
									onChange={handleCardNumberChange}
									placeholder="1234 5678 9012 3456"
									className="w-full px-4 py-3 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent font-mono"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-[#0D0D0D] mb-2">
									Cardholder Name *
								</label>
								<input
									type="text"
									value={cardDetails.cardName}
									onChange={(e) =>
										setCardDetails({ ...cardDetails, cardName: e.target.value.toUpperCase() })
									}
									placeholder="JOHN DOE"
									className="w-full px-4 py-3 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent uppercase"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-[#0D0D0D] mb-2">
										Expiry Date *
									</label>
									<input
										type="text"
										value={cardDetails.expiryDate}
										onChange={handleExpiryDateChange}
										placeholder="MM / YY"
										className="w-full px-4 py-3 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent font-mono"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-[#0D0D0D] mb-2">
										CVV *
									</label>
									<input
										type="text"
										value={cardDetails.cvv}
										onChange={handleCvvChange}
										placeholder="123"
										className="w-full px-4 py-3 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent font-mono"
										required
									/>
								</div>
							</div>

							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-xs text-[#667085]">
									🔒 Your card information is encrypted and secure. We use industry-standard security measures to protect your data.
								</p>
							</div>

							<div className="flex gap-3 pt-4">
								<Button
									type="button"
									onClick={() => {
										setShowAddPaymentMethod(false);
										setCardDetails({
											cardNumber: "",
											cardName: "",
											expiryDate: "",
											cvv: "",
										});
									}}
									variant="outline"
									className="flex-1 border-[#D5D7DA] h-11 rounded-full font-semibold"
									disabled={isProcessing}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isProcessing}
									className="flex-1 gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-11 rounded-full font-semibold"
								>
									{isProcessing ? "Processing..." : "Add Card"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
