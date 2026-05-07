"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  accountType: "Savings" | "Current" | "Corporate";
  currency: "NGN";
  status: "Active" | "Inactive" | "Pending Verification" | "Suspended";
  verificationStatus: "Verified" | "Pending" | "Failed";
  balance: number;
  lastReconciled: string;
  discrepancy: number;
  isPrimary: boolean;
  dailyLimit: number;
  monthlyVolume: number;
  transactionCount: number;
  addedDate: string;
  lastActivity: string;
  notes?: string;
}

export default function BankAccountManagementPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<BankAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBank, setFilterBank] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [showBalances, setShowBalances] = useState(false);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockAccounts: BankAccount[] = [
      {
        id: "BA001",
        bankName: "GTBank",
        bankCode: "058",
        accountNumber: "0123456789",
        accountName: "Clusteer Technologies Ltd",
        accountType: "Corporate",
        currency: "NGN",
        status: "Active",
        verificationStatus: "Verified",
        balance: 15234567.89,
        lastReconciled: "2024-12-28 10:30",
        discrepancy: 0,
        isPrimary: true,
        dailyLimit: 10000000,
        monthlyVolume: 45678900,
        transactionCount: 1247,
        addedDate: "2024-01-15",
        lastActivity: "2024-12-28 14:32",
        notes: "Primary settlement account",
      },
      {
        id: "BA002",
        bankName: "Opay",
        bankCode: "999992",
        accountNumber: "9876543210",
        accountName: "Clusteer Technologies",
        accountType: "Corporate",
        currency: "NGN",
        status: "Active",
        verificationStatus: "Verified",
        balance: 3456789.12,
        lastReconciled: "2024-12-28 09:15",
        discrepancy: 1500.0,
        isPrimary: false,
        dailyLimit: 5000000,
        monthlyVolume: 12345600,
        transactionCount: 456,
        addedDate: "2024-03-20",
        lastActivity: "2024-12-28 12:15",
        notes: "Secondary settlement account",
      },
      {
        id: "BA003",
        bankName: "Access Bank",
        bankCode: "044",
        accountNumber: "1234567890",
        accountName: "Clusteer Tech Limited",
        accountType: "Current",
        currency: "NGN",
        status: "Inactive",
        verificationStatus: "Verified",
        balance: 234567.45,
        lastReconciled: "2024-12-20 16:45",
        discrepancy: 0,
        isPrimary: false,
        dailyLimit: 2000000,
        monthlyVolume: 1234500,
        transactionCount: 89,
        addedDate: "2024-06-10",
        lastActivity: "2024-12-15 08:30",
        notes: "Backup account - rarely used",
      },
      {
        id: "BA004",
        bankName: "Zenith Bank",
        bankCode: "057",
        accountNumber: "5555666677",
        accountName: "Clusteer Technologies",
        accountType: "Current",
        currency: "NGN",
        status: "Pending Verification",
        verificationStatus: "Pending",
        balance: 0,
        lastReconciled: "Never",
        discrepancy: 0,
        isPrimary: false,
        dailyLimit: 1000000,
        monthlyVolume: 0,
        transactionCount: 0,
        addedDate: "2024-12-27",
        lastActivity: "Never",
        notes: "Awaiting KYC documents",
      },
    ];

    setAccounts(mockAccounts);
    setFilteredAccounts(mockAccounts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = accounts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (acc) =>
          acc.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          acc.accountNumber.includes(searchQuery) ||
          acc.accountName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((acc) => acc.status === filterStatus);
    }

    // Bank filter
    if (filterBank !== "all") {
      filtered = filtered.filter((acc) => acc.bankName === filterBank);
    }

    setFilteredAccounts(filtered);
  }, [searchQuery, filterStatus, filterBank, accounts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Verified":
        return "text-success bg-success/10 border-success";
      case "Pending":
      case "Pending Verification":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "Inactive":
      case "Suspended":
      case "Failed":
        return "text-danger bg-danger/10 border-danger";
      default:
        return "text-[var(--c-text-3)] bg-background border-[var(--c-line)]";
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateTime = (dateString: string) => {
    if (dateString === "Never") return "Never";
    const date = new Date(dateString);
    return date.toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSetPrimary = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isPrimary: acc.id === accountId,
      }))
    );
  };

  const handleDelete = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedAccount) {
      setAccounts((prev) => prev.filter((acc) => acc.id !== selectedAccount.id));
      setShowDeleteModal(false);
      setSelectedAccount(null);
    }
  };

  const handleEdit = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowEditModal(true);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const activeAccounts = accounts.filter((acc) => acc.status === "Active").length;
  const pendingVerification = accounts.filter((acc) => acc.verificationStatus === "Pending").length;
  const totalDiscrepancy = accounts.reduce((sum, acc) => sum + Math.abs(acc.discrepancy), 0);
  const uniqueBanks = [...new Set(accounts.map((acc) => acc.bankName))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-[var(--c-text-3)]">Loading bank accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--c-text)]">Bank Account Management</h1>
          <p className="text-[var(--c-text-3)] mt-1">Manage connected bank accounts for settlements</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBalances ? "Hide" : "Show"} Balances
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[#013800] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Bank Account
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="h-5 w-5 text-[var(--c-lime-500)]" />
            <span className="text-xs text-[var(--c-text-3)]">{accounts.length} Total</span>
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{activeAccounts}</p>
          <p className="text-sm text-[var(--c-text-3)] mt-1">Active Accounts</p>
        </div>

        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-5 w-5 text-success" />
            <span className="text-xs text-[var(--c-text-3)]">{uniqueBanks.length} Banks</span>
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">
            {showBalances ? formatCurrency(totalBalance) : "••••••"}
          </p>
          <p className="text-sm text-[var(--c-text-3)] mt-1">Total Balance</p>
        </div>

        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="text-xs text-[var(--c-text-3)]">Verification</span>
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{pendingVerification}</p>
          <p className="text-sm text-[var(--c-text-3)] mt-1">Pending Verification</p>
        </div>

        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <span className="text-xs text-[var(--c-text-3)]">Reconciliation</span>
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">
            {showBalances ? formatCurrency(totalDiscrepancy) : "••••••"}
          </p>
          <p className="text-sm text-[var(--c-text-3)] mt-1">Total Discrepancy</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--c-text-3)]" />
              <input
                type="text"
                placeholder="Search by bank, account number, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="px-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Banks</option>
            {uniqueBanks.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Bank Accounts Table */}
      <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-[var(--c-line)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Bank Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Account Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-800 to-light-green flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--c-text)] flex items-center gap-2">
                          {account.bankName}
                          {account.isPrimary && (
                            <span className="px-2 py-0.5 bg-[#B8E632] text-[var(--c-lime-500)] text-xs font-medium rounded">
                              PRIMARY
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-[var(--c-text-3)]">{account.accountType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[var(--c-text)]">{account.accountNumber}</p>
                      <p className="text-sm text-[var(--c-text-3)]">{account.accountName}</p>
                      {account.notes && (
                        <p className="text-xs text-[var(--c-text-3)] mt-1">{account.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-[var(--c-text)]">
                        {showBalances ? formatCurrency(account.balance) : "••••••••"}
                      </p>
                      <p className="text-xs text-[var(--c-text-3)]">
                        Txns: {account.transactionCount.toLocaleString()}
                      </p>
                      {account.discrepancy !== 0 && (
                        <p className="text-xs text-danger mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {formatCurrency(Math.abs(account.discrepancy))} off
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                      <span className={`block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(account.verificationStatus)}`}>
                        {account.verificationStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--c-text-3)]">
                    <div>
                      <p>Last: {formatDateTime(account.lastActivity)}</p>
                      <p className="text-xs text-[var(--c-text-3)] mt-1">
                        Reconciled: {formatDateTime(account.lastReconciled)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {!account.isPrimary && account.status === "Active" && (
                        <button
                          onClick={() => handleSetPrimary(account.id)}
                          className="p-2 hover:bg-success/10 rounded-lg transition-colors"
                          title="Set as Primary"
                        >
                          <CheckCircle className="h-4 w-4 text-success" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(account)}
                        className="p-2 hover:bg-[var(--c-lime-500)]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4 text-[var(--c-lime-500)]" />
                      </button>
                      {!account.isPrimary && (
                        <button
                          onClick={() => handleDelete(account)}
                          className="p-2 hover:bg-danger/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-danger" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-[var(--c-text-3)] mx-auto mb-4" />
            <p className="text-[var(--c-text-3)]">No bank accounts found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-[var(--c-lime-500)] hover:underline"
            >
              Add your first bank account
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--c-surface)] rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">Add Bank Account</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--c-text-3)] mb-1">
                    Bank Name
                  </label>
                  <select className="w-full px-3 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Bank</option>
                    <option value="058">GTBank</option>
                    <option value="044">Access Bank</option>
                    <option value="057">Zenith Bank</option>
                    <option value="999992">Opay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--c-text-3)] mb-1">
                    Account Type
                  </label>
                  <select className="w-full px-3 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--c-text-3)] mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="0123456789"
                  className="w-full px-3 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--c-text-3)] mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  placeholder="Will be auto-filled after verification"
                  disabled
                  className="w-full px-3 py-2 border border-[var(--c-line)] rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--c-text-3)] mb-1">
                  Daily Limit
                </label>
                <input
                  type="number"
                  placeholder="10000000"
                  className="w-full px-3 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--c-text-3)] mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any notes about this account..."
                  className="w-full px-3 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[#013800] transition-colors">
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--c-surface)] rounded-lg max-w-md w-full p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-danger" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--c-text)]">Delete Bank Account</h3>
                <p className="text-sm text-[var(--c-text-3)]">This action cannot be undone</p>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 mb-4">
              <p className="font-medium text-[var(--c-text)]">{selectedAccount.bankName}</p>
              <p className="text-sm text-[var(--c-text-3)]">{selectedAccount.accountNumber}</p>
              <p className="text-sm text-[var(--c-text-3)]">{selectedAccount.accountName}</p>
            </div>
            <p className="text-sm text-[var(--c-text-3)] mb-6">
              Are you sure you want to delete this bank account? All associated data will be preserved
              for audit purposes, but the account will no longer be available for settlements.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAccount(null);
                }}
                className="flex-1 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
