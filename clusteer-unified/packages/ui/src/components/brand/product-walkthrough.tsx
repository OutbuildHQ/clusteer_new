"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import {
	ArrowRight,
	ArrowUpRight,
	Check,
	CircleHelp,
	LayoutDashboard,
	ArrowLeftRight,
	List,
	BookOpen,
	Settings,
	Wallet,
	Landmark,
} from "lucide-react";
import { QuoteSummary } from "./quote-summary";
import { Logo } from "./logo";
import type { OverviewOrder } from "./customer-overview";
const steps = ["Quote", "Transfer", "Receipt"];
const networks = {
	TRC20: { name: "Tron", standard: "TRC-20", icon: "tron" },
	BEP20: { name: "BNB Smart Chain", standard: "BEP-20", icon: "binance-smart-chain" },
	ERC20: { name: "Ethereum", standard: "ERC-20", icon: "ethereum" },
};
type Network = keyof typeof networks;
export function ProductWalkthrough({
	stage: controlledStage,
	onStageChange,
	compact = false,
	initialSide = "sell",
	onComplete,
}: {
	stage?: number;
	onStageChange?: (stage: number) => void;
	compact?: boolean;
	initialSide?: "buy" | "sell";
	onComplete?: (order: OverviewOrder) => void;
}) {
	const [localStage, setLocalStage] = useState(0);
	const [receipt, setReceipt] = useState<OverviewOrder | null>(null);
	const completed = useRef<{ signature: string; order: OverviewOrder } | null>(null);
	const [side, setSide] = useState<"buy" | "sell">(initialSide);
	const [value, setValue] = useState("100");
	const [asset, setAsset] = useState<"USDT" | "USDC">("USDT");
	const [selectedNetwork, setSelectedNetwork] = useState<Network>(
		initialSide === "buy" ? "ERC20" : "TRC20"
	);
	const networkKey = asset === "USDC" ? "ERC20" : selectedNetwork;
	const network = networks[networkKey];
	const id = useId();
	const requestedStage = controlledStage ?? localStage;
	const amount = Number(value);
	const inRange =
		value.trim() !== "" && Number.isFinite(amount) && amount >= 1 && amount <= 1000000;
	const precise = Math.abs(amount * 10000 - Math.round(amount * 10000)) < 0.000001;
	const valid = inRange && precise;
	const stage = valid ? requestedStage : 0;
	const select = (next: number, focus = false) => {
		if (next > 0 && !valid) return;
		setLocalStage(next);
		onStageChange?.(next);
		if (focus) document.getElementById(`${id}-tab-${next}`)?.focus({ preventScroll: true });
	};
	const safeAmount = valid ? amount : 0;
	const rate = 1450;
	const fee = safeAmount * rate * 0.0075;
	const sell = side === "sell";

	useEffect(() => {
		if (stage !== 2 || !valid) return;
		const signature = JSON.stringify([side, asset, networkKey, safeAmount, rate, fee]);
		if (completed.current?.signature === signature) return;
		const reference = Array.from(crypto.getRandomValues(new Uint8Array(8)), (byte) =>
			byte.toString(16).padStart(2, "0")
		)
			.join("")
			.toUpperCase();
		const order: OverviewOrder = {
			id: `CL-${reference}`,
			side,
			asset,
			channel: networkKey,
			amountUsdt: safeAmount,
			amountNgn: safeAmount * rate,
			rate,
			fee,
			status: "completed",
			createdAt: new Date().toISOString(),
		};
		completed.current = { signature, order };
		setReceipt(order);
		onComplete?.(order);
	}, [stage, valid, side, asset, networkKey, safeAmount, rate, fee, onComplete]);

	const startAnother = () => {
		completed.current = null;
		setReceipt(null);
		select(0, true);
	};

	return (
		<div className={`cl-product-window cl-conversion-workspace ${compact ? "is-compact" : ""}`}>
			<div className="cl-window-bar">
				<Logo />
				<span className="cl-window-context">Personal account</span>
				<span className="cl-window-name">Aisha Bello</span>
				<span className="cl-window-avatar" aria-hidden="true">
					AB
				</span>
			</div>
			<div className="cl-window-layout">
				<aside className="cl-window-sidebar" aria-hidden="true">
					<small className="cl-sidebar-label">Workspace</small>
					<span>
						<LayoutDashboard size={16} />
						Overview
					</span>
					<span className="is-selected">
						<ArrowLeftRight size={16} />
						Buy / Sell
					</span>
					<span>
						<BookOpen size={16} />
						Orders
					</span>
					<span>
						<List size={16} />
						History
					</span>
					<small className="cl-sidebar-label cl-sidebar-account">Account</small>
					<span>
						<Settings size={16} />
						Settings
					</span>
					<span className="cl-sidebar-help">
						<CircleHelp size={16} />
						Support
					</span>
				</aside>
				<div className="cl-window-content">
					<div className="cl-demo-toolbar">
						<div className="cl-workspace-heading">
							<h3>Buy & sell</h3>
							<p>Stablecoins and naira, in one conversion.</p>
						</div>
						<div className="cl-demo-directions" role="group" aria-label="Conversion direction">
							<button
								aria-pressed={sell}
								onClick={() => {
									setSide("sell");
									select(0);
								}}
							>
								Sell
							</button>
							<button
								aria-pressed={!sell}
								onClick={() => {
									setSide("buy");
									setSelectedNetwork("ERC20");
									select(0);
								}}
							>
								Buy
							</button>
						</div>
					</div>
					<div className="cl-story-tabs" role="tablist" aria-label="Conversion stages">
						{steps.map((name, index) => (
							<button
								key={name}
								id={`${id}-tab-${index}`}
								role="tab"
								aria-selected={stage === index}
								aria-disabled={index > 0 && !valid}
								aria-controls={`${id}-panel`}
								tabIndex={stage === index ? 0 : -1}
								onClick={() => select(index)}
								onKeyDown={(e) => {
									if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
									e.preventDefault();
									if (!valid) return;
									const next =
										e.key === "Home"
											? 0
											: e.key === "End"
												? 2
												: (index + (e.key === "ArrowRight" ? 1 : 2)) % 3;
									select(next);
									document.getElementById(`${id}-tab-${next}`)?.focus({ preventScroll: true });
								}}
							>
								<span>{index + 1}</span>
								{name}
							</button>
						))}
					</div>
					<div
						className="cl-demo-body"
						role="tabpanel"
						id={`${id}-panel`}
						aria-labelledby={`${id}-tab-${stage}`}
					>
						<div className="cl-demo-explanation" key={`${stage}-${side}`}>
							{stage === 0 ? (
								<>
									<div className="cl-demo-editor">
										{" "}
										<label htmlFor={`${id}-amount`}>Amount in {asset}</label>
										<div className="cl-demo-amount">
											<input
												id={`${id}-amount`}
												type="number"
												min="1"
												max="1000000"
												step="0.0001"
												value={value}
												aria-invalid={!valid}
												aria-describedby={`${id}-amount-note`}
												onChange={(e) => setValue(e.target.value)}
											/>
											<Image
												src={`/assets/images/${asset.toLowerCase()}.svg`}
												alt=""
												width={20}
												height={20}
											/>
											<select
												aria-label="Stablecoin"
												value={asset}
												onChange={(e) => setAsset(e.target.value as "USDT" | "USDC")}
											>
												<option value="USDT">USDT</option>
												<option value="USDC">USDC</option>
											</select>
										</div>
										<p
											id={`${id}-amount-note`}
											className={`cl-demo-note ${valid ? "sr-only" : ""}`}
											role={!valid ? "alert" : undefined}
										>
											{valid
												? `Enter an amount in ${asset}.`
												: !inRange
													? "Enter an amount from 1 to 1,000,000."
													: "Use up to 4 decimal places."}
										</p>
									</div>

									<div className="cl-workspace-network">
										<label htmlFor={`${id}-network`}>Network</label>
										<div className="cl-network-select">
											<Image
												src={`/assets/icons/${network.icon}.svg`}
												alt=""
												width={22}
												height={22}
											/>
											<select
												id={`${id}-network`}
												value={networkKey}
												onChange={(e) => setSelectedNetwork(e.target.value as Network)}
											>
												{Object.entries(networks)
													.filter(([key]) => asset === "USDT" || key === "ERC20")
													.map(([key, item]) => (
														<option value={key} key={key}>
															{item.name} ({item.standard})
														</option>
													))}
											</select>
										</div>
									</div>
									<div className="cl-workspace-destination">
										<span>{sell ? "Receiving bank account" : "Receiving wallet"}</span>
										<div className="cl-recipient-row">
											<span className={sell ? "cl-bank-mark" : "cl-wallet-mark"}>
												{sell ? "GT" : <Wallet size={20} />}
											</span>
											<div>
												<strong>{sell ? "Aisha Bello" : `My ${network.name} wallet`}</strong>
												<span>{sell ? "GTBank ••3421" : `${network.name} wallet ••12F3`}</span>
											</div>
										</div>
									</div>
								</>
							) : stage === 1 ? (
								<>
									<h3>Transfer details</h3>
									<p>
										{sell
											? "Use the selected network for your transfer."
											: "Your bank payment funds this conversion."}
									</p>
									<ol className="cl-transfer-route" aria-label="Conversion route">
										<li>
											<span className="cl-route-mark">
												<Wallet size={18} />
											</span>
											<div>
												<strong>{sell ? "Your external wallet" : "Your Nigerian bank"}</strong>
												<span>
													{sell
														? `${asset} · ${network.name} (${network.standard})`
														: "Pay the naira total shown"}
												</span>
											</div>
										</li>
										<li>
											<span className="cl-route-mark">
												<ArrowLeftRight size={18} />
											</span>
											<div>
												<strong>{sell ? "Network confirmation" : "Payment confirmation"}</strong>
												<span>
													{sell
														? "Clusteer checks the incoming transfer"
														: "Clusteer matches payment to your order"}
												</span>
											</div>
										</li>
										<li>
											<span className="cl-route-mark">
												{sell ? <Landmark size={18} /> : <Wallet size={18} />}
											</span>
											<div>
												<strong>{sell ? "Bank payout" : "Wallet delivery"}</strong>
												<span>
													{sell ? "Aisha Bello · GTBank ••3421" : `${network.name} wallet ••12F3`}
												</span>
											</div>
										</li>
									</ol>
									<p className="cl-network-reminder">
										{sell
											? `Send ${asset} only on ${network.name} (${network.standard}).`
											: `Your wallet must support ${asset} on ${network.name}.`}
									</p>
								</>
							) : (
								<>
									<div className="cl-receipt-heading">
										<span>
											<Check size={20} />
										</span>
										<h3>Conversion complete</h3>
									</div>
									<p>
										{sell
											? "Your naira payout has reached your bank account."
											: "Your stablecoins have reached your wallet."}
									</p>
									<dl className="cl-demo-receipt">
										<div>
											<dt>Order reference</dt>
											<dd>{receipt?.id}</dd>
										</div>
										<div>
											<dt>Destination</dt>
											<dd>{sell ? "GTBank ••3421" : `${network.name} wallet ••12F3`}</dd>
										</div>
										<div>
											<dt>Network</dt>
											<dd>
												{network.name} ({network.standard})
											</dd>
										</div>
										<div>
											<dt>Status</dt>
											<dd className="cl-status-complete">
												<Check size={13} />
												Completed
											</dd>
										</div>
									</dl>
								</>
							)}
						</div>
						<div className="cl-demo-quote">
							<div className="cl-summary-heading">
								<span>{stage === 2 ? "Conversion receipt" : "Conversion summary"}</span>
								<Image
									src={`/assets/images/${asset.toLowerCase()}.svg`}
									width={24}
									height={24}
									alt=""
								/>
							</div>
							{valid ? (
								<QuoteSummary
									asset={asset}
									amount={safeAmount}
									rate={rate}
									fee={fee}
									side={side}
									showSource={stage !== 0}
								/>
							) : (
								<div className="cl-quote-unavailable">
									<span>{sell ? "Your bank receives" : "Total you pay"}</span>
									<strong>—</strong>
									<p>
										{sell
											? "Enter a valid amount to see the payout, rate and fee."
											: "Enter a valid amount to see the total cost, rate and fee."}
									</p>
								</div>
							)}
							<div className="cl-summary-route">
								<span>{sell ? "Payout currency" : "Asset"}</span>
								<strong>{sell ? "Nigerian naira · NGN" : asset}</strong>
							</div>
							{stage === 1 && (
								<button className="cl-button cl-workspace-action" onClick={() => select(2, true)}>
									View receipt <ArrowRight size={16} />
								</button>
							)}
							{stage === 2 && (
								<button className="cl-button cl-workspace-action" onClick={startAnother}>
									Start another conversion <ArrowUpRight size={16} />
								</button>
							)}
							{stage === 0 && (
								<button
									className="cl-button cl-workspace-action"
									disabled={!valid}
									onClick={() => select(1, true)}
								>
									Continue to transfer <ArrowRight size={16} />
								</button>
							)}{" "}
							<p className="cl-summary-footnote">
								{stage === 2
									? "Keep your order reference for any support queries."
									: sell
										? "Your payout is shown after the service fee."
										: "Your total includes the service fee."}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
