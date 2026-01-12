"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, LogOut, Menu } from "lucide-react";

interface AdminHeaderProps {
	onMobileMenuOpen?: () => void;
}

export default function AdminHeader({ onMobileMenuOpen }: AdminHeaderProps) {
	const router = useRouter();
	const [showDropdown, setShowDropdown] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);

	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			await fetch("/api/admin/auth/logout", { method: "POST" });
			router.push("/admin/login");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setLoggingOut(false);
		}
	};

	return (
		<header className="h-16 bg-white border-b border-[#E9EAEB] px-4 lg:px-6 flex items-center gap-2 lg:gap-4">
			{/* Mobile Menu Button */}
			<button
				onClick={onMobileMenuOpen}
				className="lg:hidden p-2 -ml-2 text-[#414651] hover:bg-[#FAFAFA] rounded-lg transition-colors flex-shrink-0"
				aria-label="Open menu"
			>
				<Menu className="w-6 h-6" />
			</button>

			{/* Search Bar - Hidden on small mobile, visible on larger screens */}
			<div className="hidden sm:flex flex-1 max-w-xl">
				<div className="relative w-full">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search..."
						className="w-full pl-10 pr-4 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
					/>
				</div>
			</div>

			{/* Mobile Search Icon - Only on very small screens */}
			<button className="sm:hidden p-2 text-[#414651] hover:bg-[#FAFAFA] rounded-lg transition-colors flex-shrink-0">
				<Search className="w-5 h-5" />
			</button>

			{/* Spacer for mobile */}
			<div className="flex-1 sm:hidden"></div>

			{/* Right Section */}
			<div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
				{/* Notifications */}
				<button className="relative p-2 text-[#414651] hover:bg-[#FAFAFA] rounded-lg transition-colors">
					<Bell className="w-5 h-5" />
					<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
				</button>

				{/* Admin Profile */}
				<div className="relative">
					<button
						onClick={() => setShowDropdown(!showDropdown)}
						className="flex items-center gap-2 px-2 sm:px-3 py-2 hover:bg-[#FAFAFA] rounded-lg transition-colors"
					>
						<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
							<span className="text-gray-600 font-medium text-xs">AD</span>
						</div>
						<span className="hidden sm:inline text-sm font-medium text-[#414651]">Admin</span>
						<ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
					</button>

					{/* Dropdown */}
					{showDropdown && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E9EAEB] py-1 z-50">
							<button
								onClick={handleLogout}
								disabled={loggingOut}
								className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#414651] hover:bg-[#FAFAFA] transition-colors disabled:opacity-50"
							>
								<LogOut className="w-4 h-4" />
								{loggingOut ? "Logging out..." : "Logout"}
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
