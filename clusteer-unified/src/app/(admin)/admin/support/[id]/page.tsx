"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
	ArrowLeft,
	User,
	Mail,
	Phone,
	Calendar,
	Clock,
	AlertCircle,
	CheckCircle,
	MessageSquare,
	Paperclip,
	Send,
	MoreHorizontal,
	Archive,
	Trash2,
	UserPlus,
	Tag,
	Flag,
	X,
} from "lucide-react";

interface Message {
	id: string;
	sender: "user" | "admin";
	senderName: string;
	content: string;
	timestamp: string;
	attachments?: { name: string; size: string; url: string }[];
}

interface TicketDetail {
	id: string;
	user: {
		name: string;
		email: string;
		phone: string;
		avatar?: string;
	};
	subject: string;
	category: string;
	priority: "High" | "Medium" | "Low";
	status: "Open" | "In Progress" | "Resolved" | "Closed";
	created: string;
	updated: string;
	assignee?: string;
	tags: string[];
	messages: Message[];
}

const mockTicket: TicketDetail = {
	id: "TKT-001",
	user: {
		name: "Jacob Jones",
		email: "jacob@example.com",
		phone: "+234 801 234 5678",
	},
	subject: "Unable to complete KYC verification",
	category: "KYC",
	priority: "High",
	status: "Open",
	created: "Jan 16, 2025 10:30 AM",
	updated: "2 min ago",
	assignee: "Admin Sarah",
	tags: ["kyc", "urgent", "document-upload"],
	messages: [
		{
			id: "1",
			sender: "user",
			senderName: "Jacob Jones",
			content: "Hello, I've been trying to complete my KYC verification for the past 2 days but I keep getting an error message when I try to upload my documents. The error says 'Upload failed, please try again'. I've tried multiple times with different files but it's not working.",
			timestamp: "Jan 16, 2025 10:30 AM",
			attachments: [
				{ name: "screenshot-error.png", size: "234 KB", url: "#" },
			],
		},
		{
			id: "2",
			sender: "admin",
			senderName: "Admin Sarah",
			content: "Hi Jacob, thank you for reaching out. I'm sorry to hear you're experiencing this issue. Let me look into this for you. Could you please confirm the file format and size of the documents you're trying to upload?",
			timestamp: "Jan 16, 2025 11:15 AM",
		},
		{
			id: "3",
			sender: "user",
			senderName: "Jacob Jones",
			content: "Sure! I'm trying to upload a JPG file of my National ID, it's about 2.5MB in size. I've also tried with a smaller PNG file (800KB) but got the same error.",
			timestamp: "Jan 16, 2025 11:30 AM",
		},
	],
};

