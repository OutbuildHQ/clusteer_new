"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Play,
  Pause,
} from "lucide-react";

interface Settlement {
  id: string;
  batchId: string;
  date: string;
  status: "Scheduled" | "Processing" | "Completed" | "Failed" | "Pending";
  bankAccount: {
    bankName: string;
    accountNumber: string;
  };
  totalAmount: number;
  transactionCount: number;
  currency: "NGN" | "USDT" | "USDC";
  startedAt?: string;
  completedAt?: string;
  failureReason?: string;
  processedBy?: string;
  retryCount: number;
  settlements: {
    deposits: { count: number; amount: number };
    withdrawals: { count: number; amount: number };
    fees: { count: number; amount: number };
  };
  priority: "High" | "Normal" | "Low";
}

export default function SettlementDashboardPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [filteredSettlements, setFilteredSettlements] = useState<Settlement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBank, setFilterBank] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [autoProcess, setAutoProcess] = useState(true);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockSettlements: Settlement[] = [
      {
        id: "SET001",
        batchId: "BATCH20241228001",
        date: "2024-12-28",
        status: "Completed",
        bankAccount: {
          bankName: "GTBank",
          accountNumber: "0123456789",
        },
        totalAmount: 12500000,
        transactionCount: 89,
        currency: "NGN",
        startedAt: "2024-12-28 09:00",
        completedAt: "2024-12-28 09:15",
        processedBy: "system",
        retryCount: 0,
        settlements: {
          deposits: { count: 65, amount: 10000000 },
          withdrawals: { count: 20, amount: 2450000 },
          fees: { count: 4, amount: 50000 },
        },
        priority: "High",
      },
      {
        id: "SET002",
        batchId: "BATCH20241228002",
        date: "2024-12-28",
        status: "Processing",
        bankAccount: {
          bankName: "Opay",
          accountNumber: "9876543210",
        },
        totalAmount: 3456789,
        transactionCount: 45,
        currency: "NGN",
        startedAt: "2024-12-28 10:30",
        processedBy: "system",
        retryCount: 0,
        settlements: {
          deposits: { count: 32, amount: 2500000 },
          withdrawals: { count: 10, amount: 943211 },
          fees: { count: 3, amount: 13578 },
        },
        priority: "Normal",
      },
      {
        id: "SET003",
        batchId: "BATCH20241228003",
        date: "2024-12-28",
        status: "Failed",
        bankAccount: {
          bankName: "Access Bank",
          accountNumber: "1234567890",
        },
        totalAmount: 450000,
        transactionCount: 5,
        currency: "NGN",
        startedAt: "2024-12-28 08:45",
        failureReason: "Insufficient bank balance",
        processedBy: "system",
        retryCount: 2,
        settlements: {
          deposits: { count: 4, amount: 400000 },
          withdrawals: { count: 1, amount: 50000 },
          fees: { count: 0, amount: 0 },
        },
        priority: "High",
      },
      {
        id: "SET004",
        batchId: "BATCH20241228004",
        date: "2024-12-28",
        status: "Scheduled",
        bankAccount: {
          bankName: "GTBank",
          accountNumber: "0123456789",
        },
        totalAmount: 8765432,
        transactionCount: 67,
        currency: "NGN",
        processedBy: "system",
        retryCount: 0,
        settlements: {
          deposits: { count: 48, amount: 7000000 },
          withdrawals: { count: 15, amount: 1700000 },
          fees: { count: 4, amount: 65432 },
        },
        priority: "Normal",
      },
      {
        id: "SET005",
        batchId: "BATCH20241227001",
        date: "2024-12-27",
        status: "Completed",
        bankAccount: {
          bankName: "Opay",
          accountNumber: "9876543210",
        },
        totalAmount: 5678900,
        transactionCount: 52,
        currency: "NGN",
        startedAt: "2024-12-27 09:00",
        completedAt: "2024-12-27 09:12",
        processedBy: "system",
        retryCount: 0,
        settlements: {
          deposits: { count: 38, amount: 4500000 },
          withdrawals: { count: 12, amount: 1150000 },
          fees: { count: 2, amount: 28900 },
        },
        priority: "Normal",
      },
    ];

    setSettlements(mockSettlements);
    setFilteredSettlements(mockSettlements);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = settlements;

    // Date range filter
    const today = new Date().toISOString().split("T")[0];
    if (dateRange === "today") {
      filtered = filtered.filter((s) => s.date === today);
    } else if (dateRange === "yesterday") {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      filtered = filtered.filter((s) => s.date === yesterday);
    } else if (dateRange === "7days") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      filtered = filtered.filter((s) => s.date >= sevenDaysAgo);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    // Bank filter
    if (filterBank !== "all") {
      filtered = filtered.filter((s) => s.bankAccount.bankName === filterBank);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.bankAccount.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSettlements(filtered);
  }, [dateRange, filterStatus, filterBank, searchQuery, settlements]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-success bg-success/10 border-success";
      case "Processing":
        return "text-[var(--c-lime-500)] bg-[var(--c-lime-500)]/10 border-primary/30";
      case "Scheduled":
      case "Pending":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "Failed":
        return "text-danger bg-danger/10 border-danger";
      default:
        return "text-[var(--c-text-3)] bg-background border-[var(--c-line)]";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-danger bg-danger/10 border-danger";
      case "Normal":
        return "text-[var(--c-text-3)] bg-background border-[var(--c-line)]";
      case "Low":
        return "text-[var(--c-lime-500)] bg-[var(--c-lime-500)]/10 border-primary/30";
      default:
        return "text-[var(--c-text-3)] bg-background border-[var(--c-line)]";
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setShowDetailModal(true);
  };

  const handleRetry = (settlementId: string) => {
    console.log("Retrying settlement:", settlementId);
    // API call to retry settlement
  };

  const totalAmount = filteredSettlements.reduce((sum, s) => sum + s.totalAmount, 0);
  const completedCount = filteredSettlements.filter((s) => s.status === "Completed").length;
  const processingCount = filteredSettlements.filter((s) => s.status === "Processing").length;
  const failedCount = filteredSettlements.filter((s) => s.status === "Failed").length;
  const uniqueBanks = [...new Set(settlements.map((s) => s.bankAccount.bankName))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-[var(--c-text-3)]">Loading settlement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--c-text)]">Settlement Dashboard</h1>
          <p className="text-[var(--c-text-3)] mt-1">Monitor and manage automated bank settlements</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoProcess(!autoProcess)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              autoProcess
                ? "border-primary bg-success/10 text-[var(--c-lime-500)]"
                : "border-[var(--c-line)] hover:bg-background"
            }`}
          >
            {autoProcess ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            Auto-Process {autoProcess ? "ON" : "OFF"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-xs text-[var(--c-text-3)]">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{completedCount}</p>
          <p className="text-sm text-[var(--c-text-3)] mt-1">Completed</p>
        </div>

        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="h-5 w-5 text-[var(--c-lime-500)] animate-spin" />
            <span className="text-xs text-[var(--c-text-3)]">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{processingCount}</p>
          <p className="text-sm text-[var(--c-text-3)] mt-1">Processing</p>
        </div>

        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="h-5 w-5 text-danger" />
            <span className="text-xs text-[var(--c-text-3)]">Requires Action</span>
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{failedCount}</p>
          <p className="text-sm text-[var(--c-text-3)] mt-1">Failed</p>
        </div>

        <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-[var(--c-lime-500)]" />
            <span className="text-xs text-[var(--c-text-3)]">Total Volume</span>
          </div>
          <p className="text-2xl font-bold text-[var(--c-text)]">{formatCurrency(totalAmount)}</p>
          <p className="text-sm text-[var(--c-text-3)] mt-1">Settlement Value</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--c-text-3)]" />
              <input
                type="text"
                placeholder="Search by batch ID, bank, or settlement ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
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
        </div>
      </div>

      {/* Settlements List */}
      <div className="space-y-4">
        {filteredSettlements.map((settlement) => (
          <div
            key={settlement.id}
            className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-800 to-light-green flex items-center justify-center">
                  <ArrowRightLeft className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--c-text)] text-lg">{settlement.batchId}</h3>
                  <p className="text-sm text-[var(--c-text-3)]">
                    {settlement.bankAccount.bankName} - {settlement.bankAccount.accountNumber}
                  </p>
                  <p className="text-xs text-[var(--c-text-3)] mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(settlement.date).toLocaleDateString("en-NG", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(settlement.status)}`}>
                  {settlement.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(settlement.priority)}`}>
                  {settlement.priority}
                </span>
              </div>
            </div>

            {/* Settlement Details */}
            <div className="grid grid-cols-4 gap-6 mb-4">
              <div className="bg-background rounded-lg p-4">
                <p className="text-sm text-[var(--c-text-3)] mb-1">Total Amount</p>
                <p className="text-xl font-bold text-[var(--c-text)]">{formatCurrency(settlement.totalAmount)}</p>
              </div>
              <div className="bg-success/10 rounded-lg p-4">
                <p className="text-sm text-[var(--c-text-3)] mb-1">Deposits</p>
                <p className="text-lg font-semibold text-success">
                  {settlement.settlements.deposits.count} • {formatCurrency(settlement.settlements.deposits.amount)}
                </p>
              </div>
              <div className="bg-danger/10 rounded-lg p-4">
                <p className="text-sm text-[var(--c-text-3)] mb-1">Withdrawals</p>
                <p className="text-lg font-semibold text-danger">
                  {settlement.settlements.withdrawals.count} • {formatCurrency(settlement.settlements.withdrawals.amount)}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-[var(--c-text-3)] mb-1">Fees</p>
                <p className="text-lg font-semibold text-orange-700">
                  {settlement.settlements.fees.count} • {formatCurrency(settlement.settlements.fees.amount)}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-[var(--c-line)]">
              <div className="flex items-center justify-between text-sm text-[var(--c-text-3)]">
                <div className="flex items-center gap-4">
                  {settlement.startedAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Started: {formatDateTime(settlement.startedAt)}
                    </span>
                  )}
                  {settlement.completedAt && (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Completed: {formatDateTime(settlement.completedAt)}
                    </span>
                  )}
                  {settlement.retryCount > 0 && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <RefreshCw className="h-4 w-4" />
                      Retried {settlement.retryCount}x
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(settlement)}
                    className="flex items-center gap-1 px-3 py-1 border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  {settlement.status === "Failed" && (
                    <button
                      onClick={() => handleRetry(settlement.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </button>
                  )}
                </div>
              </div>

              {settlement.failureReason && (
                <div className="mt-3 bg-danger/10 border border-danger rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-danger">Settlement Failed</p>
                    <p className="text-sm text-danger">{settlement.failureReason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSettlements.length === 0 && (
        <div className="text-center py-12 bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)]">
          <ArrowRightLeft className="h-12 w-12 text-[var(--c-text-3)] mx-auto mb-4" />
          <p className="text-[var(--c-text-3)]">No settlements found</p>
          <p className="text-sm text-[var(--c-text-3)] mt-2">Try adjusting your filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSettlement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--c-surface)] rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <h3 className="text-lg font-semibold text-[var(--c-text)] mb-4">Settlement Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--c-text-3)]">Batch ID</p>
                  <p className="font-medium text-[var(--c-text)]">{selectedSettlement.batchId}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--c-text-3)]">Settlement ID</p>
                  <p className="font-medium text-[var(--c-text)]">{selectedSettlement.id}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--c-text-3)]">Bank Account</p>
                  <p className="font-medium text-[var(--c-text)]">
                    {selectedSettlement.bankAccount.bankName} - {selectedSettlement.bankAccount.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--c-text-3)]">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedSettlement.status)}`}>
                    {selectedSettlement.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[var(--c-text-3)]">Total Amount</p>
                  <p className="font-medium text-[var(--c-text)]">{formatCurrency(selectedSettlement.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--c-text-3)]">Transaction Count</p>
                  <p className="font-medium text-[var(--c-text)]">{selectedSettlement.transactionCount}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedSettlement(null);
                }}
                className="flex-1 px-4 py-2 border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[#013800] transition-colors">
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
