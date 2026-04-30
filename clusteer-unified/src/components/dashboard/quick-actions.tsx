"use client";

import { Send, Download, Repeat, QrCode, ArrowUpDown, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const quickActions = [
	{
		title: "Send Money",
		description: "Transfer to anyone",
		icon: Send,
		href: "/send",
		color: "bg-light-green hover:bg-[#8DD659]",
		iconColor: "text-custom-black",
	},
	{
		title: "Receive",
		description: "Get paid instantly",
		icon: Download,
		href: "/receive",
		color: "bg-[#E8F5E9] hover:bg-[#D0EBD6]",
		iconColor: "text-primary",
	},
	{
		title: "Convert",
		description: "Exchange currencies",
		icon: Repeat,
		href: "/trade",
		color: "bg-[#E8F5E9] hover:bg-[#D0EBD6]",
		iconColor: "text-primary",
	},
	{
		title: "QR Code",
		description: "Scan to receive",
		icon: QrCode,
		href: "/receive?tab=qr",
		color: "bg-card hover:bg-background",
		iconColor: "text-muted-foreground",
		border: true,
	},
	{
		title: "Request",
		description: "Ask for payment",
		icon: ArrowUpDown,
		href: "/request",
		color: "bg-card hover:bg-background",
		iconColor: "text-muted-foreground",
		border: true,
	},
	{
		title: "Bank Accounts",
		description: "Manage accounts",
		icon: CreditCard,
		href: "/settings/payment-methods",
		color: "bg-card hover:bg-background",
		iconColor: "text-muted-foreground",
		border: true,
	},
];

export default function QuickActions() {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
				{quickActions.map((action) => {
					const Icon = action.icon;
					return (
						<Link key={action.title} href={action.href}>
							<Button
								variant="outline"
								className={`h-auto w-full flex flex-col items-center justify-center p-4 gap-2 ${action.color} ${
									action.border ? "border-2 border-border" : "border-0"
								} transition-all hover:shadow-md`}
							>
								<div className={`w-10 h-10 rounded-full bg-card flex items-center justify-center ${action.border ? 'shadow-sm' : ''}`}>
									<Icon className={`w-5 h-5 ${action.iconColor}`} />
								</div>
								<div className="text-center">
									<p className="font-semibold text-sm text-foreground">
										{action.title}
									</p>
									<p className="text-xs text-muted-foreground mt-0.5">
										{action.description}
									</p>
								</div>
							</Button>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
