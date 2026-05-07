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
	lineOnly = false,
}: {
	data: { t: string; v: number }[];
	currency?: string;
	height?: number;
	lineOnly?: boolean;
}) {
	return (
		<div style={{ width: "100%", height }}>
			<ResponsiveContainer>
				<AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id="price-area" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="var(--clusteer-blue-500)" stopOpacity={0.35} />
							<stop offset="100%" stopColor="var(--clusteer-blue-500)" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid stroke="var(--border)" vertical={false} />
					<XAxis dataKey="t" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
					<YAxis
						tickLine={false}
						axisLine={false}
						fontSize={11}
						stroke="var(--muted-foreground)"
						tickFormatter={(v) => formatMoney(Number(v), currency, { compact: true, decimals: 0 })}
						width={70}
					/>
					<Tooltip
						contentStyle={{
							background: "var(--popover)",
							border: "1px solid var(--border)",
							borderRadius: 8,
							fontSize: 12,
						}}
						formatter={(v: number) => [formatMoney(v, currency), "Price"]}
					/>
					<Area type="monotone" dataKey="v" stroke="var(--clusteer-blue-600)" strokeWidth={2} fill={lineOnly ? "none" : "url(#price-area)"} />
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
