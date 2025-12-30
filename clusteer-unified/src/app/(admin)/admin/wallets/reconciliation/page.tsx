"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Clock,
  Filter,
  Search,
  Edit2,
  Save,
  X,
} from "lucide-react";

interface ReconciliationRecord {
  id: string;
  date: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
  };
  systemBalance: number;
  bankBalance: number;
  discrepancy: number;
  status: "Matched" | "Discrepancy" | "Under Review" | "Resolved";
  transactionCount: number;
  deposits: {
    count: number;
    amount: number;
  };
  withdrawals: {
    count: number;
    amount: number;
  };
  lastReconciled: string;
  reconciledBy?: string;
  notes?: string;
  adjustmentMade?: boolean;
  adjustmentAmount?: number;
}

interface ManualAdjustment {
  recordId: string;
  amount: number;
  reason: string;
  type: "System" | "Bank";
}

export default function ReconciliationDashboardPage() {
  const [records, setRecords] = useState<ReconciliationRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ReconciliationRecord[]>([]);
  const [dateRange, setDateRange] = useState("today");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBank, setFilterBank] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockRecords: ReconciliationRecord[] = [
      {
        id: "REC001",
        date: "2024-12-28",
        bankAccount: {
          bankName: "GTBank",
          accountNumber: "0123456789",
        },
        systemBalance: 15234567.89,
        bankBalance: 15234567.89,
        discrepancy: 0,
        status: "Matched",
        transactionCount: 127,
        deposits: { count: 89, amount: 12500000 },
        withdrawals: { count: 38, amount: 8765432.11 },
        lastReconciled: "2024-12-28 10:30",
        reconciledBy: "admin@clusteer.io",
        notes: "All transactions matched perfectly",
      },
      {
        id: "REC002",
        date: "2024-12-28",
        bankAccount: {
          bankName: "Opay",
          accountNumber: "9876543210",
        },
        systemBalance: 3456789.12,
        bankBalance: 3455289.12,
        discrepancy: 1500.0,
        status: "Discrepancy",
        transactionCount: 45,
        deposits: { count: 32, amount: 2500000 },
        withdrawals: { count: 13, amount: 1543210.88 },
        lastReconciled: "2024-12-28 09:15",
        reconciledBy: "admin@clusteer.io",
        notes: "Pending deposit of ₦1,500 not reflected in bank",
      },
      {
        id: "REC003",
        date: "2024-12-27",
        bankAccount: {
          bankName: "GTBank",
          accountNumber: "0123456789",
        },
        systemBalance: 14987654.32,
        bankBalance: 14987654.32,
        discrepancy: 0,
        status: "Matched",
        transactionCount: 156,
        deposits: { count: 98, amount: 15000000 },
        withdrawals: { count: 58, amount: 10012345.68 },
        lastReconciled: "2024-12-27 18:45",
        reconciledBy: "admin@clusteer.io",
      },
      {
        id: "REC004",
        date: "2024-12-27",
        bankAccount: {
          bankName: "Opay",
          accountNumber: "9876543210",
        },
        systemBalance: 3234567.89,
        bankBalance: 3236567.89,
        discrepancy: -2000.0,
        status: "Resolved",
        transactionCount: 52,
        deposits: { count: 35, amount: 2800000 },
        withdrawals: { count: 17, amount: 1565432.11 },
        lastReconciled: "2024-12-27 17:30",
        reconciledBy: "admin@clusteer.io",
        notes: "Bank reflected duplicate deposit - contacted bank to reverse",
        adjustmentMade: true,
        adjustmentAmount: -2000.0,
      },
      {
        id: "REC005",
        date: "2024-12-28",
        bankAccount: {
          bankName: "Access Bank",
          accountNumber: "1234567890",
        },
        systemBalance: 234567.45,
        bankBalance: 234567.45,
        discrepancy: 0,
        status: "Matched",
        transactionCount: 8,
        deposits: { count: 5, amount: 450000 },
        withdrawals: { count: 3, amount: 215432.55 },
        lastReconciled: "2024-12-28 08:00",
        reconciledBy: "system",
      },
    ];

    setRecords(mockRecords);
    setFilteredRecords(mockRecords);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = records;

    // Date range filter
    const today = new Date().toISOString().split("T")[0];
    if (dateRange === "today") {
      filtered = filtered.filter((rec) => rec.date === today);
    } else if (dateRange === "yesterday") {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      filtered = filtered.filter((rec) => rec.date === yesterday);
    } else if (dateRange === "7days") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      filtered = filtered.filter((rec) => rec.date >= sevenDaysAgo);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((rec) => rec.status === filterStatus);
    }

    // Bank filter
    if (filterBank !== "all") {
      filtered = filtered.filter((rec) => rec.bankAccount.bankName === filterBank);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (rec) =>
          rec.bankAccount.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.bankAccount.accountNumber.includes(searchQuery) ||
          rec.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [dateRange, filterStatus, filterBank, searchQuery, records]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Matched":
      case "Resolved":
        return "text-green-700 bg-green-50 border-green-200";
      case "Discrepancy":
      case "Under Review":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  const handleAdjustment = (record: ReconciliationRecord) => {
    setSelectedRecord(record);
    setShowAdjustmentModal(true);
  };

  const handleSaveNote = (recordId: string, note: string) => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === recordId ? { ...rec, notes: note } : rec
      )
    );
    setEditingNote(null);
  };

  const totalDiscrepancies = filteredRecords.reduce(
    (sum, rec) => sum + Math.abs(rec.discrepancy),
    0
  );
  const unresolvedCount = filteredRecords.filter(
    (rec) => rec.status === "Discrepancy" || rec.status === "Under Review"
  ).length;
  const matchedCount = filteredRecords.filter((rec) => rec.status === "Matched").length;
  const uniqueBanks = [...new Set(records.map((rec) => rec.bankAccount.bankName))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#014F01] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reconciliation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reconciliation Dashboard</h1>
          <p className="text-gray-600 mt-1">Compare system balances with bank statements</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              autoRefresh
                ? "border-[#014F01] bg-green-50 text-[#014F01]"
                : "border-[#E9EAEB] hover:bg-gray-50"
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E9EAEB] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-xs text-gray-600">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{matchedCount}</p>
          <p className="text-sm text-gray-600 mt-1">Matched Records</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-xs text-gray-600">Unresolved</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{unresolvedCount}</p>
          <p className="text-sm text-gray-600 mt-1">Discrepancies</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-orange-600" />
            <span className="text-xs text-gray-600">Total Variance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDiscrepancies)}</p>
          <p className="text-sm text-gray-600 mt-1">Amount Off</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="h-5 w-5 text-[#014F01]" />
            <span className="text-xs text-gray-600">Coverage</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{uniqueBanks.length}</p>
          <p className="text-sm text-gray-600 mt-1">Bank Accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#E9EAEB] p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by bank, account, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
              />
            </div>
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
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
            className="px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
          >
            <option value="all">All Status</option>
            <option value="Matched">Matched</option>
            <option value="Discrepancy">Discrepancy</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
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

      {/* Reconciliation Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-lg border border-[#E9EAEB] p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#014F01] to-[#B8E632] flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {record.bankAccount.bankName}
                  </h3>
                  <p className="text-sm text-gray-600">{record.bankAccount.accountNumber}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(record.date).toLocaleDateString("en-NG", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
                {record.adjustmentMade && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    Adjusted
                  </span>
                )}
              </div>
            </div>

            {/* Balance Comparison */}
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">System Balance</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(record.systemBalance)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Bank Balance</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(record.bankBalance)}</p>
              </div>
              <div
                className={`rounded-lg p-4 ${
                  record.discrepancy === 0
                    ? "bg-green-50"
                    : record.discrepancy > 0
                    ? "bg-orange-50"
                    : "bg-red-50"
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">Discrepancy</p>
                <p
                  className={`text-xl font-bold ${
                    record.discrepancy === 0
                      ? "text-green-700"
                      : record.discrepancy > 0
                      ? "text-orange-700"
                      : "text-red-700"
                  }`}
                >
                  {record.discrepancy === 0 ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Matched
                    </span>
                  ) : (
                    formatCurrency(Math.abs(record.discrepancy))
                  )}
                </p>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-[#E9EAEB]">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-lg font-semibold text-gray-900">{record.transactionCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Deposits ({record.deposits.count})
                </p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(record.deposits.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Withdrawals ({record.withdrawals.count})
                </p>
                <p className="text-lg font-semibold text-red-600">{formatCurrency(record.withdrawals.amount)}</p>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-4 border-t border-[#E9EAEB]">
              {editingNote === record.id ? (
                <div>
                  <textarea
                    defaultValue={record.notes || ""}
                    className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] mb-2"
                    rows={2}
                    placeholder="Add reconciliation notes..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        const textarea = e.currentTarget.parentElement?.previousSibling as HTMLTextAreaElement;
                        handleSaveNote(record.id, textarea.value);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-[#014F01] text-white rounded text-sm hover:bg-[#013800]"
                    >
                      <Save className="h-3 w-3" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      className="flex items-center gap-1 px-3 py-1 border border-[#E9EAEB] rounded text-sm hover:bg-gray-50"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                    <p className="text-sm text-gray-900">
                      {record.notes || "No notes added"}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingNote(record.id)}
                    className="flex items-center gap-1 px-3 py-1 border border-[#E9EAEB] rounded text-sm hover:bg-gray-50"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9EAEB] mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Last reconciled: {formatDateTime(record.lastReconciled)} by {record.reconciledBy}
              </div>
              {record.discrepancy !== 0 && record.status !== "Resolved" && (
                <button
                  onClick={() => handleAdjustment(record)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Make Adjustment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-[#E9EAEB]">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No reconciliation records found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      )}

      {/* Adjustment Modal */}
      {showAdjustmentModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Adjustment</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <p className="font-medium text-orange-900">Discrepancy Detected</p>
              </div>
              <p className="text-sm text-orange-800">
                {selectedRecord.bankAccount.bankName} - {selectedRecord.bankAccount.accountNumber}
              </p>
              <p className="text-sm text-orange-800 mt-1">
                Difference: {formatCurrency(Math.abs(selectedRecord.discrepancy))}
                {selectedRecord.discrepancy > 0 ? " (System higher)" : " (Bank higher)"}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Type
                </label>
                <select className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]">
                  <option value="System">Adjust System Balance</option>
                  <option value="Bank">Contact Bank to Adjust</option>
                  <option value="Both">Adjust Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Amount
                </label>
                <input
                  type="number"
                  defaultValue={Math.abs(selectedRecord.discrepancy)}
                  className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Adjustment
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain why this adjustment is necessary..."
                  className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                ></textarea>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Approval Required</p>
                <p className="text-xs text-gray-600">
                  This adjustment requires approval from a senior admin. The request will be logged and
                  notified to authorized personnel.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAdjustmentModal(false);
                  setSelectedRecord(null);
                }}
                className="flex-1 px-4 py-2 border border-[#E9EAEB] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Submit Adjustment Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
