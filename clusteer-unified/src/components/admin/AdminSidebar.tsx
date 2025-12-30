"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
	Home,
	Users,
	List,
	CheckSquare,
	Wallet,
	MessageSquare,
	FileText,
	BarChart,
	Settings,
	Shield,
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	Activity,
	LogOut,
} from "lucide-react";

interface SubItem {
	name: string;
	href: string;
}

interface NavigationItem {
	name: string;
	href: string;
	icon: any;
	badge?: string;
	subItems?: SubItem[];
}

const navigationItems: NavigationItem[] = [
	{
		name: "Dashboard",
		href: "/admin",
		icon: Home
	},
	{
		name: "Users",
		href: "/admin/users",
		icon: Users
	},
	{
		name: "KYC",
		href: "/admin/kyc",
		icon: CheckSquare
	},
	{
		name: "Transactions",
		href: "/admin/transactions",
		icon: List
	},
	{
		name: "Wallets & Liquidity",
		href: "/admin/wallets",
		icon: Wallet
	},
	{
		name: "Support",
		href: "/admin/support",
		icon: MessageSquare,
		badge: "Online"
	},
	{
		name: "Content",
		href: "/admin/content",
		icon: FileText,
		subItems: [
			{ name: "All Content", href: "/admin/content" },
			{ name: "Create New", href: "/admin/content/new" },
		]
	},
	{
		name: "Reports",
		href: "/admin/reports",
		icon: BarChart,
		subItems: [
			{ name: "Overview", href: "/admin/reports" },
			{ name: "User Activity", href: "/admin/reports/user-activity" },
			{ name: "Financial Summary", href: "/admin/reports/financial-summary" },
			{ name: "Compliance", href: "/admin/reports/compliance" },
		]
	},
	{
		name: "Settings",
		href: "/admin/settings",
		icon: Settings,
		subItems: [
			{ name: "General", href: "/admin/settings" },
			{ name: "Alerts", href: "/admin/settings/alerts" },
			{ name: "API Keys", href: "/admin/settings/api-keys" },
			{ name: "Backup & Data", href: "/admin/settings/backup" },
			{ name: "Integrations", href: "/admin/settings/integrations" },
			{ name: "Audit Logs", href: "/admin/settings/audit-logs" },
		]
	},
	{
		name: "Admins",
		href: "/admin/admins",
		icon: Shield
	},
];

