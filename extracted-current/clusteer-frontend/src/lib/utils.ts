import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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
