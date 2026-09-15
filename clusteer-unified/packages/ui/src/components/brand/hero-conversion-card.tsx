"use client";

import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, Check, Landmark, Wallet } from "lucide-react";
import { WebsiteSelect } from "./website-select";
import { formatNaira } from "./quote-summary";
import type { OverviewOrder } from "./customer-overview";

type Network = { name: string; standard: string; icon: string };
type Props = {
	id: string;
	stage: number;
	side: "buy" | "sell";
	value: string;
	amount: number;
	asset: "USDT" | "USDC";
	valid: boolean;
	inRange: boolean;
	rate: number;
	fee: number;
	networkKey: string;
	networks: Record<string, Network>;
	receipt: OverviewOrder | null;
	onSide: (side: "buy" | "sell") => void;
	onValue: (value: string) => void;
	onAsset: (asset: "USDT" | "USDC") => void;
	onNetwork: (network: string) => void;
	onStage: (stage: number) => void;
	onRestart: () => void;
};

/** A website composition, sharing the walkthrough's state but no dashboard chrome. */
export function HeroConversionCard(props: Props) {
	const {
		id,
		stage,
		side,
		value,
		amount,
		asset,
		valid,
		inRange,
		rate,
		fee,
		networkKey,
		networks,
		receipt,
	} = props;
	const sell = side === "sell";
	const network = networks[networkKey];
	const total = amount * rate + (sell ? -fee : fee);
	return (
		<div className="cl-conversion-card" data-stage={stage}>
			<header className="cl-converter-header">
				<h3 tabIndex={-1} id={`${id}-card-heading`}>
					{stage === 0 ? "Buy & sell" : stage === 1 ? "Your conversion" : "Your receipt"}
				</h3>
				{stage === 0 ? (
					<div className="cl-converter-direction" role="group" aria-label="Conversion direction">
						{(["sell", "buy"] as const).map((direction) => (
							<button
								type="button"
								key={direction}
								aria-pressed={side === direction}
								onClick={() => props.onSide(direction)}
							>
								{direction === "sell" ? "Sell" : "Buy"}
							</button>
						))}
					</div>
				) : (
					<button type="button" className="cl-converter-edit" onClick={() => props.onStage(0)}>
						<ArrowLeft size={14} /> Edit amount
					</button>
				)}
			</header>
			{stage === 0 ? (
				<>
					<div className="cl-converter-entry">
						<label htmlFor={`${id}-amount`}>{sell ? "You sell" : "You buy"}</label>
						<div className={`cl-converter-amount${value.length > 7 ? " is-long-amount" : ""}`}>
							<input
								id={`${id}-amount`}
								aria-label={`Amount in ${asset}`}
								inputMode="decimal"
								type="number"
								min="1"
								max="1000000"
								step="0.0001"
								value={value}
								aria-invalid={!valid}
								aria-describedby={!valid ? `${id}-amount-note` : undefined}
								onChange={(event) => props.onValue(event.target.value)}
							/>
							<div className="cl-converter-asset">
								<WebsiteSelect
									label="Stablecoin"
									value={asset}
									onChange={(value) => props.onAsset(value as "USDT" | "USDC")}
									options={[
										{
											value: "USDT",
											label: "USDT",
											detail: "Tether",
											icon: "/assets/images/usdt.svg",
										},
										{
											value: "USDC",
											label: "USDC",
											detail: "USD Coin",
											icon: "/assets/images/usdc.svg",
										},
									]}
								/>
							</div>
						</div>
						<div className="cl-converter-network">
							<label htmlFor={`${id}-network`}>Network</label>
							<div>
								<WebsiteSelect
									id={`${id}-network`}
									label="Network"
									value={networkKey}
									onChange={props.onNetwork}
									options={Object.entries(networks)
										.filter(([key]) => asset === "USDT" || key === "ERC20")
										.map(([key, item]) => ({
											value: key,
											label: item.name,
											detail: item.standard,
											shortLabel: `${item.name} (${item.standard})`,
											icon: `/assets/icons/${item.icon}.svg`,
										}))}
								/>
							</div>
						</div>
					</div>
					{!valid && (
						<p className="cl-converter-error" id={`${id}-amount-note`} role="alert">
							{!inRange ? "Enter an amount from 1 to 1,000,000." : "Use up to 4 decimal places."}
						</p>
					)}
					<div className="cl-converter-connector" aria-hidden="true">
						<ArrowDown size={16} />
					</div>
				</>
			) : stage === 1 ? (
				<ol className="cl-converter-route" aria-label="Conversion route">
					<li>
						<span>{sell ? <Wallet size={18} /> : <Landmark size={18} />}</span>
						<div>
							<strong>{sell ? "From your wallet" : "From your Nigerian bank"}</strong>
							<p>
								{sell
									? `${amount.toLocaleString("en-NG", { maximumFractionDigits: 4 })} ${asset} · ${network.standard}`
									: `${formatNaira(total)} · Bank transfer`}
							</p>
						</div>
					</li>
					<li>
						<span>
							<ArrowDown size={18} />
						</span>
						<div>
							<strong>{sell ? "Network confirmation" : "Payment confirmation"}</strong>
							<p>
								{sell
									? "The incoming transfer is checked."
									: "Your payment is matched to the order."}
							</p>
						</div>
					</li>
					<li>
						<span>{sell ? <Landmark size={18} /> : <Wallet size={18} />}</span>
						<div>
							<strong>{sell ? "To Aisha Bello" : `To your ${network.name} wallet`}</strong>
							<p>
								{sell
									? "GTBank ••3421"
									: `${amount.toLocaleString("en-NG", { maximumFractionDigits: 4 })} ${asset} · Wallet ••12F3`}
							</p>
						</div>
					</li>
				</ol>
			) : (
				<div className="cl-converter-complete">
					<span>
						<Check size={22} />
					</span>
					<div>
						<strong>Conversion complete</strong>
						<p>
							{sell
								? "Your naira has reached your bank account."
								: "Your stablecoins have reached your wallet."}
						</p>
					</div>
				</div>
			)}
			<div
				className={`cl-converter-result${formatNaira(total).length > 14 ? " is-long-total" : ""}`}
			>
				<span>
					{stage === 2
						? sell
							? "Your bank received"
							: "Total paid"
						: sell
							? "Your bank receives"
							: "Total you pay"}
				</span>
				<div>
					<strong>{valid ? formatNaira(total) : "—"}</strong>
					<span className="cl-converter-currency">
						<span aria-hidden="true">₦</span> NGN
					</span>
				</div>
			</div>
			{valid ? (
				<dl className="cl-converter-details">
					{stage === 2 && (
						<>
							<div>
								<dt>{sell ? "You sold" : "You received"}</dt>
								<dd>
									{amount.toLocaleString("en-NG", { maximumFractionDigits: 4 })} {asset}
								</dd>
							</div>
							<div>
								<dt>Network</dt>
								<dd>
									{network.name} · {network.standard}
								</dd>
							</div>
						</>
					)}
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
					{stage === 2 && (
						<>
							<div>
								<dt>Order reference</dt>
								<dd className="cl-converter-reference">{receipt?.id}</dd>
							</div>
							<div>
								<dt>Destination</dt>
								<dd>{sell ? "GTBank ••3421" : `${network.name} wallet ••12F3`}</dd>
							</div>
						</>
					)}
				</dl>
			) : (
				<p className="cl-converter-empty">
					Enter a valid amount to see the rate, fee and {sell ? "payout" : "total cost"}.
				</p>
			)}
			{stage === 2 ? (
				<div className="cl-converter-finish">
					<Link href="/early-access" className="cl-button cl-converter-action">
						Join the waitlist <ArrowRight size={16} />
					</Link>
					<p className="cl-converter-footnote">Get an email when public access opens.</p>
					<button type="button" className="cl-converter-restart" onClick={props.onRestart}>
						Start another conversion
					</button>
				</div>
			) : (
				<button
					type="button"
					className="cl-button cl-converter-action"
					disabled={!valid}
					onClick={() => props.onStage(stage + 1)}
				>
					{stage === 0 ? "Review conversion" : "View receipt"}
					<ArrowRight size={16} />
				</button>
			)}
			{stage !== 2 && (
				<p className="cl-converter-footnote">
					{sell
						? "Your payout is shown after the service fee."
						: "Your total includes the service fee."}
				</p>
			)}
		</div>
	);
}
