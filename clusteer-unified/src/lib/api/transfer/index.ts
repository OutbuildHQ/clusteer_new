import apiClient from "@/lib/axios";
import { IResponse } from "@/types";
import { AxiosError } from "axios";

export interface VerifyRecipientResponse {
	username: string;
	is_verified: boolean;
}

export interface InternalTransferPayload {
	recipientUserId: string;
	asset: string;
	amount: number;
	note?: string;
}

export async function verifyRecipient(userId: string) {
	try {
		const res = await apiClient.get<IResponse<VerifyRecipientResponse>>(
			`/transfer/verify-recipient/${userId}`
		);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}

export async function sendInternalTransfer(payload: InternalTransferPayload) {
	try {
		const res = await apiClient.post<IResponse>("/transfer/internal", payload);
		return res.data;
	} catch (error) {
		throw error as AxiosError;
	}
}
