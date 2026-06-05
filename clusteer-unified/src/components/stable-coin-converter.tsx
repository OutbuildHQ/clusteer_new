"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getAllBlockChains,
	getExchangeRate,
} from "@/lib/api/blockchain/queries";
import { MAXIMUM_VALUE, MINIMUM_VALUE } from "@/lib/constants";
import { cn, formatNumber, parseNumber } from "@/lib/utils";
import { Crypto } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Input } from "./ui/input";

const ExchangeRateDisplay = ({ amount }: { amount: number }) => {
	return (
		<div className="bg-black z-10 flex gap-x-1.5 items-center justify-between rounded-2xl px-1 h-[13px] md:h-[26px] md:px-2 w-[55px] md:w-[106px] shrink-0">
			<Image
				className="md:size-3"
				src="/assets/icons/close.svg"
				alt="close icon"
				width={7}
				height={7}
			/>
			<div className="flex ml-auto items-center gap-x-0.5 md:gap-x-1">
				<span className="text-[7px] md:text-sm md:leading-5 text-medium-green">
					{amount.toLocaleString()}
				</span>
				<Image
					className="md:size-3"
					src="/assets/icons/uprate.svg"
					alt="up rate icon"
					width={6}
					height={6}
				/>
			</div>
		</div>
	);
};

