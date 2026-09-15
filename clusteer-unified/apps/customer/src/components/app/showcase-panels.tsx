"use client";
import { useState } from "react";
import { ArrowRight, Check, Search } from "lucide-react";
import { QuoteSummary, formatNaira } from "@/components/brand/quote-summary";
import { helpTopics } from "@/lib/marketing-content";
import type { OverviewOrder } from "@/components/brand/customer-overview";

type Props = { path: string; orders: OverviewOrder[]; navigate: (path: string) => void };
const statusLabel = (order: OverviewOrder) =>
	order.status === "completed" ? "Completed" : "Confirming";
const networkName = (channel: string) =>
	channel === "TRC20"
		? "Tron (TRC-20)"
		: channel === "BEP20"
			? "BNB Smart Chain (BEP-20)"
			: "Ethereum (ERC-20)";

export function ShowcasePanels({ path, orders, navigate }: Props) {
	const [filter, setFilter] = useState("all");
	const [query, setQuery] = useState("");
	const [read, setRead] = useState(false);
	const [orderEmails, setOrderEmails] = useState(true);
	const [updates, setUpdates] = useState(false);
	const [saved, setSaved] = useState(false);
	const detail = path.startsWith("/orders/")
		? orders.find((order) => path === `/orders/${order.id}`)
		: undefined;
	if (detail)
		return (
			<section className="cl-frame-page">
				<div className="cl-frame-heading">
					<div>
						<h2>Order details</h2>
						<p>{detail.id}</p>
					</div>
					<span
						className={`cl-status cl-status-${detail.status === "completed" ? "success" : "pending"}`}
					>
						{statusLabel(detail)}
					</span>
				</div>
				<div className="cl-frame-order-grid">
					<div className="cl-panel">
						<h3>{detail.side === "sell" ? "Stablecoins to naira" : "Naira to stablecoins"}</h3>
						<dl className="cl-frame-details">
							<div>
								<dt>Asset</dt>
								<dd>{detail.asset}</dd>
							</div>
							<div>
								<dt>Network</dt>
								<dd>{networkName(detail.channel)}</dd>
							</div>
							<div>
								<dt>Destination</dt>
								<dd>
									{detail.side === "sell"
										? "GTBank ••3421"
										: `${networkName(detail.channel).split(" (")[0]} wallet ••12F3`}
								</dd>
							</div>
							<div>
								<dt>Account holder</dt>
								<dd>Aisha Bello</dd>
							</div>
						</dl>
						<p className="cl-frame-note">
							{detail.status === "completed"
								? "This conversion is complete. Keep the order reference for your records."
								: "The transfer is awaiting network confirmation before the bank payout."}
						</p>
						<button className="cl-text-link" onClick={() => navigate("/support")}>
							Get help with this order <ArrowRight size={14} />
						</button>
					</div>
					<div className="cl-panel">
						<QuoteSummary
							amount={detail.amountUsdt}
							asset={detail.asset}
							rate={detail.rate}
							fee={detail.fee}
							side={detail.side}
						/>
					</div>
				</div>
			</section>
		);
	if (path === "/orders" || path === "/transaction-history") {
		const history = path === "/transaction-history";
		const visible = orders.filter((order) =>
			history
				? order.status === "completed"
				: filter === "all" ||
					(filter === "completed" ? order.status === "completed" : order.status !== "completed")
		);
		return (
			<section className="cl-frame-page">
				<div className="cl-frame-heading">
					<div>
						<h2>{history ? "Transaction history" : "Your orders"}</h2>
						<p>
							{history
								? "A record of your completed conversions."
								: "Follow your conversions from transfer to settlement."}
						</p>
					</div>
					<button className="cl-button cl-button-dark" onClick={() => navigate("/trade")}>
						Open conversion
					</button>
				</div>
				{!history && (
					<div className="cl-frame-filters" role="group" aria-label="Filter orders">
						{["all", "active", "completed"].map((item) => (
							<button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>
								{item === "all" ? "All orders" : item === "active" ? "Active" : "Completed"}
							</button>
						))}
					</div>
				)}
				<div className="cl-panel">
					<ul className="cl-order-list">
						{visible.map((order) => (
							<li key={order.id}>
								<button onClick={() => navigate(`/orders/${order.id}`)}>
									<div>
										<strong>
											{order.side === "sell" ? "Stablecoins to naira" : "Naira to stablecoins"}
										</strong>
										<small>
											{order.id} · {order.asset} / {order.channel}
										</small>
									</div>
									<div className="text-right">
										<strong>
											{formatNaira(
												order.amountNgn + (order.side === "sell" ? -order.fee : order.fee)
											)}
										</strong>
										<small>
											<span
												className={`cl-status cl-status-${order.status === "completed" ? "success" : "pending"}`}
											>
												{statusLabel(order)}
											</span>
										</small>
									</div>
								</button>
							</li>
						))}
					</ul>
				</div>
			</section>
		);
	}
	if (path === "/billing")
		return (
			<section className="cl-frame-page">
				<div className="cl-frame-heading">
					<div>
						<h2>Billing</h2>
						<p>Service fees across your orders.</p>
					</div>
				</div>
				<div className="cl-panel">
					<h3>Total recorded fees</h3>
					<strong className="cl-frame-total">
						{formatNaira(orders.reduce((total, order) => total + order.fee, 0))}
					</strong>
					<ul className="cl-order-list">
						{orders.map((order) => (
							<li key={order.id}>
								<button onClick={() => navigate(`/orders/${order.id}`)}>
									<div>
										<strong>{order.id}</strong>
										<small>
											{order.asset} · {order.side === "sell" ? "Sell" : "Buy"}
										</small>
									</div>
									<strong>{formatNaira(order.fee)}</strong>
								</button>
							</li>
						))}
					</ul>
				</div>
			</section>
		);
	if (path === "/notifications")
		return (
			<section className="cl-frame-page">
				<div className="cl-frame-heading">
					<div>
						<h2>Notifications</h2>
						<p role="status">{read ? "You’re all caught up." : "2 unread order updates"}</p>
					</div>
					<button
						className="cl-button cl-button-outline"
						disabled={read}
						onClick={() => setRead(true)}
					>
						Mark all as read
					</button>
				</div>
				<div className="cl-panel">
					<ul className="cl-order-list">
						{orders
							.filter((order) => order.status === "completed")
							.map((order) => (
								<li key={order.id}>
									<button onClick={() => navigate(`/orders/${order.id}`)}>
										<div>
											<strong>
												<Check size={14} /> Conversion completed
											</strong>
											<small>
												{order.id} · {order.asset}
											</small>
										</div>
										<ArrowRight size={15} />
									</button>
								</li>
							))}
					</ul>
				</div>
			</section>
		);
	if (path === "/settings")
		return (
			<section className="cl-frame-page">
				<div className="cl-frame-heading">
					<div>
						<h2>Settings</h2>
						<p>Your account details and notification preferences.</p>
					</div>
				</div>
				<div className="cl-panel">
					<h3>Personal account</h3>
					<dl className="cl-frame-details">
						<div>
							<dt>Name</dt>
							<dd>Aisha Bello</dd>
						</div>
						<div>
							<dt>Linked bank</dt>
							<dd>GTBank ••3421</dd>
						</div>
						<div>
							<dt>Currency</dt>
							<dd>Nigerian naira (NGN)</dd>
						</div>
					</dl>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							setSaved(true);
						}}
					>
						<label className="cl-frame-check">
							<input
								type="checkbox"
								checked={orderEmails}
								onChange={(event) => {
									setOrderEmails(event.target.checked);
									setSaved(false);
								}}
							/>
							Order email updates
						</label>
						<label className="cl-frame-check">
							<input
								type="checkbox"
								checked={updates}
								onChange={(event) => {
									setUpdates(event.target.checked);
									setSaved(false);
								}}
							/>
							Product news
						</label>
						<button className="cl-button cl-button-dark" type="submit">
							Save preferences
						</button>
						{saved && (
							<p role="status" className="cl-frame-note">
								Preferences updated.
							</p>
						)}
					</form>
				</div>
			</section>
		);
	if (path === "/identity-verification")
		return (
			<section className="cl-frame-page">
				<div className="cl-frame-heading">
					<div>
						<h2>Identity</h2>
						<p>Keep your account and payment details aligned.</p>
					</div>
				</div>
				<div className="cl-panel">
					<h3>Before your first conversion</h3>
					<dl className="cl-frame-details">
						<div>
							<dt>Account name</dt>
							<dd>Aisha Bello</dd>
						</div>
						<div>
							<dt>Receiving bank</dt>
							<dd>GTBank ••3421</dd>
						</div>
					</dl>
					<p className="cl-frame-note">
						Your identity and linked bank details are checked as part of account verification. Use a
						bank account in your own name.
					</p>
					<button className="cl-button cl-button-outline" onClick={() => navigate("/settings")}>
						Review account details
					</button>
					<button className="cl-text-link" onClick={() => navigate("/support")}>
						Get verification help <ArrowRight size={14} />
					</button>
				</div>
			</section>
		);
	if (path === "/referrals")
		return (
			<section className="cl-frame-page">
				<div className="cl-frame-heading">
					<div>
						<h2>Referrals & rewards</h2>
						<p>Invite friends when referrals launch.</p>
					</div>
				</div>
				<div className="cl-panel">
					<span className="cl-status">Coming soon</span>
					<h3>Referral rewards are in development.</h3>
					<p className="cl-frame-note">
						Referral links and reward history will appear here once the programme launches.
					</p>
					<button
						className="cl-button cl-button-outline"
						onClick={() => navigate("/notifications")}
					>
						View account updates
					</button>
				</div>
			</section>
		);
	const faqs = helpTopics
		.flatMap((topic) => topic.faqs)
		.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(query.trim().toLowerCase()));
	return (
		<section className="cl-frame-page">
			<div className="cl-frame-heading">
				<div>
					<h2>Support</h2>
					<p>Find help with a conversion, network or account.</p>
				</div>
			</div>
			<label className="cl-frame-search">
				<Search size={16} />
				<input
					aria-label="Search dashboard help"
					type="search"
					placeholder="Search for help"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
			</label>
			<div className="cl-panel cl-frame-faq">
				{faqs.length ? (
					faqs.map((item) => (
						<details key={item.q}>
							<summary>{item.q}</summary>
							<p>{item.a}</p>
						</details>
					))
				) : (
					<p role="status">No matching answers. Try “network” or “order”.</p>
				)}
			</div>
		</section>
	);
}
