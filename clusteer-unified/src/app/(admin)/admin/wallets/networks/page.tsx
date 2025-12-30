"use client";

import { useState, useEffect } from "react";
import {
  Network,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Edit2,
  Zap,
  DollarSign,
  Activity,
  Shield,
  ToggleLeft,
  ToggleRight,
  Plus,
} from "lucide-react";

interface NetworkConfig {
  id: string;
  name: string;
  code: "TRC20" | "BEP20" | "SOL" | "ETH" | "MATIC";
  blockchain: "Tron" | "BSC" | "Solana" | "Ethereum" | "Polygon";
  currency: "USDT" | "USDC" | "ETH" | "SOL" | "MATIC";
  status: "Active" | "Inactive" | "Maintenance";
  isEnabled: boolean;
  fees: {
    withdrawal: number;
    deposit: number;
    gas: number;
  };
  limits: {
    minWithdrawal: number;
    maxWithdrawal: number;
    minDeposit: number;
    maxDeposit: number;
    dailyLimit: number;
  };
  stats: {
    totalDeposits: number;
    totalWithdrawals: number;
    depositCount: number;
    withdrawalCount: number;
    avgConfirmationTime: number; // in minutes
    successRate: number; // percentage
  };
  confirmations: {
    required: number;
    current: number;
  };
  lastActivity: string;
  explorerUrl: string;
  rpcUrl: string;
  contractAddress?: string;
}

