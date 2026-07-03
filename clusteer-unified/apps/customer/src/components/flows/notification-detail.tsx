"use client";

import { Bell, ShieldAlert, TrendingUp, ArrowDownLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

function notifIcon(type: string) {
	if (type === "security") return <ShieldAlert size={22} />;
	if (type === "price") return <TrendingUp size={22} />;
	if (type === "tx") return <ArrowDownLeft size={22} />;
	return <Bell size={22} />;
}

function iconBg(type: string) {
	if (type === "security") return "var(--c-warn-soft)";
	return "var(--c-surface-2)";
}

function iconColor(type: string) {
	if (type === "security") return "var(--c-warn)";
	return "var(--c-text)";
}

const ROUTE_MAP: Record<string, string> = {
	tx: "/orders",
	price: "/trade",
	security: "/settings",
};

type Props = {
	notification?: {
		id: string | number;
		type: string;
		title: string;
		body: string;
		when: string;
	};
	onClose: () => void;
};

export function NotificationDetailFlow({ notification, onClose }: Props) {
	const router = useRouter();

	if (!notification) return null;
	const n = notification;
	const route = ROUTE_MAP[n.type];

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
			{/* Icon */}
			<div
				style={{
					width: 52, height: 52, borderRadius: 14,
					background: iconBg(n.type),
					display: "flex", alignItems: "center", justifyContent: "center",
					color: iconColor(n.type),
				}}
			>
				{notifIcon(n.type)}
			</div>

			{/* Content */}
			<div>
				<h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--c-text)", margin: 0 }}>{n.title}</h3>
				<p style={{ fontSize: 13.5, color: "var(--c-text-2)", marginTop: 8, lineHeight: 1.6 }}>{n.body}</p>
				<div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 8 }}>{n.when}</div>
			</div>

			{/* Actions */}
			<div style={{ display: "flex", gap: 8 }}>
				{route && (
					<button
						onClick={() => { router.push(route); onClose(); }}
						style={{
							flex: 1, height: 40, borderRadius: 10, border: "none",
							background: "var(--c-lime-500)", color: "var(--c-onyx-900)",
							fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
							display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
						}}
					>
						{n.type === "tx" ? "View orders" : n.type === "price" ? "Trade now" : "Security settings"}
						<ExternalLink size={14} />
					</button>
				)}
				<button
					onClick={onClose}
					style={{
						flex: route ? undefined : 1, minWidth: 80,
						height: 40, borderRadius: 10,
						border: "1px solid var(--c-line)", background: "transparent",
						color: "var(--c-text)", fontSize: 13.5, fontWeight: 600,
						cursor: "pointer", fontFamily: "inherit",
					}}
				>
					Dismiss
				</button>
			</div>
		</div>
	);
}
