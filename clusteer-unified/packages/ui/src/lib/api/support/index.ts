import axios, { AxiosError } from "axios";

// Django backend client for the functions below that aren't yet wired to a
// Next.js proxy route. Deliberately carries NO API key and NO auth header —
// auth_token is httpOnly so client JS can't read it anyway, and shipping the
// Django key to the browser was the exact issue this was fixed for. Any
// function still using this client directly will fail cleanly (no key) rather
// than leak one; wire it through a proxy route (like the ticket ones below)
// before calling it for real.
const blockchainApiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL || "http://localhost:8000/api/v1",
	headers: {
		"Content-Type": "application/json",
	},
});

// ==================== TYPES ====================

export interface SupportTicket {
	id: number;
	ticket_number: string;
	user_id: string;
	user_email: string;
	user_name: string;
	subject: string;
	category: 'account' | 'transaction' | 'verification' | 'security' | 'technical' | 'general' | 'other';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
	description: string;
	assigned_to: string | null;
	message_count?: number;
	last_message?: {
		message: string;
		sender_name: string;
		created_at: string;
	} | null;
	messages?: TicketMessage[];
	created_at: string;
	updated_at: string;
	resolved_at: string | null;
	closed_at: string | null;
}

export interface TicketMessage {
	id: number;
	ticket: number;
	sender_id: string;
	sender_name: string;
	sender_type: 'user' | 'agent' | 'system';
	message: string;
	attachment_url: string | null;
	attachment_name: string | null;
	is_internal_note: boolean;
	created_at: string;
}

export interface FAQ {
	id: number;
	category: string;
	question: string;
	answer: string;
	order: number;
}

export interface FAQData {
	[category: string]: FAQ[];
}

// ==================== API FUNCTIONS ====================

export async function getSupportTickets(userId: string) {
	try {
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: SupportTicket[];
		}>(`/user/${userId}/support/tickets/`);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

// Uses the Next.js proxy (/api/support/tickets/[ticketNumber]) so the Django
// API key is never exposed to the browser.
export async function getTicketDetail(_userId: string, ticketNumber: string): Promise<SupportTicket> {
	const res = await fetch(`/api/support/tickets/${ticketNumber}`);
	const json = await res.json();
	if (!res.ok) throw new Error(json.message || "Failed to fetch ticket");
	return json.data;
}

export async function createSupportTicket(userId: string, data: {
	user_email: string;
	user_name: string;
	subject: string;
	category: string;
	description: string;
	priority?: string;
}) {
	try {
		const res = await blockchainApiClient.post<{
			status: boolean;
			message: string;
			data: SupportTicket;
		}>(`/user/${userId}/support/tickets/`, data);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

// Uses the Next.js proxy (/api/support/tickets/[ticketNumber]/messages) so the
// Django API key is never exposed to the browser. sender_id is re-derived
// server-side from the session there — the client-supplied value is ignored.
export async function addTicketMessage(
	_userId: string,
	ticketNumber: string,
	data: {
		sender_id: string;
		sender_name: string;
		message: string;
	}
): Promise<{ status: boolean; message: string; data: TicketMessage }> {
	const res = await fetch(`/api/support/tickets/${ticketNumber}/messages`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	const json = await res.json();
	if (!res.ok) throw new Error(json.message || "Failed to send message");
	return json;
}

export async function getFAQs(category?: string) {
	try {
		const url = category ? `/support/faqs/?category=${category}` : '/support/faqs/';
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: FAQData;
		}>(url);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}