export default function NetworkManagementPage() {
  const [networks, setNetworks] = useState<NetworkConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig | null>(null);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockNetworks: NetworkConfig[] = [
      {
        id: "NET001",
        name: "Tron (USDT)",
        code: "TRC20",
        blockchain: "Tron",
        currency: "USDT",
        status: "Active",
        isEnabled: true,
        fees: {
          withdrawal: 1.0,
          deposit: 0,
          gas: 0.5,
        },
        limits: {
          minWithdrawal: 10,
          maxWithdrawal: 50000,
          minDeposit: 5,
          maxDeposit: 100000,
          dailyLimit: 500000,
        },
        stats: {
          totalDeposits: 1234567.89,
          totalWithdrawals: 987654.32,
          depositCount: 1247,
          withdrawalCount: 856,
          avgConfirmationTime: 2.5,
          successRate: 99.8,
        },
        confirmations: {
          required: 19,
          current: 19,
        },
        lastActivity: "2024-12-28 14:32",
        explorerUrl: "https://tronscan.org",
        rpcUrl: "https://api.trongrid.io",
        contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      },
      {
        id: "NET002",
        name: "Binance Smart Chain (USDT)",
        code: "BEP20",
        blockchain: "BSC",
        currency: "USDT",
        status: "Active",
        isEnabled: true,
        fees: {
          withdrawal: 0.8,
          deposit: 0,
          gas: 0.3,
        },
        limits: {
          minWithdrawal: 10,
          maxWithdrawal: 50000,
          minDeposit: 5,
          maxDeposit: 100000,
          dailyLimit: 500000,
        },
        stats: {
          totalDeposits: 876543.21,
          totalWithdrawals: 654321.98,
          depositCount: 456,
          withdrawalCount: 312,
          avgConfirmationTime: 1.8,
          successRate: 99.5,
        },
        confirmations: {
          required: 15,
          current: 15,
        },
        lastActivity: "2024-12-28 14:15",
        explorerUrl: "https://bscscan.com",
        rpcUrl: "https://bsc-dataseed.binance.org",
        contractAddress: "0x55d398326f99059fF775485246999027B3197955",
      },
      {
        id: "NET003",
        name: "Solana (USDC)",
        code: "SOL",
        blockchain: "Solana",
        currency: "USDC",
        status: "Active",
        isEnabled: true,
        fees: {
          withdrawal: 0.5,
          deposit: 0,
          gas: 0.000005,
        },
        limits: {
          minWithdrawal: 10,
          maxWithdrawal: 50000,
          minDeposit: 5,
          maxDeposit: 100000,
          dailyLimit: 500000,
        },
        stats: {
          totalDeposits: 543210.87,
          totalWithdrawals: 432109.76,
          depositCount: 234,
          withdrawalCount: 189,
          avgConfirmationTime: 0.5,
          successRate: 98.9,
        },
        confirmations: {
          required: 1,
          current: 1,
        },
        lastActivity: "2024-12-28 13:45",
        explorerUrl: "https://explorer.solana.com",
        rpcUrl: "https://api.mainnet-beta.solana.com",
        contractAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      },
      {
        id: "NET004",
        name: "Ethereum (USDT)",
        code: "ETH",
        blockchain: "Ethereum",
        currency: "USDT",
        status: "Maintenance",
        isEnabled: false,
        fees: {
          withdrawal: 5.0,
          deposit: 0,
          gas: 15.0,
        },
        limits: {
          minWithdrawal: 50,
          maxWithdrawal: 50000,
          minDeposit: 20,
          maxDeposit: 100000,
          dailyLimit: 500000,
        },
        stats: {
          totalDeposits: 234567.89,
          totalWithdrawals: 123456.78,
          depositCount: 89,
          withdrawalCount: 67,
          avgConfirmationTime: 12.0,
          successRate: 97.5,
        },
        confirmations: {
          required: 12,
          current: 12,
        },
        lastActivity: "2024-12-27 18:30",
        explorerUrl: "https://etherscan.io",
        rpcUrl: "https://mainnet.infura.io",
        contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      },
    ];

    setNetworks(mockNetworks);
    setIsLoading(false);
  }, []);

  const handleToggleNetwork = (networkId: string) => {
    setNetworks((prev) =>
      prev.map((net) =>
        net.id === networkId ? { ...net, isEnabled: !net.isEnabled } : net
      )
    );
  };

  const handleEdit = (network: NetworkConfig) => {
    setSelectedNetwork(network);
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-700 bg-green-50 border-green-200";
      case "Maintenance":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "Inactive":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getNetworkIcon = (code: string) => {
    const colors: Record<string, string> = {
      TRC20: "from-red-500 to-red-600",
      BEP20: "from-yellow-500 to-yellow-600",
      SOL: "from-purple-500 to-purple-600",
      ETH: "from-blue-500 to-blue-600",
      MATIC: "from-purple-700 to-purple-800",
    };
    return colors[code] || "from-[#014F01] to-[#B8E632]";
  };

  const totalVolume = networks.reduce((sum, net) => sum + net.stats.totalDeposits + net.stats.totalWithdrawals, 0);
  const activeNetworks = networks.filter((net) => net.status === "Active").length;
  const avgSuccessRate = networks.reduce((sum, net) => sum + net.stats.successRate, 0) / networks.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#014F01] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading network configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Management</h1>
          <p className="text-gray-600 mt-1">Configure blockchain networks and transaction settings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013800] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Network
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
          <div className="flex items-center justify-between mb-2">
            <Network className="h-5 w-5 text-[#014F01]" />
            <span className="text-xs text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeNetworks}/{networks.length}</p>
          <p className="text-sm text-gray-600 mt-1">Active Networks</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-xs text-gray-600">All Networks</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalVolume.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Total Volume</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-xs text-gray-600">Average</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgSuccessRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600 mt-1">Success Rate</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <span className="text-xs text-gray-600">Fastest</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.min(...networks.map((n) => n.stats.avgConfirmationTime)).toFixed(1)}m
          </p>
          <p className="text-sm text-gray-600 mt-1">Confirmation Time</p>
        </div>
      </div>

      {/* Networks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {networks.map((network) => (
          <div
            key={network.id}
            className="bg-white rounded-lg border border-[#E9EAEB] p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getNetworkIcon(network.code)} flex items-center justify-center`}>
                  <Network className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{network.name}</h3>
                  <p className="text-sm text-gray-600">{network.blockchain} • {network.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(network.status)}`}>
                  {network.status}
                </span>
                <button
                  onClick={() => handleToggleNetwork(network.id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title={network.isEnabled ? "Disable Network" : "Enable Network"}
                >
                  {network.isEnabled ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Deposits
                </p>
                <p className="text-lg font-semibold text-green-700">
                  ${network.stats.totalDeposits.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">{network.stats.depositCount} transactions</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 rotate-180" />
                  Withdrawals
                </p>
                <p className="text-lg font-semibold text-red-700">
                  ${network.stats.totalWithdrawals.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">{network.stats.withdrawalCount} transactions</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-[#E9EAEB]">
              <div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Confirmation
                </p>
                <p className="text-sm font-semibold text-gray-900">{network.stats.avgConfirmationTime}m</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Success Rate
                </p>
                <p className="text-sm font-semibold text-green-600">{network.stats.successRate}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Confirmations
                </p>
                <p className="text-sm font-semibold text-gray-900">{network.confirmations.required}</p>
              </div>
            </div>

            {/* Fees */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Fee Structure</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-600">Withdrawal</p>
                  <p className="font-semibold text-gray-900">${network.fees.withdrawal}</p>
                </div>
                <div>
                  <p className="text-gray-600">Deposit</p>
                  <p className="font-semibold text-gray-900">${network.fees.deposit}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gas</p>
                  <p className="font-semibold text-gray-900">${network.fees.gas}</p>
                </div>
              </div>
            </div>

            {/* Limits */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Transaction Limits</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-600">Min Withdrawal</p>
                  <p className="font-semibold text-gray-900">${network.limits.minWithdrawal}</p>
                </div>
                <div>
                  <p className="text-gray-600">Max Withdrawal</p>
                  <p className="font-semibold text-gray-900">${network.limits.maxWithdrawal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Daily Limit</p>
                  <p className="font-semibold text-gray-900">${network.limits.dailyLimit.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9EAEB]">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Activity className="h-3 w-3" />
                Last activity: {new Date(network.lastActivity).toLocaleString()}
              </div>
              <button
                onClick={() => handleEdit(network)}
                className="flex items-center gap-1 px-3 py-1 border border-[#E9EAEB] rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedNetwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Network Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Network Name</label>
                  <input
                    type="text"
                    defaultValue={selectedNetwork.name}
                    className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]">
                    <option>Active</option>
                    <option>Maintenance</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#E9EAEB] pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Fee Configuration</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Fee</label>
                    <input
                      type="number"
                      defaultValue={selectedNetwork.fees.withdrawal}
                      className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Fee</label>
                    <input
                      type="number"
                      defaultValue={selectedNetwork.fees.deposit}
                      className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gas Fee</label>
                    <input
                      type="number"
                      defaultValue={selectedNetwork.fees.gas}
                      className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E9EAEB] pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Transaction Limits</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Withdrawal</label>
                    <input
                      type="number"
                      defaultValue={selectedNetwork.limits.minWithdrawal}
                      className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Withdrawal</label>
                    <input
                      type="number"
                      defaultValue={selectedNetwork.limits.maxWithdrawal}
                      className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Limit</label>
                    <input
                      type="number"
                      defaultValue={selectedNetwork.limits.dailyLimit}
                      className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Confirmations</label>
                    <input
                      type="number"
                      defaultValue={selectedNetwork.confirmations.required}
                      className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedNetwork(null);
                }}
                className="flex-1 px-4 py-2 border border-[#E9EAEB] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013800] transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