export default function AdminSidebar() {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [expandedSections, setExpandedSections] = useState<string[]>(() => {
		// Auto-expand sections based on current path
		const expanded: string[] = [];
		navigationItems.forEach(item => {
			if (item.subItems && pathname.startsWith(item.href)) {
				expanded.push(item.name);
			}
		});
		return expanded;
	});

	const toggleSection = (sectionName: string) => {
		if (isCollapsed) {
			// If sidebar is collapsed, expand it first
			setIsCollapsed(false);
			setExpandedSections([sectionName]);
		} else {
			setExpandedSections(prev =>
				prev.includes(sectionName)
					? prev.filter(name => name !== sectionName)
					: [...prev, sectionName]
			);
		}
	};

	const isActive = (href: string) => {
		if (href === "/admin") {
			return pathname === href;
		}
		return pathname.startsWith(href);
	};

	const isSubItemActive = (href: string) => {
		return pathname === href;
	};

	return (
		<aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#FAFAFA] border-r border-[#E9EAEB] flex flex-col transition-all duration-300 relative`}>
			{/* Floating Toggle Button */}
			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="absolute top-[76px] -right-4 z-50 w-8 h-8 bg-white border border-[#E9EAEB] rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-all hover:scale-110"
				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				{isCollapsed ? (
					<ChevronRight className="w-4 h-4 text-gray-600" />
				) : (
					<ChevronLeft className="w-4 h-4 text-gray-600" />
				)}
			</button>

			{/* Wrapper with white background */}
			<div className="flex flex-col h-full bg-white border-[#E9EAEB] rounded-lg border m-1">
				{/* Logo & Title */}
				<div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-[#E9EAEB]`}>
					{isCollapsed ? (
						<div className="flex justify-center">
							<Image
								src="/assets/icons/logo.svg"
								alt="Clusteer logo"
								width={28}
								height={30}
								className="flex-shrink-0"
							/>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Image
								src="/assets/icons/logo_with_name.svg"
								alt="Clusteer logo"
								width={139}
								height={32}
								className="flex-shrink-0"
							/>
						</div>
					)}
					{!isCollapsed && (
						<p className="text-xs text-gray-500 mt-2">Admin Panel</p>
					)}
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
					{navigationItems.map((item) => {
						const Icon = item.icon;
						const hasSubItems = item.subItems && item.subItems.length > 0;
						const isExpanded = expandedSections.includes(item.name);
						const itemIsActive = isActive(item.href);

						return (
							<div key={item.name}>
								{/* Main Navigation Item */}
								{hasSubItems ? (
									<button
										onClick={() => toggleSection(item.name)}
										className={`
											w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
											${
												itemIsActive
													? "bg-[#E7F6EC] text-[#014F01]"
													: "text-gray-700 hover:bg-gray-50"
											}
											${isCollapsed ? 'justify-center' : ''}
										`}
										title={isCollapsed ? item.name : ''}
									>
										<Icon className="w-5 h-5 flex-shrink-0" />
										{!isCollapsed && (
											<>
												<span className="flex-1 text-left">{item.name}</span>
												{item.badge && (
													<span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
														{item.badge}
													</span>
												)}
												<ChevronDown
													className={`w-4 h-4 transition-transform ${
														isExpanded ? 'rotate-180' : ''
													}`}
												/>
											</>
										)}
									</button>
								) : (
									<Link
										href={item.href}
										className={`
											flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
											${
												itemIsActive
													? "bg-[#E7F6EC] text-[#014F01]"
													: "text-gray-700 hover:bg-gray-50"
											}
											${isCollapsed ? 'justify-center' : ''}
										`}
										title={isCollapsed ? item.name : ''}
									>
										<Icon className="w-5 h-5 flex-shrink-0" />
										{!isCollapsed && (
											<>
												<span className="flex-1">{item.name}</span>
												{item.badge && (
													<span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
														{item.badge}
													</span>
												)}
											</>
										)}
									</Link>
								)}

								{/* Sub Items */}
								{hasSubItems && isExpanded && !isCollapsed && (
									<div className="mt-1 ml-3 pl-5 border-l-2 border-gray-100 space-y-0.5">
										{item.subItems!.map((subItem) => (
											<Link
												key={subItem.href}
												href={subItem.href}
												className={`
													block px-3 py-1.5 rounded-lg text-sm transition-colors
													${
														isSubItemActive(subItem.href)
															? "bg-[#E7F6EC] text-[#014F01] font-medium"
															: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
													}
												`}
											>
												{subItem.name}
											</Link>
										))}
									</div>
								)}
							</div>
						);
					})}
				</nav>

				{/* Quick Stats (when expanded) */}
				{!isCollapsed && (
					<div className="px-4 pb-4">
						<div className="bg-gradient-to-br from-blue-50/50 to-white rounded-lg p-3 border border-blue-100/50">
							<div className="flex items-center gap-2 mb-3">
								<div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
									<Activity className="w-3.5 h-3.5 text-blue-600" />
								</div>
								<span className="text-xs font-semibold text-gray-700">Quick Stats</span>
							</div>
							<div className="space-y-2.5">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
										<span className="text-xs text-gray-600">Active Users</span>
									</div>
									<span className="text-sm font-bold text-gray-900">3,245</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
										<span className="text-xs text-gray-600">Pending KYC</span>
									</div>
									<span className="text-sm font-bold text-gray-900">124</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
										<span className="text-xs text-gray-600">Today's Volume</span>
									</div>
									<span className="text-sm font-bold text-gray-900">$2.4M</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* User Profile */}
				<div className="p-4 border-t border-[#E9EAEB]">
					<div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAFAFA] cursor-pointer transition-colors group ${isCollapsed ? 'justify-center' : ''}`}>
						<div className="w-10 h-10 bg-gradient-to-br from-[#014F01] to-[#013d01] rounded-full flex items-center justify-center flex-shrink-0">
							<span className="text-white font-semibold text-sm">AD</span>
						</div>
						{!isCollapsed && (
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">
									Admin User
								</p>
								<p className="text-xs text-gray-500 truncate">
									admin@clusteer.com
								</p>
							</div>
						)}
						{!isCollapsed && (
							<button
								className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded"
								title="Logout"
							>
								<LogOut className="w-4 h-4 text-gray-500" />
							</button>
						)}
					</div>
				</div>
			</div>
		</aside>
	);
}
