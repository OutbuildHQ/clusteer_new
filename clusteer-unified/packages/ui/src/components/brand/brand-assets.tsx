"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check, Pause, Play, Wallet, Landmark } from "lucide-react";
import { Logo } from "./logo";

// Presentation values follow the existing walkthrough fixture; no quote or order API is called.
const transfer = {
	amount: "500 USDC",
	payout: "₦719,562.50",
	fee: "₦5,437.50",
	rate: "₦1,450.00",
	name: "Aisha Bello",
	reference: "CL-048291",
};

function ArtFrame({
	name,
	tone,
	animated = false,
	children,
}: {
	name: string;
	tone: string;
	animated?: boolean;
	children: ReactNode;
}) {
	const frame = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	const [paused, setPaused] = useState(false);
	const [reduced, setReduced] = useState(true);
	useEffect(() => {
		const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(preference.matches);
		update();
		preference.addEventListener("change", update);
		const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
			threshold: 0.2,
		});
		if (frame.current) observer.observe(frame.current);
		return () => {
			observer.disconnect();
			preference.removeEventListener("change", update);
		};
	}, []);
	return (
		<div
			ref={frame}
			className={`cl-art cl-art--${tone}`}
			data-running={animated && visible && !paused && !reduced}
			data-reduced={reduced}
		>
			<div className="cl-art-scene" aria-hidden="true">
				{children}
			</div>
			{animated && !reduced && (
				<button
					type="button"
					className="cl-art-control"
					onClick={() => setPaused(!paused)}
					aria-label={`${paused ? "Play" : "Pause"} ${name} animation`}
				>
					<svg className="cl-art-duration" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
						<circle className="cl-art-duration-track" cx="22" cy="22" r="20" />
						<circle className="cl-art-duration-fill" cx="22" cy="22" r="20" pathLength="100" />
					</svg>
					{paused ? (
						<Play size={15} fill="currentColor" />
					) : (
						<Pause size={15} fill="currentColor" />
					)}
				</button>
			)}
		</div>
	);
}

function Caption({
	title,
	children,
	href,
	link,
}: {
	title: string;
	children: ReactNode;
	href: string;
	link: string;
}) {
	return (
		<div className="cl-art-caption">
			<h3>{title}</h3>
			<p>{children}</p>
			<Link href={href}>
				{link}
				<ArrowUpRight size={16} />
			</Link>
		</div>
	);
}

function QuoteArt() {
	return (
		<ArtFrame name="quote" tone="quote" animated>
			<div className="cl-art-half" />
			<div className="cl-art-quote-sheet">
				<div className="cl-art-sheet-top">
					<Logo monogramOnly />
					<span>Review conversion</span>
				</div>
				<div className="cl-art-quote-source">
					<span>You send</span>
					<strong>
						<Image src="/assets/images/usdc.svg" width={28} height={28} alt="" />
						{transfer.amount}
					</strong>
					<small>Ethereum · ERC-20</small>
				</div>
				<dl>
					<div>
						<dt>Exchange rate</dt>
						<dd>{transfer.rate}</dd>
					</div>
					<div>
						<dt>Service fee</dt>
						<dd>{transfer.fee}</dd>
					</div>
				</dl>
				<div className="cl-art-quote-total">
					<span>Bank payout</span>
					<strong>{transfer.payout}</strong>
				</div>
			</div>
			<div className="cl-art-destination">
				<Landmark size={18} />
				<div>
					<strong>{transfer.name}</strong>
					<span>GTBank · •• 4821</span>
				</div>
				<Check size={16} />
			</div>
		</ArtFrame>
	);
}

