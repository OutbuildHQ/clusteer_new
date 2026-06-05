"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useCallback, useState } from "react";
import BuyCryptoForm from "./forms/buy-crypto-form";
import SellCryptoForm from "./forms/sell-crypto-form";
import RealTimeRates from "./real-time-rates";
import { Button } from "./ui/button";
import LiveTradingChart from "./live-trading-chart";

type FormType = "buy" | "sell";

export default function BuySellCrypto() {
	const [currentForm, setCurrentForm] = useState<FormType>("buy");

	const handleSelectForm = useCallback((form: FormType) => {
		setCurrentForm(form);
	}, []);

	const handleSwap = useCallback(() => {
		setCurrentForm((prev) => (prev === "buy" ? "sell" : "buy"));
	}, []);

	return (
		<div>
			<div className="flex gap-x-2">
				<Button
					variant="outline"
					onClick={() => handleSelectForm("buy")}
					className={cn(
						"h-9 font-semibold max-w-[86px] w-full text-sm rounded-[100px] hover:bg-light-green border-light-green",
						{
							"bg-light-green": currentForm === "buy",
						}
					)}
				>
					Buy
				</Button>
				<Button
					variant="outline"
					onClick={() => handleSelectForm("sell")}
					className={cn(
						"h-9 font-semibold max-w-[86px] w-full text-sm rounded-[100px] hover:bg-light-green border-light-green",
						{
							"bg-light-green": currentForm === "sell",
						}
					)}
				>
					Sell
				</Button>
			</div>
			<div className="mt-6.5 py-10 lg:py-7.5 px-11 sm:px-12.5 bg-[#F2F2F0] grid lg:grid-cols-2 gap-y-8.5 lg:gap-x-12 xl:gap-x-[61px] items-center rounded-[28px]">
				<div className="h-full flex flex-col gap-y-8">
					<RealTimeRates transactionType={currentForm} />
					<LiveTradingChart symbol="USDT/NGN" transactionType={currentForm} />
				</div>
				{currentForm === "buy" ? (
					<BuyCryptoForm onSwap={handleSwap} />
				) : (
					<SellCryptoForm onSwap={handleSwap} />
				)}
			</div>
		</div>
	);
}
