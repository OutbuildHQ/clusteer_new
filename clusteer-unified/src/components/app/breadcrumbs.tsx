"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
	dashboard: "Dashboard",
	assets: "Assets",
	trade: "Trade",
	send: "Send",
	receive: "Receive",
	transactions: "Transactions",
	"identity-verification": "Identity Verification",
	settings: "Settings",
	help: "Help",
	security: "Security",
	notifications: "Notifications",
	privacy: "Privacy",
	limits: "Limits",
	"payment-methods": "Payment Methods",
	admin: "Admin",
	users: "Users",
	kyc: "KYC Queue",
	wallets: "Wallets",
	reports: "Reports",
	audit: "Audit Log",
	cms: "CMS",
};

export function Breadcrumbs() {
	const pathname = usePathname();
	if (pathname === "/" || pathname === "/dashboard") return null;
	const segments = pathname.split("/").filter(Boolean);
	return (
		<nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
			<Link href="/dashboard" className="hover:text-foreground"><Home className="size-3.5" /></Link>
			{segments.map((s, i) => {
				const href = "/" + segments.slice(0, i + 1).join("/");
				const isLast = i === segments.length - 1;
				const label = LABELS[s] ?? s.replace(/-/g, " ");
				return (
					<span key={href} className="inline-flex items-center gap-1.5">
						<ChevronRight className="size-3" />
						{isLast ? (
							<span className="font-medium text-foreground capitalize">{label}</span>
						) : (
							<Link href={href} className="capitalize hover:text-foreground">{label}</Link>
						)}
					</span>
				);
			})}
		</nav>
	);
}
