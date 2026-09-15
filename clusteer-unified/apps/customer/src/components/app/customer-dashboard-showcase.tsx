"use client";

import { CustomerOverview, type OverviewOrder } from "@/components/brand/customer-overview";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ProductWalkthrough } from "@/components/brand/product-walkthrough";
import { ShowcasePanels } from "./showcase-panels";
import { SidebarFrame, CUSTOMER_NAV } from "./sidebar-frame";
import { TopBarFrame } from "./topbar-frame";

const initialOrders: OverviewOrder[] = [
	{
		id: "CL-9F2A3D81",
		side: "sell",
		asset: "USDT",
		channel: "TRC20",
		amountUsdt: 1000,
		amountNgn: 1450000,
		rate: 1450,
		fee: 10875,
		status: "confirming",
		createdAt: "2026-09-14T14:20:00Z",
	},
	{
		id: "CL-7B4D2916",
		side: "sell",
		asset: "USDC",
		channel: "ERC20",
		amountUsdt: 250,
		amountNgn: 362500,
		rate: 1450,
		fee: 2718.75,
		status: "completed",
		createdAt: "2026-09-13T09:00:00Z",
	},
	{
		id: "CL-6A8E1034",
		side: "buy",
		asset: "USDT",
		channel: "BEP20",
		amountUsdt: 100,
		amountNgn: 145000,
		rate: 1450,
		fee: 1087.5,
		status: "completed",
		createdAt: "2026-09-12T15:00:00Z",
	},
];

// Presentation only: shared dashboard views receive local data, without account queries.
export function CustomerDashboardShowcase() {
	const [orders, setOrders] = useState(initialOrders);
	const recordCompletion = useCallback((order: OverviewOrder) => {
		setOrders((previous) => [order, ...previous.filter((item) => item.id !== order.id)]);
	}, []);
	const [history, setHistory] = useState(["/dashboard"]);
	const path = history[history.length - 1];
	const [tradeOpened, setTradeOpened] = useState(false);
	const content = useRef<HTMLDivElement>(null);
	const firstRender = useRef(true);
	const navigate = (next: string) => {
		if (next === path) return;
		if (next === "/trade") setTradeOpened(true);
		setHistory((previous) => [...previous, next]);
	};
	const sectionPath = path.startsWith("/orders/") ? "/orders" : path;
	const title = path.startsWith("/orders/")
		? "Order details"
		: CUSTOMER_NAV.find((item) => item.href === path)?.label || "Overview";
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		if (content.current) {
			content.current.scrollTop = 0;
			content.current.focus({ preventScroll: true });
		}
	}, [path]);
	return (
		<div className="cl-product-window cl-dashboard-showcase">
			<SidebarFrame pathname={sectionPath} tierLabel="Personal" embedded onNavigate={navigate} />
			<div className="cl-dashboard-showcase-main">
				<TopBarFrame>
					{history.length > 1 && (
						<button
							className="cl-frame-back"
							aria-label="Back within dashboard"
							onClick={() => setHistory((previous) => previous.slice(0, -1))}
						>
							<ArrowLeft size={16} />
						</button>
					)}
					<span className="cl-showcase-breadcrumb">
						Workspace <span>/</span> {title}
					</span>
					<select
						className="cl-frame-mobile-nav"
						aria-label="Dashboard section"
						value={sectionPath}
						onChange={(event) => navigate(event.target.value)}
					>
						{CUSTOMER_NAV.map((item) => (
							<option key={item.id} value={item.href}>
								{item.label}
							</option>
						))}
					</select>
					<div className="cl-showcase-user">
						<span>Aisha Bello</span>
						<span className="cl-showcase-avatar">AB</span>
					</div>
				</TopBarFrame>
				<div
					className="cl-dashboard-showcase-content"
					ref={content}
					tabIndex={-1}
					role="region"
					aria-label={`${title} dashboard view`}
				>
					{path === "/dashboard" && (
						<CustomerOverview
							name="Aisha"
							orders={orders}
							orderLimit={3}
							rate={1450}
							tradeHref="/trade"
							resumeTrade={tradeOpened}
							publicView
							onNavigate={navigate}
						/>
					)}
					{tradeOpened && (
						<div className="cl-frame-conversion" hidden={path !== "/trade"}>
							<ProductWalkthrough onComplete={recordCompletion} />
						</div>
					)}
					<div hidden={path === "/dashboard" || path === "/trade"}>
						<ShowcasePanels path={path} orders={orders} navigate={navigate} />
					</div>
				</div>
			</div>
		</div>
	);
}
