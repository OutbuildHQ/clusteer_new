import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseNumber(str: string): number | null {
	const cleaned = str.replace(/,/g, "");
	const num = parseFloat(cleaned);
	return isNaN(num) ? null : num;
}

export function formatNumber(
	num: number = 0,
	allowDec: boolean = true
): string {
	if (isNaN(num)) return "";
	let formatted = allowDec ? num.toString() : Math.floor(num).toString();
	const parts = formatted.split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	formatted = parts.join(".");
	return formatted;
}

export function getFormattedDate(date: Date): string {
	if (isNaN(date.getTime())) return ""; // handle invalid dates safely

	const options: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "long",
		year: "numeric",
	};

	const parts = date.toLocaleDateString("en-GB", options).split(" ");
	return `${parts[0]} ${parts[1]}, ${parts[2]}`;
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}
