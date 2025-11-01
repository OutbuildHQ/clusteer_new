import apiClient from "@/lib/axios";
import { Wallet } from "@/store/wallet";
import { IResponse } from "@/types";
import { AxiosError } from "axios";

interface WalletResponse {
	walletAssets: Wallet[];
	pinSet: boolean;
}

export async function getUserWallet(): Promise<WalletResponse> {
	try {
		const res = await apiClient.get<WalletResponse>("/wallet");
		console.log("Wallet API response:", res.data);
		// Ensure we always return a valid WalletResponse
		if (!res.data) {
			console.warn("No wallet data in response, returning empty wallets");
			return { walletAssets: [], pinSet: false };
		}
		return res.data;
	} catch (error) {
		// Return empty wallet data instead of throwing
		console.error("Wallet fetch error:", error);
		return { walletAssets: [], pinSet: false };
	}
}
