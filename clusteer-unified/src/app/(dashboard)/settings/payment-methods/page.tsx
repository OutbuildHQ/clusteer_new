"use client";

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
	const [showDeleteModal, setShowDeleteModal] = useState(false);
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
		setShowDeleteModal(true);
	};

	const handleDelete = async () => {
		if (!user?.id || accountToDelete === null) return;

		try {
			await deleteBankAccount(user.id, accountToDelete);
			setAccounts((prev) => prev.filter((account) => account.id !== accountToDelete));
			setShowDeleteModal(false);
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
					<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
						Payment Methods
					</h1>
					<p className="text-sm lg:text-base text-muted-foreground mt-2">
						Loading your payment methods...
					</p>
				</header>
			</section>
		);
	}

	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<header className="mb-6">
				<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
					Payment Methods
				</h1>
				<p className="text-sm lg:text-base text-muted-foreground mt-2">
					Manage your bank accounts for deposits and withdrawals
				</p>
			</header>

			<div className="space-y-6">
				{/* Add New Account Button/Form */}
				{!showAddForm ? (
					<button
						onClick={() => setShowAddForm(true)}
						disabled={accounts.length >= 5}
						style={{
							background: "transparent",
							color: "var(--c-fg, inherit)",
							border: "2px dashed var(--c-border, #e5e5e5)",
							height: "auto",
							padding: "16px 24px",
							borderRadius: "12px",
							fontWeight: 500,
							fontSize: "14px",
							cursor: accounts.length >= 5 ? "not-allowed" : "pointer",
							opacity: accounts.length >= 5 ? 0.5 : 1,
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<Plus className="w-5 h-5" />
						Add Bank Account {accounts.length >= 5 && "(Maximum reached)"}
					</button>
				) : (
					<div className="bg-card rounded-2xl border border-border p-6">
						<h3 className="font-semibold text-lg text-foreground mb-4">
							Add New Bank Account
						</h3>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">
									Bank Name
								</label>
								<input
									type="text"
									value={newAccount.bankName}
									onChange={(e) =>
										setNewAccount({ ...newAccount, bankName: e.target.value })
									}
									className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
									placeholder="e.g., GTBank"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">
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
									className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
									placeholder="0123456789"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">
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
									className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
									placeholder="John Doe"
								/>
							</div>
							<div className="flex gap-3">
								<button
									onClick={handleAddAccount}
									disabled={isSubmitting}
									style={{
										background: "var(--c-accent, #9FE870)",
										color: "#fff",
										border: "1px solid rgba(0,0,0,0.05)",
										height: "40px",
										padding: "0 24px",
										borderRadius: "9999px",
										fontWeight: 600,
										fontSize: "14px",
										cursor: isSubmitting ? "not-allowed" : "pointer",
										opacity: isSubmitting ? 0.5 : 1,
									}}
								>
									{isSubmitting ? "Adding..." : "Add Account"}
								</button>
								<button
									onClick={() => {
										setShowAddForm(false);
										setNewAccount({
											bankName: "",
											accountNumber: "",
											accountName: "",
										});
									}}
									style={{
										background: "transparent",
										color: "var(--c-fg, inherit)",
										border: "1px solid var(--c-border, #e5e5e5)",
										height: "40px",
										padding: "0 24px",
										borderRadius: "9999px",
										fontWeight: 500,
										fontSize: "14px",
										cursor: "pointer",
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Bank Accounts List */}
				<div className="space-y-4">
					{accounts.map((account) => (
						<div
							key={account.id}
							className="bg-card rounded-2xl border border-border p-5 lg:p-6"
						>
							<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
								<div className="flex items-start gap-4">
									<div className="p-3 bg-primary/10 rounded-lg">
										<CreditCard className="w-6 h-6 text-primary" />
									</div>
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-semibold text-lg text-foreground">
												{account.bankName}
											</h3>
											{account.isDefault && (
												<span
													style={{
														display: "inline-flex",
														alignItems: "center",
														borderRadius: "9999px",
														height: "24px",
														padding: "0 10px",
														fontSize: "12px",
														fontWeight: 500,
														color: "var(--c-accent, #9FE870)",
														background: "rgba(159,232,112,0.1)",
													}}
												>
													Default
												</span>
											)}
											{account.isVerified && (
												<CheckCircle2 className="w-4 h-4 text-success" />
											)}
										</div>
										<p className="text-sm text-muted-foreground mb-1">
											{account.accountNumber}
										</p>
										<p className="text-sm font-medium text-foreground">
											{account.accountName}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									{!account.isDefault && (
										<button
											onClick={() => handleSetDefault(account.id)}
											style={{
												background: "transparent",
												color: "var(--c-fg, inherit)",
												border: "1px solid var(--c-border, #e5e5e5)",
												height: "36px",
												padding: "0 16px",
												borderRadius: "9999px",
												fontWeight: 500,
												fontSize: "14px",
												cursor: "pointer",
											}}
										>
											Set as default
										</button>
									)}
									<button
										onClick={() => openDeleteDialog(account.id)}
										disabled={account.isDefault}
										style={{
											background: "transparent",
											color: "var(--c-danger, #ef4444)",
											border: "none",
											height: "36px",
											width: "36px",
											padding: 0,
											borderRadius: "9999px",
											cursor: account.isDefault ? "not-allowed" : "pointer",
											opacity: account.isDefault ? 0.5 : 1,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{accounts.length === 0 && (
					<div className="bg-card rounded-2xl border border-border p-12 text-center">
						<div className="w-16 h-16 mx-auto bg-pale-green rounded-full flex items-center justify-center mb-4">
							<CreditCard className="w-8 h-8 text-primary" />
						</div>
						<h3 className="font-semibold text-lg text-foreground mb-2">
							No payment methods added
						</h3>
						<p className="text-sm text-muted-foreground mb-6">
							Add a bank account to start making deposits and withdrawals
						</p>
						<button
							style={{
								background: "var(--c-accent, #9FE870)",
								color: "#fff",
								border: "1px solid rgba(0,0,0,0.05)",
								height: "40px",
								padding: "0 24px",
								borderRadius: "9999px",
								fontWeight: 600,
								fontSize: "14px",
								cursor: "pointer",
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
							}}
						>
							<Plus className="w-4 h-4" />
							Add Your First Bank Account
						</button>
					</div>
				)}

				{/* Info Card */}
				<div className="bg-muted rounded-2xl border border-border p-5">
					<h3 className="font-semibold text-base text-foreground mb-3">
						Important Information
					</h3>
					<ul className="space-y-2 text-sm text-muted-foreground">
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

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
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
					onClick={() => {
						setShowDeleteModal(false);
						setAccountToDelete(null);
					}}
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
							Delete Bank Account
						</h3>
						<p style={{ fontSize: "14px", color: "var(--c-muted, #6b7280)", marginBottom: "24px" }}>
							Are you sure you want to delete this bank account? This action cannot be undone.
						</p>
						<div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
							<button
								onClick={() => {
									setShowDeleteModal(false);
									setAccountToDelete(null);
								}}
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
								onClick={handleDelete}
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
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
