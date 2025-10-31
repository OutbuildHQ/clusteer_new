"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupportTickets, createSupportTicket, type SupportTicket } from "@/lib/api/support";
import { Toast } from "@/components/toast";
import {
	Search,
	Clock,
	Shield,
	XCircle,
	Scale,
	AlertCircle,
	DollarSign,
	ChevronDown,
	MessageCircle,
	Phone,
	Globe,
	Headphones,
	Send,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const HELP_TOPICS = [
	{
		icon: Clock,
		title: "Pending order",
		slug: "pending-order",
		description: "Understand the common reasons your crypto fiat order may be delayed, and what steps to take to resolve it.",
	},
	{
		icon: Shield,
		title: "Account verification",
		slug: "account-verification",
		description: "A simple guide to completing your KYC, uploading documents, and unlocking higher transaction thresholds.",
	},
	{
		icon: XCircle,
		title: "Failed transaction",
		slug: "failed-transaction",
		description: "Troubleshoot payment issues, check network statuses, and request support for failed or stuck transactions.",
	},
	{
		icon: Scale,
		title: "Fees, exchange rates",
		slug: "fees-exchange-rates",
		description: "Learn about Clusteer's transparent fee structure, how rates are determined, and where to view them.",
	},
	{
		icon: AlertCircle,
		title: "Fraud, suspicious activity",
		slug: "fraud-suspicious-activity",
		description: "Protect your account by reporting unauthorized actions, phishing, or any suspicious behavior you've noticed.",
	},
	{
		icon: DollarSign,
		title: "Fast, secure withdrawal",
		slug: "fast-secure-withdrawal",
		description: "Step-by-step guide on how to initiate withdrawals, typical processing times, and tips to ensure smooth transactions.",
	},
];

export default function SupportPage() {
	const user = useUser();
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState("");
	const [showNewTicketForm, setShowNewTicketForm] = useState(false);
	const [showLiveChat, setShowLiveChat] = useState(false);
	const [statusFilter, setStatusFilter] = useState("All");
	const [showStatusDropdown, setShowStatusDropdown] = useState(false);
	const [chatMessage, setChatMessage] = useState("");

	const [newTicket, setNewTicket] = useState({
		subject: "",
		category: "general",
		description: "",
		priority: "medium",
	});

	// Check for hash in URL to open modals
	useEffect(() => {
		const hash = window.location.hash;
		if (hash === "#create-ticket") {
			setShowNewTicketForm(true);
			// Clear the hash
			window.history.replaceState(null, "", window.location.pathname);
		} else if (hash === "#live-chat") {
			setShowLiveChat(true);
			// Clear the hash
			window.history.replaceState(null, "", window.location.pathname);
		}
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (showStatusDropdown) {
				const target = event.target as HTMLElement;
				if (!target.closest('.status-filter-dropdown')) {
					setShowStatusDropdown(false);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showStatusDropdown]);

	const { data: tickets, isLoading: ticketsLoading } = useQuery({
		queryKey: ["support-tickets", user?.id],
		queryFn: () => getSupportTickets(user!.id),
		enabled: !!user?.id,
	});

	const statusOptions = ["All", "Open", "In Progress", "Waiting Response", "Resolved", "Closed"];

	const createTicketMutation = useMutation({
		mutationFn: () =>
			createSupportTicket(user!.id, {
				user_email: user!.user!.email,
				user_name: `${user!.user!.firstName} ${user!.user!.lastName}`,
				...newTicket,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
			setShowNewTicketForm(false);
			setNewTicket({ subject: "", category: "general", description: "", priority: "medium" });
			Toast.success("Support ticket created successfully");
		},
		onError: () => {
			Toast.error("Failed to create support ticket");
		},
	});

	const handleSubmitTicket = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTicket.subject || !newTicket.description) {
			Toast.error("Please fill in all required fields");
			return;
		}
		createTicketMutation.mutate();
	};

	const filteredTickets = tickets?.filter((ticket: SupportTicket) => {
		const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "All" || ticket.status === statusFilter.toLowerCase().replace(" ", "_");
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
			{/* Header */}
			<header className="mb-8">
				<div className="flex items-center justify-between mb-2">
					<h1 className="text-[#0D0D0D] font-semibold text-2xl">Welcome back, {user?.user?.firstName}</h1>
				</div>
				<p className="text-sm text-[#667085]">
					{new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
				</p>
			</header>

			{/* Search Bar */}
			<div className="mb-8">
				<h2 className="text-lg font-semibold text-[#0D0D0D] mb-4">Need help?</h2>
				<div className="relative">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085]" />
					<input
						type="text"
						placeholder="Type your question..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 border border-[#E9EAEB] rounded-xl focus:ring-2 focus:ring-[#11C211] focus:border-transparent text-sm"
					/>
					<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#667085] bg-[#F9FAFB] px-2 py-1 rounded border border-[#E9EAEB]">
						⌘K
					</span>
				</div>
			</div>

			{/* Help Topics Grid */}
			<div className="mb-8">
				<h2 className="text-lg font-semibold text-[#0D0D0D] mb-4">Explore all topics</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{HELP_TOPICS.map((topic, index) => {
						const Icon = topic.icon;
						return (
							<Link
								key={index}
								href={`/support/help/${topic.slug}`}
								className="block bg-[#F7F9FA] hover:bg-white border border-[#E9EAEB] rounded-xl p-6 transition-all cursor-pointer group"
							>
								<Icon className="w-8 h-8 text-[#0D4222] mb-3" />
								<h3 className="font-semibold text-[#0D0D0D] mb-2">{topic.title}</h3>
								<p className="text-sm text-[#667085] leading-relaxed">{topic.description}</p>
							</Link>
						);
					})}
				</div>
			</div>

			{/* Chat CTA */}
			<div className="mb-8 bg-white border border-[#E9EAEB] rounded-xl p-6 flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-[#0D0D0D] mb-1">Still need help?</p>
				</div>
				<Button
					onClick={() => setShowLiveChat(true)}
					variant="outline"
					className="border-[#D5D7DA] h-10 px-6 rounded-full font-semibold"
				>
					Chat with us
				</Button>
			</div>

			{/* Live Chat Modal */}
			{showLiveChat && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl max-w-2xl w-full h-[600px] flex flex-col">
						{/* Chat Header */}
						<div className="flex items-center justify-between p-6 border-b border-[#E9EAEB]">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-[#11C211] rounded-full flex items-center justify-center">
									<Headphones className="w-5 h-5 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-[#0D0D0D]">Live Chat Support</h3>
									<p className="text-xs text-[#667085]">We typically reply instantly</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setShowLiveChat(false)}
								className="text-[#667085] hover:text-[#0D0D0D]"
							>
								<XCircle className="w-6 h-6" />
							</button>
						</div>

						{/* Chat Messages */}
						<div className="flex-1 overflow-y-auto p-6 space-y-4">
							{/* Welcome Message */}
							<div className="flex gap-3">
								<div className="flex-shrink-0 w-8 h-8 bg-[#E7F6EC] rounded-full flex items-center justify-center">
									<Headphones className="w-4 h-4 text-[#0D4222]" />
								</div>
								<div className="flex-1">
									<div className="inline-block bg-[#F9FAFB] p-3 rounded-lg">
										<p className="text-sm text-[#0D0D0D]">
											👋 Hi {user?.user?.firstName}! How can we help you today?
										</p>
									</div>
									<p className="text-xs text-[#667085] mt-1">Just now</p>
								</div>
							</div>

							{/* Information Card */}
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<h4 className="font-semibold text-sm text-[#0D0D0D] mb-2">Quick Actions</h4>
								<div className="space-y-2">
									<button
										onClick={() => {
											setShowLiveChat(false);
											setShowNewTicketForm(true);
										}}
										className="w-full text-left text-sm text-[#0D0D0D] hover:bg-blue-100 p-2 rounded transition-colors"
									>
										📝 Submit a support ticket
									</button>
									<button className="w-full text-left text-sm text-[#0D0D0D] hover:bg-blue-100 p-2 rounded transition-colors">
										📞 Request a callback
									</button>
									<a
										href="tel:8001134246"
										className="block w-full text-left text-sm text-[#0D0D0D] hover:bg-blue-100 p-2 rounded transition-colors"
									>
										☎️ Call us: 8001134246
									</a>
								</div>
							</div>
						</div>

						{/* Chat Input */}
						<div className="p-6 border-t border-[#E9EAEB]">
							<div className="bg-[#F9FAFB] border border-[#E9EAEB] rounded-lg p-3 text-center mb-3">
								<p className="text-sm text-[#667085]">
									🤖 Our AI assistant is currently being set up. For immediate assistance, please submit a ticket or call us.
								</p>
							</div>
							<div className="flex gap-3">
								<input
									type="text"
									value={chatMessage}
									onChange={(e) => setChatMessage(e.target.value)}
									placeholder="Type your message..."
									disabled
									className="flex-1 px-4 py-3 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent disabled:bg-[#F9FAFB] disabled:cursor-not-allowed"
								/>
								<Button
									disabled
									className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-auto px-6 rounded-lg font-semibold"
								>
									<Send className="w-4 h-4 mr-2" />
									Send
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* New Ticket Form Modal/Section */}
			{showNewTicketForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<form onSubmit={handleSubmitTicket} className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h3 className="font-semibold text-xl text-[#0D0D0D]">Submit a ticket</h3>
								<button
									type="button"
									onClick={() => setShowNewTicketForm(false)}
									className="text-[#667085] hover:text-[#0D0D0D]"
								>
									<XCircle className="w-6 h-6" />
								</button>
							</div>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-[#0D0D0D] mb-2">Subject *</label>
									<input
										type="text"
										value={newTicket.subject}
										onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
										className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent"
										placeholder="Brief description of your issue"
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-[#0D0D0D] mb-2">Category</label>
										<select
											value={newTicket.category}
											onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
											className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent"
										>
											<option value="account">Account Issues</option>
											<option value="transaction">Transaction Issues</option>
											<option value="verification">Verification</option>
											<option value="security">Security Concerns</option>
											<option value="technical">Technical Support</option>
											<option value="general">General Inquiry</option>
											<option value="other">Other</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-[#0D0D0D] mb-2">Priority</label>
										<select
											value={newTicket.priority}
											onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
											className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent"
										>
											<option value="low">Low</option>
											<option value="medium">Medium</option>
											<option value="high">High</option>
											<option value="urgent">Urgent</option>
										</select>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-[#0D0D0D] mb-2">Description *</label>
									<textarea
										value={newTicket.description}
										onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
										rows={6}
										className="w-full px-4 py-2.5 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent"
										placeholder="Please provide as much detail as possible"
										required
									/>
								</div>
								<div className="flex gap-3 pt-4">
									<Button
										type="submit"
										disabled={createTicketMutation.isPending}
										className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-11 px-8 rounded-full font-semibold"
									>
										{createTicketMutation.isPending ? "Submitting..." : "Submit ticket"}
									</Button>
									<Button
										type="button"
										onClick={() => setShowNewTicketForm(false)}
										variant="outline"
										className="border-[#D5D7DA] h-11 px-8 rounded-full font-semibold"
									>
										Cancel
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* My Tickets Section */}
			<div className="mb-8">
				<h2 className="text-lg font-semibold text-[#0D0D0D] mb-4">My tickets</h2>
				<div className="bg-white border border-[#E9EAEB] rounded-xl p-6">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="font-semibold text-[#0D0D0D] mb-1">Need assistance?</h3>
							<p className="text-sm text-[#667085]">Fill in the form and we will reply within 24 hours</p>
						</div>
					</div>

					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2 relative status-filter-dropdown">
							<span className="text-sm text-[#667085]">Active statuses:</span>
							<button
								onClick={() => setShowStatusDropdown(!showStatusDropdown)}
								className="flex items-center gap-1 text-sm font-medium text-[#0D0D0D] hover:bg-[#F9FAFB] px-3 py-1.5 rounded-lg transition-colors"
							>
								{statusFilter}
								<ChevronDown className="w-4 h-4" />
							</button>
							{showStatusDropdown && (
								<div className="absolute top-full left-20 mt-1 bg-white border border-[#E9EAEB] rounded-lg shadow-lg z-10 min-w-[160px]">
									{statusOptions.map((status) => (
										<button
											key={status}
											onClick={() => {
												setStatusFilter(status);
												setShowStatusDropdown(false);
											}}
											className="w-full text-left px-4 py-2 text-sm hover:bg-[#F9FAFB] first:rounded-t-lg last:rounded-b-lg transition-colors"
										>
											{status}
										</button>
									))}
								</div>
							)}
						</div>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
							<input
								type="text"
								placeholder="Search"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 pr-4 py-2 border border-[#E9EAEB] rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#11C211] focus:border-transparent"
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#667085]">⌘K</span>
						</div>
					</div>

					{ticketsLoading ? (
						<div className="py-12 text-center">
							<p className="text-[#667085]">Loading tickets...</p>
						</div>
					) : !filteredTickets || filteredTickets.length === 0 ? (
						<div className="py-12 text-center">
							<MessageCircle className="w-12 h-12 mx-auto text-[#667085] mb-4" />
							<h3 className="font-semibold text-lg text-[#0D0D0D] mb-2">You don't have any tickets</h3>
							<Button
								onClick={() => setShowNewTicketForm(true)}
								className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-11 px-6 rounded-full font-semibold mt-4"
							>
								<MessageCircle className="w-4 h-4 mr-2" />
								Submit a ticket
							</Button>
						</div>
					) : (
						<div className="space-y-3">
							{filteredTickets.map((ticket: SupportTicket) => (
								<Link
									key={ticket.id}
									href={`/support/${ticket.ticket_number}`}
									className="block border border-[#E9EAEB] rounded-lg p-4 hover:bg-[#F9FAFB] transition-colors"
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="text-xs font-medium text-[#667085]">#{ticket.ticket_number}</span>
												<Badge
													className={`text-xs ${
														ticket.status === "open"
															? "bg-blue-100 text-blue-800"
															: ticket.status === "resolved"
															? "bg-green-100 text-green-800"
															: "bg-gray-100 text-gray-800"
													}`}
												>
													{ticket.status.replace("_", " ")}
												</Badge>
											</div>
											<h4 className="font-medium text-[#0D0D0D] mb-1">{ticket.subject}</h4>
											<p className="text-sm text-[#667085] line-clamp-2">{ticket.description}</p>
										</div>
										<span className="text-xs text-[#667085] ml-4">
											{new Date(ticket.created_at).toLocaleDateString()}
										</span>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Contact Us Section */}
			<div className="bg-white border border-[#E9EAEB] rounded-xl p-6">
				<h2 className="text-lg font-semibold text-[#0D0D0D] mb-6">Contact us</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<h3 className="font-semibold text-[#0D0D0D] mb-2">Phone</h3>
						<p className="text-sm text-[#667085] mb-3">
							Want to speak to our support team? Call us on 8001134246
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-[#0D0D0D] mb-2">Live chat</h3>
						<p className="text-sm text-[#667085] mb-3">
							Can't find the answers you're looking for? Start by chatting with our Intelligent Assistant
						</p>
						<Button
							onClick={() => setShowLiveChat(true)}
							variant="outline"
							className="border-[#D5D7DA] h-10 px-6 rounded-full font-semibold"
						>
							Start chat
						</Button>
					</div>
				</div>
				<div className="pt-6 border-t border-[#E9EAEB]">
					<h3 className="font-semibold text-[#0D0D0D] mb-4">Working hours</h3>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-[#667085] mb-1">Availability</p>
							<p className="font-medium text-[#0D0D0D]">Online 24/7</p>
						</div>
						<div>
							<p className="text-sm text-[#667085] mb-1">Language</p>
							<p className="font-medium text-[#0D0D0D]">English</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
