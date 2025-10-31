import { ICurrency } from "@/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { memo } from "react";

interface Props {
	fiat: ICurrency;
	setFiat: (value: ICurrency) => void;
	currencies: ICurrency[];
}

const FiatSelector = memo(function FiatSelector({
	fiat,
	setFiat,
	currencies,
}: Props) {
	return (
		<Select
			onValueChange={(value) => {
				const selectedCurrency = currencies.find(
					(curr) => curr.currency === value
				);
				if (selectedCurrency) {
					setFiat(selectedCurrency);
				}
			}}
			value={fiat.currency}
			defaultValue={currencies[0].currency}
		>
			<SelectTrigger
				className="border-0 bg-none shadow-none font-semibold capitalize gap-1 !pl-3.5 justify-between p-0 min-w-20 text-base"
				aria-label="Select currency"
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{currencies.map((curr) => (
					<SelectItem
						key={curr.currency}
						value={curr.currency}
						className="capitalize font-semibold"
					>
						{curr.currency}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
});

FiatSelector.displayName = "FiatSelector";

export default FiatSelector;
