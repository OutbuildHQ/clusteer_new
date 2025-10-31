"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreditCard, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/store/user";
import { Toast } from "@/components/toast";
import {
	getBankAccounts,
	createBankAccount,
	updateBankAccount,
	deleteBankAccount,
	type BankAccount as APIBankAccount,
} from "@/lib/api/settings";

interface BankAccount {
	id: number;
	bankName: string;
	accountNumber: string;
	accountName: string;
	isDefault: boolean;
	isVerified: boolean;
}

export default function Page() {
	const user = useUser();
	const [accounts, setAccounts] = useState<BankAccount[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [newAccount, setNewAccount] = useState({
		bankName: "",
		accountNumber: "",
		accountName: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

	useEffect(() => {
		const fetchAccounts = async () => {
			if (!user?.id) return;

			try {
				const data = await getBankAccounts(user.id);
				setAccounts(
					data.map((acc: APIBankAccount) => ({
						id: acc.id,
						bankName: acc.bank_name,
						accountNumber: acc.account_number,
						accountName: acc.account_name,
						isDefault: acc.is_default,
						isVerified: acc.is_verified,
					}))
				);
			} catch (error) {
				Toast.error("Failed to load bank accounts");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAccounts();
	}, [user?.id]);

	const handleAddAccount = async () => {
		if (!user?.id) return;

		if (
			!newAccount.bankName ||
			!newAccount.accountNumber ||
			!newAccount.accountName
		) {
			Toast.error("Please fill in all fields");
			return;
		}

		if (newAccount.accountNumber.length !== 10) {
			Toast.error("Account number must be 10 digits");
			return;
		}

		setIsSubmitting(true);
		try {
			const created = await createBankAccount(user.id, {
				bank_name: newAccount.bankName,
				account_number: newAccount.accountNumber,
				account_name: newAccount.accountName,
			});

			setAccounts([
				...accounts,
				{
					id: created.data.id,
					bankName: created.data.bank_name,
					accountNumber: created.data.account_number,
					accountName: created.data.account_name,
					isDefault: created.data.is_default,
					isVerified: created.data.is_verified,
				},
			]);

			setNewAccount({ bankName: "", accountNumber: "", accountName: "" });
			setShowAddForm(false);
			Toast.success("Bank account added successfully");
		} catch (error) {
			Toast.error("Failed to add bank account");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSetDefault = async (id: number) => {
		if (!user?.id) return;

		try {
			await updateBankAccount(user.id, id, { is_default: true });
			setAccounts((prev) =>
				prev.map((account) => ({
					...account,
					isDefault: account.id === id,
				}))
			);
			Toast.success("Default account updated");
		} catch (error) {
			Toast.error("Failed to update default account");
		}
	};

	const openDeleteDialog = (id: number) => {
		const account = accounts.find((a) => a.id === id);
		if (account?.isDefault) {
			Toast.error("Cannot delete default account. Set another as default first.");
			return;
		}
		setAccountToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!user?.id || accountToDelete === null) return;

		try {
			await deleteBankAccount(user.id, accountToDelete);
			setAccounts((prev) => prev.filter((account) => account.id !== accountToDelete));
			setDeleteDialogOpen(false);
			setAccountToDelete(null);
			Toast.success("Bank account deleted successfully");
		} catch (error) {
			Toast.error("Failed to delete bank account");
		}
	};

	if (isLoading) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="text-[#181D27] font-semibold text-xl lg:text-2xl">
						Payment Methods
					</h1>
					<p className="text-sm lg:text-base text-[#667085] mt-2">
						Loading your payment methods...
					</p>
				</header>
			</section>
		);
	}

	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<header className="mb-6">
				<h1 className="text-[#181D27] font-semibold text-xl lg:text-2xl">
					Payment Methods
				</h1>
				<p className="text-sm lg:text-base text-[#667085] mt-2">
					Manage your bank accounts for deposits and withdrawals
				</p>
			</header>

			<div className="space-y-6">
				{/* Add New Account Button/Form */}
				{!showAddForm ? (
					<Button
						variant="outline"
						onClick={() => setShowAddForm(true)}
						className="w-full lg:w-auto border-dashed border-2 border-[#D5D7DA] hover:border-[#9FE870] h-auto py-4 px-6 rounded-xl"
						disabled={accounts.length >= 5}
					>
						<Plus className="w-5 h-5 mr-2" />
						Add Bank Account {accounts.length >= 5 && "(Maximum reached)"}
					</Button>
				) : (
					<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6">
						<h3 className="font-semibold text-lg text-[#0D0D0D] mb-4">
							Add New Bank Account
						</h3>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-[#0D0D0D] mb-2 block">
									Bank Name
								</label>
								<input
									type="text"
									value={newAccount.bankName}
									onChange={(e) =>
										setNewAccount({ ...newAccount, bankName: e.target.value })
									}
									className="w-full px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
									placeholder="e.g., GTBank"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-[#0D0D0D] mb-2 block">
									Account Number
								</label>
								<input
									type="text"
									value={newAccount.accountNumber}
									onChange={(e) =>
										setNewAccount({
											...newAccount,
											accountNumber: e.target.value,
										})
									}
									maxLength={10}
									className="w-full px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
									placeholder="0123456789"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-[#0D0D0D] mb-2 block">
									Account Name
								</label>
								<input
									type="text"
									value={newAccount.accountName}
									onChange={(e) =>
										setNewAccount({
											...newAccount,
											accountName: e.target.value,
										})
									}
									className="w-full px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
									placeholder="John Doe"
								/>
							</div>
							<div className="flex gap-3">
								<Button
									onClick={handleAddAccount}
									disabled={isSubmitting}
									className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-10 px-6 rounded-full font-semibold"
								>
									{isSubmitting ? "Adding..." : "Add Account"}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										setShowAddForm(false);
										setNewAccount({
											bankName: "",
											accountNumber: "",
											accountName: "",
										});
									}}
									className="h-10 px-6 rounded-full"
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				)}

				{/* Bank Accounts List */}
				<div className="space-y-4">
					{accounts.map((account) => (
						<div
							key={account.id}
							className="bg-white rounded-2xl border border-[#E9EAEB] p-5 lg:p-6"
						>
							<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
								<div className="flex items-start gap-4">
									<div className="p-3 bg-[#E7F6EC] rounded-lg">
										<CreditCard className="w-6 h-6 text-[#0D4222]" />
									</div>
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-semibold text-lg text-[#0D0D0D]">
												{account.bankName}
											</h3>
											{account.isDefault && (
												<Badge
													variant="secondary"
													className="rounded-full h-6 py-1 text-[#0D4222] bg-[#E7F6EC]"
												>
													Default
												</Badge>
											)}
											{account.isVerified && (
												<CheckCircle2 className="w-4 h-4 text-green-600" />
											)}
										</div>
										<p className="text-sm text-[#667085] mb-1">
											{account.accountNumber}
										</p>
										<p className="text-sm font-medium text-[#0D0D0D]">
											{account.accountName}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									{!account.isDefault && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleSetDefault(account.id)}
											className="text-sm font-medium h-9 px-4 rounded-full"
										>
											Set as default
										</Button>
									)}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => openDeleteDialog(account.id)}
										className="text-destructive hover:text-destructive hover:bg-red-50 h-9 w-9 p-0 rounded-full"
										disabled={account.isDefault}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{accounts.length === 0 && (
					<div className="bg-white rounded-2xl border border-[#E9EAEB] p-12 text-center">
						<div className="w-16 h-16 mx-auto bg-pale-green rounded-full flex items-center justify-center mb-4">
							<CreditCard className="w-8 h-8 text-dark-green" />
						</div>
						<h3 className="font-semibold text-lg text-[#0D0D0D] mb-2">
							No payment methods added
						</h3>
						<p className="text-sm text-[#667085] mb-6">
							Add a bank account to start making deposits and withdrawals
						</p>
						<Button className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-10 px-6 rounded-full font-semibold">
							<Plus className="w-4 h-4 mr-2" />
							Add Your First Bank Account
						</Button>
					</div>
				)}

				{/* Info Card */}
				<div className="bg-[#F9FAFB] rounded-2xl border border-[#E9EAEB] p-5">
					<h3 className="font-semibold text-base text-[#0D0D0D] mb-3">
						Important Information
					</h3>
					<ul className="space-y-2 text-sm text-[#667085]">
						<li className="flex items-start gap-2">
							<span className="text-[#9FE870] mt-1">•</span>
							<span>
								Your bank account name must match your verified identity on
								Clusteer
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-[#9FE870] mt-1">•</span>
							<span>
								Withdrawals can only be made to verified bank accounts
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-[#9FE870] mt-1">•</span>
							<span>
								Changing your default payment method will take effect
								immediately
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-[#9FE870] mt-1">•</span>
							<span>
								You can add up to 5 bank accounts to your Clusteer profile
							</span>
						</li>
					</ul>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this bank account? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => {
							setDeleteDialogOpen(false);
							setAccountToDelete(null);
						}}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</section>
	);
}
