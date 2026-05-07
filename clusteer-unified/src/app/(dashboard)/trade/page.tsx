"use client";

import { useState } from "react";
import { ASSETS } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ArrowDownUp } from "lucide-react";

type Side = "Buy" | "Sell" | "Swap";

export default function TradePage() {
	const [side, setSide] = useState<Side>("Buy");
	const [asset, setAsset] = useState("USDT");
	const [amount, setAmount] = useState("");

	const selected = ASSETS.find((a) => a.symbol === asset) ?? ASSETS[0];
	const rate = selected.priceNgn;
	const amtNum = parseFloat(amount) || 0;
	const ngnValue = amtNum * rate;
	const feePct = 0.015;
	const feeAmt = ngnValue * feePct;

	const receiveValue = (() => {
		if (side === "Buy") {
			return amtNum ? (amtNum / rate).toFixed(6) : "0";
		}
		if (side === "Sell") {
			return formatMoney(ngnValue, "NGN", { decimals: 0 });
		}
		// Swap: asset-to-asset placeholder
		return amtNum ? amtNum.toFixed(6) : "0";
	})();

	const payLabel = side === "Buy" ? "You pay" : "You sell";

	return (
		<div className="w-full max-w-[520px] mx-auto flex flex-col gap-5 lg:gap-6 px-4 lg:px-0">
			{/* Title */}
			<h1
				className="text-[22px] lg:text-[32px]"
				style={{
					fontWeight: 600,
					color: "var(--c-text)",
					letterSpacing: "-0.03em",
					margin: 0,
				}}
			>
				Buy &amp; Sell
			</h1>

			{/* Card */}
			<div
				className="p-4 lg:p-5"
				style={{
					background: "var(--c-surface)",
					border: "1px solid var(--c-line)",
					borderRadius: 14,
				}}
			>
				{/* Segmented control: Buy / Sell / Swap */}
				<div
					className="w-full"
					style={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						padding: 4,
						borderRadius: 10,
						background: "var(--c-onyx-900)",
					}}
				>
					{(["Buy", "Sell", "Swap"] as Side[]).map((s) => (
						<button
							key={s}
							onClick={() => setSide(s)}
							className="py-[10px] lg:py-0 lg:h-9 rounded-lg lg:rounded-md"
							style={{
								flex: 1,
								border: "none",
								cursor: "pointer",
								fontSize: 13.5,
								fontWeight: 500,
								fontFamily: "var(--f-sans)",
								transition: "background 0.15s, color 0.15s",
								...(side === s
									? { background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }
									: { background: "transparent", color: "var(--c-cream)" }),
							}}
						>
							{s}
						</button>
					))}
				</div>

				<div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
					{/* You pay / sell panel */}
					<div>
						<label
							style={{
								display: "block",
								fontSize: 12,
								color: "var(--c-text-3)",
								marginBottom: 6,
								fontWeight: 500,
							}}
						>
							{payLabel}
						</label>
						<div
							className="h-[54px] lg:h-16"
							style={{
								padding: "0 14px",
								border: "1px solid var(--c-line)",
								borderRadius: 14,
								background: "var(--c-surface-2)",
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							<input
								inputMode="decimal"
								placeholder="0"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								style={{
									flex: 1,
									border: "none",
									background: "transparent",
									outline: "none",
									height: "100%",
									fontSize: 28,
									fontWeight: 600,
									fontFamily: "var(--f-display)",
									fontVariantNumeric: "tabular-nums",
									color: "var(--c-text)",
									padding: 0,
									minWidth: 0,
								}}
							/>
							{side === "Buy" ? (
								<span
									style={{
										fontSize: 18,
										fontFamily: "var(--f-mono)",
										fontVariantNumeric: "tabular-nums",
										color: "var(--c-text-3)",
										fontWeight: 600,
									}}
								>
									NGN
								</span>
							) : (
								<AssetSelector value={asset} onChange={setAsset} />
							)}
						</div>
					</div>

					{/* Arrow divider */}
					<div style={{ display: "flex", justifyContent: "center" }}>
						<div
							style={{
								width: 36,
								height: 36,
								borderRadius: "50%",
								background: "var(--c-onyx-900)",
								color: "var(--c-cream)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<ArrowDownUp size={16} />
						</div>
					</div>

					{/* You receive panel */}
					<div>
						<label
							style={{
								display: "block",
								fontSize: 12,
								color: "var(--c-text-3)",
								marginBottom: 6,
								fontWeight: 500,
							}}
						>
							You receive
						</label>
						<div
							className="h-[54px] lg:h-16"
							style={{
								padding: "0 14px",
								border: "1px solid var(--c-line)",
								borderRadius: 14,
								background: "var(--c-surface-2)",
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							<div
								style={{
									flex: 1,
									fontSize: 28,
									fontWeight: 600,
									fontFamily: "var(--f-display)",
									fontVariantNumeric: "tabular-nums",
									color: "var(--c-text)",
								}}
							>
								{receiveValue}
							</div>
							{side === "Buy" ? (
								<AssetSelector value={asset} onChange={setAsset} />
							) : (
								<span
									style={{
										fontSize: 18,
										fontFamily: "var(--f-mono)",
										fontVariantNumeric: "tabular-nums",
										color: "var(--c-text-3)",
										fontWeight: 600,
									}}
								>
									NGN
								</span>
							)}
						</div>
					</div>

					{/* Fee breakdown card */}
					<div
						style={{
							background: "var(--c-surface-2)",
							borderRadius: 14,
							padding: 14,
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
							<span style={{ color: "var(--c-text-3)" }}>Rate</span>
							<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
								1 {asset} = {formatMoney(rate, "NGN", { decimals: 0 })}
							</span>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 6 }}>
							<span style={{ color: "var(--c-text-3)" }}>Fee (1.5%)</span>
							<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
								{formatMoney(feeAmt, "NGN", { decimals: 0 })}
							</span>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 6 }}>
							<span style={{ color: "var(--c-text-3)" }}>Network</span>
							<span style={{ color: "var(--c-text)" }}>{selected.chains[0]}</span>
						</div>
					</div>

					{/* Continue button */}
					<button
						className="h-[50px] lg:h-12"
						style={{
							width: "100%",
							borderRadius: 10,
							border: "none",
							cursor: "pointer",
							fontSize: 15,
							fontWeight: 500,
							fontFamily: "var(--f-sans)",
							background: "var(--c-lime-500)",
							color: "var(--c-onyx-900)",
							marginTop: 6,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						Continue → Review
					</button>
				</div>
			</div>
		</div>
	);
}

/* ---- Asset selector pill ---- */
function AssetSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<div style={{ position: "relative", flexShrink: 0 }}>
			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 6,
					pointerEvents: "none",
				}}
			>
				<AssetLogo symbol={value} size="sm" />
				<span style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>{value}</span>
				<svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5 }}>
					<path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0,
					cursor: "pointer",
					width: "100%",
					height: "100%",
				}}
			>
				{ASSETS.map((a) => (
					<option key={a.symbol} value={a.symbol}>
						{a.symbol}
					</option>
				))}
			</select>
		</div>
	);
}
