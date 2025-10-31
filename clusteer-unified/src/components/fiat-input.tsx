import { MAXIMUM_VALUE, MINIMUM_VALUE } from "@/lib/constants";
import { CURRENCIES } from "@/lib/data";
import { formatNumber, parseNumber } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { UseControllerProps, useController } from "react-hook-form";
import FiatSelector from "./fiat-selector";
import { Input } from "./ui/input";
import { ICurrency } from "@/types";

function FiatInput({ name, control }: UseControllerProps) {
	const [displayValue, setDisplayValue] = useState(
		formatNumber(MINIMUM_VALUE, true)
	);

	const [fiat, setFiat] = useState<ICurrency>(CURRENCIES[1]);

	const currencyIcon = useMemo(
		() => CURRENCIES.find((a) => fiat.currency === a.currency)?.icon ?? "",
		[fiat]
	);

	const { field } = useController({ name, control });

	const handleInputChange = useCallback(
		(
			e: React.ChangeEvent<HTMLInputElement>,
			fieldOnChange: (val: number) => void
		) => {
			const input = e.target.value;
			const cleaned = input.replace(/,/g, "");
			const allowDecimals = true;

			if (input === "") {
				setDisplayValue("");
				fieldOnChange(0);
				return;
			}

			if (allowDecimals && (cleaned === "." || cleaned.endsWith("."))) {
				setDisplayValue(input);
				return;
			}

			const pattern = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
			if (!pattern.test(cleaned)) return;

			const num = parseNumber(input);
			if (num !== null) {
				fieldOnChange(num);
				setDisplayValue(formatNumber(num, allowDecimals));
			}
		},
		[]
	);

	const handleBlur = useCallback(
		(fieldOnChange: (val: number) => void, fieldOnBlur: () => void) => {
			let num = parseNumber(displayValue) ?? MINIMUM_VALUE;
			if (num < MINIMUM_VALUE) num = MINIMUM_VALUE;
			else if (num > MAXIMUM_VALUE) num = MAXIMUM_VALUE;

			fieldOnChange(num);
			setDisplayValue(formatNumber(num, true));
			fieldOnBlur();
			// Uncomment if form validation is needed
			// control._formValues.trigger(name);
		},
		[displayValue]
	);

	return (
		<div className="bg-white flex items-center h-[65px] px-3.5 rounded-xl">
			<Input
				{...field}
				value={displayValue}
				onChange={(e) => handleInputChange(e, (val) => field.onChange(val))}
				onBlur={() => handleBlur(field.onChange, () => field.onBlur())}
				className="border-0 font-avenir-next bg-none shadow-none h-11 border-none p-0 rounded-none font-bold text-base w-full"
				aria-label="Amount input"
			/>
			<Image
				src={currencyIcon}
				alt={`${fiat} logo`}
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

export default React.memo(FiatInput);
