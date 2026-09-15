import { ArrowDown, Check, Landmark } from "lucide-react";
export const formatNaira = (amount: number) =>
	new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
export function QuoteSummary({
	amount,
	rate,
	fee,
	asset = "USDT",
	destination,
	illustrative = false,
	side = "sell",
	showSource = true,
}: {
	amount: number;
	rate: number;
	fee: number;
	asset?: string;
	destination?: string;
	illustrative?: boolean;
	side?: "buy" | "sell";
	showSource?: boolean;
}) {
	const gross = amount * rate;
	return (
		<div className="cl-quote">
			{illustrative && <span className="cl-demo-label">Illustrative quote · not a live rate</span>}
			{showSource && (
				<>
					<div className="cl-quote-amount">
						<span>{side === "sell" ? "You send" : "You receive"}</span>
						<strong>
							{amount.toLocaleString("en-NG", { maximumFractionDigits: 4 })}
							<small>{asset}</small>
						</strong>
					</div>
					<div className="cl-quote-divider">
						<ArrowDown size={16} />
					</div>
				</>
			)}
			<div className="cl-quote-amount cl-quote-result">
				<span>{side === "sell" ? "Your bank receives" : "Total you pay"}</span>
				<strong>{formatNaira(side === "sell" ? gross - fee : gross + fee)}</strong>
			</div>
			<dl className="cl-details">
				<div>
					<dt>Exchange rate</dt>
					<dd>
						1 {asset} = {formatNaira(rate)}
					</dd>
				</div>
				<div>
					<dt>Service fee</dt>
					<dd>{formatNaira(fee)}</dd>
				</div>
				{destination && (
					<div>
						<dt>
							<Landmark size={14} /> Destination
						</dt>
						<dd>{destination}</dd>
					</div>
				)}
			</dl>
		</div>
	);
}
export function SettlementProgress({
	current = 0,
	labels = ["Quote reviewed", "Transfer received", "Bank payout confirmed"],
}: {
	current?: number;
	labels?: string[];
}) {
	return (
		<ol className="cl-progress" aria-label="Transaction progress">
			{labels.map((label, i) => (
				<li
					key={label}
					data-state={i < current ? "complete" : i === current ? "current" : "upcoming"}
					aria-current={i === current ? "step" : undefined}
				>
					<span className="cl-progress-dot">{i < current ? <Check size={13} /> : i + 1}</span>
					<span>{label}</span>
				</li>
			))}
		</ol>
	);
}
