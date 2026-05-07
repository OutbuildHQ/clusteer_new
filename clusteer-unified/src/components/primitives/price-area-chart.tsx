"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { formatMoney } from "@/lib/utils";

export function PriceAreaChart({
	data,
	currency = "NGN",
	height = 240,
	color = "var(--c-lime-500)",
	gridColor,
}: {
	data: { t: string; v: number }[];
	currency?: string;
	height?: number;
	color?: string;
	gridColor?: string;
}) {
	const gradId = `price-area-${color.replace(/[^a-z0-9]/gi, "")}`;
	return (
		<div style={{ width: "100%", height }}>
			<ResponsiveContainer>
				<AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={color} stopOpacity={0.3} />
							<stop offset="100%" stopColor={color} stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid stroke={gridColor ?? "var(--c-line)"} vertical={false} />
					<XAxis dataKey="t" tickLine={false} axisLine={false} fontSize={11} stroke="var(--c-text-3)" />
					<YAxis
						tickLine={false}
						axisLine={false}
						fontSize={11}
						stroke="var(--c-text-3)"
						tickFormatter={(v) => formatMoney(Number(v), currency, { compact: true, decimals: 0 })}
						width={70}
					/>
					<Tooltip
						contentStyle={{
							background: "var(--c-surface)",
							border: "1px solid var(--c-line)",
							borderRadius: 8,
							fontSize: 12,
							color: "var(--c-text)",
						}}
						formatter={(v: number) => [formatMoney(v, currency), "Value"]}
					/>
					<Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gradId})`} />
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
