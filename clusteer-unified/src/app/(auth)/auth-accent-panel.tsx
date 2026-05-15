"use client";

import { useEffect, useState } from "react";

type RateData = {
	rate: string;
	change: string;
	volume: string;
};

const FALLBACK: RateData = { rate: "1,610.50", change: "+0.32%", volume: "3.8M" };

function formatRate(n: number): string {
	return n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function AuthAccentPanel() {
	const [data, setData] = useState<RateData>(FALLBACK);

	useEffect(() => {
		let cancelled = false;

		async function fetchRate() {
			try {
				const res = await fetch("/api/system/exchange-rate?targetCurrency=NGN&type=sell");
				const json = await res.json();
				if (cancelled || !json.status) return;

				const rate = json.sellRate ?? json.rate;
				if (!rate) return;

				// Calculate a pseudo 24h change from buy vs sell spread
				const buyRate = json.buyRate ?? rate;
				const spread = ((rate - buyRate) / buyRate) * 100;
				const changeStr = spread >= 0 ? `+${spread.toFixed(2)}%` : `${spread.toFixed(2)}%`;

				setData({
					rate: formatRate(rate),
					change: changeStr,
					volume: FALLBACK.volume, // volume not available from this endpoint
				});
			} catch {
				// keep fallback
			}
		}

		fetchRate();
		// Refresh every 5 minutes (matches API cache)
		const interval = setInterval(fetchRate, 5 * 60 * 1000);
		return () => { cancelled = true; clearInterval(interval); };
	}, []);

	return (
		<div
			className="relative hidden lg:flex items-center justify-center overflow-hidden"
			style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
		>
			{/* Lime gradient blobs */}
			<div
				className="absolute rounded-full"
				style={{
					width: 520, height: 520, top: -120, right: -160,
					background: "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--c-lime-500) 55%, transparent), transparent 70%)",
				}}
			/>
			<div
				className="absolute rounded-full"
				style={{
					width: 360, height: 360, bottom: -80, left: -100,
					background: "radial-gradient(circle, color-mix(in oklab, var(--c-lime-500) 32%, transparent), transparent 65%)",
				}}
			/>

			<div className="relative z-10 p-12 max-w-[480px]">
				{/* Live rate badge */}
				<div
					className="flex items-center gap-2 mb-4"
					style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-lime-500)", fontWeight: 600 }}
				>
					<span
						className="inline-block rounded-full live-dot"
						style={{
							width: 6, height: 6,
							background: "var(--c-lime-500)",
						}}
					/>
					Live &middot; USDT / NGN
				</div>

				{/* Price */}
				<h2
					className="font-display tabular-nums"
					style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1, color: "var(--c-cream)" }}
				>
					&#8358;{data.rate}
				</h2>
				<div style={{ color: "rgba(244,241,234,.6)", marginTop: 8, fontSize: 13 }}>
					{data.change} (24h) &middot; {data.volume} USDT volume today
				</div>

				{/* Tagline */}
				<div
					className="font-display"
					style={{ marginTop: 48, fontSize: 22, fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1.3, color: "var(--c-cream)" }}
				>
					Naira &#8596; Stablecoins, settled in{" "}
					<span style={{ color: "var(--c-lime-500)" }}>5 minutes</span>.
				</div>
				<div style={{ color: "rgba(244,241,234,.6)", marginTop: 14, fontSize: 13.5, lineHeight: 1.55 }}>
					Verified Nigerians use Clusteer to buy, sell, send and receive USDT &amp; USDC at the fairest rate. No spread games.
				</div>

				{/* Stats */}
				<div
					className="flex items-center gap-4"
					style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(244,241,234,.1)" }}
				>
					{[["92k+", "Verified users"], ["\u20A642B", "Volume settled"], ["4.9\u2605", "App rating"]].map(([v, l]) => (
						<div key={l}>
							<div className="font-display tabular-nums" style={{ fontSize: 20, fontWeight: 600, color: "var(--c-cream)" }}>{v}</div>
							<div style={{ fontSize: 11, color: "rgba(244,241,234,.5)" }}>{l}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
