"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/store/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTicketDetail, addTicketMessage, type SupportTicket, type TicketMessage } from "@/lib/api/support";
import { toast } from "sonner";
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
				sender_name: `${user!.firstName} ${user!.lastName}`,
				message: newMessage,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ticket-detail", ticketNumber] });
			setNewMessage("");
			toast.success("Message sent successfully");
		},
		onError: () => {
			toast.error("Failed to send message");
		},
	});

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) {
			toast.error("Please enter a message");
			return;
		}
		addMessageMutation.mutate();
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "open": return "bg-[var(--c-lime-500)]/10 text-[var(--c-lime-500)]";
			case "in_progress": return "bg-warning/10 text-warning";
			case "waiting_response": return "bg-orange-100 text-orange-800";
			case "resolved": return "bg-success/10 text-success";
			case "closed": return "bg-muted text-foreground";
			default: return "bg-muted text-foreground";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent": return "bg-danger/10 text-danger";
			case "high": return "bg-orange-100 text-orange-800";
			case "medium": return "bg-warning/10 text-warning";
			case "low": return "bg-success/10 text-success";
			default: return "bg-muted text-foreground";
		}
	};

	if (isLoading) {
		return (
			<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
				<button
					onClick={() => router.push("/support")}
					style={{
						background: "transparent",
						border: "none",
						padding: "8px 12px",
						cursor: "pointer",
						display: "inline-flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "14px",
						color: "var(--c-fg, inherit)",
						marginBottom: "24px",
					}}
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Support
				</button>
				<div className="bg-card border border-border rounded-xl p-8 text-center">
					<p className="text-muted-foreground">Loading ticket...</p>
				</div>
			</div>
		);
	}

	if (!ticket) {
		return (
			<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
				<button
					onClick={() => router.push("/support")}
					style={{
						background: "transparent",
						border: "none",
						padding: "8px 12px",
						cursor: "pointer",
						display: "inline-flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "14px",
						color: "var(--c-fg, inherit)",
						marginBottom: "24px",
					}}
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Support
				</button>
				<div className="bg-card border border-border rounded-xl p-8 text-center">
					<p className="text-muted-foreground">Ticket not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
			<button
				onClick={() => router.push("/support")}
				style={{
					background: "transparent",
					border: "none",
					padding: "8px 12px",
					cursor: "pointer",
					display: "inline-flex",
					alignItems: "center",
					gap: "8px",
					fontSize: "14px",
					color: "var(--c-fg, inherit)",
					marginBottom: "24px",
				}}
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Support
			</button>

			{/* Ticket Header */}
			<div className="bg-card border border-border rounded-xl p-6 mb-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-sm font-medium text-muted-foreground">#{ticket.ticket_number}</span>
							<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}>
								{ticket.status.replace("_", " ")}
							</span>
							<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
								{ticket.priority}
							</span>
						</div>
						<h1 className="text-2xl font-semibold text-foreground mb-2">{ticket.subject}</h1>
						<p className="text-sm text-muted-foreground capitalize">Category: {ticket.category.replace("_", " ")}</p>
					</div>
					<div className="text-right text-sm text-muted-foreground">
						<p>Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
						{ticket.updated_at && (
							<p>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</p>
						)}
					</div>
				</div>
				<div className="pt-4 border-t border-border">
					<p className="text-foreground">{ticket.description}</p>
				</div>
			</div>

			{/* Messages Thread */}
			<div className="bg-card border border-border rounded-xl p-6 mb-6">
				<h2 className="text-lg font-semibold text-foreground mb-4">Conversation</h2>

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
									message.sender_type === "user" ? "bg-[var(--c-lime-500)]/10" : "bg-muted"
								}`}>
									{message.sender_type === "user" ? (
										<User className="w-5 h-5 text-[var(--c-lime-500)]" />
									) : (
										<Headphones className="w-5 h-5 text-muted-foreground" />
									)}
								</div>
								<div className={`flex-1 ${
									message.sender_type === "user" ? "" : "text-right"
								}`}>
									<div className="flex items-center gap-2 mb-1">
										<span className={`text-sm font-medium text-foreground ${
											message.sender_type === "user" ? "" : "order-2"
										}`}>
											{message.sender_name}
										</span>
										<span className={`text-xs text-muted-foreground ${
											message.sender_type === "user" ? "" : "order-1"
										}`}>
											{new Date(message.created_at).toLocaleString()}
										</span>
									</div>
									<div className={`inline-block max-w-[80%] p-3 rounded-lg ${
										message.sender_type === "user"
											? "bg-[var(--c-lime-500)]/10 text-foreground"
											: "bg-muted text-foreground"
									}`}>
										<p className="text-sm whitespace-pre-wrap">{message.message}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground mb-6 text-center py-8">
						No messages yet. Our support team will respond soon.
					</p>
				)}

				{/* Reply Form */}
				{ticket.status !== "closed" ? (
					<form onSubmit={handleSendMessage} className="pt-4 border-t border-border">
						<div className="flex gap-3">
							<textarea
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								placeholder="Type your message..."
								rows={3}
								className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
								disabled={addMessageMutation.isPending}
							/>
							<button
								type="submit"
								disabled={addMessageMutation.isPending || !newMessage.trim()}
								style={{
									background: "var(--c-lime-500)",
									color: "#fff",
									border: "none",
									padding: "0 24px",
									borderRadius: "8px",
									fontWeight: 600,
									fontSize: "14px",
									cursor: (addMessageMutation.isPending || !newMessage.trim()) ? "not-allowed" : "pointer",
									opacity: (addMessageMutation.isPending || !newMessage.trim()) ? 0.5 : 1,
									display: "inline-flex",
									alignItems: "center",
									gap: "8px",
									alignSelf: "flex-end",
								}}
							>
								<Send className="w-4 h-4" />
								{addMessageMutation.isPending ? "Sending..." : "Send"}
							</button>
						</div>
					</form>
				) : (
					<div className="pt-4 border-t border-border text-center">
						<p className="text-sm text-muted-foreground">This ticket is closed. Please create a new ticket if you need further assistance.</p>
					</div>
				)}
			</div>

			{/* Ticket Info Sidebar */}
			<div className="bg-muted border border-border rounded-xl p-6">
				<h3 className="font-semibold text-foreground mb-4">Ticket Information</h3>
				<div className="space-y-3">
					<div>
						<p className="text-xs text-muted-foreground mb-1">Status</p>
						<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}>
							{ticket.status.replace("_", " ")}
						</span>
					</div>
					<div>
						<p className="text-xs text-muted-foreground mb-1">Priority</p>
						<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
							{ticket.priority}
						</span>
					</div>
					<div>
						<p className="text-xs text-muted-foreground mb-1">Category</p>
						<p className="text-sm font-medium text-foreground capitalize">
							{ticket.category.replace("_", " ")}
						</p>
					</div>
					{ticket.assigned_to && (
						<div>
							<p className="text-xs text-muted-foreground mb-1">Assigned to</p>
							<p className="text-sm font-medium text-foreground">Support Agent</p>
						</div>
					)}
					<div>
						<p className="text-xs text-muted-foreground mb-1">Created</p>
						<p className="text-sm font-medium text-foreground">
							{new Date(ticket.created_at).toLocaleString()}
						</p>
					</div>
					{ticket.resolved_at && (
						<div>
							<p className="text-xs text-muted-foreground mb-1">Resolved</p>
							<p className="text-sm font-medium text-foreground">
								{new Date(ticket.resolved_at).toLocaleString()}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