export default function TicketDetailPage() {
	const router = useRouter();
	const params = useParams();
	const [ticket] = useState<TicketDetail>(mockTicket);
	const [newMessage, setNewMessage] = useState("");
	const [selectedStatus, setSelectedStatus] = useState(ticket.status);
	const [selectedPriority, setSelectedPriority] = useState(ticket.priority);
	const [showAssignModal, setShowAssignModal] = useState(false);

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "High":
				return "bg-red-50 text-red-700 border-red-200";
			case "Medium":
				return "bg-orange-50 text-orange-700 border-orange-200";
			case "Low":
				return "bg-blue-50 text-blue-700 border-blue-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Open":
				return "bg-blue-50 text-blue-700";
			case "In Progress":
				return "bg-orange-50 text-orange-700";
			case "Resolved":
				return "bg-green-50 text-green-700";
			case "Closed":
				return "bg-gray-50 text-gray-700";
			default:
				return "bg-gray-50 text-gray-700";
		}
	};

	const handleSendMessage = () => {
		if (!newMessage.trim()) return;
		console.log("Sending message:", newMessage);
		setNewMessage("");
	};

	const handleStatusChange = (status: string) => {
		setSelectedStatus(status as any);
		console.log("Changing status to:", status);
	};

	const handlePriorityChange = (priority: string) => {
		setSelectedPriority(priority as any);
		console.log("Changing priority to:", priority);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/support")}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-gray-600" />
					</button>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
							<span className="text-sm font-medium text-gray-500">#{ticket.id}</span>
						</div>
						<p className="text-sm text-gray-600 mt-1">Created {ticket.created}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<Archive className="w-5 h-5 text-gray-600" />
					</button>
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<Trash2 className="w-5 h-5 text-red-600" />
					</button>
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<MoreHorizontal className="w-5 h-5 text-gray-600" />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content - Messages */}
				<div className="lg:col-span-2 space-y-6">
					{/* Ticket Info Bar */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div>
									<label className="block text-xs text-gray-600 mb-1">Status</label>
									<select
										value={selectedStatus}
										onChange={(e) => handleStatusChange(e.target.value)}
										className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-[#014F01] ${getStatusColor(selectedStatus)}`}
									>
										<option value="Open">Open</option>
										<option value="In Progress">In Progress</option>
										<option value="Resolved">Resolved</option>
										<option value="Closed">Closed</option>
									</select>
								</div>
								<div>
									<label className="block text-xs text-gray-600 mb-1">Priority</label>
									<select
										value={selectedPriority}
										onChange={(e) => handlePriorityChange(e.target.value)}
										className={`px-3 py-1.5 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-[#014F01] ${getPriorityColor(selectedPriority)}`}
									>
										<option value="High">High</option>
										<option value="Medium">Medium</option>
										<option value="Low">Low</option>
									</select>
								</div>
								<div>
									<label className="block text-xs text-gray-600 mb-1">Category</label>
									<span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
										{ticket.category}
									</span>
								</div>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-600">Last updated</p>
								<p className="text-sm font-medium text-gray-900">{ticket.updated}</p>
							</div>
						</div>
					</div>

					{/* Messages */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 space-y-6">
						{ticket.messages.map((message) => (
							<div
								key={message.id}
								className={`flex gap-4 ${message.sender === "admin" ? "flex-row-reverse" : ""}`}
							>
								<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
									<User className="w-5 h-5 text-gray-600" />
								</div>
								<div className={`flex-1 ${message.sender === "admin" ? "items-end" : ""}`}>
									<div className="flex items-center gap-2 mb-2">
										<span className="text-sm font-semibold text-gray-900">{message.senderName}</span>
										<span className="text-xs text-gray-500">{message.timestamp}</span>
										{message.sender === "admin" && (
											<span className="px-2 py-0.5 bg-[#014F01] text-white text-xs font-medium rounded">Admin</span>
										)}
									</div>
									<div
										className={`p-4 rounded-lg ${
											message.sender === "admin"
												? "bg-[#014F01] text-white"
												: "bg-gray-50 text-gray-900"
										}`}
									>
										<p className="text-sm leading-relaxed">{message.content}</p>
									</div>
									{message.attachments && message.attachments.length > 0 && (
										<div className="mt-3 space-y-2">
											{message.attachments.map((attachment, idx) => (
												<a
													key={idx}
													href={attachment.url}
													className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
												>
													<Paperclip className="w-4 h-4 text-gray-600" />
													<div className="flex-1">
														<p className="text-sm font-medium text-gray-900">{attachment.name}</p>
														<p className="text-xs text-gray-500">{attachment.size}</p>
													</div>
												</a>
											))}
										</div>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Reply Box */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
						<div className="mb-3">
							<label className="block text-sm font-medium text-gray-700 mb-2">Reply to {ticket.user.name}</label>
							<textarea
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								placeholder="Type your message here..."
								rows={6}
								className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
							/>
						</div>
						<div className="flex items-center justify-between">
							<button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
								<Paperclip className="w-4 h-4" />
								Attach files
							</button>
							<div className="flex items-center gap-2">
								<button
									onClick={handleSendMessage}
									className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors"
								>
									<Send className="w-4 h-4" />
									Send Reply
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Sidebar - User Info & Actions */}
				<div className="space-y-6">
					{/* User Information */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">User Information</h3>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
									<User className="w-6 h-6 text-gray-600" />
								</div>
								<div>
									<p className="text-sm font-semibold text-gray-900">{ticket.user.name}</p>
									<p className="text-xs text-gray-500">User ID: USR-12345</p>
								</div>
							</div>
							<div className="pt-4 border-t border-gray-100 space-y-3">
								<div className="flex items-center gap-2">
									<Mail className="w-4 h-4 text-gray-400" />
									<span className="text-sm text-gray-900">{ticket.user.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="w-4 h-4 text-gray-400" />
									<span className="text-sm text-gray-900">{ticket.user.phone}</span>
								</div>
							</div>
							<button
								onClick={() => router.push("/admin/users/USR-12345")}
								className="w-full py-2 text-sm text-[#014F01] hover:bg-[#E7F6EC] rounded-lg transition-colors"
							>
								View User Profile
							</button>
						</div>
					</div>

					{/* Assignment */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">Assignment</h3>
						<div className="space-y-3">
							{ticket.assignee ? (
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full bg-[#014F01] flex items-center justify-center">
											<span className="text-xs font-semibold text-white">AS</span>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-900">{ticket.assignee}</p>
											<p className="text-xs text-gray-500">Assigned</p>
										</div>
									</div>
									<button
										onClick={() => setShowAssignModal(true)}
										className="text-sm text-[#014F01] hover:underline"
									>
										Change
									</button>
								</div>
							) : (
								<button
									onClick={() => setShowAssignModal(true)}
									className="w-full flex items-center justify-center gap-2 py-2 border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<UserPlus className="w-4 h-4" />
									Assign to me
								</button>
							)}
						</div>
					</div>

					{/* Tags */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<Tag className="w-4 h-4" />
							Tags
						</h3>
						<div className="flex flex-wrap gap-2">
							{ticket.tags.map((tag, idx) => (
								<span
									key={idx}
									className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
								>
									{tag}
									<button className="hover:text-red-600 transition-colors">
										<X className="w-3 h-3" />
									</button>
								</span>
							))}
							<button className="inline-flex items-center gap-1 px-2 py-1 border border-dashed border-gray-300 text-gray-600 text-xs font-medium rounded hover:bg-gray-50 transition-colors">
								+ Add tag
							</button>
						</div>
					</div>

					{/* Ticket Actions */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
						<div className="space-y-2">
							<button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
								<CheckCircle className="w-4 h-4" />
								Mark as Resolved
							</button>
							<button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
								<Archive className="w-4 h-4" />
								Archive Ticket
							</button>
							<button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
								<Trash2 className="w-4 h-4" />
								Delete Ticket
							</button>
						</div>
					</div>

					{/* Activity Log */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Log</h3>
						<div className="space-y-3">
							<div className="flex items-start gap-2">
								<div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
								<div>
									<p className="text-sm text-gray-900">Ticket opened</p>
									<p className="text-xs text-gray-500">Jan 16, 2025 10:30 AM</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
								<div>
									<p className="text-sm text-gray-900">Assigned to Admin Sarah</p>
									<p className="text-xs text-gray-500">Jan 16, 2025 11:00 AM</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5"></div>
								<div>
									<p className="text-sm text-gray-900">Status changed to In Progress</p>
									<p className="text-xs text-gray-500">Jan 16, 2025 11:15 AM</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
