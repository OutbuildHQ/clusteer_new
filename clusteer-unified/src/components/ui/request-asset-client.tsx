"use client";

import { WalletCurrency, useSelectWallet } from "@/store/wallet";
import { useRouter } from "next/navigation";
import { useUser } from "@/store/user";
import { useState } from "react";
import { Button } from "./button";
import { Copy, QrCode, Share2, Mail, MessageCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Toast } from "@/components/toast";
import QRCode from "qrcode";

export default function RequestAssetClient({ asset }: { asset: string }) {
	const router = useRouter();
	const user = useUser();
	const wallet = useSelectWallet(asset as WalletCurrency);
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");
	const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
	const [showQR, setShowQR] = useState(false);

	if (!wallet) {
		router.push("/");
		return null;
	}

	const currencySymbol = wallet.currency === "NGN" ? "₦" : "$";

	// Generate payment request link
	const generatePaymentLink = () => {
		const baseUrl = window.location.origin;
		const params = new URLSearchParams({
			to: user?.username || user?.id || "",
			currency: wallet.currency,
			amount: amount || "0",
			note: note || "",
		});
		return `${baseUrl}/pay?${params.toString()}`;
	};

	// Generate QR Code
	const handleGenerateQR = async () => {
		if (!amount || parseFloat(amount) <= 0) {
			Toast.error("Please enter a valid amount");
			return;
		}

		const paymentLink = generatePaymentLink();
		try {
			const qrUrl = await QRCode.toDataURL(paymentLink, {
				width: 300,
				margin: 2,
				color: {
					dark: "#0D0D0D",
					light: "#FFFFFF",
				},
			});
			setQrCodeUrl(qrUrl);
			setShowQR(true);
		} catch (error) {
			Toast.error("Failed to generate QR code");
		}
	};

	// Copy payment link
	const handleCopyLink = () => {
		const link = generatePaymentLink();
		navigator.clipboard.writeText(link);
		Toast.success("Payment link copied to clipboard");
	};

	// Share via native share
	const handleShare = async () => {
		if (!amount || parseFloat(amount) <= 0) {
			Toast.error("Please enter a valid amount");
			return;
		}

		const link = generatePaymentLink();
		const shareData = {
			title: "Payment Request",
			text: `${user?.username || "Someone"} is requesting ${currencySymbol}${formatNumber(parseFloat(amount))} ${wallet.currency}${note ? `\nNote: ${note}` : ""}`,
			url: link,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (error) {
				// User cancelled share
			}
		} else {
			handleCopyLink();
		}
	};

	// Share via email
	const handleEmailShare = () => {
		if (!amount || parseFloat(amount) <= 0) {
			Toast.error("Please enter a valid amount");
			return;
		}

		const link = generatePaymentLink();
		const subject = encodeURIComponent("Payment Request");
		const body = encodeURIComponent(
			`Hi,\n\n${user?.username || "Someone"} is requesting a payment of ${currencySymbol}${formatNumber(parseFloat(amount))} ${wallet.currency}.\n\n${note ? `Note: ${note}\n\n` : ""}Click here to pay: ${link}`
		);
		window.open(`mailto:?subject=${subject}&body=${body}`);
	};

	return (
		<section className="mt-8.5 lg:mt-10">
			<header>
				<h1 className="font-bold text-3xl capitalize">
					Request {wallet.currency}
				</h1>
				<p className="text-[#667085] mt-2">
					Create a payment request and share it with anyone
				</p>
			</header>

			<div className="mt-6 lg:max-w-xl">
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6 space-y-6">
					{/* Amount Input */}
					<div>
						<label className="text-sm font-medium text-[#0D0D0D] mb-2 block">
							Amount
						</label>
						<div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-[#667085]">
								{currencySymbol}
							</span>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								placeholder="0.00"
								className="w-full pl-10 pr-4 py-3 text-lg font-semibold border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
								min="0"
								step="0.01"
							/>
						</div>
						<p className="text-xs text-[#667085] mt-1">
							Current balance: {currencySymbol}
							{formatNumber(wallet.balance || 0)}
						</p>
					</div>

					{/* Note Input */}
					<div>
						<label className="text-sm font-medium text-[#0D0D0D] mb-2 block">
							Note (Optional)
						</label>
						<textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="Add a note for the payer..."
							className="w-full px-4 py-3 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FE870] resize-none"
							rows={3}
							maxLength={200}
						/>
						<p className="text-xs text-[#667085] mt-1">
							{note.length}/200 characters
						</p>
					</div>

					{/* QR Code Display */}
					{showQR && qrCodeUrl && (
						<div className="flex flex-col items-center py-4 bg-[#F9FAFB] rounded-xl">
							<img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
							<p className="text-sm text-[#667085] mt-3">
								Scan to pay {currencySymbol}
								{formatNumber(parseFloat(amount || "0"))}
							</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button
							onClick={handleGenerateQR}
							className="w-full bg-[#9FE870] hover:bg-[#8DD659] text-custom-black font-semibold h-12 rounded-lg"
						>
							<QrCode className="w-5 h-5 mr-2" />
							{showQR ? "Regenerate QR Code" : "Generate QR Code"}
						</Button>

						<div className="grid grid-cols-2 gap-3">
							<Button
								onClick={handleCopyLink}
								variant="outline"
								className="h-12 rounded-lg font-medium"
							>
								<Copy className="w-4 h-4 mr-2" />
								Copy Link
							</Button>
							<Button
								onClick={handleShare}
								variant="outline"
								className="h-12 rounded-lg font-medium"
							>
								<Share2 className="w-4 h-4 mr-2" />
								Share
							</Button>
						</div>

						<Button
							onClick={handleEmailShare}
							variant="outline"
							className="w-full h-12 rounded-lg font-medium"
						>
							<Mail className="w-4 h-4 mr-2" />
							Share via Email
						</Button>
					</div>
				</div>

				{/* Info Section */}
				<div className="mt-6 bg-[#F9FAFB] rounded-2xl border border-[#E9EAEB] p-5">
					<h3 className="font-semibold text-base text-[#0D0D0D] mb-3">
						How it works
					</h3>
					<ul className="space-y-2 text-sm text-[#667085]">
						<li className="flex items-start gap-2">
							<span className="text-[#9FE870] mt-1">•</span>
							<span>Enter the amount you want to request</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-[#9FE870] mt-1">•</span>
							<span>Add an optional note to provide context</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-[#9FE870] mt-1">•</span>
							<span>
								Generate a QR code or share the payment link via email or
								messaging
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-[#9FE870] mt-1">•</span>
							<span>
								The payer will be directed to send you the exact amount in{" "}
								{wallet.currency}
							</span>
						</li>
					</ul>
				</div>
			</div>

			<div className="mt-8.5 xl:mt-[73px] pt-11 xl:pt-0 border-t lg:border-t-0 border-[#00000066]">
				<h2 className="text-2xl font-semibold">Recent Requests</h2>
				<p className="text-[#667085] mt-2">
					Your payment requests will appear here
				</p>
			</div>
		</section>
	);
}
