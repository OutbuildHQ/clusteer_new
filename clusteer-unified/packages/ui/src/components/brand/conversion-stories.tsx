"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* The demonstration shows how; this scene explains when and why to use each route. */
export function ConversionStories() {
	const [side, setSide] = useState<"sell" | "buy">("sell");
	const id = useId();
	const sell = side === "sell";
	const steps = sell
		? [
				[
					"Review your bank payout",
					"Choose an amount and bank account. Check the rate, fee and naira you’ll receive.",
				],
				[
					"Send from your wallet",
					"Follow your order’s instructions for the asset, network and amount.",
				],
				[
					"Follow the payout",
					"Network confirmation comes first, then the transfer to your bank account.",
				],
			]
		: [
				[
					"Choose your wallet destination",
					"Select an available asset and network, then enter your wallet address.",
				],
				[
					"Review the cost and pay",
					"Check the rate, fee and total naira cost. Follow the payment instructions on your order.",
				],
				[
					"Follow delivery to your wallet",
					"Payment confirmation comes first, then delivery on your selected network.",
				],
			];
	return (
		<section id="how" className="cl-use-section cl-container">
			<div className="cl-use-heading">
				<h2>
					Paid in stablecoins.
					<br />
					Life runs on naira.
				</h2>
				<p>
					Turn a stablecoin payment into everyday spending money, or use naira to fund your wallet.
					Choose the direction you need.
				</p>
			</div>
			<div className="cl-use-layout">
				<figure className="cl-use-photo">
					<Image
						src="/images/clusteer-lagos-studio.webp"
						alt="A fashion designer working with forest-green fabric in a sunlit Lagos studio."
						fill
						sizes="(max-width: 800px) 100vw, 50vw"
					/>
					<figcaption>
						<span>A workday in Lagos</span>
					</figcaption>
				</figure>
				<div className="cl-use-product">
					<div role="tablist" aria-label="Ways to convert" className="cl-use-tabs">
						{(["sell", "buy"] as const).map((direction) => (
							<button
								key={direction}
								id={`${id}-${direction}`}
								role="tab"
								aria-selected={side === direction}
								aria-controls={`${id}-story`}
								tabIndex={side === direction ? 0 : -1}
								onClick={() => setSide(direction)}
								onKeyDown={(e) => {
									if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
									e.preventDefault();
									const next =
										e.key === "Home"
											? "sell"
											: e.key === "End"
												? "buy"
												: direction === "sell"
													? "buy"
													: "sell";
									setSide(next);
									document.getElementById(`${id}-${next}`)?.focus();
								}}
							>
								{direction === "sell" ? "Stablecoins to naira" : "Naira to stablecoins"}
							</button>
						))}
					</div>
					<div
						role="tabpanel"
						id={`${id}-story`}
						aria-labelledby={`${id}-${side}`}
						className="cl-use-panel"
					>
						<div className="cl-use-copy" key={side}>
							<h3>
								{sell
									? "Receive naira in your bank account."
									: "Receive stablecoins in your wallet."}
							</h3>
							<p>
								{sell
									? "Already paid in stablecoins? Convert the amount you need for rent, materials or everyday spending."
									: "Need stablecoins for your next payment? Buy with naira and receive them in the wallet you already use."}
							</p>
						</div>
						<ol
							className="cl-conversion-steps"
							aria-label={sell ? "How selling works" : "How buying works"}
						>
							{steps.map(([title, description], i) => (
								<li key={title}>
									<span aria-hidden="true">{i + 1}</span>
									<div>
										<h4>{title}</h4>
										<p>{description}</p>
									</div>
								</li>
							))}
						</ol>
						<div className="cl-conversion-needs">
							<strong>What you’ll need</strong>
							<p>
								{sell
									? "Stablecoins in an external wallet and your Nigerian bank account details."
									: "Naira in your Nigerian bank account and an external wallet address on the selected network."}
							</p>
							<p>Complete the identity checks shown in your account before placing an order.</p>
						</div>
						<div className="cl-conversion-actions">
							<Link href={`/demo?side=${side}`} className="cl-button cl-button-dark">
								{sell ? "Walk through a sell" : "Walk through a buy"}
								<ArrowRight size={16} />
							</Link>
							<Link href={sell ? "/sell" : "/buy"} className="cl-text-link">
								{sell ? "Explore selling" : "Explore buying"}
								<ArrowRight size={17} />
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="cl-use-foot cl-rail">
				<div className="cl-logo-group" aria-label="Stablecoins">
					<span>Stablecoins</span>
					<ul>
						{[
							{ name: "Tether (USDT)", icon: "/assets/images/usdt.svg" },
							{ name: "USD Coin (USDC)", icon: "/assets/images/usdc.svg" },
						].map(({ name, icon }) => (
							<li key={name} tabIndex={0} aria-label={name}>
								<Image src={icon} alt="" width={30} height={30} />
								<span className="cl-logo-tip" aria-hidden="true">
									{name}
								</span>
							</li>
						))}
					</ul>
				</div>
				<div className="cl-logo-group" aria-label="Networks">
					<span>Networks</span>
					<ul>
						{[
							{ name: "Tron (TRC-20)", icon: "/assets/icons/tron.svg" },
							{ name: "BNB Smart Chain (BEP-20)", icon: "/assets/icons/binance-smart-chain.svg" },
							{ name: "Ethereum (ERC-20)", icon: "/assets/icons/ethereum.svg" },
						].map(({ name, icon }) => (
							<li key={name} tabIndex={0} aria-label={name}>
								<Image src={icon} alt="" width={30} height={30} />
								<span className="cl-logo-tip" aria-hidden="true">
									{name}
								</span>
							</li>
						))}
					</ul>
				</div>
				<Link href="/fees">
					How quotes work <ArrowRight size={15} />
				</Link>
			</div>
		</section>
	);
}
