"use client";

import { useState } from "react";
import { NETWORKS } from "@/lib/data";
import { WalletCurrency, useSelectWallet } from "@/store/wallet";
import { Dot } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CopyButton } from "../copy-button";
import { Input } from "./input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";
import SendTypeSelectionModal from "../modals/send-type-selection-modal";
import InternalSendModal from "../modals/internal-send-modal";

export default function SendAssetClient({ asset }: { asset: string }) {
	const router = useRouter();
	const wallet = useSelectWallet(asset as WalletCurrency);
	const [showTypeSelection, setShowTypeSelection] = useState(true);
	const [showInternalSend, setShowInternalSend] = useState(false);

	const handleSelectInternal = () => {
		setShowTypeSelection(false);
		setShowInternalSend(true);
	};

	const handleSelectOnchain = () => {
		setShowTypeSelection(false);
	};

	const handleCloseModals = () => {
		setShowInternalSend(false);
		setShowTypeSelection(true);
	};

	if (!wallet) {
		router.push("/");
		return null;
	}

	return (
		<>
			<SendTypeSelectionModal
				isOpen={showTypeSelection}
				onClose={() => router.back()}
				onSelectInternal={handleSelectInternal}
				onSelectOnchain={handleSelectOnchain}
				assetName={wallet.name}
			/>

			<InternalSendModal
				isOpen={showInternalSend}
				onClose={handleCloseModals}
				asset={asset.toUpperCase()}
				balance={wallet.balance}
			/>

			{!showTypeSelection && (
		<section className="mt-8.5 lg:mt-10">
			<header>
				<h1 className="font-bold text-3xl capitalize">Send {wallet.name}</h1>
			</header>
			<div className="flex flex-col xl:flex-row xl:gap-x-[60px]">
				<div>
					<div className="relative mt-8.5 border border-[#0000004D] rounded-2xl py-10 px-5 space-y-5">
						<div className="flex gap-x-4">
							<div className="rounded-full bg-real-black size-6 text-white text-center">
								1
							</div>
							<span className="font-bold text-sm">Choose a network</span>
						</div>
						<div className="ml-5 ">
							<Select>
								<SelectTrigger
									className="shadow-none placeholder:text-[#717680] gap-x-2 text-base rounded-full capitalize justify-between w-full py-5 px-8 !h-auto border-[#D5D7DA] bg-[#FAFAFA]"
									aria-label="Choose a Network"
								>
									<SelectValue placeholder="Choose a Network" />
								</SelectTrigger>
								<SelectContent>
									{NETWORKS.map((network) => (
										<SelectItem
											key={network.name}
											value={network.name}
											className="capitalize font-semibold"
										>
											{network.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="mt-8.5">
						<div className="flex gap-x-4">
							<div className="rounded-full bg-real-black size-6 text-white text-center">
								2
							</div>
							<span className="font-bold text-sm">Withdrawal address</span>
						</div>
						<div className="relative px-2.5 mt-3">
							<div className="bg-[#F2F2F0] border border-[#0000004D] rounded-2xl p-5 flex flex-col lg:flex-row gap-x-10">
								<div className="relative p-2.5 rounded-lg bg-white w-fit border border-[#D9EAFD] shadow-[0px_1px_12px_0px_#00000026]">
									<Image
										className="h-full"
										src="/assets/icons/qr_code.svg"
										alt="QR Code"
										width={138}
										height={138}
									/>
								</div>
								<div className="mt-10 lg:mt-0 space-y-2.5 w-full">
									<span className="inline-block font-medium text-lg">
										USDT Address
									</span>
									<Input
										className="text-base font-medium py-4 px-3.5 bg-white border-real-black disabled:opacity-100 !h-auto"
										value={wallet.address}
										disabled
									/>
									<CopyButton
										value={wallet.address}
										className="flex gap-x-2.5"
									/>
								</div>
							</div>
							<div className="mt-4.5 py-5 border-b border-[#00000066] space-y-2.5">
								<div className="flex">
									<p className="opacity-60 text-sm">
										Minimum withdrawal amount
									</p>
									<p className="ml-auto text-sm font-medium">0.001 USDT</p>
								</div>
								<div className="flex">
									<p className="opacity-60 text-sm">Withdrawal confirmation</p>
									<p className="ml-auto text-sm font-medium">
										15 network confirmations
									</p>
								</div>
								<div className="flex">
									<p className="opacity-60 text-sm">Withdrawal unlocking</p>
									<p className="ml-auto text-sm font-medium">
										15 network confirmations
									</p>
								</div>
							</div>
							<div className="flex items-start sm:items-center mt-6 gap-x-0.5">
								<Dot
									className="shrink-0"
									strokeWidth={2}
									stroke="#FE754B"
								/>
								<p className="text-[#FE754B] text-xs">
									Minimum withdrawal amount: 0.001 USDT. Any deposits less than
									the minimum will not be credited or refunded
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8.5 xl:mt-[73px] pt-11 xl:pt-0 border-t xl:border-t-0 border-[#00000066]">
				<h2 className="text-2xl font-semibold">Withdrawal History</h2>
			</div>
		</section>
			)}
		</>
	);
}
