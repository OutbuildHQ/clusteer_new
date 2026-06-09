"use client";

import { useEffect, useRef } from "react";
import { createChart, type IChartApi, type CandlestickData } from "lightweight-charts";

export function CandleChart({
	data,
	height = 360,
}: {
	data: CandlestickData[];
	height?: number;
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const chartRef = useRef<IChartApi | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		const root = getComputedStyle(document.documentElement);
		const muted = root.getPropertyValue("--muted-foreground").trim() || "#888";
		const border = root.getPropertyValue("--border").trim() || "#eee";
		const chart = createChart(containerRef.current, {
			autoSize: true,
			layout: {
				background: { color: "transparent" },
				textColor: muted,
				fontFamily: "var(--font-inter), sans-serif",
			},
			grid: {
				vertLines: { color: border },
				horzLines: { color: border },
			},
			rightPriceScale: { borderVisible: false },
			timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
		});
		chartRef.current = chart;
		const series = (chart as any).addCandlestickSeries({
			upColor: "oklch(0.648 0.164 149)",
			downColor: "oklch(0.588 0.218 27)",
			wickUpColor: "oklch(0.648 0.164 149)",
			wickDownColor: "oklch(0.588 0.218 27)",
			borderVisible: false,
		});
		series.setData(data);
		chart.timeScale().fitContent();
		return () => {
			chart.remove();
		};
	}, [data]);

	return <div ref={containerRef} style={{ width: "100%", height }} />;
}
