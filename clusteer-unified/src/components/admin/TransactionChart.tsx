"use client";

import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ month: "Jan", value: 65000 },
	{ month: "Feb", value: 78000 },
	{ month: "Mar", value: 82000 },
	{ month: "Apr", value: 95000 },
	{ month: "May", value: 88000 },
	{ month: "Jun", value: 102000 },
	{ month: "Jul", value: 115000 },
	{ month: "Aug", value: 108000 },
	{ month: "Sep", value: 125000 },
	{ month: "Oct", value: 138000 },
	{ month: "Nov", value: 145000 },
	{ month: "Dec", value: 158000 },
];

interface TransactionChartProps {
	data?: Array<{ month: string; value: number }>;
}

export default function TransactionChart({ data: customData }: TransactionChartProps) {
	const chartData = customData || data;

	return (
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart
				data={chartData}
				margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#014F01" stopOpacity={0.3} />
						<stop offset="95%" stopColor="#014F01" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
				<XAxis
					dataKey="month"
					stroke="#6B7280"
					style={{ fontSize: "12px" }}
				/>
				<YAxis
					stroke="#6B7280"
					style={{ fontSize: "12px" }}
					tickFormatter={(value) => `$${value / 1000}k`}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "#FFFFFF",
						border: "1px solid #E5E7EB",
						borderRadius: "8px",
						padding: "8px 12px",
					}}
					labelStyle={{ color: "#111827", fontWeight: 600 }}
					formatter={(value: number) => [
						`$${value.toLocaleString()}`,
						"Volume",
					]}
				/>
				<Area
					type="monotone"
					dataKey="value"
					stroke="#014F01"
					strokeWidth={2}
					fillOpacity={1}
					fill="url(#colorValue)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