function ProgressArt() {
	return (
		<ArtFrame name="transfer progress" tone="progress" animated>
			<div className="cl-art-progress-mark">
				<Logo monogramOnly />
			</div>
			<div className="cl-art-progress-sheet">
				<div className="cl-art-progress-head">
					<span>Your order</span>
					<span>{transfer.reference}</span>
				</div>
				{["Quote accepted", "Transfer received", "Network confirmed", "Bank payout"].map(
					(stage, i) => (
						<div className="cl-art-stage" key={stage} data-stage={i}>
							<span className="cl-art-stage-dot">
								<Check size={12} className="cl-art-stage-check" />
							</span>
							<span>{stage}</span>
							<span className="cl-art-stage-tick">
								<Check size={15} />
							</span>
						</div>
					)
				)}
				<div className="cl-art-progress-end">
					<span>To your bank account</span>
					<strong>{transfer.payout}</strong>
				</div>
			</div>
		</ArtFrame>
	);
}

function ReceiptArt() {
	return (
		<ArtFrame name="receipt" tone="receipt">
			<div className="cl-art-receipt-echo" />
			<div className="cl-art-receipt-sheet">
				<div className="cl-art-sheet-top">
					<Logo monogramOnly />
					<span>Transaction receipt</span>
				</div>
				<div className="cl-art-receipt-amount">
					<span>
						<Check size={14} /> Completed
					</span>
					<strong>{transfer.payout}</strong>
					<small>Sent to {transfer.name}</small>
				</div>
				<dl>
					<div>
						<dt>Converted</dt>
						<dd>{transfer.amount}</dd>
					</div>
					<div>
						<dt>Destination</dt>
						<dd>GTBank · •• 4821</dd>
					</div>
					<div>
						<dt>Reference</dt>
						<dd>{transfer.reference}</dd>
					</div>
				</dl>
				<div className="cl-art-receipt-seal">
					<Logo monogramOnly />
					<span>Every detail. In one place.</span>
				</div>
			</div>
		</ArtFrame>
	);
}

export function BrandAssets() {
	return (
		<>
			<div className="cl-brand-gallery">
				<article>
					<ArtFrame name="Clusteer sculpture" tone="sculpture">
						<Image
							src="/images/brand/clusteer-conversion-sculpture.webp"
							alt=""
							fill
							sizes="(max-width: 700px) 100vw, 50vw"
						/>
					</ArtFrame>
					<Caption
						title="Keep your money where you use it."
						href="/security"
						link="Understand the fund flow"
					>
						Clusteer connects your existing wallet and bank account, without a stored Clusteer
						balance.
					</Caption>
				</article>
				<article>
					<QuoteArt />
					<Caption title="Know the payout, not just the rate." href="/fees" link="How quotes work">
						See what will reach your bank account before you continue, with the exchange rate and
						service fee shown together. Network charges may also apply.
					</Caption>
				</article>
				<article>
					<ProgressArt />
					<Caption
						title="Follow every step of your order."
						href="/demo"
						link="Explore a conversion"
					>
						For a sell, network confirmation comes before the bank payout. Timing depends on the
						network, payment checks and bank availability.
					</Caption>
				</article>
				<article>
					<ReceiptArt />
					<Caption
						title="An answer when you need to look back."
						href="/demo"
						link="Explore quote to receipt"
					>
						Check how much you converted and where it went. Your receipt keeps the amounts,
						destination and reference in one place.
					</Caption>
				</article>
			</div>
			<div className="cl-brand-notes">
				<div className="cl-brand-fund-note">
					<div className="cl-brand-route" aria-hidden="true">
						<Wallet size={21} />
						<span />
						<Logo monogramOnly />
						<span />
						<Landmark size={21} />
					</div>
					<div>
						<h3>How your transfer is processed.</h3>
						<p>
							Settlement partners process transfers between your wallet and bank. Clusteer brings
							the quote, progress and receipt into one order.
						</p>
					</div>
				</div>
				<div className="cl-brand-support-note">
					<div className="cl-brand-support-mark" aria-hidden="true">
						<Logo monogramOnly />
					</div>
					<div>
						<h3>Get help with a specific order.</h3>
						<p>Need help with a transfer? Share your order reference with support.</p>
						<Link href="/contact">
							Get support <ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
