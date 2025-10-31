import axios, { AxiosError } from "axios";

// Create a separate axios instance for Django backend
const blockchainApiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL || "http://localhost:8000/api/v1",
	headers: {
		"Content-Type": "application/json",
		"X-API-KEY": process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY || "",
	},
});

// Add auth token interceptor
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

// ==================== NOTIFICATION PREFERENCES ====================

export interface NotificationPreferences {
	email_transactions: boolean;
	email_security: boolean;
	email_marketing: boolean;
	email_order_updates: boolean;
	sms_transactions: boolean;
	sms_security: boolean;
	sms_order_updates: boolean;
	push_transactions: boolean;
	push_security: boolean;
	push_price_alerts: boolean;
}

export async function getNotificationPreferences(userId: string) {
	try {
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: NotificationPreferences;
		}>(`/user/${userId}/notifications/preferences/`);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function updateNotificationPreferences(
	userId: string,
	preferences: Partial<NotificationPreferences>
) {
	try {
		const res = await blockchainApiClient.put<{
			status: boolean;
			message: string;
			data: NotificationPreferences;
		}>(`/user/${userId}/notifications/preferences/`, preferences);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

// ==================== BANK ACCOUNTS ====================

export interface BankAccount {
	id: number;
	user_id: string;
	bank_name: string;
	account_number: string;
	account_name: string;
	is_default: boolean;
	is_verified: boolean;
	created_at: string;
	updated_at: string;
}

export async function getBankAccounts(userId: string) {
	try {
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: BankAccount[];
		}>(`/user/${userId}/bank-accounts/`);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function createBankAccount(
	userId: string,
	data: {
		bank_name: string;
		account_number: string;
		account_name: string;
		is_default?: boolean;
	}
) {
	try {
		const res = await blockchainApiClient.post<{
			status: boolean;
			message: string;
			data: BankAccount;
		}>(`/user/${userId}/bank-accounts/`, data);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function updateBankAccount(
	userId: string,
	accountId: number,
	data: Partial<{ is_default: boolean }>
) {
	try {
		const res = await blockchainApiClient.put<{
			status: boolean;
			message: string;
			data: BankAccount;
		}>(`/user/${userId}/bank-accounts/${accountId}/`, data);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function deleteBankAccount(userId: string, accountId: number) {
	try {
		const res = await blockchainApiClient.delete<{
			status: boolean;
			message: string;
		}>(`/user/${userId}/bank-accounts/${accountId}/`);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

// ==================== PRIVACY SETTINGS ====================

export interface PrivacySettings {
	profile_visibility: boolean;
	transaction_history_visibility: boolean;
	analytical_cookies: boolean;
	marketing_cookies: boolean;
	third_party_sharing: boolean;
}

export async function getPrivacySettings(userId: string) {
	try {
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: PrivacySettings;
		}>(`/user/${userId}/privacy-settings/`);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function updatePrivacySettings(
	userId: string,
	settings: Partial<PrivacySettings>
) {
	try {
		const res = await blockchainApiClient.put<{
			status: boolean;
			message: string;
			data: PrivacySettings;
		}>(`/user/${userId}/privacy-settings/`, settings);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

// ==================== ACCOUNT LIMITS ====================

export interface AccountLimits {
	daily_withdrawal_limit: number;
	daily_withdrawal_used: number;
	daily_withdrawal_percentage: number;
	daily_deposit_limit: number;
	daily_deposit_used: number;
	daily_deposit_percentage: number;
	monthly_withdrawal_limit: number;
	monthly_withdrawal_used: number;
	monthly_withdrawal_percentage: number;
	monthly_deposit_limit: number;
	monthly_deposit_used: number;
	monthly_deposit_percentage: number;
	limit_currency: string;
	daily_reset_date: string;
	monthly_reset_date: string;
}

export async function getAccountLimits(userId: string) {
	try {
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: AccountLimits;
		}>(`/user/${userId}/account-limits/`);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

// ==================== DATA EXPORT ====================

export interface DataExportRequest {
	id: number;
	user_id: string;
	status: "pending" | "processing" | "completed" | "failed";
	request_type: string;
	file_url?: string;
	error_message?: string;
	requested_at: string;
	completed_at?: string;
}

export async function createDataExportRequest(
	userId: string,
	requestType: string = "full_data"
) {
	try {
		const res = await blockchainApiClient.post<{
			status: boolean;
			message: string;
			data: DataExportRequest;
		}>(`/user/${userId}/data-export/`, { request_type: requestType });
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function getDataExportRequests(userId: string) {
	try {
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: DataExportRequest[];
		}>(`/user/${userId}/data-export/`);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

// ==================== KYC VERIFICATION ====================

export interface KYCVerification {
	id: number;
	user_id: string;
	status: "not_submitted" | "pending" | "under_review" | "approved" | "rejected";
	document_type: string | null;
	document_number: string | null;
	document_front_url: string | null;
	document_back_url: string | null;
	selfie_url: string | null;
	address_document_url: string | null;
	rejection_reason: string | null;
	submitted_at: string | null;
	reviewed_at: string | null;
	created_at: string;
	updated_at: string;
}

export async function getKYCVerification(userId: string) {
	try {
		const res = await blockchainApiClient.get<{
			status: boolean;
			data: KYCVerification;
		}>(`/user/${userId}/kyc-verification/`);
		return res.data.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function submitKYCVerification(
	userId: string,
	data: Partial<KYCVerification>
) {
	try {
		const res = await blockchainApiClient.post<{
			status: boolean;
			message: string;
			data: KYCVerification;
		}>(`/user/${userId}/kyc-verification/`, data);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}
