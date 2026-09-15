import { DashboardLink as Link } from "./dashboard-link";
import { ArrowRight, ArrowUpRight, BookOpen, ShieldCheck, HelpCircle } from "lucide-react";
import type { QxOrder } from "@/lib/types";
import { formatNaira } from "./quote-summary";

export type OverviewOrder = Omit<QxOrder, "asset"> & { asset: "USDT" | "USDC" };

export type OverviewProps = {
	name?: string;
	orders?: OverviewOrder[];
	orderLimit?: number;
	rate?: number;
	rateSource?: string;
	loading?: boolean;
	error?: boolean;
	preview?: boolean;
	onRetry?: () => void;
	tradeHref?: string;
	orderHref?: string;
	publicView?: boolean;
	resumeTrade?: boolean;
	onNavigate?: (href: string) => void;
};
const statusLabels: Record<string, string> = {
	awaiting_payment: "Awaiting payment",
	awaiting_deposit: "Awaiting transfer",
	confirming: "Confirming",
	completed: "Completed",
	failed: "Failed",
	expired: "Expired",
};
export function CustomerOverview({
	name,
	orders = [],
	orderLimit = 5,
	rate,
	rateSource,
	loading,
	error,
	preview,
	onRetry,
	tradeHref = "/trade?side=sell",
	orderHref,
	publicView = false,
	resumeTrade = false,
	onNavigate,
}: OverviewProps) {
	const Heading = publicView ? "h2" : "h1";
	const active = orders.filter((o) =>
		["awaiting_payment", "awaiting_deposit", "confirming"].includes(o.status)
	);
	return (
		<div className="cl-workspace">
			<div className="cl-page-heading">
				<div>
					<Heading>{name ? `Welcome back, ${name}.` : "Your money, at a glance."}</Heading>
					<p>A clear view of your conversions and what comes next.</p>
				</div>
				{!preview && (!publicView || onNavigate) && (
					<Link onNavigate={onNavigate} className="cl-button cl-button-outline" href="/orders">
						View all orders <ArrowUpRight size={15} />
					</Link>
				)}
			</div>
			{preview && (
				<div className="cl-preview-notice">
					Design preview · all names, amounts and activity below are illustrative.
				</div>
			)}
			{error && (
				<div className="cl-preview-notice" role="alert">
					We couldn’t load your orders.{" "}
					<button onClick={onRetry} className="underline">
						Try again
					</button>
				</div>
			)}
			<div className="cl-work-grid">
				<div>
					<section className="cl-convert-launch">
						<div>
							<h2>{resumeTrade ? "Your latest conversion." : "Bring your stablecoins home."}</h2>
							<p>
								{resumeTrade
									? "Return to your amount, destination and progress."
									: "Start a conversion to naira. See the amount, rate and fee before you continue."}
							</p>
							<Link onNavigate={onNavigate} href={tradeHref} className="cl-button cl-button-dark">
								{resumeTrade ? "Return to conversion" : "Convert to naira"} <ArrowRight size={16} />
							</Link>
						</div>
						<div className="cl-asset-pair" aria-hidden="true">
							<span>₮</span>
							<ArrowRight size={17} />
							<span>₦</span>
						</div>
					</section>
					<section className="cl-panel">
						<div className="cl-panel-heading">
							<h2>Recent activity</h2>
							<span className="cl-status">
								{active.length ? `${active.length} active` : `${orders.length} orders`}
							</span>
						</div>
						{loading ? (
							<div className="cl-empty" role="status">
								Loading your orders…
							</div>
						) : !orders.length ? (
							<div className="cl-empty">
								<BookOpen size={28} />
								<strong>
									{error ? "Your orders are unavailable" : "Your first order starts here"}
								</strong>
								<p>
									{error
										? "Try again to see your recent activity."
										: "Your conversions and their progress will appear here."}
								</p>
							</div>
						) : (
							<ul className="cl-order-list">
								{(active.length
									? [...active, ...orders.filter((o) => !active.includes(o))]
									: orders
								)
									.slice(0, orderLimit)
									.map((o) => (
										<li key={o.id}>
											<Link
												onNavigate={onNavigate}
												href={orderHref ?? (preview ? "#preview-conversion" : `/orders/${o.id}`)}
											>
												<div>
													<strong>
														{o.side === "sell" ? "Stablecoins to naira" : "Naira to stablecoins"}
													</strong>
													<small>
														{o.id} · {o.asset} / {o.channel}
													</small>
												</div>
												<div className="text-right">
													<strong>
														{formatNaira(
															o.side === "sell" ? o.amountNgn - o.fee : o.amountNgn + o.fee
														)}
													</strong>
													<small>
														<span
															className={`cl-status cl-status-${o.status === "completed" ? "success" : ["failed", "expired"].includes(o.status) ? "failed" : "pending"}`}
														>
															{statusLabels[o.status] || o.status}
														</span>
													</small>
												</div>
											</Link>
										</li>
									))}
							</ul>
						)}
					</section>
				</div>
				<aside className="cl-secondary-stack">
					<section className="cl-panel">
						<h2>Your conversion rate</h2>
						<div className="cl-rate-line">
							<small>Sell USDT → receive NGN</small>
							<strong>{rate ? formatNaira(rate) : "Unavailable"}</strong>
							{rate && <span>/ USDT</span>}
						</div>
						<p className="cl-context-note">
							{preview
								? "Illustrative rate for this design preview."
								: rateSource === "fallback"
									? "Indicative fallback. A current quote is required before any conversion."
									: "Indicative rate. Your order shows the final rate and service fee."}
						</p>
						<Link onNavigate={onNavigate} className="cl-text-link" href={tradeHref}>
							Review a conversion <ArrowRight size={14} />
						</Link>
					</section>
					<section className="cl-panel">
						<span className="cl-small-icon">
							<ShieldCheck size={20} />
						</span>
						<h2>Before your next order.</h2>
						<p className="mt-3">
							Review your verification status and linked bank details before starting an order.
						</p>
						{!preview && (
							<Link
								onNavigate={onNavigate}
								className="cl-text-link"
								href={publicView && !onNavigate ? "/help" : "/identity-verification"}
							>
								{publicView ? "About verification" : "View verification"} <ArrowUpRight size={14} />
							</Link>
						)}
					</section>
					<Link
						onNavigate={onNavigate}
						className="cl-text-link"
						href={(preview || publicView) && !onNavigate ? "/help" : "/support"}
					>
						<HelpCircle size={16} /> Need a hand? Get support
					</Link>
				</aside>
			</div>
		</div>
	);
}