export default function StableCoinConverter() {
	const { data: stableCoins, isPending } = useQuery({
		queryKey: ["blockchains"],
		queryFn: getAllBlockChains,
		select: (coins) => coins.map((coin) => coin.code),
	});

	const [currentStableCoin, setCurrentStableCoin] = useState<Crypto>("ETH");

	const [amount, setAmount] = useState(MINIMUM_VALUE);

	const { data: allRates, isPending: isRatesPending } = useQuery({
		queryKey: ["exchangeRates", stableCoins],
		queryFn: async () => {
			if (!stableCoins) return {} as Record<Crypto, number>;

			const results = await Promise.all(
				stableCoins.map(async (coin) => {
					const res = await getExchangeRate({
						baseCurrency: coin,
						targetCurrency: "NGN",
						amount: 1,
					});
					return [res.base, res.sale] as const;
				})
			);

			return Object.fromEntries(results) as Record<Crypto, number>;
		},
		enabled: !!stableCoins,
	});

	const currentRate = useMemo(() => {
		if (!allRates) return 0;
		return allRates[currentStableCoin] ?? 0;
	}, [allRates, currentStableCoin]);

	const [displayValue, setDisplayValue] = useState(
		formatNumber(MINIMUM_VALUE, true)
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const input = e.target.value;
			const allowDecimals = true; // Set to false if decimals are not allowed

			// Handle empty input
			if (input === "") {
				setDisplayValue("");
				setAmount(0); // Or null, depending on requirements
				return;
			}

			const cleaned = input.replace(/,/g, "");
			const pattern = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d*$/;

			// Allow intermediate decimal states (e.g., "100." or ".")
			if (allowDecimals && (cleaned === "." || cleaned.endsWith("."))) {
				setDisplayValue(input);
				return;
			}

			// Validate and parse input
			if (pattern.test(cleaned)) {
				const numValue = parseNumber(input);
				if (numValue !== null) {
					setAmount(numValue);
					setDisplayValue(formatNumber(numValue, allowDecimals));
				}
				// If numValue is null, do nothing; input reverts to previous displayValue
			}
			// If pattern fails, do nothing; input reverts to previous displayValue
		},
		[]
	);

	const handleBlur = useCallback(() => {
		const num = parseNumber(displayValue);
		if (num !== null) {
			if (num < MINIMUM_VALUE) {
				setAmount(MINIMUM_VALUE);
				setDisplayValue(formatNumber(MINIMUM_VALUE, true));
			} else if (num > MAXIMUM_VALUE) {
				setAmount(MAXIMUM_VALUE);
				setDisplayValue(formatNumber(MAXIMUM_VALUE, true));
			} else {
				setDisplayValue(formatNumber(num, true));
			}
		} else {
			setAmount(MINIMUM_VALUE);
			setDisplayValue(formatNumber(MINIMUM_VALUE, true));
		}
	}, [displayValue]);

	const convertedDisplayAmount = useMemo(() => {
		const convertedAmount = amount * currentRate;
		return formatNumber(convertedAmount, true);
	}, [amount, currentStableCoin]);

	const isBusy = isPending || isRatesPending;

	return (
		<div className="relative flex md:flex-col mx-auto w-fit">
			<div className="absolute inset-0 flex justify-center items-center max-h-full w-fit -left-[31px] md:hidden">
				<ExchangeRateDisplay amount={currentRate} />
				<div className="absolute inset-0 z-0 my-auto max-h-[100px]">
					<Image
						src="/assets/icons/curved_arrow_mobile.svg"
						alt="curved arrow icon"
						fill
						className="object-contain"
					/>
				</div>
			</div>
			<div className="flex flex-col md:flex-row justify-center items-center gap-y-3.5 md:gap-x-[55px]">
				<div className="flex items-center h-[59px] max-w-[261px] md:max-w-[320px] gap-x-2 md:gap-x-2.5 rounded-[52px] border-[0.52px] border-gray-500 focus-visible:ring-0 outline-none overflow-hidden">
					<div className="flex items-center gap-x-1.5 md:gap-x-2 pl-3 md:pl-3.5">
						<div className="text-left flex flex-col justify-center">
							<span className="font-medium text-[6px] md:text-[8px]">
								You send
							</span>
							<Input
								name="stable-coin"
								type="text"
								disabled={isBusy}
								value={displayValue}
								onChange={handleInputChange}
								onBlur={handleBlur}
								placeholder="Enter amount"
								className="border-none focus-visible:ring-0 shadow-none text-[13px] md:text-lg h-auto p-0 rounded-none"
							/>
						</div>
						<Image
							className="sm:size-4 h-auto shrink-0"
							src="/assets/icons/help.svg"
							alt="help icon"
							width={13}
							height={13}
						/>
					</div>
					<div className="px-3 md:px-3.5 bg-[#F2FED1] h-full w-full flex items-center max-w-[92px]">
						<Select
							value={currentStableCoin}
							disabled={isBusy}
							onValueChange={(val) => setCurrentStableCoin(val as Crypto)}
						>
							<SelectTrigger className="border-none rounded-none focus-visible:ring-0 shadow-none font-medium text-[13px] w-full md:text-base !gap-x-0.5 md:!gap-x-1 p-0 [&>span]:max-w-[38px] md:[&>span]:max-w-[47px] [&>span]:w-full [&>span]:block [&>span]:text-center [&>span]:flex-shrink-0 [&>svg]:!size-5 md:[&>svg]:!size-4">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{isPending || !stableCoins ? (
									<SelectItem key={currentStableCoin} value={currentStableCoin}>
										{currentStableCoin}
									</SelectItem>
								) : (
									stableCoins.map((coin) => (
										<SelectItem key={coin} value={coin}>
											{coin}
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
					</div>
				</div>
				<Image
					className="md:size-5"
					src="/assets/icons/exchange.svg"
					alt="Currency exchange icon"
					width={10}
					height={10}
				/>
				<div className="flex items-center h-[59px] max-w-[261px] md:max-w-[320px] gap-x-2 md:gap-x-2.5 rounded-[52px] border-[0.52px] border-gray-500 focus-visible:ring-0 outline-none overflow-hidden">
					<div className="flex items-center gap-x-1.5 md:gap-x-2 pl-3 md:pl-3.5">
						<div className="text-left flex flex-col justify-center">
							<span className="font-medium text-[6px] md:text-[8px]">
								You get
							</span>
							<Input
								name="naira-conversion"
								disabled
								value={convertedDisplayAmount}
								type="text"
								placeholder="Converted to naira"
								className={cn(
									"border-none focus-visible:ring-0 shadow-none text-[13px] md:text-lg h-auto p-0 rounded-none disabled:opacity-100",
									{ "opacity-45": isRatesPending }
								)}
							/>
						</div>
						<Image
							className="sm:size-4 h-auto shrink-0"
							src="/assets/icons/help.svg"
							alt="help icon"
							width={13}
							height={13}
						/>
					</div>
					<div className="px-3 md:px-3.5 bg-[#F2FED1] h-full flex justify-center items-center min-w-[92px]">
						<span className="font-medium text-[13px] md:text-base">NAIRA</span>
					</div>
				</div>
			</div>
			<div className="relative justify-center mt-1 md:mt-[10px] hidden md:flex h-[50px]">
				<ExchangeRateDisplay amount={currentRate} />
				<div className="absolute inset-0 z-0 -top-[5px] md:-top-[11px] mx-auto max-w-[218px] md:max-w-[424px]">
					<Image
						src="/assets/icons/curved_arrow_desktop.svg"
						alt="curved arrow icon"
						fill
						className="object-contain"
					/>
				</div>
			</div>
		</div>
	);
}
