"use client";

import { MAXIMUM_VALUE, MINIMUM_VALUE } from "@/lib/constants";
import { SellCryptoSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CryptoInput from "../crypto-input";
import FiatInput from "../fiat-input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWallets } from "@/store/wallet";
import { formatNumber } from "@/lib/utils";

type SellCryptoFormType = z.infer<typeof SellCryptoSchema>;

type StableCoin = "USDT" | "USDC" | "USD";

interface SellCryptoFormProps {
	onSwap?: () => void;
}

export default function SellCryptoForm({ onSwap }: SellCryptoFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [receiveAmount, setReceiveAmount] = useState(0);
	const [selectedCurrency, setSelectedCurrency] = useState<StableCoin>("USDT");
	const { toast } = useToast();
	const wallets = useWallets() || [];

	// Get selected currency wallet balance
	const selectedWallet = wallets.find((w) => w.currency === selectedCurrency);
	const selectedBalance = selectedWallet?.balance || 0;

	// Fetch exchange rate
	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate", "NGN"],
		queryFn: async () => {
			const response = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1");
			if (!response.ok) throw new Error("Failed to fetch rate");
			return response.json();
		},
		refetchInterval: 60000,
	});

	const exchangeRate = rateData?.rate || 1575;

	const form = useForm<SellCryptoFormType>({
		mode: "onChange",
		resolver: zodResolver(SellCryptoSchema),
		defaultValues: {
			pay: 0,
		},
	});

	const payAmount = form.watch("pay");

	// Calculate receive amount (NGN) when pay amount (USDT) changes
	useEffect(() => {
		if (payAmount && exchangeRate) {
			const calculated = payAmount * exchangeRate;
			console.log('Sell calculation:', { payAmount, exchangeRate, calculated });
			setReceiveAmount(calculated);
		} else {
			setReceiveAmount(0);
		}
	}, [payAmount, exchangeRate]);

	const onSubmit = async (data: SellCryptoFormType) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/trade", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					side: "sell",
					amount: data.pay,
					chain: "solana", // Default chain, could be selected by user
					// privateKey would come from user's wallet connection
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Trade failed");
			}

			toast({
				title: "Success",
				description: result.message || "Sell order successful",
			});

			// Reset form after successful trade
			form.reset();
		} catch (error) {
			console.error("Sell crypto error:", error);
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Failed to complete sell order",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form className="font-avenir-next flex flex-col gap-y-3 lg:gap-y-1.5">
				<FormItem className="gap-1.5">
					<FormLabel className="font-medium">I want to sell</FormLabel>
					<FormControl>
						<div className="relative">
							<input
								type="number"
								value={form.watch("pay") || ""}
								onChange={(e) => form.setValue("pay", parseFloat(e.target.value) || 0)}
								className="h-12 w-full px-4 pr-24 rounded-xl border border-[#E9EAEB] focus:outline-none focus:ring-2 focus:ring-dark-green text-lg font-semibold"
								placeholder="0.00"
								min="0"
								step="0.01"
							/>
							<select
								value={selectedCurrency}
								onChange={(e) => setSelectedCurrency(e.target.value as StableCoin)}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#667085] bg-transparent border-none focus:outline-none cursor-pointer font-medium"
							>
								<option value="USDT">USDT</option>
								<option value="USDC">USDC</option>
								<option value="USD">USD</option>
							</select>
						</div>
					</FormControl>
					<FormDescription className="text-[#535862]">
						Available: <span className="font-bold">{formatNumber(selectedBalance)}</span> {selectedCurrency}
					</FormDescription>
					<FormMessage />
				</FormItem>

				<button
					type="button"
					onClick={onSwap}
					className="bg-white rounded-full size-11 flex items-center justify-center mx-auto hover:bg-gray-100 transition-colors cursor-pointer"
					aria-label="Swap to buy"
				>
					<Image
						src="/assets/icons/double_arrow.svg"
						alt="swap icon"
						width={24}
						height={24}
					/>
				</button>

				<FormItem className="gap-1.5">
					<FormLabel className="font-medium">Receive</FormLabel>
					<FormControl>
						<div className="h-12 px-4 rounded-xl border border-[#E9EAEB] bg-[#F9FAFB] flex items-center justify-between">
							<span className="text-lg font-semibold">
								₦{formatNumber(receiveAmount)}
							</span>
							<span className="text-sm text-[#667085]">NGN</span>
						</div>
					</FormControl>
					<FormDescription className="space-y-1.5">
						<span className="block text-[#535862]">
							Limit: {MINIMUM_VALUE.toLocaleString()} -{" "}
							{MAXIMUM_VALUE.toLocaleString()} NGN
						</span>
						<span className="block text-[#535862]">
							Transaction fees: 0 {selectedCurrency}
						</span>
					</FormDescription>
					<FormMessage />
				</FormItem>

				<div className="mt-6.5 grid lg:grid-cols-[2fr_1fr] items-center divide-[#00000066] lg:divide-x-[0.5px] px-7.5 py-2.5 lg:py-4 border border-[#21241D4D] rounded-xl text-sm">
					<div>
						<span className="text-[#535862]">Receive via:</span>
						<div className="flex items-start sm:items-center gap-x-1">
							<Image
								src="/assets/icons/credit_card.svg"
								alt="credit card icon"
								width={24}
								height={24}
							/>
							<span className="font-semibold">Bank Transfer</span>
						</div>
					</div>
					<div className="border-b-[0.5px] border-[#00000066] my-6 lg:hidden" />
					<div className="w-fit lg:pl-4 lg:ml-auto">
						<p className="text-[#535862]">Pay within:</p>
						<p className="font-semibold">15 mins</p>
					</div>
				</div>

				<button
					type="button"
					onClick={form.handleSubmit(onSubmit)}
					disabled={isLoading || !form.formState.isValid}
					className="flex items-center gap-x-3 text-black bg-light-green w-full justify-center h-11 rounded-4xl border border-black mx-auto mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading && <Loader2 className="size-4 animate-spin" />}
					<span className="text-base font-semibold text-black">
						{isLoading ? "Processing..." : "Sell"}
					</span>
				</button>
			</form>
		</Form>
	);
}
