"use client";
import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { QuoteSummary, SettlementProgress } from "./quote-summary";
const stages = ["Your quote", "Your transfer", "Your receipt"];
export function ConversionPreview() {
	const [stage, setStage] = useState(0);
	const [value, setValue] = useState("1000");
	const [asset, setAsset] = useState("USDT");
	const numericAmount = Number(value);
	const valid =
		value.trim() !== "" &&
		Number.isFinite(numericAmount) &&
		numericAmount >= 1 &&
		numericAmount <= 1000000;
	const amount = valid ? numericAmount : 0;
	const rate = 1450,
		fee = amount * rate * 0.0075;
	return (
		<div className="cl-conversion-preview">
			<div className="cl-preview-topline">
				<span className="cl-demo-label">Interactive product preview</span>
				<span>No funds are moved</span>
			</div>
			<div className="cl-preview-tabs" role="tablist" aria-label="Explore a conversion">
				{stages.map((name, i) => (
					<button
						key={name}
						id={`conversion-tab-${i}`}
						role="tab"
						aria-selected={stage === i}
						aria-controls="conversion-panel"
						tabIndex={stage === i ? 0 : -1}
						aria-disabled={i > 0 && !valid}
						onClick={() => {
							if (i === 0 || valid) setStage(i);
						}}
						onKeyDown={(e) => {
							if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
								e.preventDefault();
								if (!valid) return;
								const next =
									e.key === "Home"
										? 0
										: e.key === "End"
											? 2
											: (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
								setStage(next);
								document.getElementById(`conversion-tab-${next}`)?.focus();
							}
						}}
					>
						{name}
					</button>
				))}
			</div>
			<div
				id="conversion-panel"
				role="tabpanel"
				aria-labelledby={`conversion-tab-${stage}`}
				className="cl-preview-panel"
				key={stage}
			>
				{stage === 0 && (
					<div className="cl-preview-input">
						<label htmlFor="preview-amount">Try an amount</label>
						<div>
							<input
								id="preview-amount"
								aria-invalid={!valid}
								aria-describedby="preview-amount-help"
								type="number"
								min="1"
								max="1000000"
								step="any"
								value={value}
								onChange={(e) => setValue(e.target.value)}
							/>
							<select
								aria-label="Preview asset"
								value={asset}
								onChange={(e) => setAsset(e.target.value)}
							>
								<option>USDT</option>
								<option>USDC</option>
							</select>
						</div>
						<p
							id="preview-amount-help"
							className={valid ? "sr-only" : "cl-form-error"}
							role={!valid ? "alert" : undefined}
						>
							Enter an amount from 1 to 1,000,000 {asset}.
						</p>
					</div>
				)}
				{stage === 1 && (
					<div className="cl-stage-intro">
						<span className="cl-small-icon">
							<ArrowRight size={22} />
						</span>
						<h3>A clear next step.</h3>
						<p>
							In your order, you’ll see the selected network and transfer instructions. Always check
							both before sending.
						</p>
					</div>
				)}
				{stage === 2 && (
					<div className="cl-stage-intro">
						<span className="cl-small-icon cl-success">
							<Check size={22} />
						</span>
						<h3>Everything, accounted for.</h3>
						<p>Your receipt brings the amount, fee and payout status together.</p>
					</div>
				)}
				{valid && (
					<QuoteSummary
						amount={amount}
						rate={rate}
						fee={fee}
						asset={asset}
						destination="Your Nigerian bank"
						illustrative
					/>
				)}
				<SettlementProgress current={stage} />
				<button
					disabled={!valid}
					className="cl-button cl-button-dark cl-full"
					onClick={() => setStage(stage === 2 ? 0 : stage + 1)}
				>
					{stage === 2 ? (
						<>
							Replay the preview <RotateCcw size={15} />
						</>
					) : (
						<>
							Explore {stage === 0 ? "the transfer" : "the receipt"} <ArrowRight size={15} />
						</>
					)}
				</button>
			</div>
			<p className="cl-preview-footnote">
				Example rate and 0.75% fee are for demonstration only. Actual quotes and availability may
				differ.
			</p>
		</div>
	);
}
