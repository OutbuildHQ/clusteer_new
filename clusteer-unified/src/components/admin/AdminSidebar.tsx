"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
	X,
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

interface AdminSidebarProps {
	isMobileOpen?: boolean;
	onMobileClose?: () => void;
}

export default function AdminSidebar({ isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
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

	// Close mobile menu when route changes
	useEffect(() => {
		if (isMobileOpen && onMobileClose) {
			onMobileClose();
		}
	}, [pathname]);

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (isMobileOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMobileOpen]);

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
		<>
			{/* Mobile Overlay */}
			{isMobileOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={onMobileClose}
				/>
			)}

			{/* Sidebar */}
			<aside className={`
				bg-[var(--cl-bg)] border-r border-[var(--cl-line)] flex flex-col transition-all duration-300

				/* Mobile: Full width sidebar (max 80% screen width) */
				w-[280px] max-w-[80vw]

				/* Desktop: Collapsible width */
				lg:w-auto ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}

				/* Mobile: Fixed overlay sidebar */
				fixed lg:relative inset-y-0 left-0 z-50

				/* Mobile: Slide in from left - hide when closed */
				${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}

				/* Ensure smooth transitions */
				transition-transform
			`}>
				{/* Mobile Close Button */}
				<button
					onClick={onMobileClose}
					className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] rounded-lg shadow-md hover:shadow-lg"
					aria-label="Close menu"
				>
					<X className="w-5 h-5 text-[var(--cl-text-2)]" />
				</button>

				{/* Desktop Floating Toggle Button */}
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="hidden lg:flex absolute top-[76px] -right-4 z-50 w-8 h-8 bg-[var(--cl-surface)] border border-[var(--cl-line)] rounded-full shadow-md hover:shadow-lg items-center justify-center transition-all hover:scale-110"
					aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					{isCollapsed ? (
						<ChevronRight className="w-4 h-4 text-[var(--cl-text-2)]" />
					) : (
						<ChevronLeft className="w-4 h-4 text-[var(--cl-text-2)]" />
					)}
				</button>

				{/* Wrapper with white background */}
				<div className="flex flex-col h-full bg-[var(--cl-surface)] border-[var(--cl-line)] rounded-lg border m-1">
					{/* Logo & Title */}
					<div className={`border-b border-[var(--cl-line)] p-6 lg:p-6 ${isCollapsed ? 'lg:p-4' : ''}`}>
						{/* Mobile: Always show full logo */}
						<div className="lg:hidden flex items-center gap-2">
							<Image
								src="/assets/icons/logo_with_name.svg"
								alt="Clusteer logo"
								width={139}
								height={32}
								className="flex-shrink-0"
							/>
						</div>

						{/* Desktop: Show based on collapse state */}
						<div className="hidden lg:block">
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
						</div>

						{/* Show subtitle on mobile and expanded desktop */}
						<p className={`text-xs text-[var(--cl-text-3)] mt-2 lg:mt-2 ${isCollapsed ? 'lg:hidden' : ''}`}>Admin Panel</p>
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
														? "bg-[var(--cl-brand-50)] text-[#014F01]"
														: "text-[var(--cl-text-2)] hover:bg-[var(--cl-bg)]"
												}
												${isCollapsed ? 'lg:justify-center' : ''}
											`}
											title={isCollapsed ? item.name : ''}
										>
											<Icon className="w-5 h-5 flex-shrink-0" />
											{/* Mobile: Always show text */}
											<span className={`flex-1 text-left lg:hidden`}>{item.name}</span>
											{/* Desktop: Show based on collapse state */}
											{!isCollapsed && (
												<span className="hidden lg:block flex-1 text-left">{item.name}</span>
											)}
											{/* Badges and chevrons - mobile always shows, desktop based on collapse */}
											<div className={`flex items-center gap-2 lg:hidden`}>
												{item.badge && (
													<span className="px-2 py-0.5 text-xs font-medium bg-[var(--cl-up-soft)] text-[var(--cl-up)] rounded-full">
														{item.badge}
													</span>
												)}
												<ChevronDown
													className={`w-4 h-4 transition-transform ${
														isExpanded ? 'rotate-180' : ''
													}`}
												/>
											</div>
											{!isCollapsed && (
												<div className="hidden lg:flex items-center gap-2">
													{item.badge && (
														<span className="px-2 py-0.5 text-xs font-medium bg-[var(--cl-up-soft)] text-[var(--cl-up)] rounded-full">
															{item.badge}
														</span>
													)}
													<ChevronDown
														className={`w-4 h-4 transition-transform ${
															isExpanded ? 'rotate-180' : ''
														}`}
													/>
												</div>
											)}
										</button>
									) : (
										<Link
											href={item.href}
											className={`
												flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
												${
													itemIsActive
														? "bg-[var(--cl-brand-50)] text-[#014F01]"
														: "text-[var(--cl-text-2)] hover:bg-[var(--cl-bg)]"
												}
												${isCollapsed ? 'lg:justify-center' : ''}
											`}
											title={isCollapsed ? item.name : ''}
										>
											<Icon className="w-5 h-5 flex-shrink-0" />
											{/* Mobile: Always show text */}
											<span className="flex-1 lg:hidden">{item.name}</span>
											{/* Desktop: Show based on collapse state */}
											{!isCollapsed && (
												<span className="hidden lg:block flex-1">{item.name}</span>
											)}
											{/* Badge - mobile always shows, desktop based on collapse */}
											{item.badge && (
												<>
													<span className="lg:hidden px-2 py-0.5 text-xs font-medium bg-[var(--cl-up-soft)] text-[var(--cl-up)] rounded-full">
														{item.badge}
													</span>
													{!isCollapsed && (
														<span className="hidden lg:inline-block px-2 py-0.5 text-xs font-medium bg-[var(--cl-up-soft)] text-[var(--cl-up)] rounded-full">
															{item.badge}
														</span>
													)}
												</>
											)}
										</Link>
									)}

									{/* Sub Items - Always show on mobile when expanded, desktop only when not collapsed */}
									{hasSubItems && isExpanded && (
										<div className={`mt-1 ml-3 pl-5 border-l-2 border-[var(--cl-line)] space-y-0.5 ${isCollapsed ? 'hidden' : ''}`}>
											{item.subItems!.map((subItem) => (
												<Link
													key={subItem.href}
													href={subItem.href}
													className={`
														block px-3 py-1.5 rounded-lg text-sm transition-colors
														${
															isSubItemActive(subItem.href)
																? "bg-[var(--cl-brand-50)] text-[#014F01] font-medium"
																: "text-[var(--cl-text-2)] hover:bg-[var(--cl-bg)] hover:text-[var(--cl-text)]"
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
						<div className="px-4 pb-4 hidden lg:block">
							<div className="bg-gradient-to-br from-blue-50/50 to-white rounded-lg p-3 border border-blue-100/50">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-6 h-6 bg-[var(--cl-info-soft)] rounded-md flex items-center justify-center">
										<Activity className="w-3.5 h-3.5 text-[var(--cl-brand-600)]" />
									</div>
									<span className="text-xs font-semibold text-[var(--cl-text-2)]">Quick Stats</span>
								</div>
								<div className="space-y-2.5">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-1.5 h-1.5 bg-[var(--cl-info-soft)]0 rounded-full"></div>
											<span className="text-xs text-[var(--cl-text-2)]">Active Users</span>
										</div>
										<span className="text-sm font-bold text-[var(--cl-text)]">3,245</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-1.5 h-1.5 bg-[var(--cl-warn-soft)]0 rounded-full"></div>
											<span className="text-xs text-[var(--cl-text-2)]">Pending KYC</span>
										</div>
										<span className="text-sm font-bold text-[var(--cl-text)]">124</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-1.5 h-1.5 bg-[var(--cl-up-soft)]0 rounded-full"></div>
											<span className="text-xs text-[var(--cl-text-2)]">Today's Volume</span>
										</div>
										<span className="text-sm font-bold text-[var(--cl-text)]">$2.4M</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* User Profile */}
					<div className="p-4 border-t border-[var(--cl-line)]">
						<div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--cl-bg)] cursor-pointer transition-colors group ${isCollapsed ? 'lg:justify-center' : ''}`}>
							<div className="w-10 h-10 bg-gradient-to-br from-[#014F01] to-[#013d01] rounded-full flex items-center justify-center flex-shrink-0">
								<span className="text-white font-semibold text-sm">AD</span>
							</div>
							{/* Mobile: Always show user info */}
							<div className="flex-1 min-w-0 lg:hidden">
								<p className="text-sm font-medium text-[var(--cl-text)] truncate">
									Admin User
								</p>
								<p className="text-xs text-[var(--cl-text-3)] truncate">
									admin@clusteer.com
								</p>
							</div>
							{/* Desktop: Show based on collapse state */}
							{!isCollapsed && (
								<div className="hidden lg:block flex-1 min-w-0">
									<p className="text-sm font-medium text-[var(--cl-text)] truncate">
										Admin User
									</p>
									<p className="text-xs text-[var(--cl-text-3)] truncate">
										admin@clusteer.com
									</p>
								</div>
							)}
							{/* Logout button - mobile always shows, desktop based on collapse */}
							<button
								className="lg:hidden p-1.5 hover:bg-[var(--cl-surface-2)] rounded"
								title="Logout"
							>
								<LogOut className="w-4 h-4 text-[var(--cl-text-3)]" />
							</button>
							{!isCollapsed && (
								<button
									className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-[var(--cl-surface-2)] rounded"
									title="Logout"
								>
									<LogOut className="w-4 h-4 text-[var(--cl-text-3)]" />
								</button>
							)}
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
