"use client";

import { CreditCard, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserId } from "@/hooks/use-user-id";
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

function mapApiToLocal(acc: APIBankAccount): BankAccount {
	return {
		id: acc.id,
		bankName: acc.bank_name,
		accountNumber: acc.account_number,
		accountName: acc.account_name,
		isDefault: acc.is_default,
		isVerified: acc.is_verified,
	};
}

export default function Page() {
	const userId = useUserId();
	const queryClient = useQueryClient();

	const { data: accounts = [], isLoading, isError } = useQuery({
		queryKey: ["bank-accounts", userId],
		queryFn: async () => {
			const data = await getBankAccounts(userId!);
			return data.map(mapApiToLocal);
		},
		enabled: !!userId,
	});

	const [showAddForm, setShowAddForm] = useState(false);
	const [newAccount, setNewAccount] = useState({
		bankName: "",
		accountNumber: "",
		accountName: "",
	});
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

	const addMutation = useMutation({
		mutationFn: (data: { bank_name: string; account_number: string; account_name: string }) =>
			createBankAccount(userId!, data),
		onSuccess: () => {
			toast.success("Bank account added successfully");
			setNewAccount({ bankName: "", accountNumber: "", accountName: "" });
			setShowAddForm(false);
			queryClient.invalidateQueries({ queryKey: ["bank-accounts", userId] });
		},
		onError: () => {
			toast.error("Failed to add bank account");
		},
	});

	const setDefaultMutation = useMutation({
		mutationFn: (accountId: number) => updateBankAccount(userId!, accountId, { is_default: true }),
		onSuccess: () => {
			toast.success("Default account updated");
			queryClient.invalidateQueries({ queryKey: ["bank-accounts", userId] });
		},
		onError: () => {
			toast.error("Failed to update default account");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (accountId: number) => deleteBankAccount(userId!, accountId),
		onSuccess: () => {
			toast.success("Bank account deleted successfully");
			setShowDeleteModal(false);
			setAccountToDelete(null);
			queryClient.invalidateQueries({ queryKey: ["bank-accounts", userId] });
		},
		onError: () => {
			toast.error("Failed to delete bank account");
		},
	});

	const handleAddAccount = () => {
		if (!userId) return;

		if (
			!newAccount.bankName ||
			!newAccount.accountNumber ||
			!newAccount.accountName
		) {
			toast.error("Please fill in all fields");
			return;
		}

		if (newAccount.accountNumber.length !== 10) {
			toast.error("Account number must be 10 digits");
			return;
		}

		addMutation.mutate({
			bank_name: newAccount.bankName,
			account_number: newAccount.accountNumber,
			account_name: newAccount.accountName,
		});
	};

	const openDeleteDialog = (id: number) => {
		const account = accounts.find((a) => a.id === id);
		if (account?.isDefault) {
			toast.error("Cannot delete default account. Set another as default first.");
			return;
		}
		setAccountToDelete(id);
		setShowDeleteModal(true);
	};

	const handleDelete = () => {
		if (accountToDelete === null) return;
		deleteMutation.mutate(accountToDelete);
	};

	if (isLoading) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="font-semibold text-xl lg:text-2xl" style={{ color: "var(--c-text)" }}>
						Payment Methods
					</h1>
					<p className="text-sm lg:text-base mt-2" style={{ color: "var(--c-text-3)" }}>
						Loading your payment methods...
					</p>
				</header>
			</section>
		);
	}

	if (isError) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="font-semibold text-xl lg:text-2xl" style={{ color: "var(--c-text)" }}>
						Payment Methods
					</h1>
					<p className="text-sm lg:text-base mt-2" style={{ color: "var(--c-text-3)" }}>
						Failed to load payment methods. Please refresh the page.
					</p>
				</header>
			</section>
		);
	}

	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<header className="mb-6">
				<h1 className="font-semibold text-xl lg:text-2xl" style={{ color: "var(--c-text)" }}>
					Payment Methods
				</h1>
				<p className="text-sm lg:text-base mt-2" style={{ color: "var(--c-text-3)" }}>
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
							color: "var(--c-text)",
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
					<div className="ds-card p-6">
						<h3 className="font-semibold text-lg text-[var(--c-text)] mb-4">
							Add New Bank Account
						</h3>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-[var(--c-text)] mb-2 block">
									Bank Name
								</label>
								<input
									type="text"
									value={newAccount.bankName}
									onChange={(e) =>
										setNewAccount({ ...newAccount, bankName: e.target.value })
									}
									className="w-full px-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--c-lime-500)]"
									placeholder="e.g., GTBank"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-[var(--c-text)] mb-2 block">
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
									className="w-full px-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--c-lime-500)]"
									placeholder="0123456789"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-[var(--c-text)] mb-2 block">
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
									className="w-full px-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--c-lime-500)]"
									placeholder="John Doe"
								/>
							</div>
							<div className="flex gap-3">
								<button
									onClick={handleAddAccount}
									disabled={addMutation.isPending}
									style={{
										background: "var(--c-lime-500)",
										color: "#fff",
										border: "1px solid rgba(0,0,0,0.05)",
										height: "40px",
										padding: "0 24px",
										borderRadius: "9999px",
										fontWeight: 600,
										fontSize: "14px",
										cursor: addMutation.isPending ? "not-allowed" : "pointer",
										opacity: addMutation.isPending ? 0.5 : 1,
									}}
								>
									{addMutation.isPending ? "Adding..." : "Add Account"}
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
										color: "var(--c-text)",
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
							className="ds-card p-5 lg:p-6"
						>
							<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
								<div className="flex items-start gap-4">
									<div className="p-3 bg-[var(--c-lime-500)]/10 rounded-lg">
										<CreditCard className="w-6 h-6 text-[var(--c-lime-500)]" />
									</div>
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-semibold text-lg text-[var(--c-text)]">
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
														color: "var(--c-lime-500)",
														background: "rgba(159,232,112,0.1)",
													}}
												>
													Default
												</span>
											)}
											{account.isVerified && (
												<CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
											)}
										</div>
										<p className="text-sm text-[var(--c-text-3)] mb-1">
											{account.accountNumber}
										</p>
										<p className="text-sm font-medium text-[var(--c-text)]">
											{account.accountName}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									{!account.isDefault && (
										<button
											onClick={() => setDefaultMutation.mutate(account.id)}
											disabled={setDefaultMutation.isPending}
											style={{
												background: "transparent",
												color: "var(--c-text)",
												border: "1px solid var(--c-border, #e5e5e5)",
												height: "36px",
												padding: "0 16px",
												borderRadius: "9999px",
												fontWeight: 500,
												fontSize: "14px",
												cursor: setDefaultMutation.isPending ? "not-allowed" : "pointer",
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
											color: "var(--danger)",
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
					<div className="ds-card p-12 text-center">
						<div className="w-16 h-16 mx-auto bg-[var(--c-surface-2)] rounded-full flex items-center justify-center mb-4">
							<CreditCard className="w-8 h-8 text-[var(--c-lime-500)]" />
						</div>
						<h3 className="font-semibold text-lg text-[var(--c-text)] mb-2">
							No payment methods added
						</h3>
						<p className="text-sm text-[var(--c-text-3)] mb-6">
							Add a bank account to start making deposits and withdrawals
						</p>
						<button
							onClick={() => setShowAddForm(true)}
							style={{
								background: "var(--c-lime-500)",
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
				<div className="ds-card p-5">
					<h3 className="font-semibold text-base text-[var(--c-text)] mb-3">
						Important Information
					</h3>
					<ul className="space-y-2 text-sm text-[var(--c-text-3)]">
						<li className="flex items-start gap-2">
							<span className="text-light-green mt-1">•</span>
							<span>
								Your bank account name must match your verified identity on
								Clusteer
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-light-green mt-1">•</span>
							<span>
								Withdrawals can only be made to verified bank accounts
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-light-green mt-1">•</span>
							<span>
								Changing your default payment method will take effect
								immediately
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-light-green mt-1">•</span>
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
							background: "var(--c-surface)",
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
						<p style={{ fontSize: "14px", color: "var(--c-text-3)", marginBottom: "24px" }}>
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
									color: "var(--c-text)",
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
								disabled={deleteMutation.isPending}
								style={{
									background: "var(--danger)",
									color: "#fff",
									border: "none",
									height: "40px",
									padding: "0 16px",
									borderRadius: "8px",
									fontWeight: 500,
									fontSize: "14px",
									cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
									opacity: deleteMutation.isPending ? 0.5 : 1,
								}}
							>
								{deleteMutation.isPending ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
