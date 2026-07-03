import axios, { AxiosError } from "axios";

// Django backend client for the functions below that aren't yet wired to a
// Next.js proxy route (see getBankAccounts/getKYCVerification for the correct
// pattern). Deliberately carries NO API key and NO auth header — auth_token is
// httpOnly so client JS can't read it anyway, and shipping the Django key to
// the browser was the exact issue this was fixed for. Any function still using
// this client directly will fail cleanly (no key) rather than leak one; wire it
// through a proxy route (like kyc-status/route.ts) before calling it for real.
const blockchainApiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL || "http://localhost:8000/api/v1",
	headers: {
		"Content-Type": "application/json",
	},
});

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

// Bank account functions use the Next.js proxy (/api/user/bank-accounts)
// so the Django API key is never exposed to the browser.
export async function getBankAccounts(_userId: string): Promise<BankAccount[]> {
	const res = await fetch("/api/user/bank-accounts");
	if (!res.ok) throw new Error("Failed to fetch bank accounts");
	const json = await res.json();
	return json.data ?? [];
}

export async function createBankAccount(
	_userId: string,
	data: {
		bank_name: string;
		account_number: string;
		account_name: string;
		is_default?: boolean;
	}
): Promise<{ status: boolean; message: string; data: BankAccount }> {
	const res = await fetch("/api/user/bank-accounts", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	const json = await res.json();
	if (!res.ok) throw new Error(json.message || "Failed to create bank account");
	return json;
}

export async function updateBankAccount(
	_userId: string,
	accountId: number,
	data: Partial<{ is_default: boolean }>
): Promise<{ status: boolean; message: string; data: BankAccount }> {
	const res = await fetch(`/api/user/bank-accounts/${accountId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	const json = await res.json();
	if (!res.ok) throw new Error(json.message || "Failed to update bank account");
	return json;
}

export async function deleteBankAccount(_userId: string, accountId: number): Promise<{ status: boolean; message: string }> {
	const res = await fetch(`/api/user/bank-accounts/${accountId}`, { method: "DELETE" });
	const json = await res.json();
	if (!res.ok) throw new Error(json.message || "Failed to delete bank account");
	return json;
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

// Uses the Next.js proxy (/api/user/kyc-status) so the Django API key is never
// exposed to the browser — same pattern as the bank-account functions above.
export async function getKYCVerification(_userId: string): Promise<KYCVerification> {
	const res = await fetch("/api/user/kyc-status");
	const json = await res.json();
	if (!res.ok) throw new Error(json.message || "Failed to fetch KYC verification");
	return json.data;
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
