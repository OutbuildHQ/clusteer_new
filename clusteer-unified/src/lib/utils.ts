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

// --- Design system utilities (from Claude Design handoff) ---

export function formatMoney(
	amount: number,
	currency: string = "NGN",
	opts: { decimals?: number; compact?: boolean } = {},
) {
	const { decimals, compact } = opts;
	try {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency,
			minimumFractionDigits: decimals ?? (amount >= 1 ? 2 : 6),
			maximumFractionDigits: decimals ?? (amount >= 1 ? 2 : 6),
			notation: compact ? "compact" : "standard",
		}).format(amount);
	} catch {
		return `${currency} ${amount.toFixed(decimals ?? 2)}`;
	}
}

export function formatCrypto(amount: number, symbol: string, decimals = 8) {
	const fixed = amount.toFixed(decimals).replace(/\.?0+$/, "");
	return `${fixed} ${symbol}`;
}

export function formatPct(n: number, decimals = 2) {
	const sign = n > 0 ? "+" : "";
	return `${sign}${n.toFixed(decimals)}%`;
}

export function truncateAddress(addr: string, head = 6, tail = 4) {
	if (!addr || addr.length <= head + tail) return addr;
	return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export function formatDateTime(d: Date | string | number) {
	const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

export function relativeTime(d: Date | string | number) {
	const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
	const diff = (Date.now() - date.getTime()) / 1000;
	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
	if (diff < 60) return rtf.format(-Math.round(diff), "second");
	if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");
	if (diff < 86400) return rtf.format(-Math.round(diff / 3600), "hour");
	if (diff < 2592000) return rtf.format(-Math.round(diff / 86400), "day");
	return formatDateTime(date);
}

/** Format stablecoin amounts consistently: USDT/USDC get 2 decimals, NGN gets 0 */
export function formatCryptoAmount(amount: number, symbol: string): string {
	if (symbol === "NGN") return new Intl.NumberFormat("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
	// Stablecoins: 2 decimals for amounts >= 1, 4 decimals for small amounts
	const decimals = amount >= 1 ? 2 : 4;
	return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: decimals }).format(amount);
}
