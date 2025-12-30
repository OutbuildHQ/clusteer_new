"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Search,
	Filter,
	LifeBuoy,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	MessageSquare,
	User,
	Calendar,
	ChevronDown,
	RefreshCw,
	Download,
	Send,
	X,
	MoreHorizontal,
	Eye,
	Trash2,
	Archive,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import SearchBar from "@/components/admin/SearchBar";
import { ConfirmModal } from "@/components/admin/Modal";
import { formatRelativeTime } from "@/lib/date-utils";

interface Ticket {
	id: string;
	user: string;
	email: string;
	subject: string;
	category: "Technical" | "Account" | "Transaction" | "KYC" | "General";
	priority: "High" | "Medium" | "Low";
	status: "Open" | "In Progress" | "Resolved" | "Closed";
	lastMessage: string;
	messages: number;
	created: string;
	updated: string;
	assignee?: string;
}

const mockTickets: Ticket[] = [
	{
		id: "TKT-001",
		user: "Jacob Jones",
		email: "jacob@example.com",
		subject: "Unable to complete KYC verification",
		category: "KYC",
		priority: "High",
		status: "Open",
		lastMessage: "I've uploaded my documents but...",
		messages: 3,
		created: "Jan 16, 2025",
		updated: "2 min ago",
		assignee: "Admin Sarah",
	},
	{
		id: "TKT-002",
		user: "Sarah Wilson",
		email: "sarah@example.com",
		subject: "Transaction not showing in wallet",
		category: "Transaction",
		priority: "High",
		status: "In Progress",
		lastMessage: "The USDT transfer from yesterday...",
		messages: 5,
		created: "Jan 16, 2025",
		updated: "15 min ago",
		assignee: "Admin John",
	},
	{
		id: "TKT-003",
		user: "Mike Johnson",
		email: "mike@example.com",
		subject: "How to increase transaction limits?",
		category: "Account",
		priority: "Medium",
		status: "Open",
		lastMessage: "I need to increase my daily...",
		messages: 1,
		created: "Jan 15, 2025",
		updated: "1 hour ago",
	},
	{
		id: "TKT-004",
		user: "Emma Davis",
		email: "emma@example.com",
		subject: "Password reset not working",
		category: "Technical",
		priority: "Medium",
		status: "Resolved",
		lastMessage: "Thank you! It's working now.",
		messages: 4,
		created: "Jan 15, 2025",
		updated: "2 hours ago",
		assignee: "Admin Sarah",
	},
	{
		id: "TKT-005",
		user: "Tom Brown",
		email: "tom@example.com",
		subject: "Question about fees",
		category: "General",
		priority: "Low",
		status: "Closed",
		lastMessage: "All clear, thanks!",
		messages: 2,
		created: "Jan 14, 2025",
		updated: "1 day ago",
		assignee: "Admin John",
	},
];

