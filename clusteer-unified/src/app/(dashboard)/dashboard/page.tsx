"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@/store/user";

// Lazy load heavy components for better initial load
const PortfolioSummary = dynamic(() => import("@/components/portfolio-summary"), {
	loading: () => <PortfolioSummarySkeleton />,
});
const CompactWalletList = dynamic(() => import("@/components/compact-wallet-list"), {
	loading: () => <WalletListSkeleton />,
});
const RecentActivity = dynamic(() => import("@/components/recent-activity"), {
	loading: () => <RecentActivitySkeleton />,
});
const BuySellCrypto = dynamic(() => import("@/components/buy-sell-crypto"), {
	loading: () => <TradingWidgetSkeleton />,
});

// Static imports for critical above-the-fold content
import Banner from "@/components/banner";
import UserProfile from "@/components/user-profile";
import QuickActions from "@/components/dashboard/quick-actions";
import PortfolioInsights from "@/components/dashboard/portfolio-insights";

// Skeleton components
function PortfolioSummarySkeleton() {
	return (
		<div className="mb-6 animate-pulse">
			<div className="h-16 w-64 bg-gray-200 rounded-lg mb-6"></div>
			<div className="flex items-center gap-3">
				<div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
				<div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
				<div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
			</div>
		</div>
	);
}

function WalletListSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{[1, 2, 3].map((i) => (
				<div key={i} className="bg-gray-100 rounded-xl p-5 animate-pulse">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
						<div className="h-4 w-16 bg-gray-200 rounded"></div>
					</div>
					<div className="h-8 w-32 bg-gray-200 rounded mb-1"></div>
				</div>
			))}
		</div>
	);
}

function RecentActivitySkeleton() {
	return (
		<div className="space-y-4">
			<div className="h-6 w-40 bg-gray-200 rounded"></div>
			<div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex items-center gap-4 animate-pulse">
						<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
						<div className="flex-1 space-y-2">
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-3 bg-gray-200 rounded w-1/2"></div>
						</div>
						<div className="h-4 bg-gray-200 rounded w-20"></div>
					</div>
				))}
			</div>
		</div>
	);
}

function TradingWidgetSkeleton() {
	return (
		<div className="bg-gray-100 rounded-3xl p-8 animate-pulse">
			<div className="h-64 bg-gray-200 rounded-2xl"></div>
		</div>
	);
}

export default function Page() {
	const user = useUser();
	const isKycVerified = user?.is_verified || false;
	const [showInsights, setShowInsights] = useState(true);

	return (
		<div className="font-avenir-next pb-6 lg:pt-[50px]">
			{/* KYC Verification Banner - Critical, no lazy load */}
			{!isKycVerified && (
				<Banner
					title="Complete your Verification to proceed"
					description="Your security and trust are paramount to us, which is why we've
						implemented Identity Verification protocol. Verifying your identity
						ensures that Clusteer remains a safe and reliable platform for all users,
						and also enables you to enjoy an enhanced range of features and
						services."
					link="/identity-verification"
				/>
			)}

			{/* User Profile Header - Critical, no lazy load */}
			<section className={isKycVerified ? "mt-0 mb-6" : "mt-5 lg:mt-20 mb-6"}>
				<UserProfile />
			</section>

			{/* Portfolio Summary - Above fold, use Suspense */}
			<Suspense fallback={<PortfolioSummarySkeleton />}>
				<PortfolioSummary />
			</Suspense>

			{/* Quick Actions - New Feature */}
			<section className="mb-8">
				<QuickActions />
			</section>

			{/* Portfolio Insights - New Feature (Optional, can be toggled) */}
			{showInsights && isKycVerified && (
				<section className="mb-8">
					<Suspense fallback={<div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>}>
						<PortfolioInsights onClose={() => setShowInsights(false)} />
					</Suspense>
				</section>
			)}

			{/* Wallets Section - Lazy loaded */}
			<section className="mb-8">
				<Suspense fallback={<WalletListSkeleton />}>
					<CompactWalletList />
				</Suspense>
			</section>

			{/* Recent Activity - Lazy loaded */}
			<section className="mb-8">
				<Suspense fallback={<RecentActivitySkeleton />}>
					<RecentActivity />
				</Suspense>
			</section>

			{/* Quick Convert Widget - Below fold, lazy load */}
			<section className="mb-8">
				<Suspense fallback={<TradingWidgetSkeleton />}>
					<BuySellCrypto />
				</Suspense>
			</section>
		</div>
	);
}
