"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wallet,
  Clock,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  Plus,
  Minus,
  Copy,
  Check,
  AlertTriangle,
  Activity,
  DollarSign,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

interface WalletBalance {
  currency: "Naira" | "USDT" | "USDC";
  balance: number;
  lockedBalance: number;
  availableBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  network?: "TRC20" | "BEP20" | "SOL";
  address?: string;
  status: "Active" | "Frozen" | "Suspended";
  lastActivity: string;
}

interface Transaction {
  id: string;
  type: "Deposit" | "Withdrawal" | "Admin Credit" | "Admin Debit" | "Transfer";
  status: "Success" | "Failed" | "Pending";
  amount: number;
  currency: "Naira" | "USDT" | "USDC";
  timestamp: string;
  reference: string;
  note?: string;
  adminId?: string;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: "Approved" | "Pending" | "Rejected";
  accountStatus: "Active" | "Suspended" | "Restricted";
  joinedDate: string;
  lastLogin: string;
  totalTransactions: number;
  lifetimeVolume: number;
}

export default function UserWalletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [wallets, setWallets] = useState<WalletBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("all");
  const [timeRange, setTimeRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showDebitModal, setShowDebitModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockUser: UserDetail = {
      id: userId,
      name: "Adebayo Okonkwo",
      email: "adebayo.okonkwo@example.com",
      phone: "+234 803 456 7890",
      kycStatus: "Approved",
      accountStatus: "Active",
      joinedDate: "2024-01-15",
      lastLogin: "2024-12-28 14:32",
      totalTransactions: 147,
      lifetimeVolume: 15234567,
    };

    const mockWallets: WalletBalance[] = [
      {
        currency: "Naira",
        balance: 1234567.89,
        lockedBalance: 50000,
        availableBalance: 1184567.89,
        totalDeposits: 5000000,
        totalWithdrawals: 3765432.11,
        status: "Active",
        lastActivity: "2024-12-28 10:15",
      },
      {
        currency: "USDT",
        balance: 2345.67,
        lockedBalance: 100,
        availableBalance: 2245.67,
        totalDeposits: 5000,
        totalWithdrawals: 2654.33,
        network: "TRC20",
        address: "TXYZabcdef1234567890ABCDEF",
        status: "Active",
        lastActivity: "2024-12-27 16:45",
      },
      {
        currency: "USDC",
        balance: 1234.56,
        lockedBalance: 0,
        availableBalance: 1234.56,
        totalDeposits: 2000,
        totalWithdrawals: 765.44,
        network: "BEP20",
        address: "0xABCDEF1234567890abcdef1234567890",
        status: "Active",
        lastActivity: "2024-12-26 09:30",
      },
    ];

    const mockTransactions: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
      id: `TXN${String(i + 1).padStart(6, "0")}`,
      type: ["Deposit", "Withdrawal", "Admin Credit", "Admin Debit", "Transfer"][
        Math.floor(Math.random() * 5)
      ] as Transaction["type"],
      status: ["Success", "Failed", "Pending"][Math.floor(Math.random() * 3)] as Transaction["status"],
      amount: Math.random() * 10000,
      currency: ["Naira", "USDT", "USDC"][Math.floor(Math.random() * 3)] as Transaction["currency"],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      reference: `REF${String(Math.floor(Math.random() * 1000000)).padStart(8, "0")}`,
      note: i % 5 === 0 ? "Manual adjustment by admin" : undefined,
      adminId: i % 5 === 0 ? "admin-001" : undefined,
    }));

    setUser(mockUser);
    setWallets(mockWallets);
    setTransactions(mockTransactions.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
    setIsLoading(false);
  }, [userId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Success":
      case "Approved":
        return "text-success bg-success/10 border-success";
      case "Pending":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "Failed":
      case "Rejected":
      case "Suspended":
      case "Restricted":
        return "text-danger bg-danger/10 border-danger";
      default:
        return "text-[var(--c-text-3)] bg-background border-[var(--c-line)]";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "Naira") {
      return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-[var(--c-text-3)]">Loading wallet details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--c-text)]">User Not Found</h2>
          <p className="text-[var(--c-text-3)] mt-2">Unable to load user wallet details</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[#013800]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--c-text-3)] hover:text-[var(--c-lime-500)] mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wallets
        </button>

        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--c-text)]">{user.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-[var(--c-text-3)]">
                <span>{user.email}</span>
                <span>•</span>
                <span>{user.phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.kycStatus)}`}>
                KYC: {user.kycStatus}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.accountStatus)}`}>
                {user.accountStatus}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--c-line)]">
            <div>
              <p className="text-sm text-[var(--c-text-3)]">Total Transactions</p>
              <p className="text-xl font-bold text-[var(--c-text)] mt-1">{user.totalTransactions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--c-text-3)]">Lifetime Volume</p>
              <p className="text-xl font-bold text-[var(--c-text)] mt-1">₦{user.lifetimeVolume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--c-text-3)]">Total Wallets</p>
              <p className="text-xl font-bold text-[var(--c-text)] mt-1">{wallets.length}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--c-text-3)]">Last Login</p>
              <p className="text-xl font-bold text-[var(--c-text)] mt-1">{formatDateTime(user.lastLogin)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallets Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {wallets.map((wallet) => (
          <div
            key={wallet.currency}
            className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-800 to-light-green flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--c-text)]">{wallet.currency}</h3>
                  {wallet.network && (
                    <p className="text-xs text-[var(--c-text-3)]">{wallet.network}</p>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(wallet.status)}`}>
                {wallet.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--c-text-3)]">Available Balance</p>
                <p className="text-2xl font-bold text-[var(--c-text)]">{formatCurrency(wallet.availableBalance, wallet.currency)}</p>
              </div>

              {wallet.lockedBalance > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--c-text-3)]">Locked</span>
                  <span className="font-medium text-orange-600">{formatCurrency(wallet.lockedBalance, wallet.currency)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[var(--c-line)] space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--c-text-3)] flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    Total Deposits
                  </span>
                  <span className="font-medium text-success">{formatCurrency(wallet.totalDeposits, wallet.currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--c-text-3)] flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-danger" />
                    Total Withdrawals
                  </span>
                  <span className="font-medium text-danger">{formatCurrency(wallet.totalWithdrawals, wallet.currency)}</span>
                </div>
              </div>

              {wallet.address && (
                <div className="pt-3 border-t border-[var(--c-line)]">
                  <p className="text-xs text-[var(--c-text-3)] mb-1">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate">
                      {wallet.address}
                    </code>
                    <button
                      onClick={() => handleCopy(wallet.address!, `${wallet.currency}-address`)}
                      className="p-1 hover:bg-[var(--c-surface-2)] rounded transition-colors"
                    >
                      {copied === `${wallet.currency}-address` ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4 text-[var(--c-text-3)]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-between text-xs text-[var(--c-text-3)]">
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Last Activity
                </span>
                <span>{formatDateTime(wallet.lastActivity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--c-text)] mb-4">Wallet Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreditModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[#013800] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Manual Credit
          </button>
          <button
            onClick={() => setShowDebitModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors"
          >
            <Minus className="h-4 w-4" />
            Manual Debit
          </button>
          <button
            onClick={() => setShowFreezeModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--c-line)] text-[var(--c-text-3)] rounded-lg hover:bg-background transition-colors"
          >
            <Lock className="h-4 w-4" />
            Freeze Wallet
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--c-line)] text-[var(--c-text-3)] rounded-lg hover:bg-background transition-colors">
            <Download className="h-4 w-4" />
            Export Transactions
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)]">
        <div className="p-6 border-b border-[var(--c-line)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--c-text)]">Transaction History</h2>
            <div className="flex items-center gap-3">
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="px-3 py-2 border border-[var(--c-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Wallets</option>
                <option value="Naira">Naira</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-[var(--c-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-[var(--c-line)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--c-text-3)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions
                .filter((tx) => selectedWallet === "all" || tx.currency === selectedWallet)
                .slice(0, 10)
                .map((tx) => (
                  <tr key={tx.id} className="hover:bg-background transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-[var(--c-text)]">{tx.id}</p>
                        <p className="text-xs text-[var(--c-text-3)]">{tx.reference}</p>
                        {tx.note && (
                          <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {tx.note}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type.includes("Credit") || tx.type === "Deposit"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className={`font-medium ${
                          tx.type.includes("Credit") || tx.type === "Deposit"
                            ? "text-success"
                            : "text-danger"
                        }`}>
                          {tx.type.includes("Credit") || tx.type === "Deposit" ? "+" : "-"}
                          {formatCurrency(tx.amount, tx.currency)}
                        </p>
                        <p className="text-xs text-[var(--c-text-3)]">{tx.currency}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--c-text-3)]">
                      {formatDateTime(tx.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/admin/wallets/transactions/${tx.id}`)}
                        className="text-sm text-[var(--c-lime-500)] hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[var(--c-line)] flex items-center justify-between">
          <p className="text-sm text-[var(--c-text-3)]">
            Showing {Math.min(10, transactions.length)} of {transactions.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-[var(--c-line)] rounded text-sm hover:bg-background disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-[var(--c-line)] rounded text-sm hover:bg-background">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals would be rendered here - simplified for brevity */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--c-surface)] rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">Manual Credit</h3>
            <p className="text-sm text-[var(--c-text-3)] mb-4">Credit funds to user&apos;s wallet</p>
            {/* Form fields would go here */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreditModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[#013800]">
                Confirm Credit
              </button>
            </div>
          </div>
        </div>
      )}

      {showDebitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--c-surface)] rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">Manual Debit</h3>
            <p className="text-sm text-[var(--c-text-3)] mb-4">Debit funds from user&apos;s wallet</p>
            {/* Form fields would go here */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDebitModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90">
                Confirm Debit
              </button>
            </div>
          </div>
        </div>
      )}

      {showFreezeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--c-surface)] rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">Freeze Wallet</h3>
            <p className="text-sm text-[var(--c-text-3)] mb-4">Freeze user&apos;s wallet to prevent transactions</p>
            {/* Form fields would go here */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFreezeModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Freeze Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
