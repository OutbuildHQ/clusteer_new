"use client";

import { WalletCurrency, useSelectWallet } from "@/store/wallet";
import { useRouter } from "next/navigation";
import FiatReceiveForm from "../forms/fiat-receive-form";
import CryptoReceiveForm from "../forms/crypto-receive-form";
import { useUser } from "@/store/user";

export default function ReceiveAssetClient({ asset }: { asset: string }) {
	const router = useRouter();
	const user = useUser();
	const wallet = useSelectWallet(asset as WalletCurrency);

	if (!wallet) {
		router.push("/");
		return null;
	}

	// Determine if this is a crypto or fiat wallet
	const isCrypto = wallet.type === "CRYPTO";

	// Mock wallet addresses - in production, fetch these from your backend
	const walletAddresses = {
		tron: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, // Example Tron address
		bsc: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`, // Example BSC address
		ethereum: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`, // Example ETH address
		solana: `7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi`, // Example Solana address
	};

	return (
		<section className="mt-8.5 lg:mt-10">
			<header>
				<h1 className="font-bold text-3xl capitalize">
					Receive {wallet.currency}
				</h1>
				<p className="text-[#667085] mt-2">
					{isCrypto
						? `Deposit ${wallet.currency} to your wallet`
						: "Add funds to your account"}
				</p>
			</header>
			<div className="mt-5 lg:max-w-xl">
				{isCrypto ? (
					<CryptoReceiveForm
						currency={wallet.currency}
						walletAddresses={walletAddresses}
					/>
				) : (
					<FiatReceiveForm />
				)}
			</div>
			<div className="mt-8.5 xl:mt-[73px] pt-11 xl:pt-0 border-t lg:border-t-0 border-[#00000066]">
				<h2 className="text-2xl font-semibold">Receive History</h2>
			</div>
		</section>
	);
}
