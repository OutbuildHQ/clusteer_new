import axios, { AxiosError } from "axios";

const blockchainApiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL || "http://localhost:8000/api/v1",
	headers: {
		"Content-Type": "application/json",
		"X-API-KEY": process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY || "",
	},
});

const getAuthToken = () => {
	if (typeof window !== "undefined") {
		return document.cookie
			.split("; ")
			.find((row) => row.startsWith("auth_token="))
			?.split("=")[1];
	}
	return null;
};

blockchainApiClient.interceptors.request.use(
	(config) => {
		const token = getAuthToken();
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

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

export async function getTicketDetail(userId: string, ticketNumber: string) {
	try {
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: SupportTicket;
		}>(`/user/${userId}/support/tickets/${ticketNumber}/`);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
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

export async function addTicketMessage(
	userId: string,
	ticketNumber: string,
	data: {
		sender_id: string;
		sender_name: string;
		message: string;
	}
) {
	try {
		const res = await blockchainApiClient.post<{
			status: boolean;
			message: string;
			data: TicketMessage;
		}>(`/user/${userId}/support/tickets/${ticketNumber}/messages/`, data);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
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
