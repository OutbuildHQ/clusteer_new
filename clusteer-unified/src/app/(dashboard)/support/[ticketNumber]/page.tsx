"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTicketDetail, addTicketMessage, type SupportTicket, type TicketMessage } from "@/lib/api/support";
import { Toast } from "@/components/toast";
import { ArrowLeft, Send, User, Headphones } from "lucide-react";

export default function TicketDetailPage() {
	const params = useParams();
	const router = useRouter();
	const user = useUser();
	const queryClient = useQueryClient();
	const ticketNumber = params.ticketNumber as string;

	const [newMessage, setNewMessage] = useState("");

	const { data: ticket, isLoading } = useQuery({
		queryKey: ["ticket-detail", ticketNumber, user?.id],
		queryFn: () => getTicketDetail(user!.id, ticketNumber),
		enabled: !!user?.id && !!ticketNumber,
	});

	const addMessageMutation = useMutation({
		mutationFn: () =>
			addTicketMessage(user!.id, ticketNumber, {
				sender_id: user!.id,
				sender_name: `${user!.user!.firstName} ${user!.user!.lastName}`,
				message: newMessage,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ticket-detail", ticketNumber] });
			setNewMessage("");
			Toast.success("Message sent successfully");
		},
		onError: () => {
			Toast.error("Failed to send message");
		},
	});

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) {
			Toast.error("Please enter a message");
			return;
		}
		addMessageMutation.mutate();
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "open": return "bg-blue-100 text-blue-800";
			case "in_progress": return "bg-yellow-100 text-yellow-800";
			case "waiting_response": return "bg-orange-100 text-orange-800";
			case "resolved": return "bg-green-100 text-green-800";
			case "closed": return "bg-gray-100 text-gray-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent": return "bg-red-100 text-red-800";
			case "high": return "bg-orange-100 text-orange-800";
			case "medium": return "bg-yellow-100 text-yellow-800";
			case "low": return "bg-green-100 text-green-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	if (isLoading) {
		return (
			<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
				<Button onClick={() => router.push("/support")} variant="ghost" className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Support
				</Button>
				<div className="bg-white border border-[#E9EAEB] rounded-xl p-8 text-center">
					<p className="text-[#667085]">Loading ticket...</p>
				</div>
			</div>
		);
	}

	if (!ticket) {
		return (
			<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
				<Button onClick={() => router.push("/support")} variant="ghost" className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Support
				</Button>
				<div className="bg-white border border-[#E9EAEB] rounded-xl p-8 text-center">
					<p className="text-[#667085]">Ticket not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
			<Button onClick={() => router.push("/support")} variant="ghost" className="mb-6">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Support
			</Button>

			{/* Ticket Header */}
			<div className="bg-white border border-[#E9EAEB] rounded-xl p-6 mb-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-sm font-medium text-[#667085]">#{ticket.ticket_number}</span>
							<Badge className={`${getStatusColor(ticket.status)} text-xs`}>
								{ticket.status.replace("_", " ")}
							</Badge>
							<Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
								{ticket.priority}
							</Badge>
						</div>
						<h1 className="text-2xl font-semibold text-[#0D0D0D] mb-2">{ticket.subject}</h1>
						<p className="text-sm text-[#667085] capitalize">Category: {ticket.category.replace("_", " ")}</p>
					</div>
					<div className="text-right text-sm text-[#667085]">
						<p>Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
						{ticket.updated_at && (
							<p>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</p>
						)}
					</div>
				</div>
				<div className="pt-4 border-t border-[#E9EAEB]">
					<p className="text-[#0D0D0D]">{ticket.description}</p>
				</div>
			</div>

			{/* Messages Thread */}
			<div className="bg-white border border-[#E9EAEB] rounded-xl p-6 mb-6">
				<h2 className="text-lg font-semibold text-[#0D0D0D] mb-4">Conversation</h2>

				{ticket.messages && ticket.messages.length > 0 ? (
					<div className="space-y-4 mb-6">
						{ticket.messages.map((message: TicketMessage) => (
							<div
								key={message.id}
								className={`flex gap-3 ${
									message.sender_type === "user" ? "flex-row" : "flex-row-reverse"
								}`}
							>
								<div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
									message.sender_type === "user" ? "bg-[#E7F6EC]" : "bg-[#F9FAFB]"
								}`}>
									{message.sender_type === "user" ? (
										<User className="w-5 h-5 text-[#0D4222]" />
									) : (
										<Headphones className="w-5 h-5 text-[#667085]" />
									)}
								</div>
								<div className={`flex-1 ${
									message.sender_type === "user" ? "" : "text-right"
								}`}>
									<div className="flex items-center gap-2 mb-1">
										<span className={`text-sm font-medium text-[#0D0D0D] ${
											message.sender_type === "user" ? "" : "order-2"
										}`}>
											{message.sender_name}
										</span>
										<span className={`text-xs text-[#667085] ${
											message.sender_type === "user" ? "" : "order-1"
										}`}>
											{new Date(message.created_at).toLocaleString()}
										</span>
									</div>
									<div className={`inline-block max-w-[80%] p-3 rounded-lg ${
										message.sender_type === "user"
											? "bg-[#E7F6EC] text-[#0D0D0D]"
											: "bg-[#F9FAFB] text-[#0D0D0D]"
									}`}>
										<p className="text-sm whitespace-pre-wrap">{message.message}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-[#667085] mb-6 text-center py-8">
						No messages yet. Our support team will respond soon.
					</p>
				)}

				{/* Reply Form */}
				{ticket.status !== "closed" ? (
					<form onSubmit={handleSendMessage} className="pt-4 border-t border-[#E9EAEB]">
						<div className="flex gap-3">
							<textarea
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								placeholder="Type your message..."
								rows={3}
								className="flex-1 px-4 py-3 border border-[#E9EAEB] rounded-lg focus:ring-2 focus:ring-[#11C211] focus:border-transparent resize-none"
								disabled={addMessageMutation.isPending}
							/>
							<Button
								type="submit"
								disabled={addMessageMutation.isPending || !newMessage.trim()}
								className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-auto px-6 rounded-lg font-semibold self-end"
							>
								<Send className="w-4 h-4 mr-2" />
								{addMessageMutation.isPending ? "Sending..." : "Send"}
							</Button>
						</div>
					</form>
				) : (
					<div className="pt-4 border-t border-[#E9EAEB] text-center">
						<p className="text-sm text-[#667085]">This ticket is closed. Please create a new ticket if you need further assistance.</p>
					</div>
				)}
			</div>

			{/* Ticket Info Sidebar */}
			<div className="bg-[#F9FAFB] border border-[#E9EAEB] rounded-xl p-6">
				<h3 className="font-semibold text-[#0D0D0D] mb-4">Ticket Information</h3>
				<div className="space-y-3">
					<div>
						<p className="text-xs text-[#667085] mb-1">Status</p>
						<Badge className={`${getStatusColor(ticket.status)}`}>
							{ticket.status.replace("_", " ")}
						</Badge>
					</div>
					<div>
						<p className="text-xs text-[#667085] mb-1">Priority</p>
						<Badge className={`${getPriorityColor(ticket.priority)}`}>
							{ticket.priority}
						</Badge>
					</div>
					<div>
						<p className="text-xs text-[#667085] mb-1">Category</p>
						<p className="text-sm font-medium text-[#0D0D0D] capitalize">
							{ticket.category.replace("_", " ")}
						</p>
					</div>
					{ticket.assigned_to && (
						<div>
							<p className="text-xs text-[#667085] mb-1">Assigned to</p>
							<p className="text-sm font-medium text-[#0D0D0D]">Support Agent</p>
						</div>
					)}
					<div>
						<p className="text-xs text-[#667085] mb-1">Created</p>
						<p className="text-sm font-medium text-[#0D0D0D]">
							{new Date(ticket.created_at).toLocaleString()}
						</p>
					</div>
					{ticket.resolved_at && (
						<div>
							<p className="text-xs text-[#667085] mb-1">Resolved</p>
							<p className="text-sm font-medium text-[#0D0D0D]">
								{new Date(ticket.resolved_at).toLocaleString()}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
