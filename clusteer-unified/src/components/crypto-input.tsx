import { CURRENCIES } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { ICurrency } from "@/types";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import FiatSelector from "./fiat-selector";
import { Input } from "./ui/input";

interface CryptoInputProps {
	name: string;
}

function CryptoInput({ name }: CryptoInputProps) {
	const [fiat, setFiat] = useState<ICurrency>(CURRENCIES[0]);

	const { watch } = useFormContext();
	const amount = watch(name);

	const displayValue = useMemo(
		() => formatNumber(Math.round((amount ?? 0) * fiat.rate), true),
		[amount, fiat]
	);

	return (
		<div className="bg-white flex items-center h-[65px] px-3.5 rounded-xl">
			<Input
				disabled
				value={displayValue}
				className="border-0 font-avenir-next bg-none shadow-none h-11 border-none p-0 rounded-none font-bold text-base w-full disabled:opacity-100"
				aria-label="Amount input"
			/>
			<Image
				src={fiat.icon}
				alt={`${fiat.icon} logo`}
				className="size-6 shrink-0"
				width={24}
				height={24}
			/>
			<FiatSelector
				fiat={fiat}
				setFiat={setFiat}
				currencies={CURRENCIES}
			/>
		</div>
	);
}

export default React.memo(CryptoInput);