export default function SupportPage() {
	const router = useRouter();
	const toast = useToast();
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"All" | Ticket["status"]>("All");
	const [priorityFilter, setPriorityFilter] = useState<"All" | Ticket["priority"]>("All");
	const [categoryFilter, setCategoryFilter] = useState<"All" | Ticket["category"]>("All");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
	const [hoveredRow, setHoveredRow] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
	const [showArchiveModal, setShowArchiveModal] = useState<string | null>(null);

	const stats = {
		open: mockTickets.filter((t) => t.status === "Open").length,
		inProgress: mockTickets.filter((t) => t.status === "In Progress").length,
		resolved: mockTickets.filter((t) => t.status === "Resolved").length,
		avgResponseTime: "2.5 hrs",
	};

	const filteredTickets = mockTickets.filter((ticket) => {
		const matchesSearch =
			ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
		const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
		const matchesCategory = categoryFilter === "All" || ticket.category === categoryFilter;
		return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
	});

	const getPriorityColor = (priority: Ticket["priority"]) => {
		switch (priority) {
			case "High":
				return "bg-red-50 text-red-700 border-red-200";
			case "Medium":
				return "bg-orange-50 text-orange-700 border-orange-200";
			case "Low":
				return "bg-blue-50 text-blue-700 border-blue-200";
		}
	};

	const getStatusColor = (status: Ticket["status"]) => {
		switch (status) {
			case "Open":
				return "bg-blue-50 text-blue-700";
			case "In Progress":
				return "bg-orange-50 text-orange-700";
			case "Resolved":
				return "bg-green-50 text-green-700";
			case "Closed":
				return "bg-gray-50 text-gray-700";
		}
	};

	const getStatusIcon = (status: Ticket["status"]) => {
		switch (status) {
			case "Open":
				return AlertCircle;
			case "In Progress":
				return Clock;
			case "Resolved":
				return CheckCircle;
			case "Closed":
				return XCircle;
		}
	};

	const toggleTicketSelection = (id: string) => {
		const newSelection = new Set(selectedTickets);
		if (newSelection.has(id)) {
			newSelection.delete(id);
		} else {
			newSelection.add(id);
		}
		setSelectedTickets(newSelection);
	};

	const handleBulkAction = async (action: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			console.log(`Performing ${action} on tickets:`, Array.from(selectedTickets));
			toast.success('Action completed', `${selectedTickets.size} ticket(s) ${action}ed successfully`);
			setSelectedTickets(new Set());
		} catch (error) {
			toast.error('Action failed', 'An error occurred while processing tickets');
		} finally {
			setIsLoading(false);
		}
	};

	const handleArchiveTicket = async (ticketId: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			toast.success('Ticket archived', 'Ticket has been archived successfully');
			setShowArchiveModal(null);
		} catch (error) {
			toast.error('Archive failed', 'An error occurred while archiving the ticket');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteTicket = async (ticketId: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			toast.success('Ticket deleted', 'Ticket has been permanently deleted');
			setShowDeleteModal(null);
		} catch (error) {
			toast.error('Delete failed', 'An error occurred while deleting the ticket');
		} finally {
			setIsLoading(false);
		}
	};

	const handleRefresh = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			toast.success('Refreshed', 'Ticket list has been updated');
		} catch (error) {
			toast.error('Refresh failed', 'An error occurred while refreshing');
		} finally {
			setIsLoading(false);
		}
	};

	const handleExport = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			toast.success('Export successful', `Exported ${filteredTickets.length} tickets`);
		} catch (error) {
			toast.error('Export failed', 'An error occurred while exporting tickets');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{isLoading && <LoadingSpinner overlay />}

			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
					<p className="text-sm text-gray-600 mt-1">Manage customer support requests</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExport}
						className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
					>
						<Download className="w-4 h-4" />
						Export
					</button>
					<button
						onClick={handleRefresh}
						className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
					>
						<RefreshCw className="w-4 h-4" />
						Refresh
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-blue-100 rounded-lg">
							<AlertCircle className="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium mb-1">Open Tickets</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">{stats.open}</p>
					<p className="text-xs text-blue-600 font-medium">Needs attention</p>
				</div>

				<div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-orange-100 rounded-lg">
							<Clock className="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium mb-1">In Progress</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">{stats.inProgress}</p>
					<p className="text-xs text-orange-600 font-medium">Being handled</p>
				</div>

				<div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-green-100 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium mb-1">Resolved</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">{stats.resolved}</p>
					<p className="text-xs text-green-600 font-medium">Completed today</p>
				</div>

				<div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-emerald-100 rounded-lg">
							<MessageSquare className="w-6 h-6 text-emerald-600" />
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium mb-1">Avg Response</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">{stats.avgResponseTime}</p>
					<p className="text-xs text-emerald-600 font-medium">Response time</p>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<div className="flex items-center gap-4 mb-4">
					<div className="flex-1">
						<SearchBar
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search tickets by ID, user, or subject..."
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
					>
						<Filter className="w-4 h-4" />
						Filters
						<ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
					</button>
				</div>

				{/* Filter Dropdowns */}
				{showFilters && (
					<div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E9EAEB] animate-in fade-in slide-in-from-top-2 duration-200">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value as any)}
								className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
							>
								<option value="All">All Statuses</option>
								<option value="Open">Open</option>
								<option value="In Progress">In Progress</option>
								<option value="Resolved">Resolved</option>
								<option value="Closed">Closed</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
							<select
								value={priorityFilter}
								onChange={(e) => setPriorityFilter(e.target.value as any)}
								className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
							>
								<option value="All">All Priorities</option>
								<option value="High">High</option>
								<option value="Medium">Medium</option>
								<option value="Low">Low</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
							<select
								value={categoryFilter}
								onChange={(e) => setCategoryFilter(e.target.value as any)}
								className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
							>
								<option value="All">All Categories</option>
								<option value="Technical">Technical</option>
								<option value="Account">Account</option>
								<option value="Transaction">Transaction</option>
								<option value="KYC">KYC</option>
								<option value="General">General</option>
							</select>
						</div>
					</div>
				)}
			</div>

			{/* Bulk Actions Bar */}
			{selectedTickets.size > 0 && (
				<div className="bg-[#014F01] text-white rounded-lg p-4 flex items-center justify-between animate-in slide-in-from-bottom duration-300">
					<div className="flex items-center gap-4">
						<span className="font-medium">{selectedTickets.size} ticket(s) selected</span>
						<div className="flex items-center gap-2">
							<button
								onClick={() => handleBulkAction("assign")}
								className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
							>
								Assign
							</button>
							<button
								onClick={() => handleBulkAction("archive")}
								className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
							>
								Archive
							</button>
							<button
								onClick={() => handleBulkAction("close")}
								className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
							>
								Close
							</button>
						</div>
					</div>
					<button
						onClick={() => setSelectedTickets(new Set())}
						className="p-2 hover:bg-white/20 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			)}

			{/* Tickets Table */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-[#E9EAEB]">
							<tr>
								<th className="w-12 py-3 px-4">
									<input
										type="checkbox"
										checked={selectedTickets.size === filteredTickets.length && filteredTickets.length > 0}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedTickets(new Set(filteredTickets.map((t) => t.id)));
											} else {
												setSelectedTickets(new Set());
											}
										}}
										className="w-4 h-4 rounded border-gray-300 cursor-pointer"
									/>
								</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Ticket ID</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">User</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Subject</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Category</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Priority</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Status</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Updated</th>
								<th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filteredTickets.map((ticket) => {
								const StatusIcon = getStatusIcon(ticket.status);
								return (
									<tr
										key={ticket.id}
										className="hover:bg-gray-50 transition-colors group cursor-pointer"
										onMouseEnter={() => setHoveredRow(ticket.id)}
										onMouseLeave={() => setHoveredRow(null)}
										onClick={() => router.push(`/admin/support/${ticket.id}`)}
									>
										<td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
											<input
												type="checkbox"
												checked={selectedTickets.has(ticket.id)}
												onChange={() => toggleTicketSelection(ticket.id)}
												className="w-4 h-4 rounded border-gray-300 cursor-pointer"
											/>
										</td>
										<td className="py-4 px-4">
											<span className="text-sm font-medium text-[#014F01]">{ticket.id}</span>
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
													<User className="w-4 h-4 text-gray-600" />
												</div>
												<div>
													<p className="text-sm font-medium text-gray-900">{ticket.user}</p>
													<p className="text-xs text-gray-500">{ticket.email}</p>
												</div>
											</div>
										</td>
										<td className="py-4 px-4 max-w-xs">
											<p className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</p>
											<p className="text-xs text-gray-500 truncate mt-0.5">{ticket.lastMessage}</p>
											<div className="flex items-center gap-1 mt-1">
												<MessageSquare className="w-3 h-3 text-gray-400" />
												<span className="text-xs text-gray-500">{ticket.messages} messages</span>
											</div>
										</td>
										<td className="py-4 px-4">
											<span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
												{ticket.category}
											</span>
										</td>
										<td className="py-4 px-4">
											<span className={`inline-flex items-center px-2 py-1 border text-xs font-medium rounded ${getPriorityColor(ticket.priority)}`}>
												{ticket.priority}
											</span>
										</td>
										<td className="py-4 px-4">
											<span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded ${getStatusColor(ticket.status)}`}>
												<StatusIcon className="w-3 h-3" />
												{ticket.status}
											</span>
										</td>
										<td className="py-4 px-4">
											<div className="text-sm text-gray-900">{ticket.updated}</div>
											{ticket.assignee && <div className="text-xs text-gray-500 mt-0.5">{ticket.assignee}</div>}
										</td>
										<td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
											{hoveredRow === ticket.id ? (
												<div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
													<button
														onClick={() => router.push(`/admin/support/${ticket.id}`)}
														className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
														title="View ticket"
													>
														<Eye className="w-4 h-4 text-gray-600" />
													</button>
													<button
														onClick={() => setShowArchiveModal(ticket.id)}
														className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
														title="Archive ticket"
													>
														<Archive className="w-4 h-4 text-gray-600" />
													</button>
													<button
														onClick={() => setShowDeleteModal(ticket.id)}
														className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
														title="Delete ticket"
													>
														<Trash2 className="w-4 h-4 text-red-600" />
													</button>
												</div>
											) : (
												<div className="w-full h-8"></div>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				{/* Empty State */}
				{filteredTickets.length === 0 && (
					<div className="text-center py-12">
						<LifeBuoy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
						<h3 className="text-sm font-medium text-gray-900 mb-1">No tickets found</h3>
						<p className="text-sm text-gray-500">Try adjusting your search or filters</p>
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={!!showDeleteModal}
				onClose={() => setShowDeleteModal(null)}
				onConfirm={() => showDeleteModal && handleDeleteTicket(showDeleteModal)}
				title="Delete Ticket?"
				message="This action cannot be undone. This will permanently delete the support ticket and all associated messages."
				confirmText="Delete Ticket"
				variant="danger"
			/>

			{/* Archive Confirmation Modal */}
			<ConfirmModal
				isOpen={!!showArchiveModal}
				onClose={() => setShowArchiveModal(null)}
				onConfirm={() => showArchiveModal && handleArchiveTicket(showArchiveModal)}
				title="Archive Ticket?"
				message="This will move the ticket to the archive. You can restore it later if needed."
				confirmText="Archive Ticket"
				variant="primary"
			/>
		</div>
	);
}

