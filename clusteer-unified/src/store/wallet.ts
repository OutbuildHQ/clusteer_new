import { create } from "zustand";

export type WalletCurrency = "NGN" | "USDT" | "USDC";

export interface Wallet {
	name: string;
	type: "FIAT" | "CRYPTO";
	currency: WalletCurrency;
	address: string;
	balance: number;
}

interface WalletStore {
	wallets: Wallet[];
	actions: { setWallets: (wallets: Wallet[]) => void };
}

export const useWalletStore = create<WalletStore>((set) => ({
	wallets: [],
	actions: {
		setWallets: (wallets) => set({ wallets }),
	},
}));

export const useWallets = () => useWalletStore((state) => state.wallets);

export const useSelectWallet = (currency: WalletCurrency): Wallet | null =>
	useWalletStore(
		(state) =>
			state.wallets.find((wallet) => wallet.currency === currency) ?? null
	);

export const useWalletActions = () => useWalletStore((state) => state.actions);
