"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Check, Copy } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NETWORKS = [
	{ value: "tron", label: "Tron (TRC20)", symbol: "TRX" },
	{ value: "bsc", label: "BNB Smart Chain (BEP20)", symbol: "BSC" },
	{ value: "ethereum", label: "Ethereum (ERC20)", symbol: "ETH" },
	{ value: "solana", label: "Solana (SPL)", symbol: "SOL" },
];

interface CryptoReceiveFormProps {
	currency: string;
	walletAddresses?: {
		tron?: string;
		bsc?: string;
		ethereum?: string;
		solana?: string;
	};
}

export default function CryptoReceiveForm({
	currency,
	walletAddresses,
}: CryptoReceiveFormProps) {
	const [selectedNetwork, setSelectedNetwork] = useState<string>("tron");
	const [copied, setCopied] = useState(false);

	// Get the address for the selected network
	const address = walletAddresses?.[selectedNetwork as keyof typeof walletAddresses] || "";

	const handleCopy = async () => {
		if (address) {
			await navigator.clipboard.writeText(address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="flex flex-col gap-y-6">
			{/* Network Selection */}
			<div className="gap-1.5">
				<Label className="font-bold text-[#21241D] mb-2 block">
					Select Network
				</Label>
				<Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
					<SelectTrigger className="h-[54px] border border-[#E9EAEB] rounded-2xl font-bold text-[#21241D]">
						<SelectValue placeholder="Select network" />
					</SelectTrigger>
					<SelectContent>
						{NETWORKS.map((network) => (
							<SelectItem key={network.value} value={network.value}>
								{network.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-sm text-[#344054] font-medium mt-2">
					Only send {currency} on the{" "}
					{NETWORKS.find((n) => n.value === selectedNetwork)?.label} network.
					Sending on other networks may result in loss of funds.
				</p>
			</div>

			{/* QR Code */}
			{address && (
				<div className="flex flex-col items-center gap-4 p-6 bg-[#F9FAFB] rounded-2xl border border-[#E9EAEB]">
					<div className="bg-white p-4 rounded-xl">
						<QRCodeSVG value={address} size={200} level="H" />
					</div>
					<p className="text-sm text-[#667085] text-center">
						Scan QR code to get address
					</p>
				</div>
			)}

			{/* Wallet Address */}
			<div className="gap-1.5">
				<Label className="font-bold text-[#21241D] mb-2 block">
					Wallet Address
				</Label>
				<div className="relative">
					<div className="h-[54px] px-4 border border-[#E9EAEB] rounded-2xl flex items-center justify-between bg-[#F9FAFB]">
						<span className="font-mono text-sm text-[#21241D] truncate mr-2">
							{address || "No address available"}
						</span>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleCopy}
							disabled={!address}
							className="shrink-0 h-8 px-3"
						>
							{copied ? (
								<>
									<Check className="h-4 w-4 mr-1" />
									Copied
								</>
							) : (
								<>
									<Copy className="h-4 w-4 mr-1" />
									Copy
								</>
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Warning */}
			<div className="p-4 bg-[#FEF3F2] border border-[#FEE4E2] rounded-xl">
				<h3 className="font-semibold text-[#B42318] mb-2">⚠️ Important</h3>
				<ul className="text-sm text-[#B42318] space-y-1 list-disc list-inside">
					<li>Only send {currency} to this address</li>
					<li>
						Ensure you select the correct network (
						{NETWORKS.find((n) => n.value === selectedNetwork)?.label})
					</li>
					<li>Minimum deposit: 10 {currency}</li>
					<li>Deposits are credited after network confirmation</li>
				</ul>
			</div>
		</div>
	);
}
